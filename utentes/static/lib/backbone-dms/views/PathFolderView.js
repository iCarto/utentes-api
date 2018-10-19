Backbone.DMS = Backbone.DMS || {};
Backbone.DMS.PathFolderView = Backbone.View.extend({
    tagName: 'li',

    // TODO: not working, why?
    /*events: {
        'click .navigateButton': 'navigateButtonClick'
    },*/

    template: _.template(
        '<a href="#" class="navigateButton"><%=name%></a>'
    ),

    initialize: function(){
        _.bindAll(this, 'navigationButtonClick');
    },

    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        var navigationButton = this.$el.find('.navigateButton');
        navigationButton.on('click', this.navigationButtonClick);
        return this;
    },

    navigationButtonClick: function() {
        this.model.navigateTrigger();
    },

});
