var Clear = L.ToolbarAction.extend({

    options: {
        toolbarIcon: {
            html: '<i class="fa fa-refresh"></i>',
            tooltip: 'Borrar selección'
        }
    },

    addHooks: function () {
        table.clear();
    }

});
