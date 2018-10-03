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
        this.set('fileCollection', new Backbone.DMS.FileCollection());
        this.set('path', [options.utente, options.exploracao, options.departamento])
        this.fetchFileCollection();
        this.listenTo(this, 'change:name', this.modelUpdatedListener);
    },

    modelUpdatedListener: function() {
        this.updateDepartamento();
        this.updatePath();
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

    evaluatePermissions: function(fileCollectionData) {
        var filePermissions = [PERMISSION_DOWNLOAD];
        var folderPermissions = [];
        var role = wf.getRole();
        if(role === this.get('departamento')) {
            filePermissions = [PERMISSION_DOWNLOAD, PERMISSION_DELETE];
            folderPermissions = [PERMISSION_UPLOAD]
        }
        _.each(fileCollectionData.models, function(file){
            file.set('permissions', filePermissions)
        });
        this.set('permissions', folderPermissions);
        return fileCollectionData;
    },

    fetchExploracaoRoot: function() {
        this.set('name', '/');
    },

});
