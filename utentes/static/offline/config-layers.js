var allLayers = [
    {
        id: "estacoes",
        pointToLayer: Backbone.SIXHIARA.LayerStyle.doPointToLayerEstacoes,
        initialOrder: 0,
        farZoom: 12,
    },
    {
        id: "barragens",
        pointToLayer: Backbone.SIXHIARA.LayerStyle.doPointToLayerBarragens,
        initialOrder: 1,
        farZoom: 12,
    },
    {
        id: "fontes",
        initialOrder: 2,
        farZoom: 13,
        pointToLayer: Backbone.SIXHIARA.LayerStyle.doPointToLayerFontes,
    },
    {
        id: "entidadespopulacao",
        pointToLayer: Backbone.SIXHIARA.LayerStyle.doPointToLayerEntidadespopulacao,
        initialOrder: 3,
        farZoom: 10,
    },
    {
        id: "albufeiras",
        initialOrder: 4,
    },
    {
        id: "lagos",
        initialOrder: 5,
    },
    {
        id: "estradas",
        initialOrder: 6,
        farZoom: 12,
    },
    {
        id: "rios",
        initialOrder: 7,
        farZoom: 9,
    },
    {
        id: "aras",
        //onEachFeature: Backbone.SIXHIARA.LayerStyle.onEachFeaturearas,
        initialOrder: 8,
        closeZoom: 11,
    },
    {
        id: "bacias",
        initialOrder: 9,
        farZoom: 10,
        closeZoom: 11,
    },
    {
        id: "baciasrepresentacion",
        initialOrder: 10,
        closeZoom: 10,
    },
    {
        id: "provincias",
        initialOrder: 11,
    },
    {
        id: "paises",
        initialOrder: 12,
    },
    {
        id: "oceanos",
        initialOrder: 13,
    },
];
