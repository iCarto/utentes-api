Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.HistoricoLicencias = Backbone.Model.extend({

    urlRoot: '/api/renovacao_historico/',

    url: function(){
        return this.urlRoot + this.get('id');
    },

    parse: function(response){
        response.forEach(function(historic){
            this.parseDate(historic, 'd_soli');
            this.parseDate(historic, 'd_ultima_entrega_doc');

            this.parseDate(historic, 'd_emissao_sub_old');
            this.parseDate(historic, 'd_emissao_sub');
            this.parseDate(historic, 'd_validade_sub_old');
            this.parseDate(historic, 'd_validade_sub');

            this.parseDate(historic, 'd_emissao_sup_old');
            this.parseDate(historic, 'd_emissao_sup');
            this.parseDate(historic, 'd_validade_sup_old');
            this.parseDate(historic, 'd_validade_sup');
        }, this);
        return response;
    },

    parseDate: function(response, field) {
        if (response[field]) {
            var sTokens = response[field].split('-');
            response[field] = new Date(sTokens[0], sTokens[1] - 1, sTokens[2], 1, 1, 1);
        }
    },
});
