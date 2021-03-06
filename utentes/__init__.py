import datetime
import decimal
import os
import sys

from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy
from pyramid.config import Configurator
from pyramid.decorator import reify
from pyramid.renderers import JSON
from pyramid.request import Request
from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker
from webassets.filter import register_filter

import utentes.constants.perms as perm
from utentes.dbutils.scripts.utils import home_directory
from utentes.lib import webassets_filters
from utentes.tenant_custom_code import adjust_settings

from .user_utils import get_user_from_request, get_user_role, is_single_user_mode


ONE_HOUR = 3600  # in seconds


class RequestWithDB(Request):
    @reify
    def db(self):
        """Return a session. Only called once per request,
        thanks to @reify decorator"""
        session_factory = self.registry.settings["db.session_factory"]
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
        media_root = os.path.join(home_directory(), settings.get("ara"), "media")
        # media_root = media_root.decode(sys.getfilesystemencoding())
        settings["media_root"] = media_root

    engine = engine_from_config(settings, "sqlalchemy.")
    session_factory = sessionmaker(bind=engine)
    settings["db.session_factory"] = session_factory

    adjust_settings(settings)

    config = Configurator(
        settings=settings,
        request_factory=RequestWithDB,
        root_factory="utentes.user_utils.RootFactory",
    )
    config.add_request_method(get_user_from_request, "user", reify=True)

    json_renderer = JSON()
    json_renderer.add_adapter(datetime.date, date_adapter)
    json_renderer.add_adapter(decimal.Decimal, decimal_adapter)
    config.add_renderer("json", json_renderer)

    # auth
    authn_policy = AuthTktAuthenticationPolicy(
        "utentes", callback=get_user_role, cookie_name="utentes", hashalg="sha512"
    )
    authz_policy = ACLAuthorizationPolicy()
    config.set_authentication_policy(authn_policy)
    config.set_authorization_policy(authz_policy)

    config.include("pyramid_jinja2")
    config.include("pyramid_webassets")
    config.include("utentes.dbutils")
    # https://github.com/Pylons/pyramid_jinja2/issues/111
    config.commit()

    config.add_jinja2_renderer(".html")

    register_filter(webassets_filters.StrictMode)
    config.add_jinja2_extension("webassets.ext.jinja2.AssetsExtension")
    assets_env = config.get_webassets_env()
    jinja2_env = config.get_jinja2_environment()
    jinja2_env.assets_environment = assets_env
    jinja2_env.globals["is_single_user_mode"] = is_single_user_mode
    jinja2_env.globals["perm"] = perm

    config.add_static_view("static", "static", cache_max_age=ONE_HOUR)

    add_routes_views(config)
    add_routes_api(config)

    config.scan(ignore=["utentes.test", "utentes.dbutils"])
    return config.make_wsgi_app()


def add_routes_views(config):
    config.add_route("index", "/")
    config.add_route("login", "/login")
    config.add_route("logout", "/logout")
    config.add_route("user", "/utilizador")
    config.add_route("user_id", "/utilizador/{id}")
    config.add_route("users", "/utilizadores")
    config.add_route("adicionar_exploracao", "/adicionar_exploracao")
    config.add_route("adicionar_ficha", "/adicionar_ficha")
    config.add_route("adicionar_usos_comuns", "/adicionar_utente_usos_comuns")
    config.add_route("adicionar_utente_facto", "/adicionar_utente_facto")
    config.add_route("exploracao-search", "exploracao-search.html")
    config.add_route("exploracao-show", "exploracao-show.html")
    config.add_route("facturacao", "facturacao.html")
    config.add_route("renovacao", "renovacao.html")
    config.add_route("requerimento-new", "requerimento-new.html")
    config.add_route("requerimento-pendente", "requerimento-pendente.html")
    config.add_route("utentes", "utentes.html")
    config.add_route("facturacao-stats", "facturacao-stats.html")


