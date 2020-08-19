var EndEdition = L.Toolbar2.Action.extend({
    options: {
        toolbarIcon: {
            html: '<i class="fas fa-save"></i>',
            tooltip: "Gravar",
        },
    },

    initialize: function(map, geoJsonLayer, table, options) {
        this.map = map;
        this.geoJsonLayer = geoJsonLayer;
        this.table = table;
        this._options = options;
    },

    addHooks: function() {
        window.vent.trigger("sirha:editionmap:stopedition");
    },
});
