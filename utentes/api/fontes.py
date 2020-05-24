import logging

from pyramid.view import view_config

import utentes.constants.perms as perm
from utentes.models.base import badrequest_exception
from utentes.models.fonte import Fonte

from .error_msgs import error_msgs


log = logging.getLogger(__name__)


@view_config(
    route_name="api_fontes_exploracao",
    permission=perm.PERM_GET,
    request_method="GET",
    renderer="json",
)
def api_fontes_exploracao(request):
    # Return the fontes for an exploracao
    exploracao = None
    if request.matchdict:
        exploracao = request.matchdict["exploracao"] or None

    if not exploracao:
        raise badrequest_exception(
            {"error": error_msgs["no_gid"], "exploracao": exploracao}
        )

    return request.db.query(Fonte).filter(Fonte.exploracao == exploracao).all()
