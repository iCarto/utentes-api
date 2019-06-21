Backbone.UILib = Backbone.UILib || {};
Backbone.UILib.DomainCollection = Backbone.Collection.extend({
    model: Backbone.UILib.Domain,

    comparator: "order",

    byCategory: function(value) {
        return new Backbone.UILib.DomainCollection(this.where({category: value}));
    },

    byParent: function(value) {
        return new Backbone.UILib.DomainCollection(this.where({parent: value}));
    },
});
