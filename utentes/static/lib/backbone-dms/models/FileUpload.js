Backbone.DMS = Backbone.DMS || {};

Backbone.DMS.FileUpload = Backbone.Model.extend({

    defaults: {
        'pendingFiles': new Backbone.Collection(),
        'uploadedFiles': new Backbone.DMS.FileCollection(),
        'folder': null,
        'uploadInmediate': true
    },

    addUploadedFile: function(file) {
        var file = new Backbone.DMS.File({
            name: file.filename,
            size: file.size,
            type: file.type,
            date: new Date()
        })
        this.get('uploadedFiles').add(file);
    }

});
