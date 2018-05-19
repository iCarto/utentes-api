Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.SummaryPagosView = Backbone.View.extend({

    render: function(){
        if(this.model.get('pagos') === null){
            this.$el.removeClass('label-danger label-success').addClass('label-default');
        } else if (this.model.get('pagos') === true){
            this.$el.removeClass('label-danger label-default').addClass('label-success');
        } else if (this.model.get('pagos') === false){
            this.$el.removeClass('label-success label-default').addClass('label-danger');
        }

        return this;
    }

});
