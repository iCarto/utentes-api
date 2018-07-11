Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.Licencia = Backbone.Model.extend({

    defaults: {
        'id':         null,
        'lic_nro':    null,
        'tipo_agua':   null,
        'tipo_lic':   null,
        'cadastro':   null,
        'n_licen_a':  null,
        'estado':     null,
        'd_emissao':  null,
        'd_validade': null,
        'c_soli_tot': null,
        'c_soli_int': null,
        'c_soli_fon': null,
        'c_licencia': null,
        'c_real_tot': null,
        'c_real_int': null,
        'c_real_fon': null,
        'taxa_fixa': null,
        'taxa_uso': null,
        'pago_mes': null,
        'iva': null,
        'pago_iva': null,
        'consumo_tipo': null,
        'consumo_fact': null,
    },

    initialize: function(){
        this.on('change:c_soli_int change:c_soli_fon', function(model, value, options){
            // TODO: set c_soli_tot, taking into account null values
            this.set('c_soli_tot', this.getSoliTot());
        }, this);
        this.on('change:c_real_int change:c_real_fon', function(model, value, options){
            // TODO: set c_real_tot, taking into account null values
            this.set('c_real_tot', this.getRealTot());
        }, this);


        if (this.get('taxa_uso') === null
        && this.get('tipo_agua') === 'Subterrânea') {
            this.set('taxa_uso', 0.6);
        }

        if (this.get('iva') === null) {
            this.set('iva', 12.75);
        }

        this.on('change:taxa_fixa change:taxa_uso change:consumo_fact', this.updatePagoMes, this);
        this.on('change:pago_mes change:iva', this.updatePagoIva, this);
    },

    parse: function(response) {
        this.parseDate(response, 'd_emissao');
        this.parseDate(response, 'd_validade');
        return response;
    },

    parseDate: function(response, field) {
        if (response[field]) {
            var sTokens = response[field].split('-');
            response[field] = new Date(sTokens[0], sTokens[1] - 1, sTokens[2])
        }
    },

    getSoliTot: function(){
        return this.get('c_soli_int') + this.get('c_soli_fon');
    },

    getRealTot: function(){
        return this.get('c_real_int') + this.get('c_real_fon');
    },

    updatePagoMes: function() {
        var pago_mes = this.get('taxa_fixa') + (this.get('taxa_uso') * this.get('consumo_fact'));
        this.set('pago_mes', pago_mes);
    },

    updatePagoIva: function() {
        var pago_iva = this.get('pago_mes') * (1 + this.get('iva') / 100);
        this.set('pago_iva', pago_iva);
    },

    impliesValidateActivity: function() {
        var E = Backbone.SIXHIARA.Estado;
        return ! [
            E.UNKNOWN,
            E.IRREGULAR,
            E.NOT_APPROVED,
            E.INCOMPLETE_DA,
            E.INCOMPLETE_DIR,
            E.INCOMPLETE_DJ,
            E.INCOMPLETE_DT,
            E.INCOMPLETE_DF,
            E.PENDING_REVIEW_DIR,
            E.PENDING_REVIEW_DJ,
            E.PENDING_FIELD_VISIT,
        ].includes(this.get('estado'));
    },

    isLicensed: function() {
        return this.get('estado') === 'Licenciada';
    },

});
