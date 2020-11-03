Backbone.SIXHIARA.mapConfig = function(mapId, initOptions) {
    var options = initOptions || {};

    // let maxBoundsTodoMZQ = [[-29, 30], [-10, 40.64]];
    let maxBounds = L.latLngBounds(SIXHIARA.southWest, SIXHIARA.northEast).pad(0.15);
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
    var esriWorldImagery = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
            attribution:
                "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, CNES/Airbus DS, USDA FSA, USGS, Aerogrid, IGN, IGP, and the GIS User Community",
        }
    );

    var baseMap = window.localStorage.getItem("baseMap") || "OSM-HOT";

    if (baseMap === "Hidrológico") {
        offBaseLayer.loadOffline(true);
    } else if (baseMap === "OSM-HOT") {
        osmhotLayer.addTo(map);
        offBaseLayer.loadOffline(false);
    } else if (baseMap === "Satelite") {
        esriWorldImagery.addTo(map);
        offBaseLayer.loadOffline(false);
    }

    var control = L.control.layers({}, {}, {position: "topleft"}).addTo(map);
    control.addBaseLayer(offBaseLayer, "Hidrológico");
    control.addBaseLayer(osmhotLayer, "OSM-HOT");
    control.addBaseLayer(esriWorldImagery, "Satelite");

    map.on("baselayerchange", function(e) {
        window.localStorage.setItem("baseMap", e.name);
    });

    L.Map.include({
        resetView: function resetView() {
            this.fitBounds(mapOptions.maxBounds);
        },
        SIRHASScrollWheelZoomOnlyOnFocus: function(flag) {
            /*
            Cuando el mapa es parte de una página puede interesar que la rueda
            del ratón sólo haga zoom cuando el mapa tenga el foco activamente.
            Si no podría capturar el usar la rueda para desplazarse en la página
            */
            const disableScrollWheelZoom = function(e) {
                e.target.scrollWheelZoom.enable();
            };
            const enableScrollWheelZoom = function(e) {
                e.target.scrollWheelZoom.enable();
            };

            if (flag) {
                this.scrollWheelZoom.disable();
                this.on("focus", enableScrollWheelZoom);
                this.on("blur", disableScrollWheelZoom);
            } else {
                this.scrollWheelZoom.enable();
                this.off("focus", enableScrollWheelZoom);
                this.off("blur", disableScrollWheelZoom);
            }
        },
        SIRHASExploracaoStyle: function(feature) {
            if (
                feature.properties.estado_lic === SIRHA.ESTADO.IRREGULAR ||
                feature.properties.estado_lic === SIRHA.ESTADO.NOT_APPROVED
            ) {
                return {
                    color: "#6c757d",
                    weight: 3,
                    opacity: 0.5,
                    fillColor: "#6c757d",
                    fillOpacity: 0.2,
                };
            } else if (feature.properties.estado_lic === SIRHA.ESTADO.DE_FACTO) {
                return {
                    color: "#dc3545",
                    weight: 3,
                    opacity: 0.5,
                    fillColor: "#dc3545",
                    fillOpacity: 0.2,
                };
            } else if (feature.properties.estado_lic === SIRHA.ESTADO.USOS_COMUNS) {
                return {
                    color: "#ffc107",
                    weight: 3,
                    opacity: 0.5,
                    fillColor: "#ffc107",
                    fillOpacity: 0.2,
                };
            } else {
                return {
                    color: "#28a745",
                    weight: 3,
                    opacity: 0.5,
                    fillColor: "#28a745",
                    fillOpacity: 0.2,
                };
            }
        },
        SIRHASCultivosStyle: {
            color: "#994c00",
            weight: 1.5,
            opacity: 1,
            fill: false,
            // fillColor: "#994c00",
            // fillOpacity: 0.5,
        },
        SIRHASTanquesStyle: function(feature) {
            if (feature.properties.tipo === "Tanque") {
                return {
                    color: "#436eee",
                    weight: 1.5,
                    opacity: 1,
                    fill: false,
                    fillColor: "#436eee",
                    fillOpacity: 0.5,
                };
            } else if (feature.properties.tipo === "Gaiola") {
                return {
                    color: "#1a2c5f",
                    weight: 1.5,
                    opacity: 1,
                    fill: false,
                    // fillColor: "#1a2c5f",
                    // fillOpacity: 0.5,
                };
            }
        },
    });
    return map;
};
