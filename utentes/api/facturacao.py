import datetime
import logging

from pyramid.view import view_config
from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound

import utentes.constants.perms as perm
from utentes.api.error_msgs import error_msgs
from utentes.models.base import badrequest_exception
from utentes.models.exploracao import ExploracaoConFacturacao
from utentes.models.facturacao import Facturacao


log = logging.getLogger(__name__)


@view_config(
    route_name="api_facturacao",
    permission=perm.PERM_GET,
    request_method="GET",
    renderer="json",
)
@view_config(
    route_name="api_facturacao_exploracao_id",
    permission=perm.PERM_GET,
    request_method="GET",
    renderer="json",
)
def facturacao_get(request):
    gid = None
    if request.matchdict:
        gid = request.matchdict["id"] or None

    if gid:  # return individual explotacao
        try:
            return request.db.query(ExploracaoConFacturacao).filter(ExploracaoConFacturacao.gid == gid).one()
        except (MultipleResultsFound, NoResultFound):
            raise badrequest_exception({"error": error_msgs["no_gid"], "gid": gid})

    else:  # return collection
        query = request.db.query(ExploracaoConFacturacao)
        states = request.GET.getall("states[]")

        if states:
            query = query.filter(ExploracaoConFacturacao.estado_lic.in_(states))

        fact_estado = request.GET.getall("fact_estado[]")
        if fact_estado:
            query = query.filter(ExploracaoConFacturacao.fact_estado.in_(fact_estado))

        features = query.all()
        return {"type": "FeatureCollection", "features": features}


@view_config(
    route_name="api_facturacao_new_factura",
    permission=perm.PERM_UPDATE_CREATE_FACTURACAO,
    request_method="GET",
    renderer="json",
)
def num_factura_get(request):

    gid = None
    if request.matchdict:
        gid = request.matchdict["id"] or None

    if not gid:
        raise badrequest_exception({"error": error_msgs["no_gid"], "gid": gid})

    try:
        facturacao = request.db.query(Facturacao).filter(Facturacao.gid == gid).one()
    except (MultipleResultsFound, NoResultFound):
        raise badrequest_exception({"error": error_msgs["no_gid"], "gid": gid})

    exp_id = facturacao.exploracao
    if facturacao.fact_id is not None:
        return facturacao.fact_id

    try:
        exploracao = request.db.query(ExploracaoConFacturacao).filter(ExploracaoConFacturacao.gid == exp_id).one()
    except (MultipleResultsFound, NoResultFound):
        raise badrequest_exception({"error": error_msgs["no_gid"], "gid": gid})

    if not exploracao.loc_unidad:
        raise badrequest_exception(
            {"error": "A unidade é un campo obligatorio", "exp_id": exp_id}
        )

    params = {"unidad": exploracao.loc_unidad, "ano": facturacao.ano}

    sql = """
        SELECT substring(fact_id, 0, 5)::int + 1
        FROM utentes.facturacao
        WHERE fact_id ~ '.*-{unidad}/{ano}'
        ORDER BY fact_id DESC
        LIMIT 1;
        """.format(
        **params
    )

    params["next_serial"] = (request.db.execute(sql).first() or [1])[0]

    num_factura = "{next_serial:04d}-{unidad}/{ano}".format(**params)

    facturacao.fact_id = num_factura
    facturacao.fact_date = datetime.datetime.now()

    request.db.add(facturacao)
    request.db.commit()

    return num_factura


@view_config(
    route_name="api_facturacao_new_recibo",
    permission=perm.PERM_FACTURACAO,
    request_method="GET",
    renderer="json",
)
def num_recibo_get(request):

    gid = None
    if request.matchdict:
        gid = request.matchdict["id"] or None

    if not gid:
        raise badrequest_exception({"error": error_msgs["no_gid"], "gid": gid})

    try:
        facturacao = request.db.query(Facturacao).filter(Facturacao.gid == gid).one()
    except (MultipleResultsFound, NoResultFound):
        raise badrequest_exception({"error": error_msgs["no_gid"], "gid": gid})

    exp_id = facturacao.exploracao
    if facturacao.recibo_id is not None:
        return facturacao.recibo_id

    try:
        exploracao = request.db.query(ExploracaoConFacturacao).filter(ExploracaoConFacturacao.gid == exp_id).one()
    except (MultipleResultsFound, NoResultFound):
        raise badrequest_exception({"error": error_msgs["no_gid"], "gid": gid})

    if not exploracao.loc_unidad:
        raise badrequest_exception(
            {"error": "A unidade é un campo obligatorio", "exp_id": exp_id}
        )

    params = {"unidad": exploracao.loc_unidad, "ano": facturacao.ano}

    sql = """
        SELECT substring(recibo_id, 0, 5)::int + 1
        FROM utentes.facturacao
        WHERE recibo_id ~ '.*-{unidad}/{ano}'
        ORDER BY recibo_id DESC
        LIMIT 1;
        """.format(
        **params
    )

    params["next_serial"] = (request.db.execute(sql).first() or [1])[0]

    num_recibo = "{next_serial:04d}-{unidad}/{ano}".format(**params)

    facturacao.recibo_id = num_recibo
    facturacao.recibo_date = datetime.datetime.now()

    request.db.add(facturacao)
    request.db.commit()

    return num_recibo


@view_config(
    route_name="api_facturacao_exploracao_id",
    permission=perm.PERM_UPDATE_CREATE_FACTURACAO,
    request_method="PATCH",
    renderer="json",
)
@view_config(
    route_name="api_facturacao_exploracao_id",
    permission=perm.PERM_UPDATE_CREATE_FACTURACAO,
    request_method="PUT",
    renderer="json",
)
def facturacao_exploracao_update(request):
    gid = request.matchdict["id"]
    body = request.json_body
    e = request.db.query(ExploracaoConFacturacao).filter(ExploracaoConFacturacao.gid == gid).one()
    e.update_from_json_facturacao(body)
    request.db.add(e)
    request.db.commit()
    return e
