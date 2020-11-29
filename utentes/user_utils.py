from pyramid.security import Allow, Authenticated, Deny
from pyramid.settings import asbool
from pyramid.threadlocal import get_current_registry
from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound

from users.user_roles import (
    ROL_ADMIN,
    ROL_ADMINISTRATIVO,
    ROL_DIRECCION,
    ROL_FINANCIERO,
    ROL_JURIDICO,
    ROL_OBSERVADOR,
    ROL_SINGLE,
    ROL_TECNICO,
    ROL_UNIDAD_DELEGACION,
    SINGLE_USER,
)
from utentes.constants import perms as perm
from utentes.models.user import User
from utentes.tenant_custom_code import group_to_roles


# GESTIONAR UNIQUE USER
class RootFactory(object):
    __acl__ = [
        (Deny, ROL_SINGLE, perm.PERM_PAGE_ADICIONAR_USOS_COMUNS),
        (Deny, ROL_SINGLE, perm.PERM_PAGE_ADICIONAR_UTENTE_FACTO),
        (Deny, ROL_SINGLE, perm.PERM_FACTURACAO),
        (Allow, Authenticated, perm.PERM_GET),
        (Allow, ROL_ADMIN, perm.PERM_ADMIN),
        (Allow, ROL_ADMIN, perm.PERM_UTENTES),
        (Allow, ROL_ADMIN, perm.PERM_CREATE_EXPLORACAO),
        (Allow, ROL_ADMIN, perm.PERM_UPDATE_EXPLORACAO),
        (Allow, ROL_ADMIN, perm.PERM_FACTURACAO),
        (Allow, ROL_ADMIN, perm.PERM_UPDATE_CREATE_FACTURACAO),
        (Allow, ROL_ADMIN, perm.PERM_UPDATE_CULTIVO_TANQUE),
        (Allow, ROL_ADMIN, perm.PERM_REQUERIMENTO),
        (Allow, ROL_ADMIN, perm.PERM_CREATE_REQUERIMENTO),
        (Allow, ROL_ADMIN, perm.PERM_UPDATE_REQUERIMENTO),
        (Allow, ROL_ADMIN, perm.PERM_CREATE_DOCUMENTO),
        (Allow, ROL_ADMIN, perm.PERM_DELETE_DOCUMENTO),
        (Allow, ROL_ADMIN, perm.PERM_RENOVACAO),
        (Allow, ROL_ADMIN, perm.PERM_UPDATE_RENOVACAO),
        (Allow, ROL_ADMIN, perm.PERM_EM_PROCESSO),
        (Allow, ROL_ADMIN, perm.PERM_NEW_INVOICE_CYCLE),
        (Allow, ROL_ADMIN, perm.PERM_GET_USAGE_COMMON),
        (Allow, ROL_ADMIN, perm.PERM_CREATE_USAGE_COMMON),
        (Allow, ROL_ADMIN, perm.PERM_PAGE_ADICIONAR_UTENTE_FACTO),
        (Allow, ROL_ADMIN, perm.PERM_PAGE_ADICIONAR_USOS_COMUNS),
        (Allow, ROL_ADMINISTRATIVO, perm.PERM_REQUERIMENTO),
        (Allow, ROL_ADMINISTRATIVO, perm.PERM_CREATE_REQUERIMENTO),
        (Allow, ROL_ADMINISTRATIVO, perm.PERM_UPDATE_REQUERIMENTO),
        (Allow, ROL_ADMINISTRATIVO, perm.PERM_CREATE_EXPLORACAO),
        (Allow, ROL_ADMINISTRATIVO, perm.PERM_UPDATE_EXPLORACAO),
        (Allow, ROL_ADMINISTRATIVO, perm.PERM_CREATE_DOCUMENTO),
        (Allow, ROL_ADMINISTRATIVO, perm.PERM_DELETE_DOCUMENTO),
        (Allow, ROL_ADMINISTRATIVO, perm.PERM_RENOVACAO),
        (Allow, ROL_ADMINISTRATIVO, perm.PERM_UPDATE_RENOVACAO),
        (Allow, ROL_ADMINISTRATIVO, perm.PERM_EM_PROCESSO),
        (Allow, ROL_FINANCIERO, perm.PERM_FACTURACAO),
        (Allow, ROL_FINANCIERO, perm.PERM_UPDATE_CREATE_FACTURACAO),
        (Allow, ROL_FINANCIERO, perm.PERM_CREATE_DOCUMENTO),
        (Allow, ROL_FINANCIERO, perm.PERM_DELETE_DOCUMENTO),
        (Allow, ROL_FINANCIERO, perm.PERM_EM_PROCESSO),
        (Allow, ROL_DIRECCION, perm.PERM_REQUERIMENTO),
        (Allow, ROL_DIRECCION, perm.PERM_UPDATE_REQUERIMENTO),
        (Allow, ROL_DIRECCION, perm.PERM_RENOVACAO),
        (Allow, ROL_DIRECCION, perm.PERM_UPDATE_RENOVACAO),
        (Allow, ROL_DIRECCION, perm.PERM_EM_PROCESSO),
        (Allow, ROL_TECNICO, perm.PERM_UTENTES),
        (Allow, ROL_TECNICO, perm.PERM_CREATE_EXPLORACAO),
        (Allow, ROL_TECNICO, perm.PERM_UPDATE_EXPLORACAO),
        (Allow, ROL_TECNICO, perm.PERM_FACTURACAO),
        (Allow, ROL_TECNICO, perm.PERM_UPDATE_CREATE_FACTURACAO),
        (Allow, ROL_TECNICO, perm.PERM_UPDATE_CULTIVO_TANQUE),
        (Allow, ROL_TECNICO, perm.PERM_REQUERIMENTO),
        (Allow, ROL_TECNICO, perm.PERM_UPDATE_REQUERIMENTO),
        (Allow, ROL_TECNICO, perm.PERM_CREATE_DOCUMENTO),
        (Allow, ROL_TECNICO, perm.PERM_DELETE_DOCUMENTO),
        (Allow, ROL_TECNICO, perm.PERM_RENOVACAO),
        (Allow, ROL_TECNICO, perm.PERM_UPDATE_RENOVACAO),
        (Allow, ROL_TECNICO, perm.PERM_EM_PROCESSO),
        (Allow, ROL_TECNICO, perm.PERM_GET_USAGE_COMMON),
        (Allow, ROL_TECNICO, perm.PERM_CREATE_USAGE_COMMON),
        (Allow, ROL_TECNICO, perm.PERM_PAGE_ADICIONAR_UTENTE_FACTO),
        (Allow, ROL_TECNICO, perm.PERM_PAGE_ADICIONAR_USOS_COMUNS),
        (Allow, ROL_JURIDICO, perm.PERM_UPDATE_EXPLORACAO),
        (Allow, ROL_JURIDICO, perm.PERM_REQUERIMENTO),
        (Allow, ROL_JURIDICO, perm.PERM_UTENTES),
        (Allow, ROL_JURIDICO, perm.PERM_UPDATE_REQUERIMENTO),
        (Allow, ROL_JURIDICO, perm.PERM_CREATE_DOCUMENTO),
        (Allow, ROL_JURIDICO, perm.PERM_DELETE_DOCUMENTO),
        (Allow, ROL_JURIDICO, perm.PERM_RENOVACAO),
        (Allow, ROL_JURIDICO, perm.PERM_UPDATE_RENOVACAO),
        (Allow, ROL_JURIDICO, perm.PERM_EM_PROCESSO),
        (Allow, ROL_OBSERVADOR, perm.PERM_FACTURACAO),
        (Allow, ROL_OBSERVADOR, perm.PERM_REQUERIMENTO),
        (Allow, ROL_OBSERVADOR, perm.PERM_RENOVACAO),
        (Allow, ROL_UNIDAD_DELEGACION, perm.PERM_FACTURACAO),
        (Allow, ROL_UNIDAD_DELEGACION, perm.PERM_REQUERIMENTO),
        (Allow, ROL_UNIDAD_DELEGACION, perm.PERM_RENOVACAO),
        (Allow, ROL_UNIDAD_DELEGACION, perm.PERM_CREATE_DOCUMENTO),
        (Allow, ROL_UNIDAD_DELEGACION, perm.PERM_DELETE_DOCUMENTO),
        (Allow, ROL_UNIDAD_DELEGACION, perm.PERM_EM_PROCESSO),
        (Allow, ROL_SINGLE, perm.PERM_PAGE_ADICIONAR_EXPLORACAO),
    ]

    def __init__(self, request):
        pass  # noqa: WPS420


