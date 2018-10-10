# -*- coding: utf-8 -*-

from pyramid.view import view_config
from utentes.models.base import badrequest_exception
from utentes.models.exploracao import Exploracao
from utentes.models.facturacao import Facturacao
from utentes.api.error_msgs import error_msgs
from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound
from utentes.user_utils import PERM_GET, PERM_FACTURACAO, FACTURAS_DEFAULT_VALUES

import logging
log = logging.getLogger(__name__)


@view_config(route_name='api_facturacao', permission=PERM_GET, request_method='GET', renderer='json')
@view_config(route_name='api_facturacao_id', permission=PERM_GET, request_method='GET', renderer='json')
def facturacao_get(request):
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
        query = request.db.query(Exploracao)
        states = request.GET.getall('states[]')

        if states:
            query = query.filter(Exploracao.estado_lic.in_(states))

        fact_estado = request.GET.getall('fact_estado[]')
        if fact_estado:
            query = query.filter(Exploracao.fact_estado.in_(fact_estado))

        features = query.all()
        return {
            'type': 'FeatureCollection',
            'features': features
        }

@view_config(route_name='api_facturacao_new_factura', permission=PERM_FACTURACAO, request_method='GET', renderer='json')

def num_factura_get(request):

    gid = None
    if request.matchdict:
        gid = request.matchdict['id'] or None

    if gid:
        try:
            facturacao = request.db.query(Facturacao).filter(Facturacao.gid == gid).one()
            exp_id = facturacao.exploracao
            if facturacao.fact_id is not None:
                return facturacao.fact_id

            try:
                exploracao = request.db.query(Exploracao).filter(Exploracao.gid == exp_id).one()
                unidad = exploracao.loc_unidad
                ano = facturacao.ano

                if unidad:
                    sql = "SELECT to_number(substring(fact.fact_id from '^....'), '9999') " + \
                    " FROM utentes.exploracaos exp," + \
                    " utentes.facturacao fact" + \
                    " WHERE exp.gid = fact.exploracao" + \
                    "   AND exp.loc_unidad  = '{}' ".format(unidad) + \
                    "   AND fact.fact_id IS NOT NULL" + \
                    " ORDER BY substring(fact.fact_id from '^....') DESC LIMIT 1;"

                    result = request.db.execute(sql).first() or [0]

                    if result[0]:
                        next_id = '%0*d' % (4, result[0] + 1)
                    else:
                        # Use default values
                        result = FACTURAS_DEFAULT_VALUES.get(unidad)
                        next_id = '%0*d' % (4, result)

                    numFactura = str(next_id) + "-" + \
                                       unidad + "/" + \
                                       ano

                    facturacao.fact_id = numFactura

                    request.db.add(facturacao)
                    request.db.commit()

                    return numFactura

            except(MultipleResultsFound, NoResultFound):
                raise badrequest_exception({
                    'error': error_msgs['no_gid'],
                    'gid': gid
                })

        except(MultipleResultsFound, NoResultFound):
            raise badrequest_exception({
                'error': error_msgs['no_gid'],
                'gid': gid
            })


@view_config(route_name='api_facturacao_id', permission=PERM_FACTURACAO, request_method='PATCH', renderer='json')
@view_config(route_name='api_facturacao_id', permission=PERM_FACTURACAO, request_method='PUT', renderer='json')
def facturacao_update(request):
    id = request.matchdict['id']
    body = request.json_body
    e = request.db.query(Exploracao).filter(Exploracao.gid == id).one()
    e.update_from_json_facturacao(body)
    request.db.add(e)
    request.db.commit()
    return e


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
