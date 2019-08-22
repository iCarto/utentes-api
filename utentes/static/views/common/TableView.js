Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.TableView = Backbone.View.extend({
    initialize: function(options) {
        this.options = options || {};
        this.options.noDataText = options.noDataText || "NON HAI ELEMENTOS";
        this.options.rowViewModel = options.rowViewModel || Backbone.SIXHIARA.RowView;
        this._subviews = [];
    },

    render: function() {
        var subviews = [];
        var content = document.createDocumentFragment();
        self = this;
        this.collection.forEach(function(model) {
            var rowView = new self.options.rowViewModel({
                modalSelectorTpl: this.options.modalSelectorTpl,
                model: model,
                rowTemplate: this.options.rowTemplate,
                domains: this.options.domains,
                deleteFromServer: this.options.deleteFromServer,
            });
            content.appendChild(rowView.render().el);
            subviews.push(rowView);
        }, this);

        // Update DOM and _subviews array at once.
        // This would minimize reflows to only 1 instead of one per subview.
        if (this.collection.length === 0) {
            this.$("tbody").html(
                `<tr><td colspan="100%" class="TableView-nodata text-center">${this.options.noDataText}</td></tr>`
            );
        } else {
            this.$("tbody").html(content);
        }
        _.invoke(this._subviews, "remove");
        this._subviews = subviews;

        return this;
    },

    // Free old collection to be garbage collected after subviews are removed,
    // as each one has a reference to a model in the collection.
    update: function(newCollection) {
        this.collection = newCollection;
        this.render();
    },

    // Remove the container element and then clean up its managed subviews
    // as to minimize document reflows.
    remove: function() {
        _.invoke(this._subviews, "off");
        _.invoke(this._subviews, "remove");
        Backbone.View.prototype.remove.call(this);
    },
});
