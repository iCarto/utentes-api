Backbone.DMS = Backbone.DMS || {};
Backbone.DMS.FolderZipDownloadView = Backbone.View.extend({

    template: _.template(
        '<div id="zip-download"><a href="<%=downloadZipUrl%>">Descarregar todos os arquivos <i class="fa fa-file-zip-o"></i></div>'
    ),

    initialize: function(options){
        options || (options = {});
        this.createListeners();
    },

    createListeners: function(){
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model.get('files'), 'sync remove', this.showIfHasFiles);
    },

    render: function(){
        this.$el.empty();
        this.$el.html(this.template({
            downloadZipUrl: this.model.url() + '/zip'
        }));
        return this;
    },

    hasPermissions: function() {
        return !this.model.get('permissions') || _.contains(this.model.get('permissions'), PERMISSION_DOWNLOAD);
    },

    showIfHasFiles: function() {
        this.$el.toggle(this.model.get('files').length > 0 && this.hasPermissions());
    },

});
