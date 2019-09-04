import logging

from pyramid.view import view_config

import utentes.constants.perms as perm
from utentes.models.exploracao import Exploracao
from utentes.services.id_service import calculate_new_exp_id


log = logging.getLogger(__name__)


@view_config(
    route_name="api_new_exp_id",
    permission=perm.PERM_GET,
    request_method="GET",
    renderer="json",
)
def api_new_exp_id(request):
    state = request.GET.get("state")
    new_exp_id = calculate_new_exp_id(request, state)
    return {"exp_id": new_exp_id}


@view_config(
    route_name="api_expedientes",
    permission=perm.PERM_GET,
    request_method="GET",
    renderer="json",
)
def api_expedientes(request):
    result = request.db.query(Exploracao.exp_id, Exploracao.exp_name)
    exps = [{"exp_id": r[0], "exp_name": r[1]} for r in result]
    return {"list": exps}
