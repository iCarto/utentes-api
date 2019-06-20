# -*- coding: utf-8 -*-

from pyramid.httpexceptions import HTTPFound
from pyramid.security import Authenticated
from pyramid.view import view_config
from utentes.models.user import User


@view_config(
    route_name="user",
    effective_principals=Authenticated,
    renderer="utentes:templates/user.jinja2",
)
def user(request):
    user = (
        request.db.query(User)
        .filter(User.username == request.authenticated_userid)
        .one()
    )
    return HTTPFound(location=request.route_url("user_id", id=user.id))


@view_config(
    route_name="user_id",
    effective_principals=Authenticated,
    renderer="utentes:templates/user.jinja2",
)
def user_id(request):
    return {"title": "Perfil de utilizador"}
