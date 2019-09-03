# -*- coding: utf-8 -*-

from pyramid.view import view_config

import utentes.constants.perms as perm


@view_config(
    route_name="api_transform_coordinates",
    request_method="GET",
    permission=perm.PERM_GET,
    renderer="json",
)
def transform(request):

    org_srs = request.GET["org_srs"]
    dest_srs = request.GET["dest_srs"]
    org_x = request.GET["x"]
    org_y = request.GET["y"]

    params = {
        "org_srs": int(org_srs),
        "dest_srs": int(dest_srs),
        "org_x": float(org_x),
        "org_y": float(org_y),
        "dest_x": None,
        "dest_y": None,
    }

    sql = """
        SELECT
            ST_X(a.geom),
            ST_Y(a.geom)
        FROM (
            SELECT
                ST_Transform(
                    ST_GeomFromText('POINT( :org_x :org_y )', :org_srs),
                    :dest_srs
                ) as geom
        ) a
        """

    result = request.db.execute(sql, params).first()

    params["dest_x"] = result[0]
    params["dest_y"] = result[1]

    return params
