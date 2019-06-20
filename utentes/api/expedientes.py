from pyramid.view import view_config

from utentes.models.exploracao import Exploracao
from utentes.api.requerimentos import calculate_new_exp_id
from utentes.user_utils import PERM_GET

import logging

log = logging.getLogger(__name__)


@view_config(
    route_name="api_expedientes",
    permission=PERM_GET,
    request_method="GET",
    renderer="json",
)
def exploracaos_get_exp_id(request):
    ara = request.registry.settings.get("ara")
    new_exp_id = calculate_new_exp_id(request, ara)
    result = request.db.query(Exploracao.exp_id, Exploracao.exp_name).all()
    expedientes = {"new_exp_id": new_exp_id, "list": []}
    for r in result:
        expediente = {}
        expediente["exp_id"] = r[0]
        expediente["exp_name"] = r[1]
        expedientes["list"].append(expediente)
    return expedientes
