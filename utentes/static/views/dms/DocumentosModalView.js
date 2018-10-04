Backbone.DMS = Backbone.DMS || {};
Backbone.DMS.DocumentosModalView = Backbone.DMS.FileModalView.extend({

    initialize: function(options) {
        this.options = options || {};
        this.openDefaultRoot = options.openDefaultRoot;
        var exploracao = options.exploracao;
        this.model = new Backbone.DMS.DepartamentoFolder({
            'exploracao_id': exploracao.get('id'),
            'exploracao': exploracao.get('exp_id'),
            'utente': exploracao.get('utente').get('nome'),
            'departamento': this.getDefaultDepartamento()
        });
    },

    getDefaultDepartamento: function() {
        if(this.openDefaultRoot){
            return null;
        }
        if(wf.isAdmin() || wf.isDirector()) {
            return null;
        }
        return wf.getRole();
    },

});
