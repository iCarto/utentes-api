Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ActividadeCultivo = Backbone.GeoJson.Feature.extend({

    defaults: {
        'id':         null,
        'cult_id': null,
        'actividade': null,
        'c_estimado': 0,
        'cultivo': null,
        'rega': null,
        'eficiencia': null,
        'area': 0,
        'observacio': null,
        'geometry': new Backbone.Model(),
    },

    initialize: function() {
        this.on('change:rega', this.updateEficiencia, this);
        this.on('change:area change:eficiencia', this.updateCEstimado, this);
    },

    validate: function(attrs, options){
        var messages = [];
        validator(ActividadeSchema['Cultivos']).validate(this.toJSON()).forEach(function(msg){
            messages.push(msg);
        });
        if (messages.length > 0) return messages;
    },

    eficienciaByRega: function() {
        var eficiencia = 0;
        switch (this.get('rega')) {
        case 'Aspersão':
            eficiencia = 0.76;
            break;
        case 'Goteo':
            eficiencia = 0.85;
            break;
        case 'Gravidade':
            eficiencia = 0.62;
            break;
        case 'Regional':
            eficiencia = null;
            break;
        }
        return eficiencia;
    },

    updateEficiencia: function() {
        var eficiencia = this.eficienciaByRega();
        this.set('eficiencia', eficiencia);
    },

    updateCEstimado: function () {
        var tipo_rega = this.get('rega');
        var area = this.get('area');
        var eficiencia = this.get('eficiencia');
        var c_estimado = null;
        if ((tipo_rega === 'Regional') && (area !== null)) {
            c_estimado = area * 10000/12;
        } else if ((tipo_rega !== 'Regional') && (area !== null) && (eficiencia !== null)) {
            c_estimado = (area*30*86400*0.21) / (1000*eficiencia);
        }
        this.set('c_estimado', c_estimado);
    },

});
