# -*- coding: utf-8 -*-

from pyramid.view import view_config

import utentes.constants.perms as perm
from utentes.models.estado_renovacao import EstadoRenovacao


@view_config(
    route_name="api_domains_licencia_estado_renovacao",
    permission=perm.PERM_GET,
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
