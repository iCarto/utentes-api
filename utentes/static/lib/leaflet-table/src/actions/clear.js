var Clear = L.Toolbar2.Action.extend({
    options: {
        toolbarIcon: {
            html: '<i class="fas fa-sync"></i>',
            tooltip: "Eliminar polígono",
        },
    },

    initialize: function(map, geoJsonLayer, table, options) {
        this.map = map;
        this.geoJsonLayer = geoJsonLayer;
        this.table = table;
        this._options = options;
    },

    addHooks: function() {
        this.table.clear();
    },
});
