var FitToBounds = {
    fitToBounds: function(map, bounds, boundsPadding, maxZoom, minZoom) {
        maxZoom = maxZoom || Number.MAX_SAFE_INTEGER;
        minZoom = minZoom || Number.MIN_SAFE_INTEGER;
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

    setThisAsMaxBounds: function(map) {
        // el padding es para asegurarse de que entra
        // si no intenta hacer un _panInsideMaxBounds y puede
        // entrar en un bucle infinito
        var bounds = map.getBounds().pad(0.15);
        map.setMaxBounds(bounds);
    },

    fit: function(map, boundsPadding, maxZoom, minZoom, maxBounds, layers) {
        var layers = Array.isArray(layers) ? layers : [layers];
        var bounds = layers.reduce(function(totalBounds, layer) {
            var layerBounds = layer && layer.getBounds();
            return totalBounds.extend(layerBounds);
        }, new L.LatLngBounds());

        FitToBounds.fitToBounds(map, bounds, boundsPadding, maxZoom, minZoom);
        if (maxBounds) {
            FitToBounds.setThisAsMaxBounds(map);
        }
    },
};
