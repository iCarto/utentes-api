import logging

from pyramid.view import view_config

import utentes.constants.perms as perm


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
    authorized_by_perm = request.has_permission(perm.PERM_NEW_INVOICE_CYCLE)
    authorized = authorized_by_token or authorized_by_perm

    if not authorized:
        from utentes.models.base import unauthorized_exception

        raise unauthorized_exception()

    sql = """
        WITH months_substract AS (
            SELECT gid
                , CASE fact_tipo
                      WHEN 'Trimestral' THEN '3 month'::interval
                      WHEN 'Anual' THEN '12 month'::interval
                      ELSE '1 month'::interval
                   END AS month_inverval
            FROM utentes.facturacao
            ORDER BY created_at ASC
        ), foo AS (
            SELECT
                f.gid AS _gid
                , f.created_at - month_inverval  as _created_at
                , to_char(f.created_at - month_inverval, 'YYYY'::text) as _ano
                , to_char(f.created_at - month_inverval, 'MM'::text) as _mes
                , f.fact_date - month_inverval as _fact_date
                , f.recibo_date - month_inverval as _recibo_date
            FROM utentes.facturacao f JOIN months_substract USING (gid)
            ORDER BY f.created_at ASC
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
