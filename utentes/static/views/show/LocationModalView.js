Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.LocationModalView = Backbone.UILib.ModalView.extend({
    customConfiguration: function() {
        var selectLocation = new Backbone.SIXHIARA.SelectLocationView({
            el: this.$("#editLocModal"),
            model: this.widgetModel,
            domains: this.options.domains,
            domainsKeys: ["provincia", "distrito", "posto"],
        }).render();
        this._addAuxView(selectLocation);

        var selectBacia = new Backbone.SIXHIARA.SelectBaciaView({
            el: this.$("#editLocModal"),
            model: this.widgetModel,
            domains: this.options.domains,
        }).render();
        this._addAuxView(selectBacia);
    },
});
