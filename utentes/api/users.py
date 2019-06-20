# -*- coding: utf-8 -*-

from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound
from pyramid.view import view_config
from utentes.models.user import User
from utentes.lib.schema_validator.validation_exception import ValidationException

from utentes.models.base import badrequest_exception, unauthorized_exception
from utentes.api.error_msgs import error_msgs
from utentes.user_utils import PERM_ADMIN, PERM_GET

import logging

log = logging.getLogger(__name__)


@view_config(route_name="api_users", permission=PERM_ADMIN, renderer="json")
def users_read(request):
    return request.db.query(User).all()


@view_config(
    route_name="api_users",
    request_method="POST",
    permission=PERM_ADMIN,
    renderer="json",
)
def user_create(request):
    try:
        body = request.json_body
    except ValueError as ve:
        log.error(ve)
        raise badrequest_exception({"error": error_msgs["body_not_valid"]})

    user = request.db.query(User).filter(User.username == body.get("username")).first()
    if user:
        raise badrequest_exception({"error": error_msgs["user_already_exists"]})

    try:
        user = User.create_from_json(request.json_body)
        request.db.add(user)
        request.db.commit()
    except ValidationException as val_exp:
        request.db.rollback()
        raise badrequest_exception(val_exp.msgs)
    except Exception:
        log.error("Failed to create user", exc_info=True)
        request.db.rollback()
        raise badrequest_exception({"error": error_msgs["unknown_error"]})

    return user


@view_config(
    route_name="api_users_id",
    request_method="DELETE",
    permission=PERM_ADMIN,
    renderer="json",
)
def user_delete(request):
    id = request.matchdict["id"]
    if not id:
        raise badrequest_exception({"error": error_msgs["username_obligatory"]})

    try:
        user = request.db.query(User).filter(User.id == id).one()
        request.db.delete(user)
        request.db.commit()
        return {"username": user.username}
    except (MultipleResultsFound, NoResultFound):
        raise badrequest_exception({"error": error_msgs["user_not_exists"], "id": id})
    except Exception:
        log.error("Failed to delete user", exc_info=True)
        request.db.rollback()
        raise badrequest_exception({"error": error_msgs["unknown_error"]})


@view_config(
    route_name="api_users_id",
    permission=PERM_GET,
    request_method="GET",
    renderer="json",
)
def user_read(request):
    id = request.matchdict["id"]
    if not id:
        raise badrequest_exception({"error": error_msgs["username_obligatory"]})

    user = request.db.query(User).filter(User.id == id).one()
    granted = (str(request.user.id) == str(user.id)) or request.has_permission(
        PERM_ADMIN
    )

    if granted:
        try:
            return user
        except (MultipleResultsFound, NoResultFound):
            raise badrequest_exception(
                {"error": error_msgs["user_not_exists"], "id": id}
            )
    else:
        raise unauthorized_exception()


@view_config(
    route_name="api_users_id",
    permission=PERM_GET,
    request_method="PUT",
    renderer="json",
)
def user_update(request):
    json = request.json_body
    id = request.matchdict["id"]
    if not id:
        raise badrequest_exception({"error": error_msgs["username_obligatory"]})
    try:
        user = request.db.query(User).filter(User.id == id).one()
    except (MultipleResultsFound, NoResultFound):
        raise badrequest_exception(
            {"error": error_msgs["username_obligatory"], "id": id}
        )

    if str(user.id) != str(json["id"]):
        raise badrequest_exception({"error": error_msgs["username_obligatory"]})

    granted = (request.user.id == user.id) or (request.has_permission(PERM_ADMIN))

    if not granted:
        raise unauthorized_exception()

    if user.username != json["username"]:
        bads = request.db.query(User).filter(User.username == json["username"]).all()
        if bads:
            raise badrequest_exception({"error": error_msgs["user_already_exists"]})

    try:
        user.update_from_json(json)
        request.db.add(user)
        request.db.commit()
        return user
    except Exception:
        log.error("Failed to update user", exc_info=True)
        request.db.rollback()
        raise badrequest_exception({"error": error_msgs["unknown_error"]})
