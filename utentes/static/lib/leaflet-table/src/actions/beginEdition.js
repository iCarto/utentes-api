window.BeginEdition = L.Toolbar2.Action.extend({
    options: {
        toolbarIcon: {
            html: '<i class="fas fa-draw-polygon"></i>',
            tooltip: "Iniciar edição",
        },
    },

    initialize: function(map, model, options) {
        this.map = map;
        this.model = model;
        this._options = options;
    },

    addHooks: function() {
        window.vent.trigger("sirha:editionmap:beginedition", undefined, this.model);
    },
});
