var i = 0;
Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockLicenseView = Backbone.View.extend({

    template: _.template($('#licencia-tmpl').html()),

    events: {
        'click #addLicense':    'renderAddLicenseModal',
        'click #editLicense':   'renderEditLicenseModal',
        'click #addFonte':      'renderAddFonteModal',
        'click #removeLicense': 'removeLicense',
        'click #info-estado-licencia': 'showModalEstadoLicencia',
    },

    initialize: function(options){
        this.options = options;

        this.license = this.model.get('licencias').where({'tipo_agua': options.tipo_agua})[0];
        if(this.license) this.listenTo(this.license, 'change', this.render);

    },

    render: function(){
        this.$el.html('');
        if(this.license){
            this.$el.append(this.template(this.license.toJSON()));
            this.$('#addLicense').addClass('hidden');
            this.$('#editLicense').removeClass('hidden');
            this.$('#addFonte').removeClass('hidden');
            this.$('#removeLicense').removeClass('hidden');
        } else {
            var lic = new Backbone.SIXHIARA.Licencia({
                'tipo_agua': this.options.tipo_agua,
                'lic_nro': Backbone.SIXHIARA.Estado.NOT_EXISTS,
            });
            this.$el.append(this.template(lic.toJSON()));
            this.$('#addLicense').removeClass('hidden');
            this.$('#editLicense').addClass('hidden');
            this.$('#addFonte').addClass('hidden');
            this.$('#removeLicense').addClass('hidden');
            this.$el.addClass('disabled');
        }
        /*
        fact_tipo no es una propiedad de cada licencia. Si no que es común a ambas
        por lo que debería estar en un "emplazamiento" común a ambas y no hackeear de esta forma
        o si no, igual hay que inyectarlo en el modelo de la Licencia o meterlo de verdad
        */
        this.$('span.js_fact_tipo').text(this.model.get('fact_tipo'));
        return this;
    },

    removeLicense: function (e) {
        var self = this;
        bootbox.confirm('Se você aceitar a licença e as fontes associadas serán borradas', function(result){
            if (result) {
                self.model.get('licencias').remove(self.license);
                var fontes = self.model.get('fontes').where({'tipo_agua': self.options.tipo_agua});
                self.model.get('fontes').remove(fontes);
                self.stopListening(self.license, 'change');
                self.license = null;
                self.render();
            }
        });
    },

    renderAddFonteModal: function (event) {
        event.preventDefault();

        // override default action for okButtonClicked
        var self = this;
        var AddFonteModalView = Backbone.UILib.ModalView.extend({
            okButtonClicked: function () {
                // in this context, this is the backbone modalView
                if(this.isSomeWidgetInvalid()) return;
                var atts = this.draftModel.pick(this.getAttsChanged());
                this.model.set(atts);
                self.model.get('fontes').add(this.model);
                this.$('.modal').modal('hide');
            }
        });

        var fonte = new Backbone.SIXHIARA.Fonte({tipo_agua: this.options.tipo_agua})
        var modalView = new AddFonteModalView({
            model: fonte,
            selectorTmpl: '#block-fonte-modal-tmpl'
        });
        modalView.$('#tipo_agua').prop('disabled', true)
        modalView.$('#okButton').text('Adicionar');

        // connect auxiliary views
        var fonteTipoView = new Backbone.UILib.SelectView({
            el: modalView.$('#tipo_fonte'),
            collection: this.options.domains.byCategory('fonte_tipo').byParent(fonte.get('tipo_agua'))
        }).render();
        modalView.addAuxView(fonteTipoView);

        var sistMedView = new Backbone.UILib.SelectView({
            el: modalView.$('#sist_med'),
            collection: this.options.domains.byCategory('sistema_medicao')
        }).render();
        modalView.addAuxView(sistMedView);

        modalView.render();
    },

    renderEditLicenseModal: function (event) {
        event.preventDefault();

        var modalView = new Backbone.SIXHIARA.LicenseModalView({
            modalSelectorTpl: '#block-license-modal-tmpl',
            collection: this.model.get('licencias'),
            collectionModel: Backbone.SIXHIARA.Licencia,
            model: this.license,
            domains: this.options.domains,
            editing: true,
        });

        modalView.show();
        modalView.$('#fact_tipo')[0].value = this.model.get('fact_tipo');
        wf.disabledWidgets('#licenciaModal');
    },

    renderAddLicenseModal: function (event) {
        event.preventDefault();
        var self = this;
        var AddLicenseModalView = Backbone.SIXHIARA.LicenseModalView.extend({
            okButtonClicked: function () {
                // in this context, this is the backbone modalView
                if(this.isSomeWidgetInvalid()) return;
                this.collection.add(this.model);
                self.license = self.model.get('licencias').where({'tipo_agua': self.options.tipo_agua})[0];
                self.listenTo(self.license, 'change', self.render);
                self.render();
                this.$('.modal').modal('hide');
            }
        });

        var modalView = new AddLicenseModalView({
            modalSelectorTpl: '#block-license-modal-tmpl',
            collection: this.model.get('licencias'),
            collectionModel: Backbone.SIXHIARA.Licencia,
            model: new Backbone.SIXHIARA.Licencia({
                'tipo_agua': this.options.tipo_agua,
            }),
            domains: this.options.domains,
            editing: false,
        });

        modalView.show();
        modalView.$('#fact_tipo')[0].value = this.model.get('fact_tipo');
        wf.disabledWidgets('#licenciaModal');
        this.$el.removeClass('disabled');
    },

    showModalEstadoLicencia: function(){
        new Backbone.SIXHIARA.ModalTooltipEstadoLicenciaView({
            collection: this.options.domains.byCategory('licencia_estado'),
            actual_state: this.license && this.license.get('estado') || null,
        }).show();
    },

});
