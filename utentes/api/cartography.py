from pyramid.view import view_config

import utentes.constants.perms as perm
from utentes.models import cartography


@view_config(
    route_name="api_cartography",
    permission=perm.PERM_GET,
    request_method="GET",
    renderer="json",
)
def api_cartography(request):
    layer = request.matchdict["layer"]
    model = {
        "estacoes": cartography.Estacoes,
        "barragens": cartography.Barragens,
        "fontes": cartography.Fontes,
        "entidadespopulacao": cartography.EntidadesPopulacao,
        "albufeiras": cartography.Albufeiras,
        "lagos": cartography.Lagos,
        "estradas": cartography.Estradas,
        "rios": cartography.Rios,
        "aras": cartography.ARAS,
        "bacias": cartography.Bacias,
        "baciasrepresentacion": cartography.BaciasRepresentacion,
        "provincias": cartography.Provincias,
        "paises": cartography.Paises,
        "oceanos": cartography.Oceanos,
    }.get(layer)
    if not model:
        from utentes.models.base import notfound_exception

        raise notfound_exception(
            {"error": "El recurso no existe en el servidor", "layer": layer}
        )
    return {"type": "FeatureCollection", "features": request.db.query(model).all()}
