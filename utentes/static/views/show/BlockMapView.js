Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockMapView = Backbone.View.extend({
    initialize: function(_options) {
        var options = _options || {};
        var self = this;

        var baseOfflineLayers = allLayers.filter(function(l) {
            return !["baciasrepresentacion", "bacias"].includes(l.id);
        });
        options.offline = {layers: baseOfflineLayers};

        // Cuidado con tocar el orden de las siguientes cuatro líneas
        // y los parámetros optIn para PM.initialize, y pmIgnore para L.map()
        L.PM.initialize({optIn: true});
        // snapIgnore está por este bug: https://github.com/geoman-io/leaflet-geoman/issues/661
        options["mapOptions"] = {pmIgnore: false};
        this.map = Backbone.SIXHIARA.mapConfig("map", options);
        this.map.pm.setLang("pt_br");
        this.map.pm.setGlobalOptions({snappable: false, finishOn: "dblclick"});

        self.map.SIRHASScrollWheelZoomOnlyOnFocus(true);

        this.geoJSONLayer = L.geoJson(undefined, {
            style: this.map.SIRHASExploracaoStyle,
            pmIgnore: true,
        }).addTo(this.map);

        // only used for editionmap
        this.model.leafletLayer = this.geoJSONLayer;

        if (window.iAuth.isAdmin() || window.iAuth.hasRoleTecnico()) {
            var beginEditionToolbar = new L.Toolbar2.Control({
                position: "topleft",
                actions: [window.BeginEdition],
                className: "begin-edition-toolbar",
            });
            beginEditionToolbar.addTo(self.map, self.model);
            window.vent.on("sirha:editionmap:editionbegined", function() {
                beginEditionToolbar.remove();
            });
            window.vent.on("sirha:editionmap:editionfinished", function() {
                beginEditionToolbar.addTo(self.map, self.model);
                self.renderData();
            });
            Backbone.SIXHIARA.EditionMap(this.map, this.model.get("id"));
        }

        this.renderData();
    },

    renderData: function() {
        this.geoJSONLayer.clearLayers();
        if (this.model.hasGeometry()) {
            this.geoJSONLayer.addData(this.model.toGeoJSON());
        }

        this.renderActividade();

        FitToBounds.fitToLayers(
            this.map,
            [this.geoJSONLayer, this.actividadeLayer],
            0.1,
            16
        );
    },

    renderActividade: function() {
        if (this.actividadeLayer) {
            this.actividadeLayer.remove();
        }
        var act = this.model.get("actividade");
        if (!act) {
            return;
        }

        this.actividadeLayer = act.getActividadeLayer(this.map);
        if (!this.actividadeLayer) {
            return;
        }

        this.actividadeLayer.addTo(this.map);
    },
});
