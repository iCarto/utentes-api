Backbone.SIXHIARA.mapConfig = function(mapId, initOptions) {
    var options = initOptions || {};

    var defaultMapOptions = {
        zoom: 7,
        center: SIXHIARA.center,
        maxBounds: [SIXHIARA.southWest, SIXHIARA.northEast],
        minZoom: 7,
        maxZoom: 19,
        trackResize: false,
    };

    var mapOptions = _.defaults(
        _.extend({}, defaultMapOptions, options.mapOptions || {}),
        defaultMapOptions
    );

    if (options.mapBackground) {
        $("#" + mapId).css("background-color", options.mapBackground);
    }

    var map = L.map(mapId, mapOptions);

    if (options.offline && options.offline.layers) {
        var offBaseLayer = Backbone.SIXHIARA.offline(map, options.offline.layers);

        /* A bug in leaflet makes that the order which is used to add the layers to
        the control is not respected. Add and Remove the layer to create the layer-id
        partially solves this situation */
        map.addLayer(offBaseLayer);
        map.removeLayer(offBaseLayer);
        /* workaround end */
    }

    var osmhotLayer = L.tileLayer(
        "http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
        {
            attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
    );

    var baseMap = window.localStorage.getItem("baseMap") || "OSM-HOT";

    if (baseMap === "Hidrológico") {
        offBaseLayer.loadOffline(true);
    } else if (baseMap === "OSM-HOT") {
        osmhotLayer.addTo(map);
        offBaseLayer.loadOffline(false);
    }

    var control = L.control.layers({}, {}, {position: "topleft"}).addTo(map);
    control.addBaseLayer(offBaseLayer, "Hidrológico");
    control.addBaseLayer(osmhotLayer, "OSM-HOT");

    map.on("baselayerchange", function(e) {
        window.localStorage.setItem("baseMap", e.name);
    });

    return map;
};
