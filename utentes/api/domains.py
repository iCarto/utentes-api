# -*- coding: utf-8 -*-

from pyramid.view import view_config

import utentes.constants.perms as perm
from utentes.models.domain import Domain


@view_config(
    route_name="api_domains",
    permission=perm.PERM_GET,
    request_method="GET",
    renderer="json",
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
