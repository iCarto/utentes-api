"""
Con la estructura de la bd es difícil determinar cuando una explotación debe ser
exportada a primavera por primera vez. Depende de si ha creado como utente de facto
directamente (exploracaos.created_at), si ha pasado por el proceso de licenciamiento
(exploracaos.req_obs[-1] => state in ["Licenciada", "Utente de facto"] and date > x),
...

Y debemos registrar en la base de datos si una explotación ya ha sido exportada
("Existente") o no ("Novo").

Otro riesgo es exportar facturas correspondientes a una explotación que todavía no haya
sido exportada, porqué se hace en momentos distintos.

Por ello se toman algunas decisiones de diseño:
* Las facturas y las explotaciones se exportan a la vez
* En la tabla utentes.erp se registra la fecha en la que la explotación fue exportada
* Se exportan todas las explotaciones siempre. Sería preferible, exportar sólo aquellas
con cambios y las nuevas.

Se envían como "Anulada" las explotaciones que han sido eliminadas de SIRHAs o pasado
de un estado facturable a otro. Cuando una explotación vuelve a ser facturable se
exporta como "Novo"
"""

import datetime
from typing import Dict, List

from pyramid.request import Request
from pyramid.view import view_config
from sqlalchemy.orm import Session, aliased, noload

from utentes.erp.model import MANUAL_SYNC_TIME, ClientsResultSet, ExploracaosERP
from utentes.lib.utils.strings import stringify
from utentes.models.actividade import ActividadeBase
from utentes.models.constants import INVOIZABLE_STATES
from utentes.models.exploracao import Exploracao
from utentes.services import exp_service
from utentes.services.pyramid_spreadsheet_response import spreadsheet_response
from utentes.services.spreadsheet_writer import write_tmp_spreadsheet_from_records


@view_config(route_name="api_erp_clients")
def api_erp_clients(request: Request):
    exps_to_export = get_and_update_bd(request.db)
    # It's granted that response will call close on `tmp` so the file will be deleted
    tmp, filename = build_spreadsheet_file(request.db, exps_to_export)
    return spreadsheet_response(request, tmp, filename)


def get_and_update_bd(db: Session):
    entities = get_db_entities(db)
    prepare_entities(entities)
    exps_to_export = [build_data_to_export(e) for e in entities]
    db.add_all(e.exploracao_erp for e in entities)
    remove_canceled_exps_erp(db)
    update_exported_at(db)
    return exps_to_export


def get_db_entities(db: Session) -> List[ClientsResultSet]:
    invoizable_exps_subquery = (
        db.query(Exploracao)
        .options(noload(Exploracao.actividade))
        .filter(Exploracao.estado_lic.in_(INVOIZABLE_STATES))
        .subquery()
    )
    custom_exploracao = aliased(Exploracao, invoizable_exps_subquery)
    entities = (
        db.query(custom_exploracao, ExploracaosERP, ActividadeBase.tipo)
        .options(noload(custom_exploracao.actividade))
        .join(ActividadeBase, custom_exploracao.gid == ActividadeBase.exploracao)
        .outerjoin(ExploracaosERP, full=True)
    )
    # Si la explotación fue creada antes de la primera sincronización manual y no
    # fue incluida en esa sincronización debe ser ignorada

    return [
        ClientsResultSet(
            exploracao=(exp or exp_service.create_emtpy()),
            exploracao_erp=(erp or ExploracaosERP()),
            actividade=actividade,
        )
        for exp, erp, actividade in entities
        if not (exp and (exp.created_at < MANUAL_SYNC_TIME) and (not erp))
    ]


def prepare_entities(entities: List[ClientsResultSet]) -> None:
    for e in entities:
        mark_not_invoizable_exp_to_be_canceled(e)
        # Microptimization, we are doing a bulk update after inserting the new
        # e.exploracao_erp.exported_at = now
        if not e.exploracao_erp.id:
            # It's a new ExploracaoERP
            e.exploracao_erp.exploracao_gid = e.exploracao.gid
            e.exploracao_erp.update_link_id(e.exploracao)


def mark_not_invoizable_exp_to_be_canceled(e: ClientsResultSet) -> None:
    """
    Si hay un ExploracaoERP ya no está en el listado de explotaciones facturables
    debe ser anulado. Lo hacemos marcando su enlace con la explotación como
    None y el resto del código ya lo tendrá en cuenta
    """
    if not e.exploracao.gid:
        e.exploracao_erp.exploracao_gid = None


def build_data_to_export(e: ClientsResultSet):
    erp_item = e.exploracao_erp
    exp = e.exploracao

    if len(exp.licencias) == 1:
        tipo_agua = exp.licencias[0].tipo_agua
    elif len(exp.licencias) == 2:
        tipo_agua = "Ambas"
    else:
        tipo_agua = None

    if erp_item.id and erp_item.exploracao_gid:
        estado = "Existente"
    elif erp_item.id and not erp_item.exploracao_gid:
        estado = "Anulado"
    else:
        estado = "Novo"

    return {
        "Cliente": stringify(erp_item.erp_id, maxlen=12),
        "Nro_Exploracao": stringify(exp.exp_id, maxlen=100),
        "IDuCli": stringify(erp_item.link_id, maxlen=100),
        "estado": stringify(estado, maxlen=20),
        "Nome": stringify(exp.exp_name),
        "Nome_Comercial": stringify(exp.utente_rel.nome),
        "Num_Contrib": stringify(
            exp.utente_rel.nuit, exp.utente_rel.bi_di_pas, maxlen=20
        ),
        "Fac_Mor": stringify(exp.loc_unidad, exp.loc_bacia),
        "Fac_Mor2": stringify(exp.loc_provin, exp.loc_distri, exp.loc_posto),
        "Fac_Local": stringify(exp.loc_nucleo),
        "Fac_Tel": stringify(exp.utente_rel.telefone, maxlen=20),
        "Telefone2": stringify(None, maxlen=20),
        "Fac_Fax": stringify(None, maxlen=20),
        "Endereco_Web": stringify(exp.utente_rel.email),
        "Actividade": stringify(e.actividade, maxlen=100),
        "Tipo_Agua": stringify(tipo_agua, maxlen=100),
    }


def remove_canceled_exps_erp(db: Session):
    db.query(ExploracaosERP).filter(ExploracaosERP.exploracao_gid.is_(None)).delete()


def update_exported_at(db: Session):
    now = datetime.datetime.now()
    db.query(ExploracaosERP).update({"exported_at": now}, synchronize_session=False)


def build_spreadsheet_file(db: Session, data: List[Dict]):
    sheets = {"Explorações": data}
    spreadsheet_file = write_tmp_spreadsheet_from_records(sheets)
    spreadsheet_filename = build_filename()
    return spreadsheet_file, spreadsheet_filename


def build_filename() -> str:
    today = datetime.date.today().strftime("%y%m%d")
    return f"{today}_exploracaoes_primavera.xlsx"
