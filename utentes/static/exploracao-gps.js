var options = {
    mapOptions: {
        zoom: (window.SIXHIARA.gps && window.SIXHIARA.gps.zoom) || 8,
    },
    offline: {
        layers: allLayers,
    },
};

var my_map = Backbone.SIXHIARA.mapConfig("map-pane", options);
Backbone.SIXHIARA.EditionMap(my_map);

// move all this fetches to a propper place
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
