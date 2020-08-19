var CancelEdition = L.Toolbar2.Action.extend({
    options: {
        toolbarIcon: {
            html: '<i class="fas fa-window-close"></i>',
            tooltip: "Cancelar Edición",
        },
    },

    initialize: function(map, geoJsonLayer, table, options) {
        this.map = map;
        this.geoJsonLayer = geoJsonLayer;
        this.table = table;
        this._options = options;
    },

    addHooks: function() {
        window.vent.trigger("sirha:editionmap:canceledition");
    },
});
