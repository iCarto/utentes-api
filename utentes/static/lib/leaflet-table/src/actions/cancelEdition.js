window.CancelEdition = L.Toolbar2.Action.extend({
    options: {
        toolbarIcon: {
            html: '<i class="fas fa-window-close"></i>',
            tooltip: "Cancelar edição",
        },
    },

    initialize: function(map, options) {
        this.map = map;
        this._options = options;
    },

    addHooks: function() {
        window.vent.trigger("sirha:editionmap:canceledition");
    },
});
