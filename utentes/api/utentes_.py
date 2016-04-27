# -*- coding: utf-8 -*-

from pyramid.view import view_config
from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound

from utentes.lib.schema_validator.validator import Validator
from utentes.models.base import badrequest_exception
from utentes.models.utente_schema import UTENTE_SCHEMA
from utentes.models.utente import Utente


@view_config(route_name='utentes', request_method='GET', renderer='json')
@view_config(route_name='utentes_id', request_method='GET', renderer='json')
def utentes_get(request):
    gid = None
    if request.matchdict:
        gid = request.matchdict['id'] or None

    if gid:  # return individual utente
        try:
            return request.db.query(Utente).filter(Utente.gid == gid).one()
        except(MultipleResultsFound, NoResultFound):
            raise badrequest_exception({
                'error': error_msgs['no_gid'],
                'gid': gid
                })
    else:
        return request.db.query(Utente).order_by(Utente.nome).all()


@view_config(route_name='utentes_id', request_method='DELETE', renderer='json')
def utentes_delete(request):
    gid = request.matchdict['id']
    if not gid:
        raise badrequest_exception({
            'error': error_msgs['gid_obligatory']
        })
    try:
        e = request.db.query(Utente).filter(Utente.gid == gid).one()
        request.db.delete(e)
        request.db.commit()
    except(MultipleResultsFound, NoResultFound):
        raise badrequest_exception({
            'error': error_msgs['no_gid'],
            'gid': gid
        })
    return {'gid': gid}


@view_config(route_name='utentes_id', request_method='PUT', renderer='json')
def utentes_update(request):
    gid = request.matchdict['id']
    if not gid:
        raise badrequest_exception({'error': error_msgs['gid_obligatory']})

    msgs = validate_entities(request.json_body)
    if len(msgs) > 0:
        raise badrequest_exception({'error': msgs})

    try:
        e = request.db.query(Utente).filter(Utente.gid == gid).one()
        e.update_from_json(request.json_body)
        request.db.add(e)
        request.db.commit()
    except(MultipleResultsFound, NoResultFound):
        raise badrequest_exception({
            'error': error_msgs['no_gid'],
            'gid': gid
        })
    except ValueError as ve:
        log.error(ve)
        raise badrequest_exception({'error': error_msgs['body_not_valid']})

    return e


@view_config(route_name='utentes', request_method='POST', renderer='json')
def utentes_create(request):
    try:
        body = request.json_body
        nome = body.get('nome')
    except ValueError as ve:
        log.error(ve)
        raise badrequest_exception({'error': error_msgs['body_not_valid']})

    msgs = validate_entities(body)
    if len(msgs) > 0:
        raise badrequest_exception({'error': msgs})

    # TODO:320 is this not covered by schema validations?
    if not nome:
        raise badrequest_exception({'error': 'nome es um campo obligatorio'})

    e = request.db.query(Utente).filter(Utente.nome == nome).first()
    if e:
        raise badrequest_exception({'error': error_msgs['utente_already_exists']})

    u = Utente.create_from_json(body)
    request.db.add(u)
    request.db.commit()
    return u


def validate_entities(body):
    return Validator(UTENTE_SCHEMA).validate(body)
