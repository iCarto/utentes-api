var MoveToTop = L.Toolbar2.Action.extend({
    options: {
        toolbarIcon: {
            html: '<i class="fas fa-arrow-up"></i>',
            tooltip: "Mover acima",
        },
    },

    addHooks: function() {
        table.moveToTop();
    },
});