def add_routes_api(config):
    # GET    /api/exploracaos      = Return all exploracaos
    # POST   /api/exploracaos      = Create a new exploracao, 'exp_id' in body
    # GET    /api/exploracaos/{id} = Return individual exploracao
    # PUT    /api/exploracaos/{id} = Update exploracao
    # DELETE /api/exploracaos/{id} = Delete exploracao
    config.add_route("api_exploracaos", "/api/exploracaos")
    config.add_route("api_exploracaos_id", "/api/exploracaos/{id}")

    # GET /api/fontes/{exploracao}
    config.add_route("api_fontes_exploracao", "/api/fontes/{exploracao}")

    # exploracao_id*/departamento?/unidade? conforms the subpath part of the url
    # GET    /api/documentos/exploracao_id*/departamento?/unidade?
    #     Return info and routes to files for an exploracao, departamento or unidade
    # POST   /api/documentos/exploracao_id*/departamento?/unidade?
    #     Creates a new documento
    # GET    /api/exploracaos/{id}/documentos/{departamento}/{filename}
    #     Return individual documento
    # DELETE /api/exploracaos/{id}/documentos/{departamento}/{filename}
    #     Delete documento
    config.add_route(
        "api_exploracao_documentacao_files", "/api/documentos/files/*subpath"
    )
    config.add_route(
        "api_exploracao_documentacao_path", "/api/documentos/path/*subpath"
    )
    config.add_route("api_exploracao_documentacao_zip", "/api/zip/*subpath")
    config.add_route("api_exploracao_documentacao", "/api/documentos/*subpath")
    config.add_route("api_exploracao_file", "/api/file/*subpath")

    # GET    /api/utentes      = Return all utentes
    # POST   /api/utentes      = Create a new utente, 'nome' in body
    # GET    /api/utentes/{id} = Return individual utente
    # PUT    /api/utentes/{id} = Update utente
    # DELETE /api/utentes/{id} = Delete utente
    config.add_route("api_utentes", "/api/utentes")
    config.add_route("api_utentes_id", "/api/utentes/{id}")

    # GET    /api/cultivos      = Return all cultivos
    # PUT    /api/utentes/{id} = Update cultivo
    config.add_route("api_cultivos", "/api/cultivos")
    config.add_route("api_cultivos_id", "/api/cultivos/{id}")

    # GET    /api/tanques_piscicolas = Return all tanks
    # PUT    /api/tanques_piscicolas/{id} = Update a tank (geometry most of the times)
    config.add_route("api_tanques_piscicolas", "/api/tanques_piscicolas")
    config.add_route("api_tanques_piscicolas_id", "/api/tanques_piscicolas/{id}")

    # GET    /api/settings      = Return all settings
    # PUT    /api/settings/{property} = Update property
    config.add_route("api_settings", "/api/settings")
    config.add_route("api_settings_property", "/api/settings/{property}")

    # GET /domains = Return all domains (utentes included)
    config.add_route("api_domains", "/api/domains")
    config.add_route("api_domains_licencia_estado", "/api/domains/licencia_estado")
    config.add_route(
        "api_domains_facturacao_fact_estado", "/api/domains/facturacao_fact_estado"
    )

    config.add_route(
        "api_domains_licencia_estado_renovacao",
        "/api/domains/licencia_estado_renovacao",
    )

    add_routes_api_cartography(config)

    # Other views
    config.add_route("api_requerimento", "/api/requerimento")
    config.add_route("api_requerimento_id", "/api/requerimento/{id}")
    config.add_route("api_requerimento_get_datos_ara", "/api/get_datos_ara")

    config.add_route("api_facturacao", "/api/facturacao")
    config.add_route("api_facturacao_stats", "/api/facturacao/stats")
    config.add_route("api_facturacao_id", "/api/facturacao/{id}")
    config.add_route("api_facturacao_exploracao_id", "/api/facturacao_exploracao/{id}")
    config.add_route(
        "api_facturacao_new_factura", "/api/facturacao/{id}/emitir_factura"
    )
    config.add_route("api_facturacao_new_recibo", "/api/facturacao/{id}/emitir_recibo")

    config.add_route("api_renovacao", "/api/renovacao")
    config.add_route("api_renovacao_id", "/api/renovacao/{id}")
    config.add_route("api_renovacao_historico_id", "/api/renovacao_historico/{id}")

    config.add_route("nuevo_ciclo_facturacion", "/api/nuevo_ciclo_facturacion")

    config.add_route("api_new_exp_id", "/api/new_exp_id")
    config.add_route("api_expedientes", "/api/expedientes")

    config.add_route("api_users", "/api/users")
    config.add_route("api_users_id", "/api/users/{id}")

    config.add_route("api_transform_coordinates", "/api/transform")

    config.add_route("api_weap_demand", "/api/weap/demand")

    # utilities for manual testing
    config.add_route("api_test_fact_substract_month", "/api/test/fact_substract_month")


def add_routes_api_cartography(config):
    config.add_route("api_cartography", "/api/cartography/{layer}")
