Backbone.DMS = Backbone.DMS || {};
Backbone.DMS.FolderZipDownloadView = Backbone.View.extend({

    template: _.template(
        '<div id="zip-download"><a href="#">Descarregar todos os arquivos <i class="fa fa-file-zip-o"></i></div>'
    ),

    initialize: function(options){
        options || (options = {});
        this.downloadZIPUrl = this.model.url + '/zip';
    },

    render: function(){
        this.$el.empty();
        this.$el.html(this.template());
        this.$el.find('#zip-download a').attr("href", this.downloadZIPUrl);
        return this;
    },

});
