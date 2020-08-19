var SaveToAPI = L.Toolbar2.Action.extend({
    options: {
        toolbarIcon: {
            html: '<i class="fas fa-save"></i>',
            tooltip: "Gravar",
        },
    },

    initialize: function(map, geoJsonLayer, table, options) {
        this.table = table;
    },

    addHooks: function() {
        var polygonLayer = this.table.polygonLayer.toGeoJSON();
        // TODO. Probably save button should be desactivated if the validations
        // not pass
        if (!polygonLayer || polygonLayer.features.length != 1) {
            bootbox.alert({message: "Primeiro, você deve gerar um polígono"});
            return;
        }
        var feat = polygonLayer.features[0];
        var code = feat.properties.name;
        if (_.isEmpty(code)) {
            bootbox.alert("O polígono deve ter um nome válido");
            return;
        }

        var model = new Backbone.Model({entidade: null, identificador: null});

        var modalView = new Backbone.SIXHIARA.GPSModalView({
            model: model,
            modalSelectorTpl: "#modal-gps-tmpl",
        });
        modalView.render();
    },
});
