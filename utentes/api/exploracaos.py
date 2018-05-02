# -*- coding: utf-8 -*-

from pyramid.view import view_config

from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound

from utentes.lib.schema_validator.validator import Validator
from utentes.lib.schema_validator.validation_exception import ValidationException
from utentes.models.base import badrequest_exception
from utentes.models.utente import Utente
from utentes.models.utente_schema import UTENTE_SCHEMA
from utentes.models.exploracao import Exploracao
from utentes.models.licencia import Licencia
from utentes.models.exploracao_schema import EXPLORACAO_SCHEMA, EXPLORACAO_SCHEMA_CON_FICHA
from utentes.models.licencia_schema import LICENCIA_SCHEMA
from utentes.models.fonte_schema import FONTE_SCHEMA
from utentes.api.error_msgs import error_msgs

import logging
log = logging.getLogger(__name__)


@view_config(route_name='api_exploracaos', request_method='GET', renderer='json')
@view_config(route_name='api_exploracaos_id', request_method='GET', renderer='json')
def exploracaos_get(request):
    gid = None
    if request.matchdict:
        gid = request.matchdict['id'] or None

    if gid:  # return individual explotacao
        try:
            return request.db.query(Exploracao).filter(Exploracao.gid == gid).one()
        except(MultipleResultsFound, NoResultFound):
            raise badrequest_exception({
                'error': error_msgs['no_gid'],
                'gid': gid
            })

    else:  # return collection
        states = request.GET.getall('states[]')
        if states:
            features = request.db.query(Exploracao).filter(Exploracao.estado_lic.in_(states)).order_by(Exploracao.exp_id).all()
        else:
            features = request.db.query(Exploracao).order_by(Exploracao.exp_id).all()

        return {
            'type': 'FeatureCollection',
            'features': features
        }


@view_config(route_name='api_exploracaos_id', request_method='DELETE', renderer='json')
def exploracaos_delete(request):
    gid = request.matchdict['id']
    if not gid:
        raise badrequest_exception({'error': error_msgs['gid_obligatory']})
    try:
        e = request.db.query(Exploracao).filter(Exploracao.gid == gid).one()
        request.db.delete(e)
        request.db.commit()
    except(MultipleResultsFound, NoResultFound):
        raise badrequest_exception({
            'error': error_msgs['no_gid'],
            'gid': gid
        })
    return {'gid': gid}


def upsert_utente(request, body):
    u_filter = Utente.nome == body.get('utente').get('nome')
    u = request.db.query(Utente).filter(u_filter).first()
    if not u:
        validatorUtente = Validator(UTENTE_SCHEMA)
        msgs = validatorUtente.validate(body['utente'])
        if len(msgs) > 0:
            raise badrequest_exception({'error': msgs})
        u = Utente.create_from_json(body['utente'])
    # else:
    #     u.update_from_json(body['utente'])
        request.db.add(u)
    return u


@view_config(route_name='api_exploracaos_id', request_method='PUT', renderer='json')
def exploracaos_update(request):
    gid = request.matchdict['id']
    if not gid:
        raise badrequest_exception({
            'error': error_msgs['gid_obligatory']
        })

    try:
        body = request.json_body
        msgs = validate_entities(request, body)
        if len(msgs) > 0:
            raise badrequest_exception({'error': msgs})

        e = request.db.query(Exploracao).filter(Exploracao.gid == gid).one()

        u = upsert_utente(request, body)
        # u_id = body.get('utente').get('id')
        # if not u_id:
        #     u = Utente.create_from_json(body['utente'])
        #     # TODO:660 validate utente
        #     request.db.add(u)
        # elif e.utente_rel.gid != u_id:
        #     u_filter = Utente.gid == u_id
        #     u = request.db.query(Utente).filter(u_filter).one()
        # else:
        #     u = e.utente_rel

        # validatorUtente = Validator(UTENTE_SCHEMA)
        # msgs = validatorUtente.validate(request.json_body['utente'])
        # if len(msgs) > 0:
        #     raise badrequest_exception({'error': msgs})
        e.utente_rel = u
        # u.update_from_json(request.json_body['utente'])
        # request.db.add(u)

        if _tipo_actividade_changes(e, request.json_body):
            request.db.delete(e.actividade)
            del e.actividade

        lic_nro_sequence = Exploracao.LIC_NRO_SEQUENCE_FIRST
        for lic in e.licencias:
            lic_nro_sequence = calculate_lic_nro(lic.lic_nro, lic_nro_sequence)
        e.update_from_json(request.json_body, lic_nro_sequence)

        state_to_set_after_validation = body.get('state_to_set_after_validation')
        if state_to_set_after_validation:
            e.estado_lic = state_to_set_after_validation
            for lic in e.licencias:
                lic.estado = state_to_set_after_validation

        request.db.add(e)
        request.db.commit()
    except(MultipleResultsFound, NoResultFound):
        raise badrequest_exception({'error': error_msgs['no_gid'], 'gid': gid})
    except ValueError as ve:
        log.error(ve)
        raise badrequest_exception({'error': error_msgs['body_not_valid']})
    except ValidationException as val_exp:
        if u:
            request.db.refresh(u)
        if e:
            request.db.refresh(e)
        raise badrequest_exception(val_exp.msgs)

    return e


