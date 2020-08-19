var MoveToTop = L.Toolbar2.Action.extend({
    options: {
        toolbarIcon: {
            html: '<i class="fas fa-arrow-up"></i>',
            tooltip: "Mover acima",
        },
    },

    initialize: function(map, geoJsonLayer, table, options) {
        this.table = table;
    },

    addHooks: function() {
        this.table.moveToTop();
    },
});
