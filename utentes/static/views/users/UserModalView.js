Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.UserModalView = Backbone.SIXHIARA.ModalView.extend({

    customConfiguration: function() {
        var self = this;
        var domains = new Backbone.UILib.DomainCollection();
        domains.fetch({
            success: function(collection, response, options) {
                var unidades = collection.byCategory('unidade');
                unidades.shift();
                self.unidades = unidades.pluck('text');

                var concatenated = self.options.domains.byCategory('groups').toJSON().concat(unidades.toJSON());
                var newCollection = new Backbone.Collection(concatenated);

                new Backbone.UILib.SelectView({
                    el: self.$('#usergroup'),
                    collection: newCollection,
                }).render();

                if (self.options.editing) {
                    self.$('#password')[0].required = false;
                }
            },
            error: function() {
                bootbox.alert('<span style="color: red;">Produziu-se um erro. Informe ao administrador.</strong>');
            }
        });
    },


    okButtonClicked: function() {
        if(this.isSomeWidgetInvalid()) return;
        if (this.options.editing) {
            var widgets = this.$('.modal').find('.widget, .widget-number, .widget-date, .widget-boolean, .widget-external');
            var widgetsId = _.map(widgets, function(w){return w.id;});
            var attrs = this.widgetModel.pick(widgetsId);
            this.model.set(attrs);
        } else {
            var usergroup = this.model.get('usergroup');
            if(this.unidades.indexOf(usergroup) != -1){
                this.model.set('unidade', usergroup);
                this.model.set('usergroup', ROL_UNIDAD_DELEGACION);
            }

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
