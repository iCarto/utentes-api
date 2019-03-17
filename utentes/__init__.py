# -*- coding: utf-8 -*-

import datetime
import decimal
import os
import sys
from pyramid.config import Configurator
from pyramid.request import Request
from pyramid.decorator import reify
from pyramid.renderers import JSON
from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker

from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy

from .user_utils import get_user_role, get_user_from_request, is_single_user_mode
from utentes.dbutils.scripts.utils import home_directory

class RequestWithDB(Request):

    @reify
    def db(self):
        '''Return a session. Only called once per request,
        thanks to @reify decorator'''
        session_factory = self.registry.settings['db.session_factory']
        self.add_finished_callback(self.close_db_connection)
        return session_factory()

    def close_db_connection(self, request):
        request.db.commit()
        request.db.close()


def date_adapter(obj, request):
    """ Returns string in format 'yyyy-mm-dd' or None """
    return obj.isoformat() if obj else None


def decimal_adapter(obj, request):
    return float(obj) if obj or (obj == 0) else None


def main(global_config, **settings):
    if is_single_user_mode(settings):
        media_root = os.path.join(home_directory(), settings['ara'], 'media')
        media_root = media_root.decode(sys.getfilesystemencoding())
        settings['media_root'] = media_root

    engine = engine_from_config(settings, 'sqlalchemy.')
    session_factory = sessionmaker(bind=engine)
    settings['db.session_factory'] = session_factory

    config = Configurator(
        settings=settings,
        request_factory=RequestWithDB,
        root_factory='utentes.user_utils.RootFactory'
    )
    config.set_request_property(get_user_from_request, 'user', reify=True)

    json_renderer = JSON()
    json_renderer.add_adapter(datetime.date, date_adapter)
    json_renderer.add_adapter(decimal.Decimal, decimal_adapter)
    config.add_renderer('json', json_renderer)

    # auth
    authn_policy = AuthTktAuthenticationPolicy(
        'utentes',
        callback=get_user_role,
        cookie_name='utentes',
        hashalg='sha512'
    )
    authz_policy = ACLAuthorizationPolicy()
    config.set_authentication_policy(authn_policy)
    config.set_authorization_policy(authz_policy)

    config.include('pyramid_jinja2')
    config.include('pyramid_webassets')
    config.include('utentes.dbutils')
    # https://github.com/Pylons/pyramid_jinja2/issues/111
    config.commit()

    config.add_jinja2_renderer('.html')

    config.add_jinja2_extension('webassets.ext.jinja2.AssetsExtension')
    assets_env = config.get_webassets_env()
    jinja2_env = config.get_jinja2_environment()
    jinja2_env.assets_environment = assets_env
    jinja2_env.globals['is_single_user_mode'] = is_single_user_mode

    config.add_static_view('static', 'static', cache_max_age=3600)

    add_routes_views(config)
    add_routes_api(config)

    config.scan(ignore=['utentes.test', 'utentes.dbutils'])
    return config.make_wsgi_app()


def add_routes_views(config):
    config.add_route('index', '/')
    config.add_route('login', '/login')
    config.add_route('logout', '/logout')
    config.add_route('user', '/utilizador')
    config.add_route('user_id', '/utilizador/{id}')
    config.add_route('users', '/utilizadores')
    config.add_route('exploracao-gps', 'exploracao-gps.html')
    config.add_route('exploracao-new', 'exploracao-new.html')
    config.add_route('exploracao-search', 'exploracao-search.html')
    config.add_route('exploracao-show', 'exploracao-show.html')
    config.add_route('facturacao', 'facturacao.html')
    config.add_route('renovacao', 'renovacao.html')
    config.add_route('requerimento-new', 'requerimento-new.html')
    config.add_route('requerimento-pendente', 'requerimento-pendente.html')
    config.add_route('utentes', 'utentes.html')


