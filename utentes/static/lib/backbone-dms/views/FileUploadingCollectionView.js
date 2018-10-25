Backbone.DMS = Backbone.DMS || {};
Backbone.DMS.FileUploadingCollectionView = Backbone.View.extend({

    id: 'file-uploading-collection',
    className: 'uploading',

    initialize: function(options){
        options || (options = {});
        this.createListeners();
    },

    render: function() {
        this.renderFileUploadingCollection();
        return this;
    },

    createListeners: function() {
        this.listenTo(this.model, 'add', this.renderFileUploadingCollection);
        this.listenTo(this.model, 'remove', this.removeFileUploading);
    },

    renderFileUploadingCollection() {
        if(this.model) {
            var container = document.createDocumentFragment();
            this.filesUploadingViews = this.model.map(this.createFileUploadingView);
            this.filesUploadingViews.forEach(function(fileSummaryView){
                container.appendChild(fileSummaryView.render().el)
            });
            this.$el.empty().append(container);
        }
    },

    createFileUploadingView: function(fileUploadData) {
        return new Backbone.DMS.FileUploadingView({ model: fileUploadData });
    },

    removeFileUploading: function(fileUploadData){
        var filename = fileUploadData.get('filename');
        var fileUploadingViewRemoved = this.filesUploadingViews.find(function(fileUploadingView){
            return fileUploadingView.model.id == filename
        })
        fileUploadingViewRemoved.remove();
    }
});
