import datetime

from pyramid.view import view_config
from sqlalchemy import func, or_

import utentes.constants.perms as perm
import utentes.models.constants as c
from utentes.models.exploracao import Exploracao
from utentes.models.facturacao import Facturacao
from utentes.models.facturacao_fact_estado import (
    PAID,
    PENDING_CONSUMPTION,
    PENDING_INVOICE,
)
from utentes.models.utente import Utente


@view_config(
    route_name="api_facturacao_stats",
    permission=perm.PERM_GET,
    request_method="GET",
    renderer="json",
)
def facturacao_stats(request):
    mes_inicio = request.params.get("mes_inicio", None)
    ano_inicio = request.params.get("ano_inicio", None)
    mes_fim = request.params.get("mes_fim", None)
    ano_fim = request.params.get("ano_fim", None)
    tipo_agua = request.params.get("tipo_agua")
    uso_explotacion = request.params.get("uso_explotacion")
    utentes = request.params.getall("utente")
    json_data = []
    if not uso_explotacion or uso_explotacion == "Usos privativos":
        usos_privativos(
            request,
            mes_inicio,
            ano_inicio,
            mes_fim,
            ano_fim,
            tipo_agua,
            uso_explotacion,
            utentes,
            json_data,
        )
    if not uso_explotacion or uso_explotacion == "Usos comuns":
        usos_comuns(
            request,
            mes_inicio,
            ano_inicio,
            mes_fim,
            ano_fim,
            tipo_agua,
            uso_explotacion,
            utentes,
            json_data,
        )

    return json_data


def usos_comuns(
    request,
    mes_inicio,
    ano_inicio,
    mes_fim,
    ano_fim,
    tipo_agua,
    uso_explotacion,
    utentes,
    json_data,
):
    # Los datos de estadísticas para las Utentes de usos comuns se generan
    # al vuelo

    if mes_inicio is not None and ano_inicio is not None:
        d_inicio = datetime.date(int(ano_inicio), int(mes_inicio), 1)
    else:
        d_inicio = datetime.date.min
    if mes_fim is not None and ano_fim is not None:
        d_fim = datetime.date(int(ano_fim), int(mes_fim), 1)
    else:
        d_fim = datetime.date.today()

    exps = request.db.query(Exploracao).filter(Exploracao.estado_lic == c.K_USOS_COMUNS)
    for e in exps:

        if utentes and str(e.utente_rel.gid) not in utentes:
            continue

        c_real = e.c_real
        if tipo_agua:
            lic = e.get_licencia(tipo_agua[0:3])
            if lic.gid is None:
                continue
            c_real = lic.c_real_tot

        d_exp = e.d_soli or e.created_at.date()
        # Empiezo a contar en lo que sea mayor la fecha seleccionado por el
        # usuario o la fecha de la explotación
        new_d_inicio = max(d_inicio, d_exp)
        if new_d_inicio > d_fim:
            # Si la fecha para la que puedo empezar a contar es mayor que la
            # que el usuario escogió como máximo no incluyo la exp
            continue
        months = (
            (d_fim.year - new_d_inicio.year) * 12 + d_fim.month - new_d_inicio.month
        )
        json_data.append(
            {
                "gid": e.gid,
                "exp_id": e.exp_id,
                "utente_id": e.utente_rel.gid,
                "utente": e.utente_rel.nome,
                "numero_facturas_esperadas": months,
                "consumo_facturas_esperadas": months * c_real,
                "importe_facturas_esperadas": 0,
                "numero_facturas_emitidas": 0,
                "consumo_facturas_emitidas": 0,
                "importe_facturas_emitidas": 0,
                "numero_facturas_cobradas": 0,
                "consumo_facturas_cobradas": 0,
                "importe_facturas_cobradas": 0,
            }
        )


