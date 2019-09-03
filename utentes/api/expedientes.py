import logging

from pyramid.view import view_config

import utentes.constants.perms as perm
from utentes.models.exploracao import Exploracao
from utentes.services.id_service import calculate_new_exp_id


log = logging.getLogger(__name__)


@view_config(
    route_name="api_expedientes",
    permission=perm.PERM_GET,
    request_method="GET",
    renderer="json",
)
def exploracaos_get_exp_id(request):
    new_exp_id = calculate_new_exp_id(request)
    result = request.db.query(Exploracao.exp_id, Exploracao.exp_name).all()
    expedientes = {"new_exp_id": new_exp_id, "list": []}
    for r in result:
        expediente = {}
        expediente["exp_id"] = r[0]
        expediente["exp_name"] = r[1]
        expedientes["list"].append(expediente)
    return expedientes
