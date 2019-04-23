# -*- coding: utf-8 -*-

from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound
from pyramid.security import (
    authenticated_userid,
    Allow,
    Authenticated,
)
from pyramid.threadlocal import get_current_registry
from users.user_roles import (
    ROL_ADMIN, ROL_ADMINISTRATIVO, ROL_FINANCIERO, ROL_DIRECCION, ROL_TECNICO,
    ROL_JURIDICO, ROL_OBSERVADOR, ROL_UNIDAD_DELEGACION, ROL_SINGLE,
    SINGLE_USER
)
from utentes.models.user import User


PERM_ADMIN = 'admin'
PERM_UTENTES = 'create_update_utente'
PERM_UPDATE_CULTIVO_TANQUE = 'update_cultivo_tanque'
PERM_GET = 'get'
PERM_UPDATE_EXPLORACAO = 'update_exploracao'
PERM_CREATE_EXPLORACAO = 'create_exploracao'
PERM_FACTURACAO = 'get_facturacao'
PERM_RENOVACAO = 'get_renovacao'
PERM_REQUERIMENTO = 'get_requerimento'
PERM_EM_PROCESSO = 'get_em_processo'
PERM_CREATE_REQUERIMENTO = 'create_requerimento'
PERM_CREATE_DOCUMENTO = 'create_documento'
PERM_UPDATE_CREATE_FACTURACAO = 'update_facturacao'
PERM_UPDATE_REQUERIMENTO = 'update_requerimento'
PERM_UPDATE_RENOVACAO = 'update_renovacao'
PERM_DELETE_DOCUMENTO = 'delete_documento'

# GESTIONAR UNIQUE USER
class RootFactory(object):
    __acl__ = [
               (Allow, Authenticated, PERM_GET),

               (Allow, ROL_ADMIN, PERM_ADMIN),
               (Allow, ROL_ADMIN, PERM_UTENTES),
               (Allow, ROL_ADMIN, PERM_CREATE_EXPLORACAO),
               (Allow, ROL_ADMIN, PERM_UPDATE_EXPLORACAO),
               (Allow, ROL_ADMIN, PERM_FACTURACAO),
               (Allow, ROL_ADMIN, PERM_UPDATE_CREATE_FACTURACAO),
               (Allow, ROL_ADMIN, PERM_UPDATE_CULTIVO_TANQUE),
               (Allow, ROL_ADMIN, PERM_REQUERIMENTO),
               (Allow, ROL_ADMIN, PERM_CREATE_REQUERIMENTO),
               (Allow, ROL_ADMIN, PERM_UPDATE_REQUERIMENTO),
               (Allow, ROL_ADMIN, PERM_CREATE_DOCUMENTO),
               (Allow, ROL_ADMIN, PERM_DELETE_DOCUMENTO),
               (Allow, ROL_ADMIN, PERM_RENOVACAO),
               (Allow, ROL_ADMIN, PERM_UPDATE_RENOVACAO),
               (Allow, ROL_ADMIN, PERM_EM_PROCESSO),

               (Allow, ROL_ADMINISTRATIVO, PERM_REQUERIMENTO),
               (Allow, ROL_ADMINISTRATIVO, PERM_CREATE_REQUERIMENTO),
               (Allow, ROL_ADMINISTRATIVO, PERM_UPDATE_REQUERIMENTO),
               (Allow, ROL_ADMINISTRATIVO, PERM_CREATE_EXPLORACAO),
               (Allow, ROL_ADMINISTRATIVO, PERM_UPDATE_EXPLORACAO),
               (Allow, ROL_ADMINISTRATIVO, PERM_CREATE_DOCUMENTO),
               (Allow, ROL_ADMINISTRATIVO, PERM_DELETE_DOCUMENTO),
               (Allow, ROL_ADMINISTRATIVO, PERM_RENOVACAO),
               (Allow, ROL_ADMINISTRATIVO, PERM_UPDATE_RENOVACAO),
               (Allow, ROL_ADMINISTRATIVO, PERM_EM_PROCESSO),

               (Allow, ROL_FINANCIERO, PERM_FACTURACAO),
               (Allow, ROL_FINANCIERO, PERM_UPDATE_CREATE_FACTURACAO),
               (Allow, ROL_FINANCIERO, PERM_CREATE_DOCUMENTO),
               (Allow, ROL_FINANCIERO, PERM_DELETE_DOCUMENTO),
               (Allow, ROL_FINANCIERO, PERM_RENOVACAO),
               (Allow, ROL_FINANCIERO, PERM_UPDATE_RENOVACAO),
               (Allow, ROL_FINANCIERO, PERM_EM_PROCESSO),

               (Allow, ROL_DIRECCION, PERM_REQUERIMENTO),
               (Allow, ROL_DIRECCION, PERM_UPDATE_REQUERIMENTO),
               (Allow, ROL_DIRECCION, PERM_RENOVACAO),
               (Allow, ROL_DIRECCION, PERM_UPDATE_RENOVACAO),
               (Allow, ROL_DIRECCION, PERM_EM_PROCESSO),

               (Allow, ROL_TECNICO, PERM_UTENTES),
               (Allow, ROL_TECNICO, PERM_CREATE_EXPLORACAO),
               (Allow, ROL_TECNICO, PERM_UPDATE_EXPLORACAO),
               (Allow, ROL_TECNICO, PERM_FACTURACAO),
               (Allow, ROL_TECNICO, PERM_UPDATE_CREATE_FACTURACAO),
               (Allow, ROL_TECNICO, PERM_UPDATE_CULTIVO_TANQUE),
               (Allow, ROL_TECNICO, PERM_REQUERIMENTO),
               (Allow, ROL_TECNICO, PERM_UPDATE_REQUERIMENTO),
               (Allow, ROL_TECNICO, PERM_CREATE_DOCUMENTO),
               (Allow, ROL_TECNICO, PERM_DELETE_DOCUMENTO),
               (Allow, ROL_TECNICO, PERM_RENOVACAO),
               (Allow, ROL_TECNICO, PERM_UPDATE_RENOVACAO),
               (Allow, ROL_TECNICO, PERM_EM_PROCESSO),

               (Allow, ROL_JURIDICO, PERM_UPDATE_EXPLORACAO),
               (Allow, ROL_JURIDICO, PERM_REQUERIMENTO),
               (Allow, ROL_JURIDICO, PERM_UTENTES),
               (Allow, ROL_JURIDICO, PERM_UPDATE_REQUERIMENTO),
               (Allow, ROL_JURIDICO, PERM_CREATE_DOCUMENTO),
               (Allow, ROL_JURIDICO, PERM_DELETE_DOCUMENTO),
               (Allow, ROL_JURIDICO, PERM_RENOVACAO),
               (Allow, ROL_JURIDICO, PERM_UPDATE_RENOVACAO),
               (Allow, ROL_JURIDICO, PERM_EM_PROCESSO),

               (Allow, ROL_OBSERVADOR, PERM_FACTURACAO),
               (Allow, ROL_OBSERVADOR, PERM_REQUERIMENTO),
               (Allow, ROL_OBSERVADOR, PERM_RENOVACAO),

               (Allow, ROL_UNIDAD_DELEGACION, PERM_FACTURACAO),
               (Allow, ROL_UNIDAD_DELEGACION, PERM_REQUERIMENTO),
               (Allow, ROL_UNIDAD_DELEGACION, PERM_RENOVACAO),
               (Allow, ROL_UNIDAD_DELEGACION, PERM_CREATE_DOCUMENTO),
               (Allow, ROL_UNIDAD_DELEGACION, PERM_DELETE_DOCUMENTO),
               (Allow, ROL_UNIDAD_DELEGACION, PERM_EM_PROCESSO),

               ]

    def __init__(self, request):
        pass


