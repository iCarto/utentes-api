var DeleteSelected = L.ToolbarAction.extend({
    options: {
        toolbarIcon: {
            html: '<i class="fas fa-trash-alt"></i>',
            tooltip: "Borrar seleccionados",
        },
    },

    addHooks: function() {
        table.deleteSelected();
    },
});
