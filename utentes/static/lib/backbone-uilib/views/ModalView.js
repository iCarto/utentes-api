Backbone.UILib = Backbone.UILib || {};
Backbone.UILib.ModalView = Backbone.View.extend({
    events: {
        "click #okButton": "okButtonClicked",
    },

    initialize: function(options) {
        this.options = Object.assign({}, {editing: true}, options);
        if (this.options.editing && this.options.creating) {
            throw "No permitido";
        }
        this.auxViews = [];

        if (this.options.modalSelectorTpl) {
            this.template = _.template($(this.options.modalSelectorTpl).html());
        } else if (this.html) {
            this.template = _.template(this.html);
        } else {
            throw "Bad configuration";
        }
        this._cloneModelIfNeeded();
        this.$el.html(this.template(this.widgetModel.toJSON()));
        if (this.options.textConfirmBt) {
            this.$("#okButton").text(this.options.textConfirmBt);
        }
        if (this.options.appendToSelector) {
            $(this.options.appendToSelector).append(this.el);
        } else {
            $(document.body).append(this.el);
        }
    },

    _cloneModelIfNeeded: function() {
        // on the modal we work with a draft model until
        // the user clicks okButton: then, the model is updated
        this.widgetModel = this.options.editing ? this.model.clone() : this.model;
    },

    render: function() {
        this.customConfiguration();
        this._selectViewWrapper();
        this._renderWidgetsView();
        this._renderWidgetDate();
        var self = this;
        this.$(".modal").on("hidden.bs.modal", function() {
            self._close();
        });
        this.$(".modal").modal("show");
    },

    _selectViewWrapper: function() {
        if (!this.options.selectViewWrapper) {
            return;
        }
        var selectViewWrapper = new Backbone.UILib.SelectViewWrapper({
            domains: this.options.domains,
            domainMap: this.options.domainMap,
            el: this.$el,
        });
        this._addAuxView(selectViewWrapper);
    },

    _renderWidgetsView: function() {
        var widgetsView = new Backbone.UILib.WidgetsView({
            el: this.$el,
            model: this.widgetModel,
        }).render();
        this._addAuxView(widgetsView);
    },

    _addAuxView: function(view) {
        this.auxViews.push(view);
        return view;
    },

    _renderWidgetDate: function() {
        this.$(".modal")
            .find(".widget-date")
            .toArray()
            .forEach(function(widget) {
                widget.addEventListener("input", function(e) {
                    var dateWidget = e.target;
                    var validDate = formatter().validDateFormat(dateWidget.value);
                    if (validDate) {
                        dateWidget.setCustomValidity("");
                    } else {
                        dateWidget.setCustomValidity(
                            "A data deve ter o formato correcto"
                        );
                    }
                });
            });
    },

    okButtonClicked: function() {
        if (this.isSomeWidgetInvalid()) return;
        if (this.options.editing) {
            var attrs = this.widgetModel.pick(this.getAttsChanged());
            this.model.set(attrs);
        } else if (this.options.creating) {
            this.collection.add(this.model);
        }
        if (this.options.deleteFromServer) {
            this.model.save({wait: true});
        }
        this.$(".modal").modal("hide");
    },

    isSomeWidgetInvalid: function() {
        // we only use Constraint API with input elements, so check only those
        var widgets = this.$(".modal").find(
            "input.widget, input.widget-number, input.widget-date, select.widget"
        );
        var someInvalid = false;
        widgets.each(function(index, widget) {
            if (!widget.validity.valid) {
                someInvalid = true;
            }
        });
        return someInvalid;
    },

    getAttsChanged: function() {
        var widgets = this.$(".modal").find(
            ".widget, .widget-number, .widget-date, .widget-boolean"
        );
        var widgetsId = _.map(widgets, function(w) {
            return w.id;
        });
        return widgetsId;
    },

    _close: function() {
        this.$(".modal").unbind();
        this.$(".modal").remove();
        this.remove();
    },

    remove: function() {
        this.$el.unbind();
        this.off();
        Backbone.View.prototype.remove.call(this);
        _.invoke(this.auxViews, "remove");
        this.auxViews = [];
    },

    customConfiguration: function() {
        // To be implemented by child classes
    },
});
