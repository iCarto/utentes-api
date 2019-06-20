# -*- coding: utf-8 -*-

from pyramid.view import view_config

from utentes.models.domain import Domain
from utentes.user_utils import PERM_GET


@view_config(
    route_name="api_domains", permission=PERM_GET, request_method="GET", renderer="json"
)
def domains_get(request):
    domains = (
        request.db.query(Domain)
        .order_by(Domain.category, Domain.ordering, Domain.key)
        .all()
    )
    domains.append(
        {"category": "utente", "text": "", "alias": "", "order": 0, "parent": ""}
    )
    return domains