def calculate_lic_nro(lic_nro, next_sequence):
    # TODO
    return 0
    # format is XXXX-YYY-ZZZ, being the ZZZ the value we are interested in
    # nro = int(lic_nro.split('-')[2])
    # if next_sequence > nro:
    #     pass
    # elif next_sequence == nro:
    #     next_sequence = next_sequence + 1
    # else:
    #     next_sequence = nro + 1
    # return next_sequence


def _tipo_actividade_changes(e, json):
    return e.actividade and json.get('actividade') and (e.actividade.tipo != json.get('actividade').get('tipo'))


@view_config(route_name='api_exploracaos', request_method='POST', renderer='json')
def exploracaos_create(request):
    try:
        body = request.json_body
        exp_id = body.get('exp_id')
    except ValueError as ve:
        log.error(ve)
        raise badrequest_exception({'error': error_msgs['body_not_valid']})

    msgs = validate_entities(request, body)
    if len(msgs) > 0:
        raise badrequest_exception({'error': msgs})

    e = request.db.query(Exploracao).filter(Exploracao.exp_id == exp_id).first()
    if e:
        raise badrequest_exception({'error': error_msgs['exploracao_already_exists']})

    u_filter = Utente.nome == body.get('utente').get('nome')
    u = request.db.query(Utente).filter(u_filter).first()
    if not u:
        validatorUtente = Validator(UTENTE_SCHEMA)
        msgs = validatorUtente.validate(body['utente'])
        if len(msgs) > 0:
            raise badrequest_exception({'error': msgs})
        u = Utente.create_from_json(body['utente'])
        request.db.add(u)
    try:
        e = Exploracao.create_from_json(body)
    except ValidationException as val_exp:
        if u:
            request.db.refresh(u)
        if e:
            request.db.refresh(e)
        raise badrequest_exception(val_exp.msgs)
    e.utente_rel = u
    e.ara = request.registry.settings.get('ara')
    state_to_set_after_validation = body.get('state_to_set_after_validation')
    if state_to_set_after_validation:
        e.estado_lic = state_to_set_after_validation
        for lic in e.licencias:
            lic.estado = state_to_set_after_validation
    request.db.add(e)
    request.db.commit()
    return e


def activity_fail(v):
    return (v is None) or \
           (v == '') or \
           (len(v) == 0) or \
           (v.get('tipo') is None) or \
           (v.get('tipo') == 'Actividade non declarada')


def validate_entities(request, body):
    import re
    validatorExploracao = Validator(EXPLORACAO_SCHEMA)
    if request.registry.settings.get('ara') == 'Sul':
        validatorExploracao.add_rule('EXP_ID_FORMAT', {'fails': lambda v: v and (not re.match('^\d{3}\/ARAS\/\d{4}$', v))})
    else:
        validatorExploracao.add_rule('EXP_ID_FORMAT', {'fails': lambda v: v and (not re.match('^\d{4}-\d{3}$', v))})

    if Licencia.implies_validate_ficha(body.get('estado_lic')):
        validatorExploracao.appendSchema(EXPLORACAO_SCHEMA_CON_FICHA)
        validatorExploracao.add_rule('ACTIVITY_NOT_NULL', {'fails': activity_fail})

    msgs = validatorExploracao.validate(body)

    validatorFonte = Validator(FONTE_SCHEMA)
    for fonte in body.get('fontes'):
        msgs = msgs + validatorFonte.validate(fonte)

    if Licencia.implies_validate_ficha(body.get('estado_lic')):
        validatorLicencia = Validator(LICENCIA_SCHEMA)
        if request.registry.settings.get('ara') == 'Sul':
            validatorLicencia.add_rule('LIC_NRO_FORMAT', {'fails': lambda v: v and (not re.match('^\d{3}\/ARAS\/\d{4}\/(Sup|Sub)$', v))})
        else:
            validatorLicencia.add_rule('LIC_NRO_FORMAT', {'fails': lambda v: v and (not re.match('^\d{4}-\d{3}-\d{3}$', v))})

        for lic in body.get('licencias'):
            if Licencia.implies_validate_activity(lic.get('estado')):
                msgs = msgs + validatorLicencia.validate(lic)

    return msgs
