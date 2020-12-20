Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.SelectBaciaView = Backbone.UILib.BaseView.extend({
    initialize: function(options) {
        Backbone.UILib.BaseView.prototype.initialize.call(this);

        var domains = options.domains;
        var unidade = domains.byCategory("unidade");
        var bacias = domains.byCategory("bacia");
        var subacias = domains.byCategory("subacia");

        var selectUnidade = new Backbone.UILib.SelectView({
            el: this.$("#loc_unidad"),
            collection: unidade,
        });
        this.addView(selectUnidade);

        var selectBacias = new Backbone.UILib.SelectView({
            el: this.$("#loc_bacia"),
            collection: bacias.byParent(this.model.get("loc_unidad")),
        });
        selectBacias.listenTo(this.model, "change:loc_unidad", function(model) {
            this.update(bacias.where({parent: model.get("loc_unidad")}));
        });
        this.addView(selectBacias);

        var selectSubacias = new Backbone.UILib.SelectView({
            el: this.$("#loc_subaci"),
            collection: subacias.byParent(this.model.get("loc_bacia")),
        });
        selectSubacias.listenTo(this.model, "change:loc_bacia", function(model) {
            this.update(subacias.where({parent: model.get("loc_bacia")}));
        });
        this.addView(selectSubacias);
    },
});