def is_single_user_mode(settings=None):
    settings = settings or get_current_registry().settings
    return settings.get('ara') in ['ARAN', 'DPMAIP']


def get_user_role(username, request):
    GROUPS_TO_ROLES = {
        ROL_SINGLE: [ROL_SINGLE, ROL_ADMIN],
        ROL_ADMIN: [ROL_ADMIN],
        ROL_ADMINISTRATIVO: [ROL_ADMINISTRATIVO],
        ROL_FINANCIERO: [ROL_FINANCIERO],
        ROL_DIRECCION: [ROL_DIRECCION],
        ROL_TECNICO: [ROL_TECNICO],
        ROL_JURIDICO: [ROL_JURIDICO],
        ROL_OBSERVADOR: [ROL_OBSERVADOR],
        ROL_UNIDAD_DELEGACION: [ROL_UNIDAD_DELEGACION],
    }
    ara = request.registry.settings.get('ara')
    if ara == 'ARAS':
        GROUPS_TO_ROLES[ROL_JURIDICO] = [ROL_JURIDICO, ROL_DIRECCION]
    if ara == 'ARAZ':
        GROUPS_TO_ROLES[ROL_JURIDICO] = [ROL_JURIDICO, ROL_DIRECCION, ROL_ADMINISTRATIVO]

    if is_single_user_mode():
        return GROUPS_TO_ROLES[get_unique_user().usergroup]
    try:
        user = request.db.query(User).filter(User.username == username).one()
        return GROUPS_TO_ROLES[user.usergroup]
    except(MultipleResultsFound, NoResultFound):
        return []


def get_user_from_request(request):
    if is_single_user_mode():
        return get_unique_user()

    username = authenticated_userid(request)
    if username is not None:
        try:
            return request.db.query(User).filter(User.username == username).one()
        except(MultipleResultsFound, NoResultFound):
            return None
    else:
        return None

def get_user_from_db(request):
    if is_single_user_mode():
        return get_unique_user()
    from pyramid.settings import asbool
    if asbool(request.registry.settings.get('users.debug')):
        get_user_from_db_stub(request)

    login_user = request.POST.get('user', '')
    login_pass = request.POST.get('passwd', '')
    try:
        user = request.db.query(User).filter(User.username == login_user).one()
        if user.check_password(login_pass):
            return user
        else:
            return None
    except(MultipleResultsFound, NoResultFound):
        return None


VALID_LOGINS = {
    'admin': ROL_ADMIN,
    'administrativo': ROL_ADMINISTRATIVO,
    'financieiro': ROL_FINANCIERO,
    'secretaria': ROL_DIRECCION,
    'tecnico': ROL_TECNICO,
    'juridico': ROL_JURIDICO,
    'observador': ROL_OBSERVADOR,
    'unidade': ROL_UNIDAD_DELEGACION,
}

def get_unique_user():
    return User.create_from_json({
        'username': SINGLE_USER,
        'usergroup': ROL_SINGLE,
        'password': SINGLE_USER
        })


def get_user_from_db_stub(request):
    username = request.POST.get('user', '')
    if username in VALID_LOGINS.keys():
        user = request.db.query(User).filter(User.username == username).first()
        if not user:
            user = User()
            user.username = username
            user.usergroup = VALID_LOGINS[username]
            user.set_password(username)
            request.db.add(user)
            request.db.commit()
        return user
