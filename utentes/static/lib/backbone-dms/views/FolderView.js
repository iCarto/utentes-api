Backbone.DMS = Backbone.DMS || {};
Backbone.DMS.FolderView = Backbone.View.extend({
    id: "folder-view",
    className: 'content',

    initialize: function(){
        this.breadcrumbView = new Backbone.DMS.BreadcrumbView({
            model: this.model
        });

        this.fileCollectionView = new Backbone.DMS.FileCollectionView({
            model: this.model.get('fileCollection')
        });
        this.listenTo(this.fileCollectionView.model, 'navigate', this.navigateListener)

        this.folderZipDownloadView = new Backbone.DMS.FolderZipDownloadView({
            model: this.model.get('fileCollection')
        });

        this.render();
        this.listenTo(this.model, 'change:name', this.render)
    },

    render: function(e){
        this.$el.empty();

        this.$el.append(this.breadcrumbView.render().el)

        this.$el.append(this.fileCollectionView.render().el)

        this.$el.append(this.folderZipDownloadView.render().el)

        if(this.model.get('permissionUpload')) {
            this.fileUploadView = new Backbone.DMS.FileUploadView({
                model: new Backbone.DMS.FileUpload(),
                postUrl: this.model.get('fileCollection').url
            });
            this.listenTo(this.fileUploadView.model, 'change', this.fileUploadViewChange)

            this.$el.append(this.fileUploadView.render().el)
        }

        return this;
    },

    fileUploadViewChange: function() {
        this.model.fetchFileCollection();
    },

    navigateListener: function(file) {
        this.model.set(file.attributes);
    }

});
