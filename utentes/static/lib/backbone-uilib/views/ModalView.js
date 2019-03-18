Backbone.UILib = Backbone.UILib || {};
Backbone.UILib.ModalView = Backbone.View.extend({

    events: {
        'click #okButton': 'okButtonClicked'
    },

    initialize: function (options) {
        this.options = options || {};
        this.auxViews = [];

        // on the modal we work with a draft model until
        // the user clicks okButton: then, the model is updated
        this.draftModel = this.model.clone();

        if(!this.options.selectorTmpl) throw "You need to provide a selector template";

        // take the template and append it to DOM
        var selectorTmpl = this.options.selectorTmpl;
        this.template = _.template($(selectorTmpl).html());
        this.$el.html(this.template(this.draftModel.toJSON()));
        $(document.body).append(this.el);

        // connect events:
        // - modal and aux views would be removed from DOM on close
        var self = this;
        this.$('.modal').on('hidden.bs.modal', function () {
            // this is the modal itself
            $(this).remove();
            self.remove();
        });

    },

    addAuxView: function (view) {
        this.auxViews.push(view);
        return view;
    },

    render: function () {
        var widgetsView = new Backbone.UILib.WidgetsView({
            el: this.$el,
            model: this.draftModel,
        }).render();
        this.addAuxView(widgetsView);
        this.customConfiguration();

        this.$('.modal').modal('show');
        this.$('.modal').find('.widget-date').toArray().forEach(function(widget){
            widget.addEventListener('input', function(e){
                var dateWidget = e.target;
                var validDate = formatter().validDateFormat(dateWidget.value);
                if (validDate) {
                    dateWidget.setCustomValidity('');
                } else {
                    dateWidget.setCustomValidity('A data deve ter o formato correto');
                }
            });
        });
    },

    remove: function () {
        Backbone.View.prototype.remove.call(this);
        _.invoke(this.auxViews, 'remove');
        this.auxViews = [];
    },

    okButtonClicked: function () {
        if(this.isSomeWidgetInvalid()) return;
        var atts = this.draftModel.pick(this.getAttsChanged());
        this.model.set(atts);
        this.$('.modal').modal('hide');
    },

    getAttsChanged: function () {
        var widgets = this.$('.modal').find('.widget, .widget-number, .widget-date, .widget-boolean');
        var widgetsId = _.map(widgets, function(w){return w.id});
        return widgetsId;
    },

    isSomeWidgetInvalid: function () {
        // we only use Constraint API with input elements, so check only those
        var widgets = this.$('.modal').find('input.widget, input.widget-number, input.widget-date, select.widget');
        var someInvalid = false;
        widgets.each(function (index, widget) {
            if(!widget.validity.valid) {
                someInvalid = true;
            }
        });
        return someInvalid;
    },
    customConfiguration: function() {
        // To be implemented by child classes
    },

});
