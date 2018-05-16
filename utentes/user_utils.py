# -*- coding: utf-8 -*-

from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound
from pyramid.security import authenticated_userid

from pyramid.security import Allow

from utentes.models.user import User

ROL_ADMIN = u'Administrador'
ROL_ADMINISTRATIVO = u'D. Administrativo'
ROL_FINANCIERO = u'D. Financeiro'
ROL_DIRECCION = u'Direcção'
ROL_TECNICO = u'D. Técnico'
ROL_JURIDICO = u'D. Jurídico'

ROL_ADMIN_SAFE = 'administrador'
ROL_ADMINISTRATIVO_SAFE = 'administrativo'
ROL_FINANCIERO_SAFE = 'financieiro'
ROL_DIRECCION_SAFE = 'direccao'
ROL_TECNICO_SAFE = 'tecnico'
ROL_JURIDICO_SAFE = 'juridico'


class RootFactory(object):
    __acl__ = [
               (Allow, ROL_ADMIN, ROL_ADMIN),
               (Allow, ROL_ADMINISTRATIVO, ROL_ADMINISTRATIVO),
               (Allow, ROL_FINANCIERO, ROL_FINANCIERO),
               (Allow, ROL_DIRECCION, ROL_DIRECCION),
               (Allow, ROL_TECNICO, ROL_TECNICO),
               (Allow, ROL_JURIDICO, ROL_JURIDICO),
               ]

    def __init__(self, request):
        pass


def get_user_role(username, request):
    try:
        user = request.db.query(User).filter(User.username == username).one()
        return [user.usergroup]
    except(MultipleResultsFound, NoResultFound):
        return []


def get_user_from_request(request):
    username = authenticated_userid(request)
    if username is not None:
        try:
            return request.db.query(User).filter(User.username == username).one()
        except(MultipleResultsFound, NoResultFound):
            return None
    else:
        return None


def get_user_from_db(request):
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
