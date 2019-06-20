# -*- coding: utf-8 -*-

from pyramid.view import view_config
from utentes.models.estado_renovacao import EstadoRenovacao
from utentes.user_utils import PERM_GET


@view_config(
    route_name="api_domains_licencia_estado_renovacao",
    permission=PERM_GET,
    request_method="GET",
    renderer="json",
)
def domains_licencia_estado_renovacao_get(request):
    domains = (
        request.db.query(EstadoRenovacao)
        .order_by(
            EstadoRenovacao.category, EstadoRenovacao.ordering, EstadoRenovacao.key
        )
        .all()
    )
    return domains
