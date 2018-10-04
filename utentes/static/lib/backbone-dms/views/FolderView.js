Backbone.DMS = Backbone.DMS || {};
Backbone.DMS.FolderView = Backbone.View.extend({
    id: "folder-view",
    className: 'content',

    initialize: function(){
        this.breadcrumbView = new Backbone.DMS.BreadcrumbView({
            model: this.model
        });

        this.fileUploadView = new Backbone.DMS.FileUploadView({
            model: new Backbone.DMS.FileUpload(),
            postUrl: this.model.get('fileCollection').url
        });
        this.listenTo(this.fileUploadView.model, 'change', this.fileUploadViewChange)

        this.fileCollectionView = new Backbone.DMS.FileCollectionView({
            model: this.model.get('fileCollection')
        });
        this.listenTo(this.fileCollectionView.model, 'navigate', this.navigateListener)

        this.folderZipDownloadView = new Backbone.DMS.FolderZipDownloadView({
            model: new Backbone.DMS.FolderZipDownload({
                url: this.model.get('fileCollection').url
            })
        });

        this.render();
        this.refreshViewsOnPermissions();

        this.listenTo(this.model, 'change:name', this.refreshUrls);
        this.listenTo(this.model, 'change:permissions', this.refreshViewsOnPermissions)
    },

    render: function(e){
        this.$el.empty();

        this.$el.append(this.breadcrumbView.render().el)

        this.$el.append(this.fileUploadView.render().el)

        this.$el.append(this.folderZipDownloadView.render().el)

        this.$el.append(this.fileCollectionView.render().el)

        return this;
    },

    refreshUrls: function(){
        this.fileUploadView.updateUrl(this.model.get('fileCollection').url);
        this.folderZipDownloadView.updateUrl(this.model.get('fileCollection').url);
    },

    refreshViewsOnPermissions: function() {
        this.showFolderZipDownloadView();
        this.showUploadView();
    },

    showUploadView: function()  {
        this.fileUploadView.showView(_.contains(this.model.get('permissions'), PERMISSION_UPLOAD))
    },

    showFolderZipDownloadView: function()  {
        this.folderZipDownloadView.showView(_.contains(this.model.get('permissions'), PERMISSION_DOWNLOAD))
    },

    fileUploadViewChange: function() {
        this.model.fetchFileCollection();
    },

    navigateListener: function(file) {
        this.model.set(file.attributes);
    }

});
