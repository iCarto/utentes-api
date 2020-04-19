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

var MySaveToAPI = SaveToAPI.extend({
    addHooks: function() {
        var polygonLayer = table.polygonLayer.toGeoJSON();
        // TODO. Probably save button should be desactivated if the validations
        // not pass
        if (!polygonLayer || polygonLayer.features.length != 1) {
            bootbox.alert({message: "Primeiro, você deve gerar um polígono"});
            return;
        }
        feat = polygonLayer.features[0];
        code = feat.properties.name;
        if (_.isEmpty(code)) {
            bootbox.alert("O polígono deve ter um nome válido");
            return;
        }

        var model = new Backbone.Model({entidade: null, identificador: null});

        var modalView = new Backbone.SIXHIARA.GPSModalView({
            model: model,
            modalSelectorTpl: "#modal-gps-tmpl",
        });
        modalView.render();

        return;
    },
});

var MyImportGPX = ImportGPX.extend({
    initialize: function() {
        this.options.toolbarIcon.tooltip = "Carregar";
        var action = this;
        $("#input-importgpx").on("change", function(e) {
            action.convertToGeoJSON(e.target.files, geoJsonLayer, map, table);
            // reset value of input.file element for the change event
            // to be triggered if the user loads again the same file
            $("#input-importgpx").val("");
        });
    },

    addHooks: function() {
        // make hidden input.file to open
        $("#input-importgpx").trigger("click");
    },
});

var MyAddCoordinates = AddCoordinates.extend({
    addHooks: function() {
        var domains = new Backbone.UILib.DomainCollection([
            {category: "crs", text: "WGS84", alias: "4326"},
            {category: "crs", text: "UTM 36S", alias: "32736"},
            {category: "crs", text: "UTM 37S", alias: "32737"},
        ]);

        var modalView = new Backbone.SIXHIARA.AddCoordinatesModalView({
            model: new Backbone.Model(),
            map: map,
            domains: domains,
            geoJsonLayer: geoJsonLayer,
            modalSelectorTpl: "#modal-gps-add-coordinates-tmpl",
        }).render();
    },
});

var MyDeleteSession = EndSession.extend({
    addHooks: function() {
        bootbox.confirm(
            "Tem certeza de que deseja apagar todos os pontos carregados?",
            function(result) {
                if (result) {
                    table.endSession();
                }
                return;
            }
        );
    },
});

var actionsToolbar = new L.Toolbar2.Control({
    position: "topright",
    actions: [
        MyImportGPX,
        MakePolygon,
        Clear,
        MoveToTop,
        DeleteSelected,
        MySaveToAPI,
        MyAddCoordinates,
        MyDeleteSession,
    ],
    className: "gps-toolbar",
}).addTo(map);

var table = L.control.table(geoJsonLayer, {featOrderTitle: "Ordem"}).addTo(map);

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
