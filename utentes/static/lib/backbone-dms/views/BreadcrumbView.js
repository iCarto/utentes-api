Backbone.DMS = Backbone.DMS || {};
Backbone.DMS.BreadcrumbView = Backbone.View.extend({
    id: 'breadcrumb-view',

    template: _.template(
        '<ul id="breadcrumb" class="breadcrumb">' +
            '<% _(path).each(function(dir) { %><li><%=dir%></li><% }) %>' +
        '</ul>' +
        '<a id="back-button" href="#"><i class="fa fa-arrow-left"></i> Voltar atrás</a>'
    ),

    initialize: function(options){
        options || (options = {});
        this.listenTo(this.model, 'change:path', this.render);
        _.bindAll(this, 'backToRoot');
    },

    render: function(){
        this.$el.empty();
        this.$el.html(this.template(this.model.toJSON()));
        var name = this.model.get('name');
        var backButton = this.$el.find('#back-button');
        backButton.toggle(name != '/');
        backButton.on('click', this.backToRoot);
        return this;
    },

    backToRoot: function() {
        this.model.set('name', '/');
    }

});
