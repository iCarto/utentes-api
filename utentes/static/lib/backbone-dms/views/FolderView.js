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

        this.render();
        this.listenTo(this.model, 'change:name', this.render);
        this.listenTo(this.model, 'change:permissions', this.refreshViewsOnPermissions)
    },

    render: function(e){
        this.$el.empty();

        this.$el.append(this.breadcrumbView.render().el)

        this.$el.append(this.fileCollectionView.render().el)

        return this;
    },

    refreshViewsOnPermissions: function() {
        this.showFolderZipDownloadView();
        this.showUploadView();
    },

    showUploadView: function()  {
        if(_.contains(this.model.get('permissions'), PERMISSION_UPLOAD)) {
            this.fileUploadView = new Backbone.DMS.FileUploadView({
                model: new Backbone.DMS.FileUpload(),
                postUrl: this.model.get('fileCollection').url
            });
            this.listenTo(this.fileUploadView.model, 'change', this.fileUploadViewChange)

            this.$el.children(":first").after(this.fileUploadView.render().el)
        }
    },

    showFolderZipDownloadView: function()  {
        if(_.contains(this.model.get('permissions'), PERMISSION_DOWNLOAD)) {
            this.folderZipDownloadView = new Backbone.DMS.FolderZipDownloadView({
                model: this.model.get('fileCollection')
            });

            this.$el.children(":first").after(this.folderZipDownloadView.render().el);
        }
    },

    fileUploadViewChange: function() {
        this.model.fetchFileCollection();
    },

    navigateListener: function(file) {
        this.model.set(file.attributes);
    }

});
