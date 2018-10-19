Backbone.DMS = Backbone.DMS || {};
Backbone.DMS.FileCollectionView = Backbone.View.extend({
    tagName: 'table',
    id: 'file-collection-table',
    className: 'table',

    template: _.template(
        '<thead>' +
            '<th class="type"></th>' +
            '<th class="name">Nome</th>' +
            '<th class="date">Data</th>' +
            '<th class="size">Tamanho</th>' +
            '<th class="actions"></th>' +
        '</thead>' +
        '<tbody>' +
        '</tbody>'
    ),

    initialize: function(options){
        options || (options = {});
        this.createListeners();
    },

    createListeners: function() {
        this.listenTo(this.model, 'sync', this.renderFileCollection);
        this.listenTo(this.model, 'remove', this.removeFile);
    },

    render: function() {
        this.$el.empty();
        this.$el.append(this.template());
        return this;
    },

    renderFileCollection() {
        if(this.model) {
            var container = document.createDocumentFragment();
            this.fileSummaryViews = this.model.map(this.createFileSummaryView);
            this.fileSummaryViews.forEach(function(fileSummaryView){
                container.appendChild(fileSummaryView.render().el)
            });
            this.$el.find("tbody").empty().append(container);
        }
    },

    createFileSummaryView: function(file) {
        if(file.get('type') == 'folder') {
            return new Backbone.DMS.FolderSummaryView({ model: file });
        }else{
            return new Backbone.DMS.FileSummaryView({ model: file });
        }
    },

    removeFile: function(file){
        var fileSummaryViewRemoved = this.fileSummaryViews.find(function(fileSummaryView){
            return fileSummaryView.model == file
        });
        fileSummaryViewRemoved.remove();
    }
});
