var AddCoordinates = L.Toolbar2.Action.extend({
    options: {
        toolbarIcon: {
            html:
                '<i class="fas add-coordinates-icon" style="content: url(static/img/add_coordinates_icon.svg)"></i>',
            tooltip: "Adicionar coordenadas",
        },
    },

    initialize: function(map, geoJsonLayer, table, options) {
        this.map = map;
        this.geoJsonLayer = geoJsonLayer;
    },

    addHooks: function() {
        var domains = new Backbone.UILib.DomainCollection([
            {category: "crs", text: "WGS84", alias: "4326"},
            {category: "crs", text: "UTM 36S", alias: "32736"},
            {category: "crs", text: "UTM 37S", alias: "32737"},
        ]);

        var modalView = new Backbone.SIXHIARA.AddCoordinatesModalView({
            model: new Backbone.Model(),
            map: this.map,
            domains: domains,
            geoJsonLayer: this.geoJsonLayer,
            modalSelectorTpl: "#modal-gps-add-coordinates-tmpl",
        }).render();
    },
});
