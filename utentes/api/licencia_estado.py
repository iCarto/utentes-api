# -*- coding: utf-8 -*-

from pyramid.view import view_config
from utentes.models.estado import Estado
from utentes.user_utils import PERM_GET


@view_config(
    route_name="api_domains_licencia_estado",
    permission=PERM_GET,
    request_method="GET",
    renderer="json",
)
def domains_licencia_estado_get(request):
    ara = {"ARAN": "Norte", "ARAS": "Sul", "ARAZ": "Zambeze", "DPMAIP": "DPMAIP"}[
        request.registry.settings.get("ara")
    ]
    domains = (
        request.db.query(Estado)
        .filter(Estado.app.any(ara))
        .order_by(Estado.category, Estado.ordering, Estado.key)
        .all()
    )
    return domains
