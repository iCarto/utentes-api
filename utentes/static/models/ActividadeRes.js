Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ActividadeRes = Backbone.Model.extend({

    defaults: {
        'id':         null,
        'actividade': null,
        'c_estimado': null,
        'reses_tipo': null,
        'reses_nro': null,
        'c_res': null,
        'observacio': null,
    },

    initialize: function() {
        this.on('change:reses_tipo', this.updateCRes, this);
        this.on('change:reses_nro change:c_res', this.updateCEstimado, this);
    },

    validate: function(attrs, options){
        var messages = [];
        validator(ActividadeSchema['Reses']).validate(this.toJSON()).forEach(function(msg){
            messages.push(msg);
        });
        if (messages.length > 0) return messages;
    },

    updateCRes: function() {
        var c_res = 0;
        switch (this.get('reses_tipo')) {
        case 'Avícola (Aves)':
            c_res = 0.3;
            break;
        case 'Caprino (Cabras)':
            c_res = 5;
            break;
        case 'Equino (Cavalos)':
            c_res = 25;
            break;
        case 'Ovino (Ovelhas)':
            c_res = 5;
            break;
        case 'Porcino (Porcos)':
            c_res = 15;
            break;
        case 'Vacuno (Vacas)':
            c_res = 65;
            break;
        }
        this.set('c_res', c_res);
    },

    updateCEstimado: function () {
        var c_estimado = null;
        var reses_nro = this.get('reses_nro');
        var c_res = this.get('c_res');
        var notnull = _.every([reses_nro, c_res], function(v) {
            return (v !== null) && (v !== undefined);
        });
        if (notnull) {
            c_estimado = reses_nro * c_res * 0.03;
        }

        this.set('c_estimado', c_estimado);
    },

});
