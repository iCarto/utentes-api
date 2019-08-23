var Clear = L.ToolbarAction.extend({
    options: {
        toolbarIcon: {
            html: '<i class="fas fa-sync"></i>',
            tooltip: "Borrar selección",
        },
    },

    addHooks: function() {
        table.clear();
    },
});
