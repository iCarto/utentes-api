Backbone.DMS = Backbone.DMS || {};
Backbone.DMS.FolderSummaryView = Backbone.View.extend({
    tagName: 'tr',

    events: {
        'click .navigateButton': 'navigateButtonClick'
    },

    template: _.template(
        '<td class="type"><i class="fa fa-folder"></i></td>' +
        '<td class="name"><a href="#" class="navigateButton"><%=data.name%></a></td>' +
        '<td class="date"><%=formatDate(data.date)%></td>' +
        '<td class="size">' +
            '<% if(data.size) { print(data.size + " " + (data.size == 1 ? "arquivo" : "arquivos")) }else{ print("-") }  %>' +
        '</td>' +
        '<td class="actions"><a href="#" class="navigateButton"><i class="fa fa-sitemap"></i></a></td>'
    ),

    initialize: function(){
    },

    render: function(){
        this.$el.html( this.template({
            data: this.model.toJSON(),
            formatDate: Util.formatDate
        }));
        return this;
    },

    navigateButtonClick: function() {
        this.model.navigateTrigger()
    }
});
