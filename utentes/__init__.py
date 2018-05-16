# -*- coding: utf-8 -*-

import datetime
import decimal
from pyramid.config import Configurator
from pyramid.request import Request
from pyramid.decorator import reify
from pyramid.renderers import JSON
from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker


class RequestWithDB(Request):

    @reify
    def db(self):
        """Return a session. Only called once per request,
        thanks to @reify decorator"""
        session_factory = self.registry.settings['db.session_factory']
        self.add_finished_callback(self.close_db_connection)
        return session_factory()

    def close_db_connection(self, request):
        request.db.commit()
        request.db.close()


def date_adapter(obj, request):
    return obj.isoformat() if obj else None


def decimal_adapter(obj, request):
    return float(obj) if obj or (obj == 0) else None


def get_user_role(username, request):
    return username


def main(global_config, **settings):
    engine = engine_from_config(settings, 'sqlalchemy.')
    session_factory = sessionmaker(bind=engine)
    settings['db.session_factory'] = session_factory

    config = Configurator(
        settings=settings,
        request_factory=RequestWithDB
    )

    json_renderer = JSON()
    json_renderer.add_adapter(datetime.date, date_adapter)
    json_renderer.add_adapter(decimal.Decimal, decimal_adapter)
    config.add_renderer('json', json_renderer)

    config.include('pyramid_jinja2')

    config.add_static_view('static', 'static', cache_max_age=0)

    add_routes_views(config)
    add_routes_api(config)

    config.scan()
    return config.make_wsgi_app()


def add_routes_views(config):
    config.add_route('login', '/login')


def add_routes_api(config):
    # GET    /api/exploracaos      = Return all exploracaos
    # POST   /api/exploracaos      = Create a new exploracao, 'exp_id' in body
    # GET    /api/exploracaos/{id} = Return individual exploracao
    # PUT    /api/exploracaos/{id} = Update exploracao
    # DELETE /api/exploracaos/{id} = Delete exploracao
    config.add_route('api_exploracaos', '/api/exploracaos')
    config.add_route('api_exploracaos_id', '/api/exploracaos/{id}')

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

    # GET /api/base/fountains = Return a GeoJSON
    # POST /api/base/fountains = DELETE the table and insert the features in the zip
    config.add_route('api_base_fountains', '/api/base/fountains')

    config.add_route('api_requerimento', '/api/requerimento')
    config.add_route('api_requerimento_id', '/api/requerimento/{id}')

    config.add_route('api_facturacao', '/api/facturacao')
    config.add_route('api_facturacao_id', '/api/facturacao/{id}')

    config.add_route('nuevo_ciclo_facturacion', '/api/nuevo_ciclo_facturacion')

    config.add_route('api_expedientes', '/api/expedientes')
