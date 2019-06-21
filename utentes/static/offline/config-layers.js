var allLayers = [
    {
        id: "Albufeiras",
        initialOrder: 7,
        farZoom: 11, // 500.000
    },
    {
        id: "CidadesVilas",
        pointToLayer: Backbone.SIXHIARA.LayerStyle.doPointToLayerCidadesVilas,
        initialOrder: 6,
    },
    {
        id: "Estradas",
        initialOrder: 5,
        farZoom: 11, // 500.000
    },
    {
        id: "Lagos",
        initialOrder: 4,
    },
    {
        id: "Oceano",
        initialOrder: 0,
    },
    {
        id: "Pais",
        initialOrder: 1,
    },
    {
        id: "Postos",
        initialOrder: 2,
    },
    {
        id: "Provincias",
        initialOrder: 3,
    },
    {
        id: "Rios",
        initialOrder: 8,
        farZoom: 11, // 500.000
    },
    {
        id: "Fontes",
        initialOrder: 9,
        farZoom: 13, // 150.000
        // onEachFeature: pop_Fontes4,
        pointToLayer: Backbone.SIXHIARA.LayerStyle.doPointToLayerFontes,
        almostOver: true,
    },
    {
        id: "PaisesPunto",
        pointToLayer: Backbone.SIXHIARA.LayerStyle.doPointToLayerPaisesPunto,
        initialOrder: 10,
    },
    {
        id: "PostosPunto",
        pointToLayer: Backbone.SIXHIARA.LayerStyle.doPointToLayerPostosPunto,
        initialOrder: 11,
        farZoom: 9, // 1.000.000
    },
    {
        id: "ProvinciasPunto",
        pointToLayer: Backbone.SIXHIARA.LayerStyle.doPointToLayerProvinciasPunto,
        initialOrder: 12,
    },
];
