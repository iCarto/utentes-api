import logging

from pyramid.view import view_config
from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound

import utentes.constants.perms as perm
from .error_msgs import error_msgs
from utentes.lib.schema_validator.validator import Validator
from utentes.models.actividade import Actividade
from utentes.models.actividades_schema import ActividadeSchema
from utentes.models.base import badrequest_exception
from utentes.models.cultivo import ActividadesCultivos
from utentes.models.exploracao import Exploracao


log = logging.getLogger(__name__)


@view_config(
    route_name="api_cultivos",
    permission=perm.PERM_GET,
    request_method="GET",
    renderer="json",
)
@view_config(
    route_name="api_cultivos_id",
    permission=perm.PERM_GET,
    request_method="GET",
    renderer="json",
)
def cultivos_get(request):
    gid = None
    if request.matchdict:
        gid = request.matchdict["id"] or None

    if gid:  # return individual cultivo
        try:
            return (
                request.db.query(ActividadesCultivos)
                .filter(ActividadesCultivos.gid == gid)
                .one()
            )
        except (MultipleResultsFound, NoResultFound):
            raise badrequest_exception({"error": error_msgs["no_gid"], "gid": gid})
    else:  # return collection
        return {
            "type": "FeatureCollection",
            "features": request.db.query(ActividadesCultivos).all(),
        }


@view_config(
    route_name="api_cultivos_id",
    permission=perm.PERM_UPDATE_CULTIVO_TANQUE,
    request_method="PUT",
    renderer="json",
)
def cultivos_update(request):
    gid = request.matchdict["id"]
    if not gid:
        raise badrequest_exception({"error": error_msgs["gid_obligatory"]})

    msgs = validate_entities(request.json_body)
    if len(msgs) > 0:
        raise badrequest_exception({"error": msgs})

    try:
        cultivo = (
            request.db.query(ActividadesCultivos)
            .filter(ActividadesCultivos.gid == gid)
            .one()
        )
        cultivo.update_from_json(request.json_body)
        request.db.add(cultivo)
        request.db.commit()
        actv = (
            request.db.query(Actividade)
            .filter(Actividade.gid == cultivo.actividade)
            .one()
        )
        c_estimado_actv = 0
        area_medi_actv = 0
        for cultivo in actv.cultivos:
            c_estimado_actv += cultivo.c_estimado
            area_medi_actv += cultivo.area or 0
        actv.c_estimado = c_estimado_actv
        actv.area_medi = area_medi_actv
        request.db.add(actv)
        exp = (
            request.db.query(Exploracao).filter(Exploracao.gid == actv.exploracao).one()
        )
        exp.c_estimado = c_estimado_actv
        request.db.add(exp)
        request.db.commit()
    except (MultipleResultsFound, NoResultFound):
        raise badrequest_exception({"error": error_msgs["no_cultivo_gid"], "gid": gid})
    except ValueError as ve:
        log.error(ve)
        raise badrequest_exception({"error": error_msgs["body_not_valid"]})

    return cultivo


def validate_entities(body):
    return Validator(ActividadeSchema["Cultivos"]).validate(body)
