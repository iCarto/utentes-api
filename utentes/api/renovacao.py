# -*- coding: utf-8 -*-

import datetime
import logging

from dateutil.relativedelta import relativedelta
from pyramid.view import view_config
from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound

import utentes.constants.perms as perm
import utentes.models.constants as c
from utentes.api.error_msgs import error_msgs
from utentes.models.base import badrequest_exception
from utentes.models.estado_renovacao import (
    DE_FACTO,
    LICENSED,
    NOT_APPROVED,
    NOT_VALID,
    PENDING_RENOV_LICENSE,
)
from utentes.models.exploracao import Exploracao
from utentes.models.exploracao_con_renovacao import ExpConRenovacao
from utentes.models.renovacao import Renovacao


log = logging.getLogger(__name__)


@view_config(
    route_name="api_renovacao",
    permission=perm.PERM_GET,
    request_method="GET",
    renderer="json",
)
@view_config(
    route_name="api_renovacao_id",
    permission=perm.PERM_GET,
    request_method="GET",
    renderer="json",
)
def renovacao_get(request):
    gid = None
    if request.matchdict:
        gid = request.matchdict["id"] or None

    if gid:  # return individual renovacao
        try:
            return request.db.query(Renovacao).filter(Renovacao.gid == gid).one()
        except (MultipleResultsFound, NoResultFound):
            raise badrequest_exception({"error": error_msgs["no_gid"], "gid": gid})

    n_months_to_go_back = 6
    today = datetime.date.today()
    exploracaos = request.db.query(ExpConRenovacao).all()
    exploracaos_filtered = []

    for e in exploracaos:
        for l in e.licencias:
            if l.d_validade and today >= (
                l.d_validade - relativedelta(months=n_months_to_go_back)
            ):
                exploracaos_filtered.append(e.__json__(request))
                break

    for f in exploracaos_filtered:
        valid = [
            r
            for r in f.get("properties").get("renovacao")
            if r.get("estado") not in NOT_VALID
        ]

        if not valid:
            r_to_be_used = fill_renovacao_from_exploracao(f)

        elif len(valid) == 1:
            r_to_be_used = valid[0]

        else:
            raise badrequest_exception(
                {
                    "error": u"Há mais de uma renovação em progresso para a exploração selecionada"
                }
            )

        f["properties"]["renovacao"] = r_to_be_used

    states = request.GET.getall("states[]")
    features = [
        e
        for e in exploracaos_filtered
        if e.get("properties").get("renovacao").get("estado") in states
    ]

    return {"type": "FeatureCollection", "features": features}


def fill_renovacao_from_exploracao(exp):
    renovacao = {}
    renovacao["exploracao"] = exp["properties"]["id"]
    renovacao["exp_id"] = exp["properties"]["exp_id"]
    renovacao["estado"] = PENDING_RENOV_LICENSE

    for lic in exp["properties"]["licencias"]:
        if lic["tipo_agua"] == c.K_SUBTERRANEA:
            renovacao["tipo_lic_sub_old"] = lic["tipo_lic"]
            renovacao["d_emissao_sub_old"] = lic["d_emissao"]
            renovacao["d_validade_sub_old"] = lic["d_validade"]
            renovacao["c_licencia_sub_old"] = lic["c_licencia"]
        if lic["tipo_agua"] == c.K_SUPERFICIAL:
            renovacao["tipo_lic_sup_old"] = lic["tipo_lic"]
            renovacao["d_emissao_sup_old"] = lic["d_emissao"]
            renovacao["d_validade_sup_old"] = lic["d_validade"]
            renovacao["c_licencia_sup_old"] = lic["c_licencia"]

    if len(exp["properties"]["facturacao"]):
        f = exp["properties"]["facturacao"][-1]
        if f["consumo_fact_sub"]:
            exp["properties"]["consumo_fact_sub_old"] = f["consumo_fact_sub"]
        if f["consumo_fact_sup"]:
            exp["properties"]["consumo_fact_sup_old"] = f["consumo_fact_sup"]

    return renovacao


@view_config(
    route_name="api_renovacao_id",
    permission=perm.PERM_UPDATE_RENOVACAO,
    request_method="PATCH",
    renderer="json",
)
@view_config(
    route_name="api_renovacao_id",
    permission=perm.PERM_UPDATE_RENOVACAO,
    request_method="PUT",
    renderer="json",
)
def renovacao_update(request):
    gid = request.matchdict["id"]
    body = request.json_body

    renovacoes = (
        request.db.query(Renovacao)
        .filter(Renovacao.exploracao == gid, Renovacao.estado != LICENSED)
        .all()
    )

    valid = [r for r in renovacoes if r.estado not in NOT_VALID]

    if len(valid) > 1:
        raise badrequest_exception(
            {
                "error": "Há mais de uma renovação em progresso para a exploração selecionada"
            }
        )

    if len(valid) == 0:
        r = Renovacao()
        r.update_from_json_renovacao(body)
    elif len(valid) == 1:
        r = valid[0]
        r.update_from_json(body)

    if r.estado in (DE_FACTO, NOT_APPROVED):
        exp = (
            request.db.query(Exploracao).filter(Exploracao.gid == r.exploracao).all()[0]
        )
        exp.setLicStateAndExpId(
            request, {"exp_id": exp.exp_id, "state_to_set_after_validation": r.estado}
        )

    request.db.add(r)
    request.db.commit()
    return r


@view_config(
    route_name="api_renovacao_historico_id",
    permission=perm.PERM_GET,
    request_method="GET",
    renderer="json",
)
def renovacao_get_historical(request):
    exp_gid = request.matchdict.get("id")
    if not exp_gid:
        raise badrequest_exception({"error": error_msgs["no_gid"], "gid": exp_gid})

    try:
        return (
            request.db.query(Renovacao)
            .filter(Renovacao.exploracao == exp_gid, Renovacao.estado.in_(NOT_VALID))
            .order_by(
                Renovacao.d_validade_sub_old.desc(), Renovacao.d_validade_sup_old.desc()
            )
            .all()
        )

    except (MultipleResultsFound, NoResultFound):
        raise badrequest_exception({"error": error_msgs["no_gid"], "gid": exp_gid})
