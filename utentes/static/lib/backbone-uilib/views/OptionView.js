Backbone.UILib = Backbone.UILib || {};
Backbone.UILib.OptionView = Backbone.View.extend({

    tagName: 'option',

    initialize: function(options){
        this.options = options || {};
        if(!this.options.text) throw {message: 'no key provided'};
    },

    render: function(){
        this.$el.html(this.model.get(this.options.text));

        return this;
    }

});
