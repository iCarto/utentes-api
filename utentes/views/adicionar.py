from pyramid.view import view_config, view_defaults

import utentes.constants.perms as perm
import utentes.models.constants as c
from utentes.services.exp_service import get_license_state


@view_defaults(renderer="utentes:templates/exploracao-new.jinja2")
class Adicionar:
    def __init__(self, request):
        self.request = request

    @view_config(
        route_name="adicionar_ficha",
        permission=perm.PERM_CREATE_EXPLORACAO,
    )
    def adicionar_ficha(self):
        ensure_exp_is_in_correct_state(self.request)
        return {}

    @view_config(
        route_name="adicionar_exploracao",
        permission=perm.PERM_PAGE_ADICIONAR_EXPLORACAO,
    )
    def adicionar_exploracao(self):
        return {}

    @view_config(
        route_name="adicionar_usos_comuns",
        permission=perm.PERM_PAGE_ADICIONAR_USOS_COMUNS,
    )
    def adicionar_usos_comuns(self):
        return {"next_state": c.K_USOS_COMUNS}

    @view_config(
        route_name="adicionar_utente_facto",
        permission=perm.PERM_PAGE_ADICIONAR_UTENTE_FACTO,
    )
    def adicionar_utente_facto(self):
        return {"next_state": c.K_DE_FACTO}


def ensure_exp_is_in_correct_state(request):
    # Commonly it happens pressing back button after visit this page
    gid = request.GET.get("id")
    estado_lic = get_license_state(request, gid)
    if estado_lic not in [c.K_PENDING_FIELD_VISIT, c.K_INCOMPLETE_DT]:
        from pyramid.httpexceptions import HTTPTemporaryRedirect

        url = request.route_url("exploracao-show", _query={"id": gid})
        raise HTTPTemporaryRedirect(location=url)
