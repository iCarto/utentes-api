# -*- coding: utf-8 -*-

from pyramid.httpexceptions import HTTPFound
from pyramid.security import forget
from pyramid.view import view_config


@view_config(route_name="logout")
def logout(request):
    headers = forget(request)
    response = HTTPFound(
        location=request.route_url(
            request.registry.settings.get("users.after_logout_url")
        ),
        headers=headers,
    )

    response.delete_cookie("utentes_stub_user")
    response.delete_cookie("utentes_stub_role")
    response.delete_cookie("utentes_stub_unidade")

    return response
