Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.UserModalView = Backbone.SIXHIARA.ModalView.extend({

    customConfiguration: function() {
        new Backbone.UILib.SelectView({
            el: this.$('#usergroup'),
            collection: this.options.domains.byCategory('groups'),
        }).render();

        if (this.options.editing) {
            this.$('#password')[0].required = false;
        }
    },


    okButtonClicked: function() {
        if(this.isSomeWidgetInvalid()) return;
        if (this.options.editing) {
            var widgets = this.$('.modal').find('.widget, .widget-number, .widget-date, .widget-boolean, .widget-external');
            var widgetsId = _.map(widgets, function(w){return w.id;});
            var attrs = this.widgetModel.pick(widgetsId);
            this.model.set(attrs);
        } else {
            this.collection.add(this.model);
        }

        if (this.options.deleteFromServer) {
            this.model.save(null, {
                wait: true,
                success: function () {
                    console.log('Ok');
                },
                error: function (xhr, textStatus) {
                    if (textStatus && textStatus.responseJSON && textStatus.responseJSON.error) {
                        if(Array.isArray(textStatus.responseJSON.error)) {
                            alert(textStatus.responseJSON.error.join('\n'));
                        } else{
                            alert(textStatus.responseJSON.error);
                        }
                    } else {
                        alert(textStatus.statusText);
                    }
                },
            });
        }
        this.$('.modal').modal('hide');
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

});
