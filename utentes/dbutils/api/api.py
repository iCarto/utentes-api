import logging

from pyramid.view import view_config

import utentes.constants.perms as perm
from utentes.dbutils.scripts.dump import dump
from utentes.dbutils.scripts.restore import restore
from utentes.dbutils.scripts.utils import DBUtilsException
from utentes.models.base import badrequest_exception


logger = logging.getLogger(__name__)


@view_config(
    route_name="api_db_dump",
    permission=perm.PERM_ADMIN,
    request_method="GET",
    renderer="json",
)
def api_db_dump(request):
    session = request.db
    try:
        filepath = dump(session)
    except DBUtilsException as e:
        logger.error(e, exc_info=True)
        raise badrequest_exception({"error": e.args})

    return {"dump": "ok", "file": filepath}


@view_config(
    route_name="api_db_restore",
    permission=perm.PERM_ADMIN,
    request_method="GET",
    renderer="json",
)
def api_db_restore(request):
    session = request.db
    try:
        filepath = request.GET["file"]
        restore(session, filepath)
    except DBUtilsException as e:
        logger.error(e, exc_info=True)
        raise badrequest_exception({"error": e.args})
    finally:
        # Avoid commit/rollkback after disconnect
        session.invalidate()

    return {"restore": "ok"}
