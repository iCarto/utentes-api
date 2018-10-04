Backbone.DMS = Backbone.DMS || {};
Backbone.DMS.FileCollectionView = Backbone.View.extend({
    tagName: 'table',
    id: 'file-collection-table',
    className: 'table',

    template: _.template(
        '<thead>' +
            '<th class="type"></th>' +
            '<th class="name">Nombre</th>' +
            '<th class="created_at">Data</th>' +
            '<th class="size">Tamaño</th>' +
            '<th class="actions"></th>' +
        '</thead>' +
        '<tbody>' +
        '</tbody>'
    ),

    initialize: function(options){
        options || (options = {});
        this.model.fetch();
        this.listenTo(this.model, 'sync remove', this.renderFileCollection);
        _.bindAll(this, 'renderFileCollection');
    },

    render: function() {
        this.$el.empty();
        this.$el.append(this.template());
        return this;
    },

    renderFileCollection() {
        var fileCollection = this.model;
        if(fileCollection) {
            var container = document.createDocumentFragment();
            fileCollection.each(function(file){
                if(file.get('type') == 'folder') {
                    var fileView = new Backbone.DMS.FolderSummaryView({ model: file });
                    container.appendChild(fileView.el);
                }else{
                    var fileView = new Backbone.DMS.FileSummaryView({ model: file });
                    container.appendChild(fileView.el);
                }
            });
            this.$el.find("tbody").empty();
            this.$el.find("tbody").append(container);
        }
    }
});
