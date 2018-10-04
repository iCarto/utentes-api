Backbone.DMS = Backbone.DMS || {};
Backbone.DMS.FolderZipDownloadView = Backbone.View.extend({

    template: _.template(
        '<div id="zip-download"><a href="#">Descarregar todos os arquivos <i class="fa fa-file-zip-o"></i></div>'
    ),

    initialize: function(options){
        options || (options = {});
        this.listenTo(this.model, 'change', this.render)
    },

    render: function(){
        this.$el.empty();
        this.$el.html(this.template());
        this.$el.find('#zip-download a').attr("href", this.model.get('url') + '/zip');
        return this;
    },

    updateUrl: function(url) {
        this.model.set('url', url);
    },

    showView: function(show) {
        if(show) {
            this.render();
        }else{
            this.$el.empty();
        }
    }

});
