Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockFontesView = Backbone.View.extend({
    initialize: function(options) {
        this.subViews = [];

        var tableFontesView = new Backbone.SIXHIARA.TableView({
            el: this.el,
            collection: this.collection,
            domains: options.domains,
            rowViewModel: Backbone.SIXHIARA.FonteTableRowShowView,
            noDataText: "NON HAI FONTES",
        });
        tableFontesView.listenTo(this.collection, "update", function(
            collection,
            options
        ) {
            this.update(collection);
        });
        this.subViews.push(tableFontesView);
    },

    render: function() {
        _.invoke(this.subViews, "render");

        return this;
    },

    remove: function() {
        Backbone.View.prototype.remove.call(this);
        _.invoke(this.subViews, "remove");
    },
});
