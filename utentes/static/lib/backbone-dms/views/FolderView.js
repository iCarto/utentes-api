Backbone.DMS = Backbone.DMS || {};
Backbone.DMS.FolderView = Backbone.View.extend({
    id: "folder-view",
    className: 'content',

    initialize: function(options){
        options || (options = {});

        this.viewPermissions = options.viewPermissions;

        this.createViews();
        this.createListeners();
    },

    createViews: function() {
        this.breadcrumbView = new Backbone.DMS.BreadcrumbView({
            model: this.model.get('path')
        });
        this.fileUploadView = new Backbone.DMS.FileUploadView({
            model: new Backbone.DMS.FileUpload({
                folder: this.model
            })
        });
        this.fileCollectionView = new Backbone.DMS.FileCollectionView({
            model: this.model.get('files')
        });
        this.folderZipDownloadView = new Backbone.DMS.FolderZipDownloadView({
            model: this.model
        });
    },

    createListeners: function() {
        this.listenTo(this.model, 'sync', this.reviewModelPermissions);
        this.listenTo(this.breadcrumbView.model, 'navigate', this.navigateListener);
        this.listenTo(this.fileCollectionView.model, 'navigate', this.navigateListener);
        this.listenTo(this.fileUploadView.model.get('uploadedFiles'), 'add', this.reloadFiles);
    },

    render: function(e){
        this.$el.empty();
        this.$el.append(this.breadcrumbView.render().el)
        this.$el.append(this.fileUploadView.render().el)
        this.$el.append(this.folderZipDownloadView.render().el)
        this.$el.append(this.fileCollectionView.render().el)
        return this;
    },

    navigateListener: function(file) {
        this.reviewModelPermissions(file);
        this.model.set(file.attributes);
        this.model.fetch();
    },

    reloadFiles: function(data) {
        this.model.fetchFiles();
    },

    reviewModelPermissions: function(model) {
        if(!model.get('permissions') && this.viewPermissions) {
            model.set('permissions', this.viewPermissions)
        }
    }

});
