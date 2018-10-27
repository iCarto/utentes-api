Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.LicenseSaveIsPrinted = Backbone.Model.extend({

    urlRoot: '/api/requerimento/',

    url: function(){
        return this.urlRoot + this.get("id") + '/printed';
    }

});
