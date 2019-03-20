Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.UserModalView = Backbone.SIXHIARA.ModalView.extend({

    customConfiguration: function() {
        var self = this;
        var domains = new Backbone.UILib.DomainCollection();
        domains.fetch({
            success: function(collection, response, options) {

                var byDepartamento = self.options.domains.byCategory('groups');
                var byUnidades = collection.byCategory('unidade');

                new Backbone.UILib.SelectView({
                    el: this.$('#usergroup'),
                    collection: self.options.domains,
                }).render();

                document.getElementById('usergroup').addEventListener('change', function(e){
                    var selected = this.options[this.options.selectedIndex].text;
                    if (selected == ROL_UNIDAD_DELEGACION) {
                        new Backbone.UILib.SelectView({
                            el: self.$('#unidade'),
                            collection: byUnidades,
                        }).render();
                        self.$('#unidade-form').removeClass('hidden');
                    }else {
                        self.$('#unidade-form').addClass('hidden');
                    }
                }, this);

                document.getElementById('unidade').addEventListener('change', function(e){
                    self.checkIfUnidadWidgetIsValid();
                }, this);

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
        this.checkIfUnidadWidgetIsValid();
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

    checkIfUnidadWidgetIsValid: function(){
        var unidadeSelect = document.getElementById('unidade');
        var unidadeSelectHelpBlock = document.getElementById('helpBlock_unidade');

        if(this.$('#unidade').is(':visible') && !this.$('#unidade').val()){
            var errorMsg = 'O campo "Unidade" é obrigatório para o tipo de usuário "Unidade ou Delegação"';
            unidadeSelect.setCustomValidity(errorMsg);
            unidadeSelectHelpBlock.innerHTML = errorMsg;
            unidadeSelectHelpBlock.style.display = 'block';
        }else {
            unidadeSelect.setCustomValidity('');
            unidadeSelectHelpBlock.innerHTML = '';
            unidadeSelectHelpBlock.style.display = 'none';
        }
    }

});
