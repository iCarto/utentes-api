Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockLicenseView = Backbone.View.extend({
    template: _.template($("#licencia-tmpl").html()),

    events: {
        "click #addLicense": "renderAddLicenseModal",
        "click #editLicense": "renderEditLicenseModal",
        "click #addFonte": "renderAddFonteModal",
        "click #showHistoric": "renderHistoricLicenseModal",
        "click #removeLicense": "removeLicense",
        "click #info-estado-licencia": "showModalEstadoLicencia",
        "click #printLicense": "printLicense",
    },

    initialize: function(options) {
        this.options = options;

        this.license = this.model
            .get("licencias")
            .where({tipo_agua: options.tipo_agua})[0];
        if (this.license) this.listenTo(this.license, "change", this.render);
    },

    render: function() {
        this.$el.html("");
        if (this.license) {
            this.$el.append(this.template(this.license.toJSON()));
            this.$("#addLicense").addClass("hidden");
            this.$("#editLicense").removeClass("hidden");
            this.$("#addFonte").removeClass("hidden");
            this.$("#showHistoric").removeClass("hidden");
            this.$("#removeLicense").removeClass("hidden");
            if (this.license.get("lic_time_info")) {
                this.$("#info-license-block").removeClass("hidden");
            }

            if (
                this.license.get("estado") == SIRHA.ESTADO.LICENSED ||
                this.license.get("estado") == SIRHA.ESTADO.PENDING_DIR_SIGN ||
                this.license.get("estado") == SIRHA.ESTADO.PENDING_EMIT_LICENSE ||
                window.SIRHA.is_single_user_mode()
            ) {
                this.$("#printLicense").removeClass("hidden");
            }
            // licenciada, pendente firma licença (Director) y pendente emissão licença (DJ)
            /*
            fact_tipo no es una propiedad de cada licencia. Si no que es común a ambas
            por lo que debería estar en un "emplazamiento" común a ambas y no hackeear de esta forma
            o si no, igual hay que inyectarlo en el modelo de la Licencia o meterlo de verdad
            */
            this.$("span.js_fact_tipo").text(this.model.get("fact_tipo"));
        } else {
            var lic = new Backbone.SIXHIARA.Licencia({
                tipo_agua: this.options.tipo_agua,
                lic_nro: SIRHA.ESTADO.NOT_EXISTS,
            });

            /*
            Workaround. En Licencia.initialize se setean valores. Al crear una
            licencia nueva vacía esos valores se muestran en el template a
            pesar de que en realidad deberían nulos
            */
            lic.set({taxa_uso: null, iva: null}, {silent: true});

            this.$el.append(this.template(lic.toJSON()));
            this.$("#addLicense").removeClass("hidden");
            this.$("#editLicense").addClass("hidden");
            this.$("#addFonte").addClass("hidden");
            this.$("#showHistoric").addClass("hidden");
            this.$("#removeLicense").addClass("hidden");
            this.$("#printLicense").addClass("hidden");
            this.$("#info-license-block").addClass("hidden");

            this.$el.addClass("disabled");

            /*
            fact_tipo no es una propiedad de cada licencia. Si no que es común a ambas
            por lo que debería estar en un "emplazamiento" común a ambas y no hackeear de esta forma
            o si no, igual hay que inyectarlo en el modelo de la Licencia o meterlo de verdad
            */
            this.$("span.js_fact_tipo").text("-");
        }

        return this;
    },

    removeLicense: function(e) {
        var self = this;
        bootbox.confirm(
            "Se você aceitar a licença e as fontes associadas serán borradas",
            function(result) {
                if (result) {
                    self.model.get("licencias").remove(self.license);
                    var fontes = self.model
                        .get("fontes")
                        .where({tipo_agua: self.options.tipo_agua});
                    self.model.get("fontes").remove(fontes);
                    self.stopListening(self.license, "change");
                    self.license = null;
                    self.render();
                }
            }
        );
    },

    renderAddFonteModal: function(event) {
        event.preventDefault();

        var tipoAgua = this.options.tipo_agua;
        var modalView = new Backbone.UILib.ModalView({
            modalSelectorTpl: "#block-fonte-modal-tmpl",
            collection: this.model.get("fontes"),
            collectionModel: Backbone.SIXHIARA.Fonte,
            model: new Backbone.SIXHIARA.Fonte({tipo_agua: tipoAgua}),
            domains: this.options.domains,
            creating: true,
            editing: false,
            selectViewWrapper: true,
            domainMap: {
                sist_med: "sistema_medicao",
                disp_a: "piscicultura_fontes_disp_a",
                tipo_fonte: this.options.domains
                    .byCategory("fonte_tipo")
                    .byParent(tipoAgua),
                red_monit: "red_monit",
            },
            textConfirmBt: "Adicionar",
        });
        modalView.render();
    },

    renderEditLicenseModal: function(event) {
        event.preventDefault();

        var modalView = new Backbone.SIXHIARA.LicenseModalView({
            modalSelectorTpl: "#block-license-modal-tmpl",
            collection: this.model.get("licencias"),
            collectionModel: Backbone.SIXHIARA.Licencia,
            model: this.license,
            domains: this.options.domains,
            editing: true,
            exploracao: this.model,
        });

        modalView.render();

        if (modalView.$("#fact_tipo").length) {
            // En dpmaip no tenemos #fact_tipo
            // Igual se podrían ocualtar con uilib-enability
            modalView.$("#fact_tipo")[0].value = this.model.get("fact_tipo");
        }
        iAuth.disabledWidgets("#licenciaModal");
    },

    renderAddLicenseModal: function(event) {
        event.preventDefault();
        var self = this;
        var AddLicenseModalView = Backbone.SIXHIARA.LicenseModalView.extend({
            okButtonClicked: function() {
                // in this context, this is the backbone modalView
                if (this.isSomeWidgetInvalid()) return;
                this.collection.add(this.model);
                self.license = self.model
                    .get("licencias")
                    .where({tipo_agua: self.options.tipo_agua})[0];
                self.listenTo(self.license, "change", self.render);
                self.render();
                this.$(".modal").modal("hide");
                self.$el.removeClass("disabled");
                self.model.setLicState(this.model.get("estado"));
            },
        });

        var modalView = new AddLicenseModalView({
            modalSelectorTpl: "#block-license-modal-tmpl",
            collection: this.model.get("licencias"),
            collectionModel: Backbone.SIXHIARA.Licencia,
            model: new Backbone.SIXHIARA.Licencia({
                tipo_agua: this.options.tipo_agua,
            }),
            domains: this.options.domains,
            creating: true,
            editing: false,
        });

        modalView.render();
        if (modalView.$("#fact_tipo").length) {
            // En dpmaip no tenemos #fact_tipo
            modalView.$("#fact_tipo")[0].value = this.model.get("fact_tipo");
        }

        iAuth.disabledWidgets("#licenciaModal");
    },

    showModalEstadoLicencia: function() {
        new Backbone.SIXHIARA.ModalTooltipEstadoLicenciaView({
            collection: this.options.domains.byCategory("licencia_estado"),
            actual_state: (this.license && this.license.get("estado")) || null,
        }).show();
    },

    renderHistoricLicenseModal: function() {
        var self = this;
        var historico = new Backbone.SIXHIARA.HistoricoLicencias(this.model);
        historico.fetch({
            success: function(model, resp, options) {
                var modal = new Backbone.SIXHIARA.ModalHistoricoLicencias({
                    model: self.model,
                    tipo_agua: self.options.tipo_agua,
                    renovacoes: resp,
                }).show();
            },
            error: function() {
                bootbox.alert("Erro ao carregar dados históricos da licença.");
                return;
            },
        });
    },

    printLicense: function(e) {
        e.preventDefault();
        e.stopPropagation();
        SIRHA.Services.PrintService.license(this.model, this.options.tipo_agua).catch(
            function(error) {
                bootbox.alert({
                    title: "Erro ao imprimir licença",
                    message: error,
                });
            }
        );
    },
});
