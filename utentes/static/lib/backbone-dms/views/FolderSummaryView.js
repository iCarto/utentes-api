Backbone.DMS = Backbone.DMS || {};
Backbone.DMS.FolderSummaryView = Backbone.View.extend({
    tagName: 'tr',

    events: {
        'click .navigateButton': 'navigateButtonClick'
    },

    template: _.template(
        '<td class="type"><i class="fa fa-folder"></i></td>' +
        '<td class="name"><a href="#" class="navigateButton"><%=name%></a></td>' +
        '<td class="size"><%=size%> arquivos</td>' +
        '<td class="actions"><a href="#" class="navigateButton"><i class="fa fa-sitemap"></i></a></td>'
    ),

    initialize: function(){
        this.render();
    },

    render: function(){
        this.$el.html( this.template(this.model.toJSON()));
        return this;
    },

    navigateButtonClick: function() {
        this.model.navigateTrigger()
    }
});
