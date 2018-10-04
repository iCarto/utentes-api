Backbone.DMS = Backbone.DMS || {};

Backbone.DMS.Folder = function (options) {
    this.options = options || {};

    this.defaults = _.extend({}, Backbone.DMS.File.prototype.defaults, {
        'fileCollection': null
    });

    Backbone.Model.apply(this, [options]);

};

_.extend(Backbone.DMS.Folder.prototype, Backbone.DMS.File.prototype, {

    getFileCollectionUrl: function() {
        return '';
    },

    setCurrentFolderPermissions: function() {
        this.unset('permissions');
        this.set('permissions', this.getFolderPermissions());
    },

    getFolderPermissions: function() {
        return [];
    },

    getFileCollectionPermissions: function() {
        return [];
    },

    fetchFileCollection: function () {
        this.get('fileCollection').url = this.getFileCollectionUrl();
        this.get('fileCollection').fetch({
            success: this.fetchFileCollectionSuccess.bind(this)
        });
    },

    fetchFileCollectionSuccess: function(fileCollectionData) {
        if(this.get('fileCollection')) {
            var filePermissions = this.getFileCollectionPermissions();
            _.each(this.get('fileCollection').models, function(file){
                file.set('permissions', filePermissions)
            });
        }
    }

});

Backbone.DMS.Folder.extend = Backbone.DMS.File.extend;
