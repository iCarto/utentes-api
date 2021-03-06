from pyramid.httpexceptions import HTTPFound
from pyramid.security import remember
from pyramid.view import view_config

from utentes.user_utils import (
    ROL_FINANCIERO,
    get_unique_user,
    get_user_from_db,
    is_single_user_mode,
)


@view_config(route_name="index", renderer="utentes:templates/login.jinja2")
@view_config(route_name="login", renderer="utentes:templates/login.jinja2")
def login(request):

    if is_single_user_mode():
        user = get_unique_user()
        headers = remember(request, user.username)
        response = HTTPFound(location="/exploracao-search.html", headers=headers)
        response.set_cookie("utentes_stub_user", value=user.username)
        import urllib.request, urllib.parse, urllib.error

        usergroup = urllib.parse.quote(user.usergroup)
        response.set_cookie("utentes_stub_role", value=usergroup)
        if user.unidade is not None:
            unidade = urllib.parse.quote(user.unidade)
            response.set_cookie("utentes_stub_unidade", value=unidade)
        return response

    login_url = request.route_url("login")
    root_url = request.route_url("index")

    # In some configurations, referrer does not add the trailing slash
    # when the root url is visited. This should be fixed in a more correct way
    root_url_without_trailing_slash = (
        root_url[:-1] if root_url.endswith("/") else root_url
    )

    referrer = request.url

    if referrer in [login_url, root_url, root_url_without_trailing_slash]:
        referrer = request.route_url(
            request.registry.settings.get("users.after_login_url")
        )
    next = request.params.get("next", referrer)

    if request.authenticated_userid and request.url in [
        root_url,
        root_url_without_trailing_slash,
    ]:
        return HTTPFound(location=next)

    if "submit" in request.POST:
        user = get_user_from_db(request)
        if user:
            headers = remember(request, user.username)
            if user.usergroup == ROL_FINANCIERO and next == request.route_url(
                request.registry.settings.get("users.after_login_url")
            ):
                next = request.route_url("facturacao")
            response = HTTPFound(location=next, headers=headers)
            response.set_cookie("utentes_stub_user", value=user.username)
            import urllib.request, urllib.parse, urllib.error

            usergroup = urllib.parse.quote(user.usergroup)
            response.set_cookie("utentes_stub_role", value=usergroup)
            if user.unidade is not None:
                unidade = urllib.parse.quote(user.unidade)
                response.set_cookie("utentes_stub_unidade", value=unidade)
            return response

    return {"title": request.registry.settings.get("ara_app_name"), "next": next}
