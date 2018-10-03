Backbone.DMS = Backbone.DMS || {};

Backbone.DMS.Folder = function (options) {
    this.options = options || {};

    this.defaults = _.extend({}, Backbone.DMS.File.prototype.defaults, {
        'fileCollection': null,
        'permissionUpload': true
    });

    Backbone.Model.apply(this, [options]);
};

_.extend(Backbone.DMS.Folder.prototype, Backbone.DMS.File.prototype, {

    getFileCollectionUrl: function() {
        return '';
    },

    fetchFileCollection: function () {
        this.get('fileCollection').url = this.getFileCollectionUrl();
        this.get('fileCollection').fetch();
    },

});

Backbone.DMS.Folder.extend = Backbone.DMS.File.extend;
