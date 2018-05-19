var MoveToTop = L.ToolbarAction.extend({

    options: {
        toolbarIcon: {
            html: '<i class="fa fa-arrow-up"></i>',
            tooltip: 'Mover arriba'
        }
    },

    addHooks: function () {
        table.moveToTop();
    }

});
