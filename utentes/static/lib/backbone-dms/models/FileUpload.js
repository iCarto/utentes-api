Backbone.DMS = Backbone.DMS || {};

Backbone.DMS.FileUpload = Backbone.Model.extend({

    defaults: {
        'uploadedFiles': new Backbone.DMS.FileCollection(),
    },

    addUploadedFile: function(filename) {
        var file = new Backbone.DMS.File({
            name: filename
        })
        this.get('uploadedFiles').add(file);
        this.trigger('change')
    }

});