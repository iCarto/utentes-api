Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockMapView = Backbone.View.extend({
    initialize: function(options) {
        var options = options || {};
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

        self.map.scrollWheelZoom.disable();
        self.map.on("focus", function() {
            self.map.scrollWheelZoom.enable();
        });
        self.map.on("blur", function() {
            self.map.scrollWheelZoom.disable();
        });

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
            window.vent.on(
                "sirha:editionmap:stopedition sirha:editionmap:canceledition",
                function() {
                    beginEditionToolbar.addTo(self.map, self.model);
                }
            );
            Backbone.SIXHIARA.EditionMap(this.map);
        }

        this.renderData();

        this.listenTo(this.model, "change:actividade", this.renderActividade);
        this.listenTo(this.model, "change:geometry_edited", this.renderData);
        // this.listenTo(this.model, "renderActividade", this.renderActividade);
    },

    renderData: function() {
        var data = this.model.toGeoJSON();
        if (data.geometry.coordinates) {
            this.geoJSONLayer = L.geoJson(data, {
                style: {
                    stroke: true,
                    color: "#00b300",
                    weight: 4,
                    opacity: 0.5,
                    fillColor: "#00b300",
                    fillOpacity: 0.2,
                },
                pmIgnore: true,
            }).addTo(this.map);
            this.model.leafletLayer && this.model.leafletLayer.remove();
            this.model.leafletLayer = this.geoJSONLayer;

            FitToBounds.fitToLayers(this.map, this.geoJSONLayer, 0.1, 16);
        }

        this.renderActividade();
    },

    /*
      If the activity should render any geometry, like the cultivos for Regadio
      activities it's done in this method
    */
    renderActividade: function() {
        if (this.actividadeLayer) this.actividadeLayer.clearLayers();
        var act = this.model.get("actividade");
        if (!act) {
            return;
        }

        this.actividadeLayer = act.getActividadeLayer(this.map);
        if (!this.actividadeLayer) {
            return;
        }

        this.actividadeLayer.addTo(this.map);
        FitToBounds.fitToLayers(
            this.map,
            [this.geoJSONLayer, this.actividadeLayer],
            0.1,
            16
        );
    },
});
