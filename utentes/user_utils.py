# -*- coding: utf-8 -*-

from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound
from pyramid.security import authenticated_userid

from pyramid.security import Allow
from pyramid.security import Authenticated

from utentes.models.user import User

ROL_ADMIN = u'Administrador'
ROL_ADMINISTRATIVO = u'D. Administrativo'
ROL_FINANCIERO = u'D. Financeiro'
ROL_DIRECCION = u'Direcção'
ROL_TECNICO = u'D. Técnico'
ROL_JURIDICO = u'D. Jurídico'

PERM_ADMIN = 'admin'
PERM_UTENTES = 'create_update_utente'
PERM_CULTIVO_TANQUE = 'update_cultivo_tanque'
PERM_GET = 'get'
PERM_EXPLORACAO = 'create_update_exploracao'
PERM_FACTURACAO = 'update_facturacao'
PERM_CREATE_REQUERIMENTO = 'create_requerimento'
PERM_UPDATE_REQUERIMENTO = 'update_requerimento'
PERM_CREATE_DOCUMENTO = 'create_documento'
PERM_DELETE_DOCUMENTO = 'create_documento'


# GESTIONAR UNIQUE USER
class RootFactory(object):
    __acl__ = [
               (Allow, Authenticated, PERM_GET),

               (Allow, ROL_ADMIN, PERM_ADMIN),
               (Allow, ROL_ADMIN, PERM_UTENTES),
               (Allow, ROL_ADMIN, PERM_EXPLORACAO),
               (Allow, ROL_ADMIN, PERM_FACTURACAO),
               (Allow, ROL_ADMIN, PERM_CULTIVO_TANQUE),
               (Allow, ROL_ADMIN, PERM_CREATE_REQUERIMENTO),
               (Allow, ROL_ADMIN, PERM_UPDATE_REQUERIMENTO),
               (Allow, ROL_ADMIN, PERM_CREATE_DOCUMENTO),
               (Allow, ROL_ADMIN, PERM_DELETE_DOCUMENTO),

               (Allow, ROL_ADMINISTRATIVO, PERM_CREATE_REQUERIMENTO),
               (Allow, ROL_ADMINISTRATIVO, PERM_UPDATE_REQUERIMENTO),
               (Allow, ROL_ADMINISTRATIVO, PERM_CREATE_DOCUMENTO),
               (Allow, ROL_ADMINISTRATIVO, PERM_DELETE_DOCUMENTO),

               (Allow, ROL_FINANCIERO, PERM_FACTURACAO),
               (Allow, ROL_FINANCIERO, PERM_CREATE_DOCUMENTO),
               (Allow, ROL_FINANCIERO, PERM_DELETE_DOCUMENTO),

               (Allow, ROL_DIRECCION, PERM_UPDATE_REQUERIMENTO),

               (Allow, ROL_TECNICO, PERM_UTENTES),
               (Allow, ROL_TECNICO, PERM_EXPLORACAO),
               (Allow, ROL_TECNICO, PERM_FACTURACAO),
               (Allow, ROL_TECNICO, PERM_CULTIVO_TANQUE),
               (Allow, ROL_TECNICO, PERM_UPDATE_REQUERIMENTO),
               (Allow, ROL_TECNICO, PERM_CREATE_DOCUMENTO),
               (Allow, ROL_TECNICO, PERM_DELETE_DOCUMENTO),

               (Allow, ROL_JURIDICO, ROL_JURIDICO),
               (Allow, ROL_JURIDICO, PERM_UPDATE_REQUERIMENTO),
               (Allow, ROL_JURIDICO, PERM_CREATE_DOCUMENTO),
               (Allow, ROL_JURIDICO, PERM_DELETE_DOCUMENTO),
               ]

    def __init__(self, request):
        pass


def get_user_role(username, request):
    if request.registry.settings.get('ara') == 'ARAN':
        return [get_unique_user().usergroup]
    try:
        user = request.db.query(User).filter(User.username == username).one()
        return [user.usergroup]
    except(MultipleResultsFound, NoResultFound):
        return []


def get_user_from_request(request):
    if request.registry.settings.get('ara') == 'ARAN':
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
    if request.registry.settings.get('ara') == 'ARAN':
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
    'admin': u'Administrador',
    'administrativo': u'D. Administrativo',
    'financieiro': u'D. Financeiro',
    'secretaria': u'Direcção',
    'tecnico': u'D. Técnico',
    'juridico': u'D. Jurídico',
}


def get_unique_user():
    return User.create_from_json({
        'username': 'UNIQUE_USER',
        'usergroup': 'Administrador',
        'password': 'UNIQUE_USER'
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
