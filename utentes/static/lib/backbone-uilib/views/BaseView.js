Backbone.UILib = Backbone.UILib || {};
Backbone.UILib.BaseView = Backbone.View.extend({

    initialize: function(options){
        this.options = options || {};
        this._subviews = [];
    },

    addView: function(v){
        this._subviews.push(v);

        return v;
    },

    render: function(){
        this._subviews.forEach(function(v){
            v.render();
        });

        return this;
    },

    // Remove the container element,
    // and then clean up its managed subviews
    remove: function(){
        Backbone.View.prototype.remove.call(this);
        _.invoke(this._subviews, 'remove');
    }

});
