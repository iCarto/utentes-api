var ZoomSelected = L.Toolbar2.Action.extend({
    options: {
        toolbarIcon: {
            html: '<i class="fas fa-search-location"></i>',
            tooltip: "Zoom à selecçao",
        },
    },

    initialize: function(map, geoJsonLayer, table, options) {
        this.map = map;
        this.geoJsonLayer = geoJsonLayer;
        this.table = table;
        this._options = options;
    },

    addHooks: function() {
        this.table.zoomSelected();
    },
});
