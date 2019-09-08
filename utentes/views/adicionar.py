# -*- coding: utf-8 -*-

from pyramid.view import view_config

import utentes.constants.perms as perm
import utentes.models.constants as c
from utentes.services.exp_service import get_license_state


@view_config(
    route_name="adicionar_ficha",
    permission=perm.PERM_CREATE_EXPLORACAO,
    renderer="utentes:templates/exploracao-new.jinja2",
)
def adicionar_ficha(request):
    ensure_exp_is_in_correct_state(request)
    return {}


def ensure_exp_is_in_correct_state(request):
    # Commonly it happens pressing back button after visit this page
    gid = request.GET.get("id")
    estado_lic = get_license_state(request, gid)
    if estado_lic not in [c.K_PENDING_FIELD_VISIT, c.K_INCOMPLETE_DT]:
        from pyramid.httpexceptions import HTTPTemporaryRedirect

        url = request.route_url("exploracao-show", _query={"id": gid})
        raise HTTPTemporaryRedirect(location=url)


@view_config(
    route_name="adicionar_exploracao",
    permission=perm.PERM_PAGE_ADICIONAR_EXPLORACAO,
    renderer="utentes:templates/exploracao-new.jinja2",
)
def adicionar_exploracao(request):
    return {}


@view_config(
    route_name="adicionar_usos_comuns",
    permission=perm.PERM_PAGE_ADICIONAR_USOS_COMUNS,
    renderer="utentes:templates/exploracao-new.jinja2",
)
def adicionar_usos_comuns(request):
    return {"next_state": c.K_USOS_COMUNS}


@view_config(
    route_name="adicionar_utente_facto",
    permission=perm.PERM_PAGE_ADICIONAR_UTENTE_FACTO,
    renderer="utentes:templates/exploracao-new.jinja2",
)
def adicionar_utente_facto(request):
    return {"next_state": c.K_DE_FACTO}
