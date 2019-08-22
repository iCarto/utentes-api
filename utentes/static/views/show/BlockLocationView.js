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
        new Backbone.SIXHIARA.LocationModalView({
            modalSelectorTpl: "#block-location-modal-tmpl",
            model: this.model,
            domains: this.options.domains,
        }).render();
    },

    remove: function() {
        Backbone.View.prototype.remove.call(this);
        _.invoke(this.subViews, "remove");
    },
});
