Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.SelectLocationView = Backbone.UILib.BaseView.extend({
    initialize: function(options) {
        Backbone.UILib.BaseView.prototype.initialize.call(this);

        var domains = options.domains;
        var provincias = domains.byCategory(options.domainsKeys[0]);
        var distritos = domains.byCategory(options.domainsKeys[1]);
        var postos = domains.byCategory(options.domainsKeys[2]);

        var selectProvincias = new Backbone.UILib.SelectView({
            el: this.$("#loc_provin"),
            collection: provincias,
        });
        this.addView(selectProvincias);

        var selectDistritos = new Backbone.UILib.SelectView({
            el: this.$("#loc_distri"),
            collection: distritos.byParent(this.model.get("loc_provin")),
        });
        selectDistritos.listenTo(this.model, "change:loc_provin", function(
            model,
            value,
            options
        ) {
            this.update(distritos.where({parent: model.get("loc_provin")}));
        });
        this.addView(selectDistritos);

        var selectPostos = new Backbone.UILib.SelectView({
            el: this.$("#loc_posto"),
            collection: postos.byParent(this.model.get("loc_distri")),
        });
        selectPostos.listenTo(this.model, "change:loc_distri", function(
            model,
            value,
            options
        ) {
            this.update(postos.where({parent: model.get("loc_distri")}));
        });
        this.addView(selectPostos);
    },

    // render - Backbone.UILib.BaseView.prototype.render.call(this)

    // remove - Backbone.UILib.BaseView.prototype.remove.call(this)
});
