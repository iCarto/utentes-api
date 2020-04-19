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

    fit: function(map, boundsPadding, maxZoom, minZoom, layers) {
        var layers = Array.isArray(layers) ? layers : [layers];
        var bounds = layers.reduce(function(totalBounds, layer) {
            var layerBounds = layer && layer.getBounds();
            return totalBounds.extend(layerBounds);
        }, new L.LatLngBounds());

        return FitToBounds.fitToBounds(map, bounds, boundsPadding, maxZoom, minZoom);
    },

    fitAndSetMaxBounds: function(map, boundsPadding, maxZoom, minZoom, layers) {
        let mapBounds = FitToBounds.fit(map, boundsPadding, maxZoom, minZoom, layers);
        // el padding es para asegurarse de que entra
        // si no intenta hacer un _panInsideMaxBounds y puede
        // entrar en un bucle infinito
        map.setMaxBounds(mapBounds.pad(0.15));
    },
};
