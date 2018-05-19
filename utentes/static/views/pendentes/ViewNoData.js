Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewNoData = Backbone.View.extend({
    tagName:  'div',

    // optional, you can assign multiple classes to
    // this property like so: 'container homepage'
    className: 'myclass',

    // Note: When declaring a View, options, el, tagName, id and className
    // may be defined as functions, if you want their values to be determined
    // at runtime.
    id: 'myid', // optional

    template: _.template(`
        <h2>Non hai datos que mostrar<h2>
    `),

    initialize: function (options) {
        this.options = options || {};
    },

    render: function() {
        var json = this.model ? this.model.toJSON() : {};
        this.$el.html(this.template(json));
        return this;
    },

    init: function() {
    },
});
