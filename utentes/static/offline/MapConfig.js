Backbone.SIXHIARA.mapConfig = function(mapId, initOptions) {
    var options = initOptions || {};

    // let maxBoundsTodoMZQ = [[-29, 30], [-10, 40.64]];
    let maxBounds = L.latLngBounds(SIXHIARA.southWest, SIXHIARA.northEast).pad(0.25);
    var defaultMapOptions = {
        maxBounds: maxBounds,
        minZoom: 6, // Permite ver todo Mozambique
        maxZoom: 19, // Depende de las tiles que se usen en realidad.
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
    map.fitBounds([SIXHIARA.southWest, SIXHIARA.northEast]);

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

    L.Map.include({
        resetView: function resetView() {
            this.fitBounds(mapOptions.maxBounds);
        },
    });
    return map;
};
