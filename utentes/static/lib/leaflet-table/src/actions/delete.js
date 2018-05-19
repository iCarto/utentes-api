var DeleteSelected = L.ToolbarAction.extend({

    options: {
        toolbarIcon: {
            html: '<i class="fa fa-trash-o"></i>',
            tooltip: 'Borrar seleccionados'
        }
    },

    addHooks: function () {
        table.deleteSelected();
    }

});