def add_routes_api(config):
    # GET    /api/exploracaos      = Return all exploracaos
    # POST   /api/exploracaos      = Create a new exploracao, 'exp_id' in body
    # GET    /api/exploracaos/{id} = Return individual exploracao
    # PUT    /api/exploracaos/{id} = Update exploracao
    # DELETE /api/exploracaos/{id} = Delete exploracao
    config.add_route('api_exploracaos', '/api/exploracaos')
    config.add_route('api_exploracaos_id', '/api/exploracaos/{id}')

    # GET    /api/exploracaos/{id}/documentos/{departamento} = Return all documentos for a departamento
    # POST   /api/exploracaos/{id}/documentos/{departamento} = Create a new documento
    # GET    /api/exploracaos/{id}/documentos/{departamento}/{filename} = Return individual documento
    # DELETE /api/exploracaos/{id}/documentos/{departamento}/{filename} = Delete documento
    config.add_route('api_exploracao_documentos_departamento', '/api/exploracaos/{id}/documentos/{departamento}')
    config.add_route('api_exploracao_documentos_departamento_files', '/api/exploracaos/{id}/documentos/{departamento}/files')
    config.add_route('api_exploracao_documentos_departamento_path', '/api/exploracaos/{id}/documentos/{departamento}/path')
    config.add_route('api_exploracao_documentos_departamento_zip', '/api/exploracaos/{id}/documentos/{departamento}/zip')
    config.add_route('api_exploracao_documentos_departamento_file', '/api/exploracaos/{id}/documentos/{departamento}/files/{name}')

    # GET    /api/utentes      = Return all utentes
    # POST   /api/utentes      = Create a new utente, 'nome' in body
    # GET    /api/utentes/{id} = Return individual utente
    # PUT    /api/utentes/{id} = Update utente
    # DELETE /api/utentes/{id} = Delete utente
    config.add_route('api_utentes', '/api/utentes')
    config.add_route('api_utentes_id', '/api/utentes/{id}')

    # GET    /api/cultivos      = Return all cultivos
    # PUT    /api/utentes/{id} = Update cultivo
    config.add_route('api_cultivos', '/api/cultivos')
    config.add_route('api_cultivos_id', '/api/cultivos/{id}')

    # GET    /api/tanques_piscicolas = Return all tanks
    # PUT    /api/tanques_piscicolas/{id} = Update a tank (geometry most of the times)
    config.add_route('api_tanques_piscicolas', '/api/tanques_piscicolas')
    config.add_route('api_tanques_piscicolas_id', '/api/tanques_piscicolas/{id}')

    # GET    /api/settings      = Return all settings
    # PUT    /api/settings/{property} = Update property
    config.add_route('api_settings', '/api/settings')
    config.add_route('api_settings_property', '/api/settings/{property}')

    # GET /domains = Return all domains (utentes included)
    config.add_route('api_domains', '/api/domains')
    config.add_route('api_domains_licencia_estado', '/api/domains/licencia_estado')
    config.add_route('api_domains_facturacao_fact_estado', '/api/domains/facturacao_fact_estado')

    config.add_route('api_domains_licencia_estado_renovacao', '/api/domains/licencia_estado_renovacao')

    # GET /api/base/fountains = Return a GeoJSON
    # POST /api/base/fountains = DELETE the table and insert the features in the zip
    config.add_route('api_base_fountains', '/api/base/fountains')

    config.add_route('api_requerimento', '/api/requerimento')
    config.add_route('api_requerimento_id', '/api/requerimento/{id}')
    config.add_route('api_requerimento_get_datos_ara', '/api/get_datos_ara')

    config.add_route('api_facturacao', '/api/facturacao')
    config.add_route('api_facturacao_id', '/api/facturacao/{id}')
    config.add_route('api_facturacao_new_factura', '/api/facturacao/{id}/emitir_factura')

    config.add_route('api_renovacao', '/api/renovacao')
    config.add_route('api_renovacao_id', '/api/renovacao/{id}')
    config.add_route('api_renovacao_historico_id', '/api/renovacao_historico/{id}')

    config.add_route('nuevo_ciclo_facturacion', '/api/nuevo_ciclo_facturacion')

    config.add_route('api_expedientes', '/api/expedientes')

    config.add_route('api_users', '/api/users')
    config.add_route('api_users_id', '/api/users/{id}')
