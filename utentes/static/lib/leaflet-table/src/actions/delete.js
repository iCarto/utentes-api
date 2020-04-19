var DeleteSelected = L.Toolbar2.Action.extend({
    options: {
        toolbarIcon: {
            html: '<i class="fas fa-trash-alt"></i>',
            tooltip: "Eliminar selecionados",
        },
    },

    addHooks: function() {
        table.deleteSelected();
    },
});
