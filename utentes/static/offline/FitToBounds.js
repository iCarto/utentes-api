var FitToBounds = {
    defaults: {
        maxZoom: Number.MAX_SAFE_INTEGER,
        minZoom: Number.MIN_SAFE_INTEGER,
        boundPadding: 0,
    },

    fitToBounds: function(map, bounds, _boundsPadding, _maxZoom, _minZoom) {
        let maxZoom = _maxZoom || map.getMaxZoom() || FitToBounds.defaults.maxZoom;
        let minZoom = _minZoom || map.getMinZoom() || FitToBounds.defaults.minZoom;
        let boundsPadding = _boundsPadding || FitToBounds.defaults.boundPadding;
        map.fitBounds(bounds.pad(boundsPadding));
        var zoom = map.getZoom();
        if (zoom > maxZoom) {
            var center = map.getCenter();
            map.setZoomAround(center, maxZoom);
        }
        if (zoom < minZoom) {
            var center = map.getCenter();
            map.setZoomAround(center, minZoom);
        }
        return map.getBounds();
    },

    fitToLayers: function(map, _layers, boundsPadding, maxZoom, minZoom) {
        let bounds;
        if (_layers.getBounds) {
            bounds = _layers.getBounds();
        } else {
            var layers = Array.isArray(_layers) ? _layers : [_layers];
            bounds = layers.reduce(function(totalBounds, layer) {
                if (layer && layer.getBounds) {
                    var layerBounds = layer.getBounds();
                    return totalBounds.extend(layerBounds);
                }
                return totalBounds.extend(layer.getLatLng());
            }, new L.LatLngBounds());
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
