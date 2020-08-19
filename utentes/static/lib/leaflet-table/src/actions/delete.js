var DeleteSelected = L.Toolbar2.Action.extend({
    options: {
        toolbarIcon: {
            html: '<i class="fas fa-trash-alt"></i>',
            tooltip: "Eliminar selecionados",
        },
    },

    initialize: function(map, geoJsonLayer, table, options) {
        this.table = table;
    },

    addHooks: function() {
        this.table.deleteSelected();
    },
});
