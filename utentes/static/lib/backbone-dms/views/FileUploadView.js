Backbone.DMS = Backbone.DMS || {};
Backbone.DMS.FileUploadView = Backbone.View.extend({
    id: 'fileupload-view',

    template: _.template(
        '<div id="errors"></div>' +
        '<div class="dropzone">' +
            '<label for="fileupload" class="fileupload">' +
                '<i class="fa fa-plus-square"></i><br>' +
                '<span>Arraste cá o documento/arquivo</span>' +
            '</label>' +
            '<input id="fileupload" type="file" name="file" multiple/>' +
        '</div>' +
        '<div class="uploading"></div>'
    ),

    templateUploading: _.template(
        '<div id="<%=id%>" class="file-uploading">' +
            '<span><%=filename%></span>' +
            '<div class="bar" style="width: 0%;"></div>' +
        '</div>'
    ),

    templateError: _.template(
        '<div class="alert alert-danger">' +
            'Houve um erro ao enviar o arquivo <i><%=filename%></i><br>' +
            '<ul>' +
                '<% _(errors).each(function(error) { %><li><%=error%></li><% }) %>' +
            '</ul>' +
        '</div>'
    ),

    initialize: function(options){
        options || (options = {});
        _.bindAll(this, 'onUploadStart', 'onUploadProgress', 'onUploadDone', 'onUploadError', 'showErrors');
    },

    render: function(){
        this.$el.empty();
        this.$el.html(this.template());
        this.$el.find('#fileupload').fileupload({
            url: this.model.get('url'),
            add: this.onUploadStart,
            progress: this.onUploadProgress,
            done: this.onUploadDone,
            error: this.onUploadError,
            dropZone: this.$el.find('.fileupload')
        });
        return this;
    },

    updateUrl: function(url) {
        this.model.set('url', url);
    },

    showView: function(show) {
        if(show) {
            this.render();
        }else{
            this.$el.empty();
        }
    },

    onUploadStart: function(e, data) {
        var filename = data.files[0].name;
        var errors = this.validate(data)
        if(errors.length > 0) {
            this.showErrors(filename, errors)
        }else{
            var id = this.getFileUploadId(data.files[0].name);
            this.$el.children('.uploading').append(this.templateUploading({
                id,
                filename
            }));
            data.submit();
        }
    },

    onUploadProgress: function(e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        var id = this.getFileUploadId(data.files[0].name);
        $('#' + id + '.file-uploading .bar').css('width', progress + '%');
    },

    onUploadDone: function(e, data) {
        var id = this.getFileUploadId(data.files[0].name);
        this.$el.find('#' + id + '.file-uploading').remove();
    },

    onUploadError: function(error) {
        var errorResponse = error.responseJSON;
        this.showErrors(errorResponse.name, [errorResponse.error])
        var id = this.getFileUploadId(errorResponse.name);
        this.$el.find('#' + id + '.file-uploading').remove();
    },

    validate: function(data) {
        var uploadErrors = [];
        var size = data.files[0].size;
        if(size > (150*1024*1024)) {
            uploadErrors.push('O tamanho do arquivo não pode exceder 150 MB');
        }
        return uploadErrors;
    },

    showErrors: function(filename, errors) {
        var error = $(this.templateError(
            {
                filename: filename,
                errors: errors
            }
        ));
        this.$el.children('#errors').append(error);
        setTimeout(function(){
            error.hide('slow');
        }, 10000);
    },

    getFileUploadId: function(filename) {
        this.model.addUploadedFile(filename);
        filename = filename.replace(/\./g,'_');
        return filename.replace(/ /g,'_');
    }

});
