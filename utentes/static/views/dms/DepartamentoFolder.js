Backbone.DMS = Backbone.DMS || {};
Backbone.DMS.DepartamentoFolder = Backbone.DMS.Folder.extend({

    defaults: function() {
        // to merge with superclass defaults
        return _.extend({}, Backbone.DMS.File.prototype.defaults, {
            'fileCollection': null,
            'utente': '',
            'exploracao_id': '',
            'exploracao': '',
            'departamento': ''
        });
    },

    initialize: function(options) {
        options || (options = {});
        this.set('exploracao_id', options.exploracao_id);
        this.set('exploracao', options.exploracao);
        this.set('departamento', options.departamento);
        this.set('name', options.departamento);
        var fileCollection = new Backbone.DMS.FileCollection();
        fileCollection.url = this.getFileCollectionUrl();
        this.set('fileCollection', fileCollection);

        this.setCurrentFolderPermissions();
        this.updatePath();
    },

    modelUpdated: function() {
        this.updateDepartamento();
        this.updatePath();
        this.setCurrentFolderPermissions();
    },

    updateDepartamento: function() {
        if(this.get('name') != '/') {
            this.set('departamento', this.get('name'));
        }else{
            this.unset('departamento');
        }
    },

    // We should define a Path model object and work with it
    // in BreadcrumbView
    updatePath: function() {
        var path = this.get('path');
        if(this.has('departamento')) {
            path = [
                {
                    name: this.get('exploracao'),
                    folder: '/'
                },
                {
                    name: this.get('departamento'),
                    folder: this.get('departamento')
                }
            ];
        }else{
            path = [
                {
                    name: this.get('exploracao'),
                    folder: '/'
                }
            ];
        }
        this.set('path', path);
    },

    getFileCollectionUrl: function() {
        if(this.has('departamento')){
            return '/api/exploracaos/' + this.get('exploracao_id') + '/documentos/' + this.get('departamento');
        }else{
            return '/api/exploracaos/' + this.get('exploracao_id') + '/documentos';
        }
    },

    getFolderPermissions: function(fileCollectionData) {
        var folderPermissions = [PERMISSION_DOWNLOAD];
        var role = wf.getRole();
        if(role === this.get('departamento') || (this.get('departamento') && wf.isAdmin(role))) {
            folderPermissions.push(PERMISSION_UPLOAD);
        }
        return folderPermissions;
    },

    getFileCollectionPermissions: function() {
        var filePermissions = [PERMISSION_DOWNLOAD];
        var role = wf.getRole();
        if(role === this.get('departamento') || wf.isAdmin(role)) {
            filePermissions.push(PERMISSION_DELETE);
        }
        return filePermissions;
    },

});
