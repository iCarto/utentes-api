Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.GPSModalView = Backbone.UILib.ModalView.extend({
    render: function() {
        // connect auxiliary views
        var tiposEntidade = new Backbone.UILib.DomainCollection();
        tiposEntidade.add([
            new Backbone.UILib.Domain({alias: null, text: null, order: 0}),
            new Backbone.UILib.Domain({
                alias: "Exploracao",
                text: "Exploracao",
                order: 1,
            }),
            new Backbone.UILib.Domain({alias: "Cultura", text: "Cultura", order: 2}),
            new Backbone.UILib.Domain({
                alias: "Tanque Piscícola",
                text: "Tanque Piscícola",
                order: 3,
            }),
        ]);

        var widgetsView = new Backbone.UILib.WidgetsView({
            el: $("#gpsModalView"),
            model: this.model,
        }).render();
        this._addAuxView(widgetsView);

        var selectEntidade = new Backbone.UILib.SelectView({
            el: $("#entidade"),
            collection: tiposEntidade,
        }).render();
        this._addAuxView(selectEntidade);

        var selectIdentificador = new Backbone.UILib.SelectView({
            el: this.$("#identificador"),
            collection: [],
        });
        this._addAuxView(selectIdentificador);

        var Entidades = Backbone.Collection.extend({
            modelId: function(attrs) {
                return attrs.parent + attrs.id;
            },
        });
        var entidades = new Entidades();
        exploracaos.forEach(function(e) {
            e.set("parent", "Exploracao");
            e.set("alias", e.get("exp_id"));
            e.set("text", e.get("exp_id"));
            entidades.add(e);
        });
        cultivos.forEach(function(e) {
            e.set("parent", "Cultura");
            e.set("alias", e.get("cult_id"));
            e.set("text", e.get("cult_id"));
            entidades.add(e);
        });
        tanques.forEach(function(e) {
            e.set("parent", "Tanque Piscícola");
            e.set("alias", e.get("tanque_id"));
            e.set("text", e.get("tanque_id"));
            entidades.add(e);
        });

        var self = this;
        selectIdentificador.listenTo(this.model, "change:entidade", function(
            model,
            value,
            options
        ) {
            this.update(entidades.where({parent: self.model.get("entidade")}));
        });

        this.$(".modal").modal("show");
    },

    okButtonClicked: function() {
        var entidade = this.model.get("entidade");
        var identificador = this.model.get("identificador");

        if (entidade === "Exploracao") {
            e = exploracaos.filter({exp_id: identificador});
        } else if (entidade === "Cultura") {
            e = cultivos.filter({cult_id: identificador});
        } else {
            e = tanques.filter({tanque_id: identificador});
        }
        if (e.length != 1) {
            alert("O arquivo de código não existe");
            return;
        }

        this.saveModelToAPI(e[0], feat.geometry);

        this.$(".modal").modal("hide");
    },

    saveModelToAPI: function(model, geometry) {
        model.get("geometry").set("type", geometry.type);
        model.get("geometry").set("coordinates", geometry.coordinates);
        model.set("geometry_edited", true);
        if (!model.isValid()) {
            alert(model.validationError);
            return;
        }

        model.save(null, {
            wait: true,
            success: function(model, resp, options) {
                table.deleteSelected();
                table.clear();
            },
            error: function(xhr, textStatus, errorThrown) {
                alert(textStatus.statusText + " " + textStatus.responseText);
            },
        });
    },
});
