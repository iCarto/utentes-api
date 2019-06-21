Backbone.DMS = Backbone.DMS || {};
Backbone.DMS.FolderView = Backbone.View.extend({
    id: "folder-view",
    className: "content",

    initialize: function(options) {
        this.options = options || {};

        this.createViews();
        this.createListeners();
    },

    createViews: function() {
        this.breadcrumbView = new Backbone.DMS.BreadcrumbView({
            model: this.model.get("path"),
        });
        this.fileUploadView = new Backbone.DMS.FileUploadView({
            model: new Backbone.DMS.FileUpload({
                folder: this.model,
                uploadInmediate: this.options.uploadInmediate,
            }),
        });
        this.fileCollectionView = new Backbone.DMS.FileCollectionView({
            model: this.model.get("files"),
        });
        this.folderZipDownloadView = new Backbone.DMS.FolderZipDownloadView({
            model: this.model,
        });
    },

    createListeners: function() {
        this.listenTo(this.model, "sync", this.reviewModelPermissions);
        this.listenTo(this.breadcrumbView.model, "navigate", this.navigateListener);
        this.listenTo(this.fileCollectionView.model, "navigate", this.navigateListener);
        this.listenTo(
            this.fileUploadView.model.get("uploadedFiles"),
            "add",
            this.reloadFiles
        );
    },

    render: function(e) {
        this.$el.empty();
        var componentsToShow = this.getComponentsToShow();
        if (componentsToShow.includes("breadcrumb")) {
            this.$el.append(this.breadcrumbView.render().el);
        }
        if (componentsToShow.includes("upload")) {
            this.$el.append(this.fileUploadView.render().el);
        }
        if (componentsToShow.includes("zip")) {
            this.$el.append(this.folderZipDownloadView.render().el);
        }
        if (componentsToShow.includes("files")) {
            this.$el.append(this.fileCollectionView.render().el);
        }
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
        if (!model.get("permissions") && this.options.viewPermissions) {
            model.set("permissions", this.options.viewPermissions);
        }
    },

    getComponentsToShow: function() {
        return this.options.components
            ? this.options.components
            : ["breadcrumb", "upload", "zip", "files"];
    },

    hasPendingFiles: function() {
        return this.fileUploadView.hasPendingFiles();
    },

    saveFiles: function(options) {
        this.fileUploadView.savePendingFiles(options);
    },
});
