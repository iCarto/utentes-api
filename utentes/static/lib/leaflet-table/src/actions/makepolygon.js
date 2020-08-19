var MakePolygon = L.Toolbar2.Action.extend({
    options: {
        toolbarIcon: {
            html: '<i class="fas fa-square"></i>',
            tooltip: "Críar polígono",
        },
    },

    initialize: function(map, geoJsonLayer, table, options) {
        this.table = table;
    },

    addHooks: function() {
        var polygon = this.table.makePolygon();
    },
});