def is_single_user_mode(settings=None):
    settings = settings or get_current_registry().settings
    return settings.get("ara") == "DPMAIP"


def get_user_role(username, request):
    ara = request.registry.settings.get("ara")
    current_group_to_roles = group_to_roles(ara)

    if is_single_user_mode():
        return current_group_to_roles[get_unique_user().usergroup]
    try:
        user = request.db.query(User).filter(User.username == username).one()
    except (MultipleResultsFound, NoResultFound):
        return []
    return current_group_to_roles[user.usergroup]


def get_user_from_request(request):
    if is_single_user_mode():
        return get_unique_user()

    username = request.authenticated_userid
    if username is not None:
        try:
            return request.db.query(User).filter(User.username == username).one()
        except (MultipleResultsFound, NoResultFound):
            return None
    else:
        return None


def get_user_from_db(request):
    if is_single_user_mode():
        return get_unique_user()

    if asbool(request.registry.settings.get("users.debug")):
        get_user_from_db_stub(request)

    login_user = request.POST.get("user", "")
    login_pass = request.POST.get("passwd", "")
    try:
        user = request.db.query(User).filter(User.username == login_user).one()
    except (MultipleResultsFound, NoResultFound):
        return None
    if user.check_password(login_pass):
        return user


def get_unique_user():
    return User.create_from_json(
        {"username": SINGLE_USER, "usergroup": ROL_SINGLE, "password": SINGLE_USER}
    )


def get_user_from_db_stub(request):
    valid_logins = {
        "admin": ROL_ADMIN,
        "administrativo": ROL_ADMINISTRATIVO,
        "financieiro": ROL_FINANCIERO,
        "secretaria": ROL_DIRECCION,
        "tecnico": ROL_TECNICO,
        "juridico": ROL_JURIDICO,
        "observador": ROL_OBSERVADOR,
        "unidade": ROL_UNIDAD_DELEGACION,
    }

    username = request.POST.get("user", "")
    if username in list(valid_logins.keys()):
        user = request.db.query(User).filter(User.username == username).first()
        if not user:
            user = User()
            user.username = username
            user.usergroup = valid_logins[username]
            user.set_password(username)
            request.db.add(user)
            request.db.commit()
        return user
