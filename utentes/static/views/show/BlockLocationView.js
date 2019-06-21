Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockLocationView = Backbone.View.extend({
    events: {
        "click #editBlockLocation": "renderModal",
    },

    initialize: function(options) {
        this.subViews = [];
        this.options = options;

        var exploracao = this.model;

        var locationView = new Backbone.UILib.WidgetsView({
            el: this.el,
            model: exploracao,
        });
        this.subViews.push(locationView);

        this.domainsFilled = false;
        options.domains.on("sync", this.setDomainsFilled, this);

        exploracao.on("change", this.render, this);
    },

    setDomainsFilled: function() {
        this.domainsFilled = true;
    },

    render: function() {
        _.invoke(this.subViews, "render");

        return this;
    },

    renderModal: function(event) {
        if (!this.domainsFilled) return;

        var modalView = new Backbone.UILib.ModalView({
            model: this.model,
            selectorTmpl: "#block-location-modal-tmpl",
        });

        // connect auxiliary views
        var selectLocation = new Backbone.SIXHIARA.SelectLocationView({
            el: modalView.$("#editLocModal"),
            model: modalView.draftModel,
            domains: this.options.domains,
            domainsKeys: ["provincia", "distrito", "posto"],
        }).render();
        modalView.addAuxView(selectLocation);

        var selectBacia = new Backbone.SIXHIARA.SelectBaciaView({
            el: modalView.$("#editLocModal"),
            model: modalView.draftModel,
            domains: this.options.domains,
        }).render();
        modalView.addAuxView(selectBacia);

        modalView.render();
    },

    remove: function() {
        Backbone.View.prototype.remove.call(this);
        _.invoke(this.subViews, "remove");
    },
});
