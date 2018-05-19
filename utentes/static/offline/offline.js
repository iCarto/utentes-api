Backbone.SIXHIARA.offline = function(map, layersConfig){
    var self = this;
    function restackLayers() {
        if (! map.hasLayer(feature_group)) return;
        if (! self.initiallayersloaded) return;
        /*
        Una solución a explorar sería crear un container para cada capa
        y aplicar .hide() / .show() al container
        */
        var zoom = map.getZoom();
        collection.forEach(function(layerConfig) {
            var layer = layerConfig.get('layer');
            if (layerConfig.isVisible(zoom)) {
                // Si ya existe no hace nada
                feature_group.addLayer(layer);
                // Como collection está ordenado de capa superior en el TOC a capa
                // inferior (primera en ser renderizada), bringToBack debería
                // ejecutarse en realidad pocas veces.
                layer.bringToBack();
            } else {
                feature_group.removeLayer(layer);
            }
        });

        // feature_group.bringToBack();
    };

    var feature_group = new L.featureGroup([]);

    var collection = new Backbone.SIXHIARA.LayerConfigCollection();

    for (var i = layersConfig.length - 1; i>=0; i--) {
        layersConfig[i].initialOrder = 11 - layersConfig[i].initialOrder;
        if ((!layersConfig[i].style) && (!layersConfig[i].pointToLayer)) {
            layersConfig[i].style = Backbone.SIXHIARA.LayerStyle['doStyle' + layersConfig[i].id];
        }
        collection.add(layersConfig[i]);
    }


    collection.on('initiallayersloaded', function() {
        self.initiallayersloaded = true;
        self.fontes = collection.get('Fontes');
        if (self.addToMap) {
            feature_group.addTo(map);
            restackLayers();
        } else {
            restackFontes();
        }

    });

    function restackFontes() {
        var fontesLayer = self.fontes.get('layer');
        feature_group.removeLayer(fontesLayer);
        if (self.fontes.isVisible(map.getZoom())) {
            map.addLayer(fontesLayer);
            fontesLayer.bringToFront();
        } else {
            map.removeLayer(fontesLayer);
        }
    }

    map.on('zoomend', function(e) {
        restackLayers();
        if ( (! map.hasLayer(feature_group)) && (self.initiallayersloaded) ) {
            restackFontes();
        }

    });

    map.on('baselayerchange', function(e) {
        if (e.name === 'Sem rede') {
            restackLayers();
        } else {
            restackFontes();
        }
    });

    feature_group.loadOffline = function(addToMap) {
        self.addToMap = addToMap;
        collection.load({
            loadType: 'zoom',
            zoom: map.getZoom(),
        });
    }
    return feature_group;
}
