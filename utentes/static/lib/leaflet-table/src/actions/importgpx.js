var ImportGPX = L.Toolbar2.Action.extend({
    options: {
        toolbarIcon: {
            html: '<i class="fas fa-folder-open"></i>',
            tooltip: "Importar GPX",
        },
    },

    initialize: function(map, geoJsonLayer, table, options) {
        this.options.toolbarIcon.tooltip = "Carregar";
        this.map = map;
        this.geoJsonLayer = geoJsonLayer;
        this.table = table;
        this._options = options;
        var self = this;
        $("body").append(
            '<input id="input-importgpx" type="file" accept=".gpx,.zip,application/zip,application/x-zip,application/x-zip-compressed" style="display: none;">'
        );
        $("#input-importgpx").on("change", function(e) {
            var files = e.currentTarget.files;
            if (files === 0) return;

            if (files[0].name.toLowerCase().slice(-3) === "gpx") {
                self.gpxToGeoJSON(files, self.geoJsonLayer, self.map, self.table);
            } else {
                self.shpToGeoJSON(files, self.geoJsonLayer, self.map, self.table);
            }

            // reset value of input.file element for the change event
            // to be triggered if the user loads again the same file
            $("#input-importgpx").val("");
        });
    },

    addHooks: function() {
        // make hidden input.file to open
        $("#input-importgpx").trigger("click");
    },

    gpxToGeoJSON: function(files, geoLayer, map) {
        var reader = new FileReader();
        var file = files[0];
        // set up what happens on finish reading
        reader.onloadend = function(e) {
            if (this.readyState !== 2 || this.error) {
                bootbox.alert("Error carregando ficheiro");
                return;
            }

            var gpx = new DOMParser().parseFromString(this.result, "text/xml");
            var myGeoJSON = toGeoJSON.gpx(gpx);

            // TODO: toGeoJSON doesn't import all properties from GPX
            // (ie: it does not import "ele" or "cmt")
            // research or just use those that imports : name, time, desc

            geoLayer.clearLayers();

            // would populate data and idx
            geoLayer.addData(myGeoJSON);
        };

        // we only allow for reading 1 file
        reader.readAsText(file);
    },

    shpToGeoJSON: function(files, geoLayer, map) {
        var reader = new FileReader();
        var file = files[0];
        // set up what happens on finish reading
        reader.onloadend = function(e) {
            if (this.readyState !== 2 || this.error) {
                bootbox.alert("Error carregando ficheiro");
                return;
            }

            shp(this.result)
                .then(function(myGeoJSON) {
                    geoLayer.clearLayers();

                    // would populate data and idx
                    geoLayer.addData(myGeoJSON);
                })
                .catch(function(e) {
                    bootbox.alert("Error carregando ficheiro");
                });
        };

        // we only allow for reading 1 file
        reader.readAsArrayBuffer(file);
    },
});
