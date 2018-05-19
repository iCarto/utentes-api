Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewJuridicoNotEditable1 = Backbone.SIXHIARA.ViewJuridico1.extend({

    init: function() {
        Backbone.SIXHIARA.ViewJuridico1.prototype.init.call(this);
        this.$('input, textarea, button').prop('disabled', function() {return true;});
    },
});
