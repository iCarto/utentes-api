var ImportGPX = L.Toolbar2.Action.extend({
    options: {
        toolbarIcon: {
            html: '<i class="fas fa-folder-open"></i>',
            tooltip: "Importar GPX",
        },
    },

    convertToGeoJSON: function(files, geoLayer, map) {
        if (files.length === 0) return;
        var reader = new FileReader();

        // set up what happens on finish reading
        reader.onloadend = function(e) {
            var gpx = new DOMParser().parseFromString(e.target.result, "text/xml");
            var myGeoJSON = toGeoJSON.gpx(gpx);

            // TODO: toGeoJSON doesn't import all properties from GPX
            // (ie: it does not import "ele" or "cmt")
            // research or just use those that imports : name, time, desc

            geoLayer.clearLayers();

            // would populate data and idx
            geoLayer.addData(myGeoJSON);

            // TODO how a toolbar action may have access to the map?
            map.fitBounds(geoLayer.getBounds()).setMaxBounds(
                geoLayer.getBounds().pad(0.5)
            );
        };

        // we only allow for reading 1 file
        reader.readAsText(files[0]);
    },
});
