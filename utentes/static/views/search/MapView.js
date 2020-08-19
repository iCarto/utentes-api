Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.MapView = Backbone.View.extend({
    initialize: function(options) {
        var options = options || {};
        var self = this;

        options.mapOptions = options.mapOptions || {};
        options.offline = {layers: allLayers};
        this.map = Backbone.SIXHIARA.mapConfig(this.el.id, options);

        this.geoJSONLayer = L.geoJson(this.collection.toGeoJSON(), {
            style: this.leafletStyle,
            onEachFeature: function(feature, layer) {
                if (feature.properties) {
                    var exp_id = feature.properties.exp_id;
                    var exp = self.collection.filter({exp_id: exp_id})[0];
                    layer.bindPopup(
                        '<a href="' + exp.urlShow() + '">' + exp_id + "</a>"
                    );
                }
                layer.on({
                    mouseover: function(e) {
                        var layer = e.target;
                        var exp_id = layer.feature.properties.exp_id;
                        self.collection.trigger("leaflet", {
                            type: "mouseover",
                            exp_id: exp_id,
                        });

                        layer.setStyle({
                            opacity: 1,
                            fillOpacity: 0.4,
                        });

                        layer.bringToFront();
                    },
                    mouseout: function(e) {
                        self.geoJSONLayer.resetStyle(e.target);
                        self.collection.trigger("leaflet", {
                            type: "mouseout",
                            exp_id: exp_id,
                        });
                    },
                });
            },
        });

        this.mapEvents();
        this.geoJSONLayer.addTo(this.map);
    },

    leafletStyle: function style(feature) {
        /* Even if the default style is used, to get resetStyle working is needed
        to pass a function to L.geojson */
        return {
            stroke: true,
            color: "#00b300",
            weight: 4,
            opacity: 0.5,
            fillColor: "#00b300",
            fillOpacity: 0.2,
        };
    },

    update: function(newCollection) {
        this.collection = newCollection;
        this.updateLayer();
        this.updateMapView();
    },

    updateLayer: function() {
        this.geoJSONLayer.clearLayers();
        var geojson = this.collection.toGeoJSON();
        if (geojson.features.length > 0) {
            this.geoJSONLayer.addData(geojson);
        }
    },

    updateMapView: function() {
        if (this.geoJSONLayer.getLayers().length > 0) {
            FitToBounds.fitToLayers(this.map, this.geoJSONLayer, 0.04, 16);
        } else {
            this.map.resetView();
        }
    },

    mapEvents: function() {
        var self = this;
        this.map.on("dragend", function(e) {
            // user or programatic event? https://github.com/Leaflet/Leaflet/issues/2267
            if (e.hard) return;
            where.set("mapBounds", self.map.getBounds());
        });
    },
});
