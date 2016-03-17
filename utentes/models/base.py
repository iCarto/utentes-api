# -*- coding: utf-8 -*-

import json

from sqlalchemy.ext.declarative import declarative_base

PGSQL_SCHEMA_UTENTES = 'utentes'
PGSQL_SCHEMA_DOMAINS = 'domains'

class BaseClass(object):
    # python uses this method to compare objects
    # for example, in exploracao.update_array
    def __eq__(self, other):
        if (self.gid is None) or (other.gid is None):
            # shall we in this case compare all attributes?
            return False
        return self.gid == other.gid

DeclarativeBase = declarative_base()
Base = declarative_base(cls=BaseClass)



def unauthorized_exception(body=None):
    body = body or {'error': 'No autorizado'}
    from pyramid.httpexceptions import HTTPUnauthorized
    return build_exception(HTTPUnauthorized, body)


def badrequest_exception(body=None):
    body = body or {'error': 'Peticion incorrecta'}
    from pyramid.httpexceptions import HTTPBadRequest
    return build_exception(HTTPBadRequest, body)


def notfound_exception(body=None):
    body = body or {'error': 'No encontrado'}
    from pyramid.httpexceptions import HTTPNotFound
    return build_exception(HTTPNotFound, body)


def methodnotallowed_exception(body=None):
    body = body or {'error': 'No permitido'}
    from pyramid.httpexceptions import HTTPMethodNotAllowed
    return build_exception(HTTPMethodNotAllowed, body)


def build_exception(httpexc, body):
    response = httpexc()
    response.body = json.dumps(body)
    response.content_type = 'application/json'
    return response


class APIAction(object):

    OK = 'ok'
    FAILED = 'failed'

    def __init__(self, operation="", status="", exp_type="", exp_id="",
                 user_name=""):
        self.operation = operation
        self.status    = status
        self.exp_type  = exp_type
        self.exp_id    = exp_id
        self.user_name = user_name

    def __json__(self, request):
        return {
            'status':    self.status,
            'operation': self.operation,
            'type':      self.exp_type,
            'id':        self.exp_id,
            'name':      self.user_name
        }

def update_array(olds, news_json, factory):
    news = []
    update_dict = {}
    for n in news_json:
        new = factory(n)
        # new.exploracao = self.gid
        news.append(new)
        if n.get('id'):
           update_dict[n.get('id')] = n

    # this needs objects to declare when they are equals
    # by declaring the method __eq__
    to_remove = [el for el in olds if el not in news]
    to_update = [el for el in olds if el in news]
    to_append = [el for el in news if el not in olds]

    for old in to_remove:
        olds.remove(old)

    for old in to_update:
        new = update_dict[old.gid]
        if new:
            old.update_from_json(new)

    for new in to_append:
        olds.append(new)

def update_geom(updatable, json, geom_key='geometry'):
    g = json.get(geom_key)
    if not g:
        return
    from geoalchemy2.elements import WKTElement
    from utentes.lib.geomet import wkt
    the_geom = WKTElement(wkt.dumps(g), srid=4326)
    the_geom = the_geom.ST_Multi().ST_Transform(32737)
    updatable = the_geom
