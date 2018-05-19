# -*- coding: utf-8 -*-

from pyramid.view import view_config
from utentes.user_utils import PERM_GET


@view_config(route_name='exploracao-gps', permission=PERM_GET, renderer='utentes:templates/exploracao-gps.html')
def exploracao_gps(request):
    return {}


@view_config(route_name='exploracao-new', permission=PERM_GET, renderer='utentes:templates/exploracao-new.html')
def exploracao_new(request):
    return {}


@view_config(route_name='exploracao-search', permission=PERM_GET, renderer='utentes:templates/exploracao-search.html')
def exploracao_search(request):
    return {}


@view_config(route_name='exploracao-show', permission=PERM_GET, renderer='utentes:templates/exploracao-show.html')
def exploracao_show(request):
    return {}


@view_config(route_name='facturacao', permission=PERM_GET, renderer='utentes:templates/facturacao.html')
def facturacao(request):
    return {}


@view_config(route_name='requerimento-new', permission=PERM_GET, renderer='utentes:templates/requerimento-new.html')
def requerimento_new(request):
    return {}


@view_config(route_name='requerimento-pendente', permission=PERM_GET, renderer='utentes:templates/requerimento-pendente.html')
def requerimento_pendente(request):
    return {}


@view_config(route_name='utentes', permission=PERM_GET, renderer='utentes:templates/utentes.html')
def utentes(request):
    return {}
