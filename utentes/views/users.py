from pyramid.view import view_config

import utentes.constants.perms as perm


@view_config(
    route_name="users",
    permission=perm.PERM_ADMIN,
    renderer="utentes:templates/users.jinja2",
)
def users_admin(request):
    return {"title": "Administração de utilizadores"}
