# -*- coding: utf-8 -*-

import logging

from pyramid.view import view_config
from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound

import utentes.constants.perms as perm
from utentes.api.error_msgs import error_msgs
from utentes.models.ara import Ara
from utentes.models.base import badrequest_exception
from utentes.models.exploracao import Exploracao
from utentes.services.id_service import calculate_new_exp_id


log = logging.getLogger(__name__)


@view_config(
    route_name="api_requerimento",
    permission=perm.PERM_GET,
    request_method="GET",
    renderer="json",
)
@view_config(
    route_name="api_requerimento_id",
    permission=perm.PERM_GET,
    request_method="GET",
    renderer="json",
)
def requerimento_get(request):
    gid = None
    if request.matchdict:
        gid = request.matchdict["id"] or None

    if gid:  # return individual explotacao
        try:
            return request.db.query(Exploracao).filter(Exploracao.gid == gid).one()
        except (MultipleResultsFound, NoResultFound):
            raise badrequest_exception({"error": error_msgs["no_gid"], "gid": gid})

    else:  # return collection
        states = request.GET.getall("states[]")
        if states:
            features = (
                request.db.query(Exploracao)
                .filter(Exploracao.estado_lic.in_(states))
                .all()
            )
        else:
            features = request.db.query(Exploracao).all()

        return {"type": "FeatureCollection", "features": features}


@view_config(
    route_name="api_requerimento_id",
    permission=perm.PERM_UPDATE_REQUERIMENTO,
    request_method="PATCH",
    renderer="json",
)
@view_config(
    route_name="api_requerimento_id",
    permission=perm.PERM_UPDATE_REQUERIMENTO,
    request_method="PUT",
    renderer="json",
)
def requerimento_update(request):
    gid = request.matchdict["id"]
    body = request.json_body
    e = request.db.query(Exploracao).filter(Exploracao.gid == gid).one()
    e.update_from_json_requerimento(request, body)
    request.db.add(e)
    request.db.commit()
    return e


@view_config(
    route_name="api_requerimento",
    permission=perm.PERM_CREATE_REQUERIMENTO,
    request_method="POST",
    renderer="json",
)
# admin || administrativo
def requerimento_create(request):
    try:
        body = request.json_body
    except ValueError as ve:
        log.error(ve)
        raise badrequest_exception({"error": error_msgs["body_not_valid"]})

    e = Exploracao()
    e.update_from_json_requerimento(request, body)
    request.db.add(e)
    request.db.commit()
    return e


@view_config(
    route_name="api_requerimento_get_datos_ara",
    permission=perm.PERM_GET,
    request_method="GET",
    renderer="json",
)
def get_datos_ara(request):
    ara = request.registry.settings.get("ara")
    result = request.db.query(Ara).filter(Ara.id == ara).one()
    return result
