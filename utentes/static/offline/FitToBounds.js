var FitToBounds = {
    defaults: {
        maxZoom: Number.MAX_SAFE_INTEGER,
        minZoom: Number.MIN_SAFE_INTEGER,
        boundsPadding: 0,
    },

    fitToBounds: function(map, bounds, _boundsPadding, _maxZoom, _minZoom) {
        let maxZoom = _maxZoom || map.getMaxZoom() || FitToBounds.defaults.maxZoom;
        let minZoom = _minZoom || map.getMinZoom() || FitToBounds.defaults.minZoom;
        let boundsPadding = _boundsPadding || FitToBounds.defaults.boundsPadding;
        map.fitBounds(bounds.pad(boundsPadding));
        var zoom = map.getZoom();
        var center = map.getCenter();
        if (zoom > maxZoom) {
            map.setZoomAround(center, maxZoom);
        }
        if (zoom < minZoom) {
            map.setZoomAround(center, minZoom);
        }
        return map.getBounds();
    },

    fitToLayers: function(map, _layers, boundsPadding, maxZoom, minZoom) {
        /*
        Si esta función no encuentra al menos una geometría en `_layers`,
        retorna sin hacer nada. Es decir no modifica la vista.
        */
        let bounds;
        if (_layers.getBounds) {
            bounds = _layers.getBounds();
        } else {
            var layers = Array.isArray(_layers) ? _layers : [_layers];
            bounds = layers.reduce(function(totalBounds, layer) {
                if (layer) {
                    if (layer.getBounds) {
                        var layerBounds = layer.getBounds();
                        return totalBounds.extend(layerBounds);
                    }
                    if (layer.getLatLng) {
                        return totalBounds.extend(layer.getLatLng());
                    }
                }
                return totalBounds;
            }, new L.LatLngBounds());
        }
        if (!bounds.isValid()) {
            return;
        }
        return FitToBounds.fitToBounds(map, bounds, boundsPadding, maxZoom, minZoom);
    },

    fitAndSetMaxBounds: function(map, layers, boundsPadding, maxZoom, minZoom) {
        let mapBounds = FitToBounds.fitToLayers(
            map,
            layers,
            boundsPadding,
            maxZoom,
            minZoom
        );
        // el padding es para asegurarse de que entra
        // si no intenta hacer un _panInsideMaxBounds y puede
        // entrar en un bucle infinito
        map.setMaxBounds(mapBounds.pad(0.15));
    },
};
