Backbone.SIXHIARA.mapConfig = function(mapId, initOptions) {
    var options = initOptions || {};

    var defaultMapOptions = {
        zoom: 7,
        center: SIXHIARA.center,
        maxBounds: [SIXHIARA.southWest, SIXHIARA.northEast],
        minZoom: 6,
        maxZoom: 19,
    };

    var mapOptions = _.defaults(_.extend({}, defaultMapOptions, options.mapOptions || {}), defaultMapOptions);



    if (options.mapBackground) {
        $('#'+ mapId).css('background-color', options.mapBackground);
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

    if (options.online || true) {
        var mapBoxApi = window.localStorage.getItem('mapBoxApi');

        var hotLayer = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });

        var iCartoLayer = L.tileLayer('https://api.mapbox.com/styles/v1/fpuga/ciyeq8j4m00362slesun9tw70/tiles/256/{z}/{x}/{y}?access_token=' + mapBoxApi, {
            attribution:'© <a href= "http://icarto.es">iCarto</a>, © <a href= "https://www.mapbox.com/map-feedback/">Mapbox</a>, © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        })

    }

    var baseMap = window.localStorage.getItem('baseMap') || 'Sem rede';
    if (baseMap === 'Sem rede') {
        offBaseLayer.loadOffline(true);
    } else if (baseMap === 'OSM-HOT') {
        hotLayer.addTo(map);
        offBaseLayer.loadOffline(false);
    } else if (baseMap === 'OSM-Mapbox') {
        iCartoLayer.addTo(map);
        offBaseLayer.loadOffline(false);
    }


    var control = L.control.layers({}, {}, {position:'topleft'}).addTo(map);
    control.addBaseLayer(offBaseLayer, 'Sem rede');
    control.addBaseLayer(hotLayer, "OSM-HOT");
    control.addBaseLayer(iCartoLayer, "OSM-Mapbox");



    map.on('baselayerchange', function(e) {
        window.localStorage.setItem('baseMap', e.name);
    });

    return map;
}
