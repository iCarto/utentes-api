Backbone.DMS = Backbone.DMS || {};

Backbone.DMS.Folder = function (options) {
    this.options = options || {};

    this.defaults = _.extend({}, Backbone.DMS.File.prototype.defaults, {
        'path': new Backbone.DMS.FolderCollection(),
        'files': new Backbone.DMS.FileCollection()
    });

    this.listenTo(this,'sync', this.fetchFullFolder)

    Backbone.Model.apply(this, [options]);

};

_.extend(Backbone.DMS.Folder.prototype, Backbone.DMS.File.prototype, {

    parse: function(folderResponse) {
        this.get('files').url = folderResponse['files'];
        this.get('path').url = folderResponse['path'];
        return {
            'id': folderResponse['id'],
            'name': folderResponse['name'],
            'type': folderResponse['type'],
            'size': folderResponse['size'],
            'url': folderResponse['url'],
            'date': new Date(folderResponse['date']),
            'permissions': folderResponse['permissions']
        }
    },

    fetchFullFolder: function() {
        this.fetchFiles();
        this.fetchPath();
    },

    fetchFiles: function () {
        this.get('files').fetch({
            success: this.fetchFilesSuccess.bind(this)
        });
    },

    fetchPath() {
        this.get('path').fetch();
    },

    fetchFilesSuccess: function(fileCollectionData) {
        if(this.get('files')) {
            this.reviewFilePermissions(this.get('files').models)
        }
    },

    reviewFilePermissions: function(files) {
        var folderPermissions = this.get('permissions');
        _.each(files, function(file){
            var filePermissions = folderPermissions;
            if(file.get('permissions')) {
                filePermissions = file.get('permissions')
            }
            file.set('permissions', filePermissions)
        });
    }

});

Backbone.DMS.Folder.extend = Backbone.DMS.File.extend;
