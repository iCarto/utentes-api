Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.LayerConfig = Backbone.Model.extend({

    // static variable.
    // styleObj: {},

    defaults: {
        id: null,
        layer: null,
        initialOrder: null,
        scaleDependent: null,
        data: null,
        loaded: false,
    },

    initialize: function(options) {
        if (!this.get('layer')) {
            var geojsonOptions = {};

            if (this.get('style')) {
                if (this.get('style') === true) {
                    geojsonOptions.style = this.styleObj['doStyle' + this.get('id')];
                } else {
                    geojsonOptions.style = this.get('style');
                }
            }

            if (this.get('pointToLayer')) {
                if (this.get('pointToLayer') === true) {
                    geojsonOptions.pointToLayer = this.styleObj['doPointToLayer' + this.get('id')];
                } else {
                    geojsonOptions.pointToLayer = this.get('pointToLayer');
                }
            }

            if (this.get('onEachFeature')) {
                if (this.get('onEachFeature') === true) {
                    geojsonOptions.onEachFeature = this.styleObj['onEachFeature' + this.get('id')];
                } else {
                    geojsonOptions.onEachFeature = this.get('onEachFeature');
                }
            }

            if (this.get('data') === true) {
                this.get('data') === window['json_' + this.get('id')];
            }

            this.calculateScaleDependent();

            this.set('layer', new L.geoJson(this.get('data'), geojsonOptions));

            if (this.get('data') !== null) {
                this.set('loaded', true)
            }
        }
    },

    calculateScaleDependent: function() {
        var scaleDependent = this.get('scaleDependent');
        var farZoom = this.get('farZoom');
        var closeZoom = this.get('closeZoom');
        var minScale = this.get('minScale');
        var maxScale = this.get('maxScale');

        if (scaleDependent || farZoom || closeZoom || closeZoom || minScale || maxScale) {
            scaleDependent = scaleDependent || {};
            scaleDependent.farZoom = farZoom || this.scaleToZoom(minScale) || -1;
            scaleDependent.closeZoom = closeZoom || this.scaleToZoom(maxScale) || Number.MAX_VALUE;
            this.set('scaleDependent', scaleDependent);
        }
    },

    scaleToZoom: function(scale) {
        switch (scale) {
        case 1000000:
            return 9;
        case 500000:
            return 11;
        case 250000:
            return 12;
        case 150000:
            return 13;
        case 50000:
            return 13;
        case 25000:
            return 14;
        default:
            return null;
        }
    },

    isVisible: function(zoom) {
        var scaleDependent = this.get('scaleDependent')
        return (
    !scaleDependent ||
    ((scaleDependent.farZoom <= zoom) && (zoom <= scaleDependent.closeZoom))
        );
    },

    loadWithAjax: function() {
        var url = Backbone.SIXHIARA.Config.urlOfflineData + 'json_' + this.get('id') + '.js';
        var self = this;
        $.getJSON(url, function(data) {
            self.get('layer').clearLayers();
            self.get('layer').addData(data);
            self.set('loaded', true);
            self.trigger('layerloaded');
        });
    },

});

Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.LayerConfigCollection = Backbone.Collection.extend({
    model: Backbone.SIXHIARA.LayerConfig,
    comparator: 'initialOrder',

    filterByZoom: function(zoom) {
        // https://github.com/Leaflet/Leaflet/issues/2086
        // http://stackoverflow.com/a/31104813/930271
        // http://stackoverflow.com/questions/12848812/layer-ordering-in-leaflet-js
        // http://jsfiddle.net/nathansnider/7r763xaq/
        return this.filter(function(layer){
            var scaleDependent = layer.get('scaleDependent')
            return (
        !scaleDependent ||
        ((scaleDependent.farZoom <= zoom) && (zoom <= scaleDependent.closeZoom))
            );
        });
    },

    load: function(data) {
        data = data || {loadType:'all'};
        var self = this;
        if (data.loadType === 'all') {
            this.forEach(function(l) {l.loadWithAjax()});
        } else if (data.loadType === 'zoom') {
            (function() {
                var layers = self.filterByZoom(data.zoom);
                var counter = layers.length;
                layers.forEach(function(l){
                    l.once('layerloaded', function(){
                        counter -= 1;
                        if (counter === 0) {
                            self.trigger('initiallayersloaded');
                            self.forEach(function(l2){
                                if (!l2.get('loaded')) {
                                    l2.loadWithAjax();
                                }
                            });
                        }
                    });
                    l.loadWithAjax();
                });
            }());
        }
    },
});
