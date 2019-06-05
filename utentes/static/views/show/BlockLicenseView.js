Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockLicenseView = Backbone.View.extend({

    template: _.template($('#licencia-tmpl').html()),

    events: {
        'click #addLicense':    'renderAddLicenseModal',
        'click #editLicense':   'renderEditLicenseModal',
        'click #addFonte':      'renderAddFonteModal',
        'click #showHistoric':  'renderHistoricLicenseModal',
        'click #removeLicense': 'removeLicense',
        'click #info-estado-licencia': 'showModalEstadoLicencia',
        'click #printLicense': 'printLicense',
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
            this.$('#showHistoric').removeClass('hidden');
            this.$('#removeLicense').removeClass('hidden');
            if (this.license.get("lic_time_info")) {
                this.$('#info-license-block').removeClass('hidden');
            }

            if (this.license.get("estado") == SIRHA.ESTADO.LICENSED ||
                this.license.get("estado") == SIRHA.ESTADO.PENDING_DIR_SIGN ||
                this.license.get("estado") == SIRHA.ESTADO.PENDING_EMIT_LICENSE ||
                window.SIRHA.is_single_user_mode()) {
                    this.$('#printLicense').removeClass('hidden');
            }
            // licenciada, pendente firma licença (Director) y pendente emissão licença (DJ)
            /*
            fact_tipo no es una propiedad de cada licencia. Si no que es común a ambas
            por lo que debería estar en un "emplazamiento" común a ambas y no hackeear de esta forma
            o si no, igual hay que inyectarlo en el modelo de la Licencia o meterlo de verdad
            */
            this.$('span.js_fact_tipo').text(this.model.get('fact_tipo'));

        } else {
            var lic = new Backbone.SIXHIARA.Licencia({
                'tipo_agua': this.options.tipo_agua,
                'lic_nro': SIRHA.ESTADO.NOT_EXISTS,
            });

            /*
            Workaround. En Licencia.initialize se setean valores. Al crear una
            licencia nueva vacía esos valores se muestran en el template a
            pesar de que en realidad deberían nulos
            */
            lic.set({'taxa_uso': null, 'iva':null}, {'silent': true})

            this.$el.append(this.template(lic.toJSON()));
            this.$('#addLicense').removeClass('hidden');
            this.$('#editLicense').addClass('hidden');
            this.$('#addFonte').addClass('hidden');
            this.$('#showHistoric').addClass('hidden');
            this.$('#removeLicense').addClass('hidden');
            this.$('#printLicense').addClass('hidden');
            this.$('#info-license-block').addClass('hidden');


            this.$el.addClass('disabled');

            /*
            fact_tipo no es una propiedad de cada licencia. Si no que es común a ambas
            por lo que debería estar en un "emplazamiento" común a ambas y no hackeear de esta forma
            o si no, igual hay que inyectarlo en el modelo de la Licencia o meterlo de verdad
            */
            this.$('span.js_fact_tipo').text('-');
        }

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

        var dispAgua = new Backbone.UILib.SelectView({
            el: modalView.$('#disp_a'),
            collection: this.options.domains.byCategory('piscicultura_fontes_disp_a')
        }).render();
        modalView.addAuxView(dispAgua);

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
            exploracao: this.model,
        });
        
        modalView.show();
        
        if (modalView.$('#fact_tipo').length) {
            // En dpmaip no tenemos #fact_tipo
            // Igual se podrían ocualtar con uilib-enability
            modalView.$('#fact_tipo')[0].value = this.model.get('fact_tipo');
        }
        iAuth.disabledWidgets('#licenciaModal');
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
                self.$el.removeClass('disabled');
                self.model.setLicState(this.model.get('estado'));
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
        if (modalView.$('#fact_tipo').length) {
            // En dpmaip no tenemos #fact_tipo
            modalView.$('#fact_tipo')[0].value = this.model.get('fact_tipo');
        }

        iAuth.disabledWidgets('#licenciaModal');

    },

    showModalEstadoLicencia: function(){
        new Backbone.SIXHIARA.ModalTooltipEstadoLicenciaView({
            collection: this.options.domains.byCategory('licencia_estado'),
            actual_state: this.license && this.license.get('estado') || null,
        }).show();
    },

    renderHistoricLicenseModal: function(){
        var self = this;
        var historico = new Backbone.SIXHIARA.HistoricoLicencias(this.model);
        historico.fetch({
            success: function(model, resp, options){
                var modal = new Backbone.SIXHIARA.ModalHistoricoLicencias({
                    model: self.model,
                    tipo_agua: self.options.tipo_agua,
                    renovacoes: resp
                }).show();
            },
            error: function(){
                bootbox.alert('Erro ao carregar dados históricos da licença.');
                return;
            }
        });
    },

    printLicense: function(i){
        var json = this.model.toJSON();

        if (!this.license.get("tipo_lic")) {
            bootbox.alert("A exploração tem que ter uma tipo de licença.");
            return;
        }
        json.licencia = this.license.toJSON();
        // Create a copy of the main object since both types of licenses share fields
        // In adition, remove its nulls to avoid problems during the template generation
        var data = JSON.parse(JSON.stringify(json, function(key, value) {
            if(value === null) {
                return "";
            }
            return value;
        }));

        // We filter fontes by tipo_agua (Subterrânea / Superficial)
        data.fontes = data.fontes.filter(function(fonte){
            return fonte.tipo_agua == data.licencia.tipo_agua;
        });

        var licenseSortName = /(\d{4}\/)(\w{3})/.exec(data.licencia.lic_nro)[2];

        data.licencia.d_emissao = formatter().formatDate(data.licencia.d_emissao) || "";
        data.licencia.d_validade = formatter().formatDate(data.licencia.d_validade)  || "";
        data.urlTemplate = Backbone.SIXHIARA.tipoTemplates[data.licencia.tipo_lic];
        data.licencia.duration = Backbone.SIXHIARA.duracionLicencias[data.licencia.tipo_lic];
        data.nameFile = data.licencia.tipo_lic.concat("_")
                                              .concat(data.licencia.lic_nro)
                                              .concat("_")
                                              .concat(data.exp_name)
                                              .concat('.docx');
        var self = this;

        var datosAra = new Backbone.SIXHIARA.AraGetData();
        datosAra.fetch({
            success: function(model, resp, options) {
                data.ara = resp
                data.ara.logoUrl = 'static/print-templates/images/' + window.SIRHA.getARA() + '_cabecera.png';
                data.ara.portadaUrl = 'static/print-templates/images/' + window.SIRHA.getARA() + '_portada.png';
                var docxGenerator = new Backbone.SIXHIARA.DocxGeneratorView({
                    model: self.model,
                    data: data
                })
            },
            error: function() {
                bootbox.alert('Erro ao imprimir licença');
            }
        });
    },

});
