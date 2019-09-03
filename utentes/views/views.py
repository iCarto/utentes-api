# -*- coding: utf-8 -*-

from pyramid.view import view_config

import utentes.constants.perms as perm
import utentes.models.constants as c


@view_config(
    route_name="exploracao-gps",
    permission=perm.PERM_UPDATE_CULTIVO_TANQUE,
    renderer="utentes:templates/exploracao-gps.jinja2",
)
def exploracao_gps(request):
    return {}


@view_config(
    route_name="exploracao-new",
    permission=PERM_CREATE_EXPLORACAO,
    renderer="utentes:templates/exploracao-new.jinja2",
)
def exploracao_new(request):
    return {}


@view_config(
    route_name="exploracao-search",
    permission=perm.PERM_GET,
    renderer="utentes:templates/exploracao-search.jinja2",
)
def exploracao_search(request):
    return {}


@view_config(
    route_name="exploracao-show",
    permission=perm.PERM_GET,
    renderer="utentes:templates/exploracao-show.jinja2",
)
def exploracao_show(request):
    gid = request.GET.get("id")
    estado_lic = get_license_state(request, gid)
    return {
        "next_state": estado_lic,
        "d_soli_label": u"Data de cadastramento"
        if estado_lic == c.K_USOS_COMUNS
        else u"Data de solicitação",
    }


@view_config(
    route_name="facturacao",
    permission=perm.PERM_FACTURACAO,
    renderer="utentes:templates/facturacao.jinja2",
)
def facturacao(request):
    return {}


@view_config(
    route_name="requerimento-new",
    permission=perm.PERM_CREATE_REQUERIMENTO,
    renderer="utentes:templates/requerimento-new.jinja2",
)
def requerimento_new(request):
    return {}


@view_config(
    route_name="requerimento-pendente",
    permission=perm.PERM_REQUERIMENTO,
    renderer="utentes:templates/requerimento-pendente.jinja2",
)
def requerimento_pendente(request):
    return {}


@view_config(
    route_name="renovacao",
    permission=perm.PERM_RENOVACAO,
    renderer="utentes:templates/renovacao.jinja2",
)
def renovacao(request):
    return {}


@view_config(
    route_name="utentes",
    permission=perm.PERM_GET,
    renderer="utentes:templates/utentes.jinja2",
)
def utentes(request):
    return {}


@view_config(
    route_name="facturacao-stats",
    permission=perm.PERM_GET,
    renderer="utentes:templates/facturacao-stats.jinja2",
)
def facturacao_stats(request):
    return {}
