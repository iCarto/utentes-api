# -*- coding: utf-8 -*-

import datetime
import logging

from pyramid.view import view_config

from utentes.models.exploracao import Exploracao
from utentes.models.facturacao import Facturacao
from utentes.models.facturacao_fact_estado import (
    PENDING_CONSUMPTION,
    PENDING_INVOICE,
    FacturacaoFactEstado,
)
from utentes.user_utils import PERM_NEW_INVOICE_CYCLE


log = logging.getLogger(__name__)


def diff_month(d1, d2):
    return (d1.year - d2.year) * 12 + d1.month - d2.month


@view_config(
    route_name="api_test_fact_substract_month", request_method="GET", renderer="json"
)
# admin
def nuevo_ciclo_facturacion(request):
    request_token = request.GET.get("token_new_fact_cycle")
    settings_token = request.registry.settings["token_new_fact_cycle"]
    authorized_by_token = request_token == settings_token
    authorized_by_perm = request.has_permission(PERM_NEW_INVOICE_CYCLE)
    authorized = authorized_by_token or authorized_by_perm

    if not authorized:
        from utentes.models.base import unauthorized_exception

        raise unauthorized_exception()

    sql = """
        WITH foo AS (
            SELECT
                gid AS _gid
                , created_at - '1 month'::interval as _created_at
                , to_char(created_at - '1 month'::interval, 'YYYY'::text) as _ano
                , to_char(created_at - '1 month'::interval, 'MM'::text) as _mes
                , fact_date - '1 month'::interval as _fact_date
                , recibo_date - '1 month'::interval as _recibo_date
            FROM utentes.facturacao
            ORDER BY created_at ASC
        )
        UPDATE utentes.facturacao SET
            created_at = _created_at
            , ano = _ano
            , mes = _mes
            , fact_date = _fact_date
            , recibo_date = _recibo_date
        FROM foo
        WHERE gid = _gid
        ;
    """

    request.db.execute(sql)
    return {"ok": "ok"}


def decimal_adapter(obj):
    return float(obj) if obj or (obj == 0) else None
