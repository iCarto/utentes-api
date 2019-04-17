Backbone.UILib = Backbone.UILib || {};
Backbone.UILib.SelectView = Backbone.View.extend({

    initialize: function(options){
        var defaultOptions = {
            /* Adds an `option` like
            {
                'category': '<category>',
                'text': null,
                'order': 0,
            }
            to the `select` when there is no one in the collection. If the
            collection is empty it does not append the empty option.
            */
            addVoidValue: true,
            /*
            Introducido después de mucho código hecho. Probablmente debería ser
            opción por defecto y refactorizar el resto del código. De modo que
            incluso en lugar de una collection se le pudiera pasar un `category`
            y se hiciera el filtro aquí dentro
            */
            cloneCollection: false,
        };
        this.options = Object.assign({}, defaultOptions, options);
        this._subviews = [];
        this._updateCollection(this.collection)
    },

    _updateCollection: function(newCollection) {
        if (this.options.cloneCollection) {
            this.collection = new Backbone.UILib.DomainCollection(newCollection.models);
        } else {
            this.collection = newCollection;
        }
    },

    render: function(){
        var subviews = [];
        var content = document.createDocumentFragment();
        if (this.collection.length === 0) {
            this._updateDOMAndNotify(content, subviews);
            return this;
        }

        if (this.isVoidNeed()) {
            var emptyModel = new  Backbone.UILib.Domain({
                'category': this.collection.at(0).get('category'),
                'text': null,
                'order': 0,
            });
            if (this.cloneCollection) {
                this.collection.unshift(emptyModel);
            } else {
                var option = new Backbone.UILib.OptionView({
                    model: emptyModel,
                    text:  'text',
                    attributes: null,
                });
                content.appendChild(option.render().el);
                subviews.push(option);
            }
        }

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

        this._updateDOMAndNotify(content, subviews);

        return this;
    },

    _updateDOMAndNotify: function(content, subviews) {
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
    },

    isVoidNeed: function() {
        if (!this.options.addVoidValue) {
            return false;
        }
        if (this.collection.filter((d) => d.get('text') === null).length > 0) {
            return false;
        }
        return true;
    },

    // Free old collection to be garbage collected after subviews are removed,
    // as each one has a reference to a model in the collection.
    update: function(newCollection){
        this._updateCollection(newCollection);
        this.render();
    },

    // Remove the container element and then clean up its managed subviews
    // as to minimize document reflows.
    remove: function(){
        Backbone.View.prototype.remove.call(this);
        _.invoke(this._subviews, 'remove');
    },

});
