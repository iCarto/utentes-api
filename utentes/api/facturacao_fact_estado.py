# -*- coding: utf-8 -*-

from pyramid.view import view_config
from utentes.models.facturacao_fact_estado import FacturacaoFactEstado
from utentes.user_utils import PERM_GET


@view_config(route_name='api_domains_facturacao_fact_estado', permission=PERM_GET, request_method='GET', renderer='json')
def domains_facturacao_fact_estado(request):
    domains = request.db.query(FacturacaoFactEstado).all()
    return domains
