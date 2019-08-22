Backbone.UILib = Backbone.UILib || {};
Backbone.UILib.SelectViewWrapper = Backbone.View.extend({
    initialize: function(options) {
        this.options = options || {};
        this.selectViews = {};

        if (this.options.domains && this.options.domains.length) {
            this.createSelects();
        }
    },

    createSelects: function() {
        this.el.querySelectorAll("select.widget").forEach(widget => {
            const category = this.options.domainMap[widget.id];
            var domains;
            if (category instanceof Backbone.UILib.DomainCollection) {
                domains = category;
            } else {
                domains = this.options.domains.byCategory(category);
            }
            if (domains.length) {
                const select = this.selectViews[widget.id];
                if (select) {
                    select.update(domains);
                } else {
                    this.selectViews[widget.id] = new Backbone.UILib.SelectView({
                        el: widget,
                        collection: domains,
                    }).render();
                }
            }
        });
    },

    remove: function() {
        Object.keys(this.selectViews).forEach(id => {
            this.selectViews[id].remove();
        });
        Backbone.View.prototype.remove.call(this);
    },
});
