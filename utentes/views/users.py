# -*- coding: utf-8 -*-

from pyramid.view import view_config
from utentes.user_utils import PERM_ADMIN


@view_config(
    route_name="users", permission=PERM_ADMIN, renderer="utentes:templates/users.jinja2"
)
def users_admin(request):
    return {"title": u"Administração de utilizadores"}
