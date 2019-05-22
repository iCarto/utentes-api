# -*- coding: utf-8 -*-

import logging
import datetime

from pyramid.view import view_config

from sqlalchemy import func, or_
from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound
from utentes.api.error_msgs import error_msgs
from utentes.models.base import badrequest_exception
from utentes.models.exploracao import Exploracao
from utentes.models.facturacao import Facturacao
from utentes.models.utente import Utente
from utentes.models.facturacao_fact_estado import PAID, PENDING_CONSUMPTION, PENDING_INVOICE

from utentes.user_utils import PERM_UPDATE_CREATE_FACTURACAO, PERM_FACTURACAO, PERM_GET

import json

log = logging.getLogger(__name__)


@view_config(
    route_name='api_facturacao',
    permission=PERM_GET,
    request_method='GET',
    renderer='json')
@view_config(
    route_name='api_facturacao_exploracao_id',
    permission=PERM_GET,
    request_method='GET',
    renderer='json')
def facturacao_get(request):
    gid = None
    if request.matchdict:
        gid = request.matchdict['id'] or None

    if gid:  # return individual explotacao
        try:
            return request.db.query(Exploracao).filter(
                Exploracao.gid == gid).one()
        except (MultipleResultsFound, NoResultFound):
            raise badrequest_exception({
                'error': error_msgs['no_gid'],
                'gid': gid
            })

    else:  # return collection
        query = request.db.query(Exploracao)
        states = request.GET.getall('states[]')

        if states:
            query = query.filter(Exploracao.estado_lic.in_(states))

        fact_estado = request.GET.getall('fact_estado[]')
        if fact_estado:
            query = query.filter(Exploracao.fact_estado.in_(fact_estado))

        features = query.all()
        return {'type': 'FeatureCollection', 'features': features}


@view_config(
    route_name='api_facturacao_new_factura',
    permission=PERM_UPDATE_CREATE_FACTURACAO,
    request_method='GET',
    renderer='json')
def num_factura_get(request):

    gid = None
    if request.matchdict:
        gid = request.matchdict['id'] or None

    if not gid:
        raise badrequest_exception({'error': error_msgs['no_gid'], 'gid': gid})

    try:
        facturacao = request.db.query(Facturacao).filter(
            Facturacao.gid == gid).one()
    except (MultipleResultsFound, NoResultFound):
        raise badrequest_exception({'error': error_msgs['no_gid'], 'gid': gid})

    exp_id = facturacao.exploracao
    if facturacao.fact_id is not None:
        return facturacao.fact_id

    try:
        exploracao = request.db.query(Exploracao).filter(
            Exploracao.gid == exp_id).one()
    except (MultipleResultsFound, NoResultFound):
        raise badrequest_exception({'error': error_msgs['no_gid'], 'gid': gid})

    if not exploracao.loc_unidad:
        raise badrequest_exception({
            'error':
            'A unidade é un campo obligatorio',
            'exp_id':
            exp_id
        })

    params = {
        'unidad': exploracao.loc_unidad,
        'ano': facturacao.ano,
    }

    sql = '''
        SELECT substring(fact_id, 0, 5)::int + 1
        FROM utentes.facturacao
        WHERE fact_id ~ '.*-{unidad}/{ano}'
        ORDER BY fact_id DESC
        LIMIT 1;
        '''.format(**params)

    # TODO. Para 2018. Debemos dejar reservados números de facturas
    # Estos defaults serán eliminados a futuro
    FACTURAS_DEFAULT_VALUES = {
        'UGBI/2018': [2500],
        'UGBL/2018': [1800],
        'UGBU/2018': [9000],
        'UGBS/2018': [1500]
    }

    params['next_serial'] = (request.db.execute(sql).first() or [
        FACTURAS_DEFAULT_VALUES.get('{unidad}/{ano}'.format(**params), 1)
    ])[0]

    num_factura = '{next_serial:04d}-{unidad}/{ano}'.format(**params)

    facturacao.fact_id = num_factura
    facturacao.fact_date = datetime.datetime.now()

    request.db.add(facturacao)
    request.db.commit()

    return num_factura


