# -*- coding: utf-8 -*-

from pyramid.view import view_config
from utentes.models.exploracao import Exploracao
from utentes.models.facturacao_fact_estado import FacturacaoFactEstado
from utentes.models.facturacao import Facturacao
import datetime
from utentes.user_utils import PERM_ADMIN


import logging
log = logging.getLogger(__name__)


def diff_month(d1, d2):
    return (d1.year - d2.year) * 12 + d1.month - d2.month


@view_config(route_name='nuevo_ciclo_facturacion', permission=PERM_ADMIN, request_method='GET', renderer='json')
# admin || financieiro
def nuevo_ciclo_facturacion(request):
    states = FacturacaoFactEstado.ESTADOS_FACTURABLES
    exps = request.db.query(Exploracao).filter(Exploracao.estado_lic.in_(states)).all()
    today = datetime.datetime.now()
    for e in exps:
        if (len(e.facturacao) > 0):
            d_months = diff_month(today, e.facturacao[-1].created_at)
            if (
                e.fact_tipo == 'Mensal' and d_months != 1
                or e.fact_tipo == 'Trimestral' and d_months != 3
                or e.fact_tipo == 'Anual' and d_months != 12
            ):
                continue

        lic_sup = e.get_licencia('sup')
        lic_sub = e.get_licencia('sub')
        f = Facturacao()
        f.exploracao = e.gid

        if lic_sup.consumo_tipo == u'Fixo' or lic_sub.consumo_tipo == u'Fixo':
            f.fact_estado = 'Pendente Emisão Factura (D. Fin)'
        else:
            f.fact_estado = 'Pendente Acrescentar Consumo (R. Cad DT)'

        f.c_licencia_sup = lic_sup.c_licencia
        f.c_licencia_sub = lic_sub.c_licencia
        f.consumo_tipo_sup = lic_sup.consumo_tipo
        f.consumo_tipo_sub = lic_sub.consumo_tipo
        if (len(e.facturacao) > 0):
            f.pagos = e.facturacao[-1].pagos
            f.fact_tipo = e.facturacao[-1].fact_tipo
            f.pago_lic = e.facturacao[-1].pago_lic
            f.consumo_fact_sup = e.facturacao[-1].consumo_fact_sup
            f.consumo_fact_sub = e.facturacao[-1].consumo_fact_sub
            f.taxa_fixa_sup = e.facturacao[-1].taxa_fixa_sup
            f.taxa_fixa_sub = e.facturacao[-1].taxa_fixa_sub
            f.taxa_uso_sup = e.facturacao[-1].taxa_uso_sup
            f.taxa_uso_sub = e.facturacao[-1].taxa_uso_sub
            f.pago_mes_sub = e.facturacao[-1].pago_mes_sup
            f.pago_mes_sub = e.facturacao[-1].pago_mes_sub
            f.pago_iva_sub = e.facturacao[-1].pago_iva_sup
            f.pago_iva_sub = e.facturacao[-1].pago_iva_sub
            f.iva_sub = e.facturacao[-1].iva_sup
            f.iva_sub = e.facturacao[-1].iva_sub
            f.iva = e.facturacao[-1].iva
            f.pago_mes = e.facturacao[-1].pago_mes
            f.pago_iva = e.facturacao[-1].pago_iva
        else:
            f.pagos = False
            f.fact_tipo = 'Mensal'
            f.pago_lic = False
            f.consumo_fact_sup = lic_sup.c_licencia
            f.consumo_fact_sub = lic_sub.c_licencia
            f.taxa_fixa_sup = lic_sup.taxa_fixa
            f.taxa_fixa_sub = lic_sub.taxa_fixa
            f.taxa_uso_sup = lic_sup.taxa_uso
            f.taxa_uso_sub = lic_sub.taxa_uso
            f.pago_mes_sup = lic_sup.pago_mes
            f.pago_mes_sub = lic_sub.pago_mes
            f.pago_iva_sup = lic_sup.pago_iva
            f.pago_iva_sub = lic_sub.pago_iva
            f.iva_sup = lic_sup.iva
            f.iva_sub = lic_sub.iva
            f.iva = lic_sup.iva or lic_sub.iva
            f.pago_mes = ((f.pago_mes_sub or 0) + (f.pago_mes_sup or 0)) or None
            f.pago_iva = ((f.pago_iva_sub or 0) + (f.pago_iva_sup or 0)) or None

        # f.observacio = '[{"created_at": null, "autor": null, "text": null, "state": null}]'
        f.observacio = [{'created_at': None, 'autor': None, 'text': None, 'state': None}]
        e.fact_estado = f.fact_estado
        e.fact_tipo = f.fact_tipo
        e.pago_lic = f.pago_lic
        e.pagos = f.pagos
        e.facturacao.append(f)
        request.db.add(e)

    request.db.commit()
    return {'ok': 'ok'}


def decimal_adapter(obj):
    return float(obj) if obj or (obj == 0) else None
