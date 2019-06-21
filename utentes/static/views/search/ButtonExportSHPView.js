Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ButtonExportSHPView = Backbone.View.extend({
    /* http://sheetjs.com/demos/Export2Excel.js */

    events: {
        "click #export-button-shp": "export",
    },

    initialize: function(options) {
        this.options = options || {};
    },

    render: function() {
        this.$el.append(
            $(
                '<button id="export-button-shp" type="button" class="btn btn-default btn-sm">SHP</button>'
            )
        );
    },

    export: function(evt) {
        /* Probablemente pasarle el `where` y hacer el filtrado de nuevo a
        a partir de la colección original tiene más sentido que acomplarlo a
        una vista concreta distinta */

        var exploracaos = this.options.listView.collection.sortBy(function(exp) {
            return exp.get("utente").get("nome");
        });
        exploracaos = new Backbone.SIXHIARA.ExploracaoCollection(exploracaos);

        var options = {
            folder: "exploracoes",
            types: {
                polygon: "exploracoes",
            },
        };
        var features = exploracaos.toSHP();
        var content = shpwrite.zip(features, options);
        var blob = this.dataURItoBlob("data:application/zip;base64," + content);
        saveAs(blob, options.folder + ".zip");
    },

    dataURItoBlob: function dataURItoBlob(dataURI) {
        // https://stackoverflow.com/a/12300351/930271
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataURI.split(",")[1]);

        // separate out the mime component
        var mimeString = dataURI
            .split(",")[0]
            .split(":")[1]
            .split(";")[0];

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);

        // create a view into the buffer
        var ia = new Uint8Array(ab);

        // set the bytes of the buffer to the correct values
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        var blob = new Blob([ab], {type: mimeString});
        return blob;
    },
});
