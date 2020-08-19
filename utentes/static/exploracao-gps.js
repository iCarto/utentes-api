var options = {
    mapOptions: {
        zoom: (window.SIXHIARA.gps && window.SIXHIARA.gps.zoom) || 8,
    },
    offline: {
        layers: allLayers,
    },
};

var map = Backbone.SIXHIARA.mapConfig("map-pane", options);

// TODO: take it from leaflet-table
var unselectedFeature = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 0.4,
    fillOpacity: 0.4,
};

var geoJsonLayer = L.geoJson([], {
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, unselectedFeature);
    },
    onEachFeature: function(feature, layer) {
        // on adding each feat
    },
}).addTo(map);

var table = L.control.table(geoJsonLayer, {featOrderTitle: "Ordem"});

var actionsToolbar = new L.Toolbar2.Control({
    position: "topright",
    actions: [
        ImportGPX,
        MakePolygon,
        Clear,
        MoveToTop,
        DeleteSelected,
        SaveToAPI,
        AddCoordinates,
        EndSession,
    ],
    className: "gps-toolbar",
}).addTo(map, geoJsonLayer, table);

table.addTo(map);

var exploracaos = new Backbone.SIXHIARA.ExploracaoCollection();
exploracaos.fetch({
    parse: true,
    success: function() {
        exploracaos = exploracaos.withFicha();
    },
});

var cultivos = new Backbone.SIXHIARA.CultivoCollection();
cultivos.fetch();

var tanques = new Backbone.SIXHIARA.TanquePiscicolaCollection();
tanques.fetch();
