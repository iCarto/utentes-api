Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewJuridicoNotEditable = Backbone.SIXHIARA.ViewJuridico1.extend({

    init: function() {
        Backbone.SIXHIARA.ViewJuridico1.prototype.init.call(this);
        this.$("bt-geometria").prop('disabled', false);
        this.$('input, textarea, button').prop('disabled', function() {return true;});
    },
});
