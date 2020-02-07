import logging

from pyramid.view import view_config
from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound

from . import error_msgs
import utentes.constants.perms as perm
from utentes.models.base import badrequest_exception
from utentes.models.setting import Setting


logger = logging.getLogger(__name__)


@view_config(
    route_name="api_settings",
    permission=perm.PERM_GET,
    request_method="GET",
    renderer="json",
)
def settings_get(request):
    return {s.property: s.value for s in request.db.query(Setting)}


@view_config(
    route_name="api_settings_property",
    permission=perm.PERM_ADMIN,
    request_method="PUT",
    renderer="json",
)
def settings_update(request):
    prop = request.matchdict["property"]
    if not prop:
        raise badrequest_exception({"error": error_msgs["gid_obligatory"]})

    try:
        setting = request.db.query(Setting).filter(Setting.property == prop).one()
        setting.update_from_json(request.json_body, prop)
        request.db.add(setting)
        request.db.commit()
    except (MultipleResultsFound, NoResultFound):
        raise badrequest_exception({"error": error_msgs["no_gid"], "gid": prop})
    except ValueError as ve:
        logger.exception(ve)
        raise badrequest_exception({"error": error_msgs["body_not_valid"]})

    return setting
