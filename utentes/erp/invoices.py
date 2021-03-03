import datetime
from typing import Dict, List

from pyramid.view import view_config
from sqlalchemy import or_
from sqlalchemy.orm import Session

from utentes.erp.model import (
    MANUAL_SYNC_TIME,
    ExploracaosERP,
    FacturacaoERP,
    InvoicesResultSet,
)
from utentes.models.base import badrequest_exception_user
from utentes.models.constants import K_SUBTERRANEA, K_SUPERFICIAL
from utentes.models.exploracao import ExploracaoBase
from utentes.models.facturacao import Facturacao
from utentes.models.facturacao_fact_estado import PENDING_PAYMENT
from utentes.services.pyramid_spreadsheet_response import spreadsheet_response
from utentes.services.spreadsheet_writer import write_tmp_spreadsheet_from_records


@view_config(route_name="api_erp_invoices")
def api_erp_invoices(request):
    invoices_to_export = get_and_update_bd(request.db)
    # It's granted that response will call close on `tmp` so the file will be deleted
    tmp, filename = build_spreadsheet_file(request.db, invoices_to_export)
    return spreadsheet_response(request, tmp, filename)


def get_and_update_bd(db: Session):
    entities = get_db_entities(db)
    prepare_entities(entities)
    invoices_to_export = [build_data_to_export(e) for e in entities]
    db.add_all(e.invoice_erp for e in entities)
    return invoices_to_export


def get_db_entities(db: Session) -> List[InvoicesResultSet]:
    """
    Returns all the needed data from the database in form of Entities.
    For the invoices (Facturacao) return those that are in PENDING_PAYMENT and (are
    modified from the last export, or are not already being exported)
    """
    not_exported_of_updated_after_export_invoices = or_(
        FacturacaoERP.exported_at.is_(None),
        Facturacao.updated_at > FacturacaoERP.exported_at,
    )
    entities = (
        db.query(
            Facturacao,
            ExploracaoBase,
            ExploracaosERP,
            FacturacaoERP,
        )
        .join(ExploracaoBase, ExploracaoBase.gid == Facturacao.exploracao)
        .outerjoin(
            ExploracaosERP, ExploracaosERP.exploracao_gid == Facturacao.exploracao
        )
        .outerjoin(FacturacaoERP, FacturacaoERP.facturacao_gid == Facturacao.gid)
        .filter(Facturacao.created_at > MANUAL_SYNC_TIME)
        .filter(not_exported_of_updated_after_export_invoices)
        .filter(Facturacao.fact_estado == PENDING_PAYMENT)
    )
    return [
        InvoicesResultSet(
            invoice=e.Facturacao,
            exploracao_base=e.ExploracaoBase,
            exploracao_erp=e.ExploracaosERP,
            invoice_erp=(e.FacturacaoERP or FacturacaoERP()),
        )
        for e in entities
    ]


def prepare_entities(entities: List[InvoicesResultSet]) -> None:
    now = datetime.datetime.now()
    for e in entities:
        if not e.exploracao_erp:
            raise badrequest_exception_user(
                "Você está tentando exportar uma fatura sem primeiro exportar a exploracao"
            )
        e.invoice_erp.exported_at = now
        e.invoice_erp.facturacao_gid = e.invoice.gid
        e.invoice_erp.update_link_id(e.invoice)


def build_data_to_export(e: InvoicesResultSet) -> Dict:
    invoice = e.invoice
    invoice_erp = e.invoice_erp

    is_sup = invoice.has_water_type("sup")
    is_sub = invoice.has_water_type("sub")

    if invoice_erp.id:
        estado = "Existente"
    else:
        estado = "Novo"

    return {
        "Cliente": e.exploracao_erp.erp_id,
        "Nro_Exploracao": e.exploracao_base.exp_id,
        "IDuCli": e.exploracao_erp.link_id,
        "Nro_Factura": invoice.fact_id,
        "Factura_Prim": invoice_erp.erp_id,
        "IDuFac": invoice_erp.link_id,
        "Estado": estado,
        "Data": invoice.fact_date,
        "Fact_tipo": invoice.fact_tipo,
        "Periodo_Factura": invoice.billing_period(),
        "Descricao": e.exploracao_base.actividade.tipo,
        "Superficial": is_sup and K_SUPERFICIAL,
        "Con_Sup": is_sup and invoice.consumo_fact_sup,
        "TaxaUso_sup": is_sup and invoice.taxa_uso_sup,
        "TaxaFixa_Sup": is_sup and invoice.taxa_fixa_sup,
        "Subterranea": is_sub and K_SUBTERRANEA,
        "Con_Sub": is_sub and invoice.consumo_fact_sub,
        "TaxaUso_Sub": is_sub and invoice.taxa_uso_sub,
        "TaxaFixa_Sub": is_sub and invoice.taxa_fixa_sub,
        "Valor": invoice.pago_mes,
        "IVA": invoice.iva,
        "valor_IVA": ((invoice.pago_iva_sub or 0) + (invoice.pago_iva_sup or 0))
        or None,
        "Multa": invoice.juros,
        "Valor final": invoice.pago_iva,
    }


def build_spreadsheet_file(db: Session, data: List[Dict]):
    sheets = {"Sheet1": data}
    spreadsheet_file = write_tmp_spreadsheet_from_records(sheets)
    spreadsheet_filename = build_filename()
    return spreadsheet_file, spreadsheet_filename


def build_filename() -> str:
    today = datetime.date.today().strftime("%y%m%d")
    return f"{today}_facturas_primavera.xlsx"
