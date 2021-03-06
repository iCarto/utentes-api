Backbone.DMS = Backbone.DMS || {};
Backbone.DMS.FileUploadView = Backbone.View.extend({
    id: "fileupload-view",

    template: _.template(
        '<div id="errors"></div>' +
            '<div class="dropzone">' +
            '<label for="fileupload" class="fileupload">' +
            '<i class="fas fa-plus-square"></i><br>' +
            "<span>Arraste cá o documento/arquivo</span>" +
            "</label>" +
            '<input id="fileupload" type="file" name="file" multiple/>' +
            "</div>"
    ),

    templateError: _.template(
        '<div class="alert alert-danger">' +
            "Houve um erro co arquivo <i><%=filename%></i><br>" +
            "<ul>" +
            "<% _(errors).each(function(error) { %><li><%=error%></li><% }) %>" +
            "</ul>" +
            "</div>"
    ),

    initialize: function(options) {
        this.options = options || {};
        this.createViews();
        this.createListeners();
        _.bindAll(
            this,
            "updatePostUrl",
            "updatePendingFileUrl",
            "savePendingFiles",
            "onFileAdd",
            "onUploadProgress",
            "onUploadDone",
            "onUploadsFinished",
            "onUploadError",
            "showErrors"
        );
    },

    createListeners: function() {
        this.listenTo(this.model.get("folder"), "change", this.render);
        this.listenTo(this.model.get("folder"), "change:id", this.updatePostUrl);
    },

    createViews: function() {
        this.uploadingView = new Backbone.DMS.FileUploadingCollectionView({
            model: this.model.get("pendingFiles"),
        });
    },

    render: function() {
        this.$el.empty();
        if (
            !this.model.get("folder").get("permissions") ||
            _.contains(this.model.get("folder").get("permissions"), PERMISSION_UPLOAD)
        ) {
            this.$el.html(this.template());
            this.$el.find("#fileupload").fileupload({
                url: this.model.get("folder").url(),
                add: this.onFileAdd,
                progress: this.onUploadProgress,
                done: this.onUploadDone,
                fail: this.onUploadError,
                stop: this.onUploadsFinished,
                dropZone: this.$el.find(".fileupload"),
            });
        }
        this.$el.append(this.uploadingView.render().el);
        return this;
    },

    updatePostUrl: function() {
        var pendingFiles = this.model.get("pendingFiles");
        pendingFiles.forEach(this.updatePendingFileUrl);
    },

    updatePendingFileUrl: function(pendingFile) {
        var data = pendingFile.get("data");
        data.url = this.model.get("folder").url();
    },

    savePendingFiles: function(savePendingFilesOptions) {
        this.savePendingFilesOptions = savePendingFilesOptions || {};
        this.$el.find(".dropzone").hide();
        var pendingFiles = this.model.get("pendingFiles");
        pendingFiles.forEach(function(pendingFile) {
            var data = pendingFile.get("data");
            data.submit();
        });
    },

    onFileAdd: function(e, data) {
        var filename = data.files[0].name;
        var errors = this.validate(data);
        if (errors.length > 0) {
            this.showErrors(filename, errors);
        } else {
            var pendingFile = new Backbone.DMS.FilePending({
                filename: filename,
                data: data,
            });
            this.model.get("pendingFiles").add(pendingFile);
            if (this.model.get("uploadInmediate")) {
                data.submit();
            }
        }
    },

    onUploadProgress: function(e, data) {
        var progress = parseInt((data.loaded / data.total) * 100, 10);
        var filename = data.files[0].name;
        var pendingFile = this.model.get("pendingFiles").get(filename);
        pendingFile.set("progress", progress);
    },

    onUploadDone: function(e, data) {
        this.model.addUploadedFile(data.files[0].name);
        this.removeFileFromUploading(data);
    },

    onUploadsFinished: function() {
        if (
            this.savePendingFilesOptions &&
            this.savePendingFilesOptions.uploadFinished
        ) {
            this.savePendingFilesOptions.uploadFinished(!this.hasErrors());
        }
    },

    onUploadError: function(error, data) {
        if (data.jqXHR.responseJSON) {
            this.showErrors(data.files[0].name, [data.jqXHR.responseJSON.error]);
        } else {
            this.showErrors(data.files[0].name, [data.jqXHR.statusText]);
        }
        this.removeFileFromUploading(data);
    },

    removeFileFromUploading: function(data) {
        var filename = data.files[0].name;
        var pendingFile = this.model.get("pendingFiles").get(filename);
        this.model.get("pendingFiles").remove(pendingFile);
    },

    validate: function(data) {
        var uploadErrors = [];
        var size = data.files[0].size;
        if (size > 150 * 1024 * 1024) {
            uploadErrors.push("O tamanho do arquivo não pode exceder 150 MB");
        }
        var filename = data.files[0].name;
        var filePending = this.model.get("pendingFiles").get(filename);
        if (filePending) {
            uploadErrors.push("Já existe um arquivo com esse nome na lista");
        }
        return uploadErrors;
    },

    showErrors: function(filename, errors) {
        var error = $(
            this.templateError({
                filename: filename,
                errors: errors,
            })
        );
        this.$el.children("#errors").append(error);
        if (this.model.get("uploadInmediate")) {
            setTimeout(function() {
                error.hide("slow");
            }, 10000);
        }
    },

    hasPendingFiles: function() {
        return this.model.get("pendingFiles").length > 0;
    },

    hasErrors: function() {
        return this.$el.children("#errors").children().length > 0;
    },

    getFileUploadId: function(filename) {
        filename = filename.replace(/[^a-zA-Z0-9]/g, "_");
        return filename.replace(/ /g, "_");
    },
});