def usos_privativos(
    request,
    mes_inicio,
    ano_inicio,
    mes_fim,
    ano_fim,
    tipo_agua,
    uso_explotacion,
    utentes,
    json_data,
):

    fields = [
        Facturacao.exploracao.label("exploracao_gid"),
        func.count(Facturacao.exploracao).label("numero_facturas"),
    ]
    if not tipo_agua:
        fields.extend(
            [
                func.sum(Facturacao.consumo).label("consumo"),
                func.sum(Facturacao.pago_iva).label("importe"),
            ]
        )
    if tipo_agua == c.K_SUPERFICIAL:
        fields.extend(
            [
                func.sum(
                    func.coalesce(
                        Facturacao.consumo_fact_sup, Facturacao.c_licencia_sup, 0
                    )
                ).label("consumo"),
                func.sum(
                    func.coalesce(Facturacao.pago_mes_sup, 0)
                    * (1 + func.coalesce(Facturacao.iva, 0) / 100)
                    * (1 + func.coalesce(Facturacao.juros, 0) / 100)
                ).label("importe"),
            ]
        )

    if tipo_agua == c.K_SUBTERRANEA:
        fields.extend(
            [
                func.sum(
                    func.coalesce(
                        Facturacao.consumo_fact_sub, Facturacao.c_licencia_sub, 0
                    )
                ).label("consumo"),
                func.sum(
                    func.coalesce(Facturacao.pago_mes_sub, 0)
                    * (1 + func.coalesce(Facturacao.iva, 0) / 100)
                    * (1 + func.coalesce(Facturacao.juros, 0) / 100)
                ).label("importe"),
            ]
        )

    subquery_esperadas = request.db.query(*fields).group_by(Facturacao.exploracao)

    subquery_emitidas = (
        request.db.query(*fields)
        .filter(
            Facturacao.fact_estado != PENDING_CONSUMPTION,
            Facturacao.fact_estado != PENDING_INVOICE,
        )
        .group_by(Facturacao.exploracao)
    )

    subquery_cobradas = (
        request.db.query(*fields)
        .filter(Facturacao.fact_estado == PAID)
        .group_by(Facturacao.exploracao)
    )

    if mes_inicio is not None and ano_inicio is not None:
        subquery_esperadas = subquery_esperadas.filter(
            Facturacao.mes >= mes_inicio, Facturacao.ano >= ano_inicio
        )
        subquery_emitidas = subquery_emitidas.filter(
            Facturacao.mes >= mes_inicio, Facturacao.ano >= ano_inicio
        )
        subquery_cobradas = subquery_cobradas.filter(
            Facturacao.mes >= mes_inicio, Facturacao.ano >= ano_inicio
        )
    if mes_fim is not None and ano_fim is not None:
        subquery_esperadas = subquery_esperadas.filter(
            Facturacao.mes <= mes_fim, Facturacao.ano <= ano_fim
        )
        subquery_emitidas = subquery_emitidas.filter(
            Facturacao.mes <= mes_fim, Facturacao.ano <= ano_fim
        )
        subquery_cobradas = subquery_cobradas.filter(
            Facturacao.mes <= mes_fim, Facturacao.ano <= ano_fim
        )

    if tipo_agua is not None:
        if tipo_agua == c.K_SUPERFICIAL:
            subquery_esperadas = subquery_esperadas.filter(
                Facturacao.c_licencia_sup != None
            )
        if tipo_agua == c.K_SUBTERRANEA:
            subquery_esperadas = subquery_esperadas.filter(
                Facturacao.c_licencia_sub != None
            )

    subquery_esperadas = subquery_esperadas.subquery()
    subquery_emitidas = subquery_emitidas.subquery()
    subquery_cobradas = subquery_cobradas.subquery()

    query = (
        request.db.query(
            Exploracao.gid,
            Exploracao.exp_id,
            Utente.gid.label("utente_id"),
            Utente.nome.label("utente"),
            func.coalesce(
                subquery_esperadas.c.numero_facturas.label("numero_facturas_esperadas"),
                0,
            ),
            func.coalesce(
                subquery_esperadas.c.consumo.label("consumo_facturas_esperadas"), 0
            ),
            func.coalesce(
                subquery_esperadas.c.importe.label("importe_facturas_esperadas"), 0
            ),
            func.coalesce(
                subquery_emitidas.c.numero_facturas.label("numero_facturas_emitidas"), 0
            ),
            func.coalesce(
                subquery_emitidas.c.consumo.label("consumo_facturas_emitidas"), 0
            ),
            func.coalesce(
                subquery_emitidas.c.importe.label("importe_facturas_emitidas"), 0
            ),
            func.coalesce(
                subquery_cobradas.c.numero_facturas.label("numero_facturas_cobradas"), 0
            ),
            func.coalesce(
                subquery_cobradas.c.consumo.label("consumo_facturas_cobradas"), 0
            ),
            func.coalesce(
                subquery_cobradas.c.importe.label("importe_facturas_cobradas"), 0
            ),
        )
        .join(Utente, Exploracao.utente == Utente.gid)
        .join(subquery_esperadas, subquery_esperadas.c.exploracao_gid == Exploracao.gid)
        .outerjoin(
            subquery_emitidas, subquery_emitidas.c.exploracao_gid == Exploracao.gid
        )
        .outerjoin(
            subquery_cobradas, subquery_cobradas.c.exploracao_gid == Exploracao.gid
        )
        .order_by(Exploracao.gid)
    )

    if utentes:
        query = query.filter(
            or_(*[Utente.gid == int(utente_id) for utente_id in utentes])
        )

    row_headers = [
        "gid",
        "exp_id",
        "utente_id",
        "utente",
        "numero_facturas_esperadas",
        "consumo_facturas_esperadas",
        "importe_facturas_esperadas",
        "numero_facturas_emitidas",
        "consumo_facturas_emitidas",
        "importe_facturas_emitidas",
        "numero_facturas_cobradas",
        "consumo_facturas_cobradas",
        "importe_facturas_cobradas",
    ]

    for result in query.all():
        json_data.append(dict(list(zip(row_headers, result))))
