# -*- coding: utf-8 -*-

from pyramid.view import view_config

import utentes.constants.perms as perm
from utentes.models.facturacao_fact_estado import FacturacaoFactEstado


@view_config(
    route_name="api_domains_facturacao_fact_estado",
    permission=perm.PERM_GET,
    request_method="GET",
    renderer="json",
)
def domains_facturacao_fact_estado(request):
    domains = request.db.query(FacturacaoFactEstado).all()
    return domains
