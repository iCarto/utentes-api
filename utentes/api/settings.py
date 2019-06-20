# -*- coding: utf-8 -*-

from pyramid.view import view_config

from utentes.models.setting import Setting
from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound
from utentes.models.base import badrequest_exception
from utentes.user_utils import PERM_ADMIN, PERM_GET

import error_msgs
import logging

logger = logging.getLogger(__name__)


@view_config(
    route_name="api_settings",
    permission=PERM_GET,
    request_method="GET",
    renderer="json",
)
def settings_get(request):
    return {s.property: s.value for s in request.db.query(Setting)}


@view_config(
    route_name="api_settings_property",
    permission=PERM_ADMIN,
    request_method="PUT",
    renderer="json",
)
def settings_update(request):
    property = request.matchdict["property"]
    if not property:
        raise badrequest_exception({"error": error_msgs["gid_obligatory"]})

    try:
        setting = request.db.query(Setting).filter(Setting.property == property).one()
        setting.update_from_json(request.json_body, property)
        request.db.add(setting)
        request.db.commit()
    except (MultipleResultsFound, NoResultFound):
        raise badrequest_exception({"error": error_msgs["no_gid"], "gid": property})
    except ValueError as ve:
        logger.exception(ve)
        raise badrequest_exception({"error": error_msgs["body_not_valid"]})

    return setting
