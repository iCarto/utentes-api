Backbone.DMS = Backbone.DMS || {};
Backbone.DMS.BreadcrumbView = Backbone.View.extend({
    id: 'breadcrumb-view',

    // TODO: not working, why?
    /*events: {
        'click .navigateButton': 'navigateButtonClick'
    },*/

    template: _.template(
        '<ul id="breadcrumb" class="breadcrumb">' +
        '</ul>' +
        '<a id="parent-folder-button" class="navigateButton" href="#">Subir n&iacute;vel <i class="fa fa-arrow-up"></i></a>'
    ),

    initialize: function(options){
        options || (options = {});
        _.bindAll(this, 'navigationButtonClick')
        this.createListeners();
    },

    createListeners: function() {
        this.listenTo(this.model, 'sync', this.renderPathFolders);
    },

    render: function(){
        this.$el.empty();
        this.$el.html(this.template());
        var navigationButton = this.$el.find('.navigateButton');
        navigationButton.on('click', this.navigationButtonClick);
        return this;
    },

    renderPathFolders: function() {
        var pathFolderCollection = this.model;
        if(pathFolderCollection) {
            var container = document.createDocumentFragment();
            this.pathFolderViews = this.model.map(this.createPathFolderView);
            this.pathFolderViews.forEach(function(pathFolderView){
                container.appendChild(pathFolderView.render().el)
            });
            this.$el.find("ul").empty().append(container);
            this.$el.find('#parent-folder-button').toggle(pathFolderCollection.length > 1)
        }
    },

    createPathFolderView: function(pathFolder) {
        return new Backbone.DMS.PathFolderView({model: pathFolder});
    },

    navigationButtonClick: function() {
        if(this.model.length > 1) {
            var parentModel = this.model.at(this.model.length - 2);
            parentModel.navigateTrigger();
        }
    }

});
