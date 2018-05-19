Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ActividadePecuaria = Backbone.SIXHIARA.ActividadeNull.extend({

    defaults: {
        'id':         null,
        'tipo': 'Pecuária',
        'c_estimado': null,
        'n_res_tot': null,
        'reses': new Backbone.SIXHIARA.ResCollection()
    },

    initialize: function() {
        this.get('reses').on('all', this.updateChildBasedComputations, this);
    },

    parse: function(response) {
        response.reses = new Backbone.SIXHIARA.ResCollection(response.reses, {parse: true});
        return response;
    },

    updateChildBasedComputations: function () {
        var c_estimado = this.get('reses').reduce(function(sum, res){
            return sum + res.get('c_estimado');
        }, 0);
        this.set('c_estimado', c_estimado);

        var n_res_tot = this.get('reses').reduce(function(sum, res){
            return sum + res.get('reses_nro');
        }, 0);
        this.set('n_res_tot', n_res_tot);

        this.trigger('change', this.model);
    },

    toJSON: function () {
        var json   =  _.clone(this.attributes);
        json.reses = this.get('reses').toJSON();
        return json;
    },

    validateSubActivity: function() {
        var messages = [];
        this.get('reses').forEach(function(cultivo){
            var msgs = cultivo.validate();
            if (msgs) {
                messages = messages.concat(msgs);
            }
        });
        return messages;
    },

});

// declare activity for dinamic discovery
Backbone.SIXHIARA.ActividadesFactory = Backbone.SIXHIARA.ActividadesFactory || {};
Backbone.SIXHIARA.ActividadesFactory['Pecuária'] = Backbone.SIXHIARA.ActividadePecuaria;
