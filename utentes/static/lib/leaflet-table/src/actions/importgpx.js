/* global shp, toGeoJSON */

window.ImportGPX = L.Toolbar2.Action.extend({
    options: {
        toolbarIcon: {
            html: '<i class="fas fa-folder-open"></i>',
            tooltip: "Carregar dados",
        },
    },

    initialize: function(map, geoJsonLayer, table, options) {
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
            if (files === 0) {
                return;
            }

            self.fileToGeoJSON(files, self.geoJsonLayer).then(function() {
                $("#input-importgpx").val("");
            });
        });
    },

    addHooks: function() {
        // make hidden input.file to open
        $("#input-importgpx").trigger("click");
    },

    fileToGeoJSON: function(files, geoLayer) {
        var file = files[0];
        var isGPX = file.name.toLowerCase().slice(-3) === "gpx";

        // https://gist.github.com/richardneililagan/e70b90545919f65e93f9
        // https://stackoverflow.com/questions/50279432
        // https://stackoverflow.com/questions/34495796/
        // https://thecompetentdev.com/weeklyjstips/tips/65_promisify_filereader/
        // https://simon-schraeder.de/posts/filereader-async/
        function readFile(file, as) {
            /*
            as = "readAsText", "readAsArrayBuffer", ...
            */
            return new Promise((resolve, reject) => {
                var reader = new FileReader();
                reader.onload = event => {
                    // let result = event.target.result;
                    let result = reader.result;
                    resolve(result);
                };
                reader.onerror = reject;
                reader.onabort = reject;

                if (as) {
                    reader[as](file);
                } else if (/^image/.test(file.type)) {
                    reader.readAsDataURL(file);
                } else if (isGPX) {
                    reader.readAsText(file);
                } else {
                    reader.readAsArrayBuffer(file);
                }
            });
        }

        return readFile(file)
            .then(function(data) {
                if (isGPX) {
                    var gpx = new DOMParser().parseFromString(data, "text/xml");
                    return Promise.resolve(toGeoJSON.gpx(gpx));
                } else {
                    return shp(data);
                }
            })
            .then(function(myGeoJSON) {
                geoLayer.clearLayers();
                geoLayer.addData(myGeoJSON);
            })
            .catch(function() {
                // console.log(err);
                bootbox.alert({
                    message: "Error carregando ficheiro",
                    container: document.getElementById("map"),
                });
            });
    },
});
