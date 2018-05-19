Backbone.UILib = Backbone.UILib || {};
Backbone.UILib.SelectView = Backbone.View.extend({

    initialize: function(){
        this._subviews = [];
    },

    render: function(){
        var subviews = [];
        var content = document.createDocumentFragment();

        this.collection.forEach(function(model){
            var alias = model.get('alias');
            var option = new Backbone.UILib.OptionView({
                model: model,
                text:  'text',
                attributes: alias ? {'value': model.get('alias')} : null
            });
            content.appendChild(option.render().el);
            subviews.push(option);
        }, this);

        // Update DOM and _subviews array at once.
        // This would minimize reflows to only 1 instead of one per subview.
        if(this.collection.length === 0) {
            this.$el.prop('disabled', true);
            this.$el.empty();
        } else {
            this.$el.prop('disabled', false);
            this.$el.html(content);
        }
        _.invoke(this._subviews, 'remove');
        this._subviews = subviews;

        // Trigger a change event on this component.
        // Some views, as Widgets.js, are listening to this event
        // to update the model.
        this.$el.trigger('change');

        return this;
    },

    // Free old collection to be garbage collected after subviews are removed,
    // as each one has a reference to a model in the collection.
    update: function(newCollection){
        this.collection = newCollection;
        this.render();
    },

    // Remove the container element and then clean up its managed subviews
    // as to minimize document reflows.
    remove: function(){
        Backbone.View.prototype.remove.call(this);
        _.invoke(this._subviews, 'remove');
    },

});
