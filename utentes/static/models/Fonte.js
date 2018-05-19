Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.Fonte = Backbone.Model.extend({

    defaults: {
        'id':         null,
        'tipo_agua':  null,
        'tipo_fonte': null,
        'lat_lon':    null,
        'd_dado':     null,
        'c_soli':     null,
        'c_max':      null,
        'c_real':     null,
        'sist_med':   null,
        'metodo_est': null,
        'observacio': null,
    },

    parse: function(response) {
        this.parseDate(response, 'd_dado');
        return response;
    },

    parseDate: function(response, field) {
        if (response[field]) {
            var sTokens = response[field].split('-');
            response[field] = new Date(sTokens[0], sTokens[1] - 1, sTokens[2])
        }
    },

});
