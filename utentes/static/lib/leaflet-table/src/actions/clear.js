var Clear = L.Toolbar2.Action.extend({
    options: {
        toolbarIcon: {
            html: '<i class="fas fa-sync"></i>',
            tooltip: "Eliminar polígono",
        },
    },

    addHooks: function() {
        table.clear();
    },
});