@view_config(
    route_name='api_facturacao_new_recibo',
    permission=PERM_FACTURACAO,
    request_method='GET',
    renderer='json')
def num_recibo_get(request):

    gid = None
    if request.matchdict:
        gid = request.matchdict['id'] or None

    if not gid:
        raise badrequest_exception({'error': error_msgs['no_gid'], 'gid': gid})

    try:
        facturacao = request.db.query(Facturacao).filter(
            Facturacao.gid == gid).one()
    except (MultipleResultsFound, NoResultFound):
        raise badrequest_exception({'error': error_msgs['no_gid'], 'gid': gid})

    exp_id = facturacao.exploracao
    if facturacao.recibo_id is not None:
        return facturacao.recibo_id

    try:
        exploracao = request.db.query(Exploracao).filter(
            Exploracao.gid == exp_id).one()
    except (MultipleResultsFound, NoResultFound):
        raise badrequest_exception({'error': error_msgs['no_gid'], 'gid': gid})

    if not exploracao.loc_unidad:
        raise badrequest_exception({
            'error':
            'A unidade é un campo obligatorio',
            'exp_id':
            exp_id
        })

    params = {
        'unidad': exploracao.loc_unidad,
        'ano': facturacao.ano,
    }

    sql = '''
        SELECT substring(recibo_id, 0, 5)::int + 1
        FROM utentes.facturacao
        WHERE recibo_id ~ '.*-{unidad}/{ano}'
        ORDER BY recibo_id DESC
        LIMIT 1;
        '''.format(**params)

    params['next_serial'] = (request.db.execute(sql).first() or [1])[0]

    num_recibo = '{next_serial:04d}-{unidad}/{ano}'.format(**params)

    facturacao.recibo_id = num_recibo
    facturacao.recibo_date = datetime.datetime.now()

    request.db.add(facturacao)
    request.db.commit()

    return num_recibo



@view_config(
    route_name='api_facturacao_exploracao_id',
    permission=PERM_UPDATE_CREATE_FACTURACAO,
    request_method='PATCH',
    renderer='json')
@view_config(
    route_name='api_facturacao_exploracao_id',
    permission=PERM_UPDATE_CREATE_FACTURACAO,
    request_method='PUT',
    renderer='json')
def facturacao_exploracao_update(request):
    id = request.matchdict['id']
    body = request.json_body
    e = request.db.query(Exploracao).filter(Exploracao.gid == id).one()
    e.update_from_json_facturacao(body)
    request.db.add(e)
    request.db.commit()
    return e


@view_config(
    route_name='api_facturacao_stats',
    permission=PERM_GET,
    request_method='GET',
    renderer='json')
