Backbone.UILib = Backbone.UILib || {};
Backbone.UILib.ListView = Backbone.View.extend({

    // how to instantiate this view
    // it needs Backbone.UILib.ItemView on its scope
    //
    // var listView = new Backbone.UILib.ListView({
    //   collection: collection,
    //   el: el,
    //   subviewTemplate: subviewTemplate
    // });

    initialize: function(options){
        this.options = options || {};
        if(this.options.subviewTemplate){
            this.subviewTemplate = this.options.subviewTemplate;
        } else {
            throw {message: 'no subview template provided'};
        }

        this._subviews = [];
    },

    render: function(){
        var subviews = [];
        var content = document.createDocumentFragment();

        this.collection.forEach(function(model){
            var item = new Backbone.UILib.ItemView({
                model: model,
                template: this.subviewTemplate
            });
            content.appendChild(item.render().el);
            subviews.push(item);
        }, this);

        // Update DOM and _subviews array at once.
        // This would minimize reflows to only 1 instead of one per subview.
        this.$el.html(content);
        _.invoke(this._subviews, 'remove');
        this._subviews = subviews;

        return this;
    },

    // Free old collection to be garbage collected after subviews are removed,
    // as each one has a reference to a model in the collection.
    update: function(newCollection){
        this.collection.stopListening();
        this.collection = newCollection;
        this.render();
    },

    // Remove the container element and then clean up its managed subviews
    // as to minimize document reflows.
    remove: function(){
        Backbone.View.prototype.remove.call(this);
        _.invoke(this._subviews, 'remove');
    }

});
