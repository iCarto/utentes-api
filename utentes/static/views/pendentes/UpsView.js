Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.UpsView = Backbone.View.extend({
    tagName: "div",

    // optional, you can assign multiple classes to
    // this property like so: 'container homepage'
    className: "myclass",

    // Note: When declaring a View, options, el, tagName, id and className
    // may be defined as functions, if you want their values to be determined
    // at runtime.
    id: "myid", // optional
    template: _.template(`
        Ocorreu un erro. Informe ao administrador
    `),

    initialize: function(options) {
        this.options = options || {};
    },

    // Re-render the title of the todo item.
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    },
});