def facturacao_stats(request):
    fields = [
        Facturacao.exploracao.label('exploracao_gid'), 
        func.count(Facturacao.exploracao).label('numero_facturas'),
        func.sum(Facturacao.consumo).label('consumo'),
        func.sum(Facturacao.pago_iva).label('importe')
    ]

    mes_inicio = request.params.get('mes_inicio', None)
    ano_inicio = request.params.get('ano_inicio', None)
    mes_fim = request.params.get('mes_fim', None)
    ano_fim = request.params.get('ano_fim', None)
    tipo_agua = request.params.get('tipo_agua')
    utentes = request.params.getall('utente')

    subquery_esperadas = (request.db.query(*fields).group_by(Facturacao.exploracao))

    subquery_emitidas = (request.db.query(*fields).filter(Facturacao.fact_estado != PENDING_CONSUMPTION, Facturacao.fact_estado != PENDING_INVOICE).group_by(Facturacao.exploracao))

    subquery_cobradas = (request.db.query(*fields).filter(Facturacao.fact_estado == PAID).group_by(Facturacao.exploracao))

    if mes_inicio is not None and ano_inicio is not None:
        subquery_esperadas = subquery_esperadas.filter(Facturacao.mes >= mes_inicio, Facturacao.ano >= ano_inicio)
        subquery_emitidas = subquery_emitidas.filter(Facturacao.mes >= mes_inicio, Facturacao.ano >= ano_inicio)
        subquery_cobradas = subquery_cobradas.filter(Facturacao.mes >= mes_inicio, Facturacao.ano >= ano_inicio)
    if mes_fim is not None and ano_fim is not None:
        subquery_esperadas = subquery_esperadas.filter(Facturacao.mes <= mes_fim, Facturacao.ano <= ano_fim)
        subquery_emitidas = subquery_emitidas.filter(Facturacao.mes <= mes_fim, Facturacao.ano <= ano_fim)
        subquery_cobradas = subquery_cobradas.filter(Facturacao.mes <= mes_fim, Facturacao.ano <= ano_fim)

    if tipo_agua is not None:
        if tipo_agua == u'Superficial':
            subquery_esperadas = subquery_esperadas.filter(Facturacao.c_licencia_sup != None)
        if tipo_agua == u'Subterrânea':
            subquery_esperadas = subquery_esperadas.filter(Facturacao.c_licencia_sub != None)

    subquery_esperadas = subquery_esperadas.subquery()
    subquery_emitidas = subquery_emitidas.subquery()
    subquery_cobradas = subquery_cobradas.subquery()

    query = request.db.query(
        Exploracao.gid,
        Exploracao.exp_id, 
        Utente.gid.label('utente_id'),
        Utente.nome.label('utente'),
        func.coalesce(subquery_esperadas.c.numero_facturas.label('numero_facturas_esperadas'), 0),
        func.coalesce(subquery_esperadas.c.consumo.label('consumo_facturas_esperadas'), 0),
        func.coalesce(subquery_esperadas.c.importe.label('importe_facturas_esperadas'), 0),
        func.coalesce(subquery_emitidas.c.numero_facturas.label('numero_facturas_emitidas'), 0),
        func.coalesce(subquery_emitidas.c.consumo.label('consumo_facturas_emitidas'), 0),
        func.coalesce(subquery_emitidas.c.importe.label('importe_facturas_emitidas'), 0),
        func.coalesce(subquery_cobradas.c.numero_facturas.label('numero_facturas_cobradas'), 0),
        func.coalesce(subquery_cobradas.c.consumo.label('consumo_facturas_cobradas'), 0),
        func.coalesce(subquery_cobradas.c.importe.label('importe_facturas_cobradas'), 0),
    ).join(Utente, Exploracao.utente == Utente.gid).join(subquery_esperadas, subquery_esperadas.c.exploracao_gid == Exploracao.gid).outerjoin(subquery_emitidas, subquery_emitidas.c.exploracao_gid == Exploracao.gid).outerjoin(subquery_cobradas, subquery_cobradas.c.exploracao_gid == Exploracao.gid).order_by(Exploracao.gid)

    if utentes:
        query = query.filter(or_(*[Utente.gid == int(utente_id) for utente_id in utentes]))

    row_headers = ['gid', 'exp_id', 'utente_id', 'utente', 'numero_facturas_esperadas', 'consumo_facturas_esperadas', 'importe_facturas_esperadas', 'numero_facturas_emitidas', 'consumo_facturas_emitidas', 'importe_facturas_emitidas', 'numero_facturas_cobradas', 'consumo_facturas_cobradas', 'importe_facturas_cobradas']
    json_data=[]
    for result in query.all():
        json_data.append(dict(zip(row_headers,result)))
    return json_data


# @view_config(route_name='api_facturacao', request_method='POST', renderer='json')
# # admin || administrativo
# def facturacao_create(request):
#     try:
#         body = request.json_body
#     except ValueError as ve:
#         log.error(ve)
#         raise badrequest_exception({'error': error_msgs['body_not_valid']})
#
#     e = Exploracao()
#     e.update_from_json_facturacao(body)
#     ara = request.registry.settings.get('ara')
#     # e.exp_id = calculate_new_exp_id(request, ara)
#     e.ara = ara
#
#     request.db.add(e)
#     request.db.commit()
#     return e
