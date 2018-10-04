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

    evaluatePermissions: function(fileCollectionData) {
        return fileCollectionData;
    },

    fetchFileCollection: function () {
        this.unset('permissions');
        this.get('fileCollection').url = this.getFileCollectionUrl();
        this.get('fileCollection').fetch({
            success: this.fetchFileCollectionSuccess.bind(this)
        });
    },

    fetchFileCollectionSuccess: function(fileCollectionData) {
        this.evaluatePermissions(fileCollectionData);
    }

});

Backbone.DMS.Folder.extend = Backbone.DMS.File.extend;
