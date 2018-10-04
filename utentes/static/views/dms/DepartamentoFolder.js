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
        this.set('path', [options.utente, options.exploracao, options.departamento])
        this.listenTo(this, 'change:name', this.modelUpdatedListener);

        this.setCurrentFolderPermissions();

    },

    modelUpdatedListener: function() {
        this.updateDepartamento();
        this.updatePath();
        this.setCurrentFolderPermissions();
        this.fetchFileCollection();
    },

    updateDepartamento: function() {
        if(this.get('name') != '/') {
            this.set('departamento', this.get('name'));
        }else{
            this.unset('departamento');
        }
    },

    updatePath: function() {
        var path = this.get('path');
        if(this.has('departamento')) {
            path = [this.get('utente'), this.get('exploracao'), this.get('departamento')];
        }else{
            path = [this.get('utente'), this.get('exploracao')];
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

    fetchExploracaoRoot: function() {
        this.set('name', '/');
    },

});
