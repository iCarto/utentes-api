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
        this.$el.append($('<button id="export-button-shp" type="button" class="btn btn-default btn-sm pull-right">SHP</button>'));
    },

    export: function(evt){
        this.collection.downloadSHP();
    },
});
