Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewNoData = Backbone.View.extend({
    tagName: "div",

    className: "myclass",

    id: "myid",

    template: _.template(`
        <h2>Não há dados que mostrar<h2>
    `),

    initialize: function(options) {
        this.options = options || {};
    },

    render: function() {
        var json = this.model ? this.model.toJSON() : {};
        this.$el.html(this.template(json));
        return this;
    },

    init: function() {},
});
