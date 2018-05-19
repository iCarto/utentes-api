Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.CEstimadoComputedView = Backbone.View.extend({

    initialize: function (options) {
        this.options = options || {};
    },

    render: function(){
        var areaExp = this.options.areaExp;
        var value = formatter().formatNumber(areaExp*0.25*86400*30/1000) || '';
        this.$el.val(value);

        return this;
    }

});
