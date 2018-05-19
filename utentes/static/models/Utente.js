Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.Utente = Backbone.Model.extend({

    defaults: {
        'id':             null,
        'nome':           null,
        'uten_tipo':      null,
        'nuit':           null,
        'uten_gere':      null,
        'uten_memb':      null,
        'uten_mulh':      null,
        'contacto':       null,
        'email':          null,
        'telefone':       null,
        'loc_provin':     null,
        'loc_distri':     null,
        'loc_posto':      null,
        'loc_nucleo':     null,
        'reg_comerc':     null,
        'reg_zona':       null,
        'observacio':     null,
    },

    validate: function(attrs, options){
        var messages = [];
        validator(UTENTE_SCHEMA).validate(this.attributes).forEach(function(msg){
            messages.push(msg);
        });
        if (messages.length > 0) return messages;
    },

});
