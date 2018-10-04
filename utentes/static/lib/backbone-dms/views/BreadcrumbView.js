Backbone.DMS = Backbone.DMS || {};
Backbone.DMS.BreadcrumbView = Backbone.View.extend({
    id: 'breadcrumb-view',

    template: _.template(
        '<ul id="breadcrumb" class="breadcrumb">' +
            '<% _(path).each(function(pathEntry) { %><li><a href="<%=pathEntry.folder%>" class="navigation-button"><%=pathEntry.name%></a></li><% }) %>' +
        '</ul>' +
        '<a id="back-button" href="#"><i class="fa fa-arrow-up"></i> Subir nivel</a>'
    ),

    initialize: function(options){
        options || (options = {});
        this.listenTo(this.model, 'change:path', this.render);
        _.bindAll(this, 'navigationButtonClick', 'backToRoot');
    },

    render: function(){
        this.$el.empty();
        this.$el.html(this.template(this.model.toJSON()));
        var name = this.model.get('name');
        var backButton = this.$el.find('#back-button');
        backButton.toggle(name != '/');
        backButton.on('click', this.backToRoot);

        var navigationButton = this.$el.find('.navigation-button');
        navigationButton.on('click', this.navigationButtonClick);

        return this;
    },

    navigationButtonClick: function(event) {
        var name = $(event.target).attr('href');
        this.model.set('name', name);
        event.preventDefault();
    },

    backToRoot: function() {
        this.model.set('name', '/');
    }

});
