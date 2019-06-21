Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.LicenseView = Backbone.UILib.BaseView.extend({
    events: {
        "click input:checkbox": "clickActive",
        "click .help": "showModalEstadoLicencia",
    },

    initialize: function(options) {
        Backbone.UILib.BaseView.prototype.initialize.call(this);
        this.options = options || {};
        this.tipo_agua = this.options.tipo_agua;

        this.license = new Backbone.SIXHIARA.Licencia({
            tipo_agua: this.tipo_agua,
            estado: this.model.get("estado_lic"),
            lic_nro: this.model.get("exp_id")
                ? this.model.get("exp_id") + "/" + this.tipo_agua.substring(0, 3)
                : null,
            taxa_fixa: null,
            taxa_uso: this.tipo_agua === "Subterrânea" ? 0.6 : null,
            iva: window.SIXHIARA.IVA,
        });

        this.updateModelView = new Backbone.UILib.WidgetsView({
            el: this.el,
            model: this.license,
        });
        this.addView(this.updateModelView);

        var self = this;
        this.$(this.options.selectorButtonAddFonte).on("click", function(e) {
            self.renderModal(e);
        });

        this.isDisabled = true;
        var app = this;
        this.domainsFilled = false;
        this.options.domains.on("sync", function() {
            app.domainsFilled = true;
            app.estadosLicencia = app.options.domains
                .byCategory("licencia_estado")
                .byParent("precampo");
            var estadosView = new Backbone.UILib.SelectView({
                el: app.$("#estado"),
                collection: app.estadosLicencia,
            });
            app.addView(estadosView);
            app.render();
            estadosView.$el.prop("disabled", app.isDisabled);
        });
    },

    // render - Backbone.UILib.BaseView.prototype.render.call(this);

    // remove - Backbone.UILib.BaseView.prototype.remove.call(this);

    clickActive: function(e) {
        var self = this;
        this.$el.toggleClass("panel-disabled");
        if (e.target.checked) {
            this.model.get("licencias").add(this.license);
            this.enableWidgets();
            if (window.SIRHA.is_single_user_mode()) {
                this.listenTo(this.license, "change:estado", function() {
                    exploracao.set(
                        {
                            estado_lic: this.license.get("estado"),
                        },
                        {silent: true}
                    );
                });
            }
        } else {
            this.model.get("licencias").remove(this.license);
            var fontes = this.model.get("fontes").where({tipo_agua: this.tipo_agua});
            this.model.get("fontes").remove(fontes);
            this.stopListening(this.license);
            if (window.SIRHA.is_single_user_mode()) {
                var ex_lic =
                    this.model.get("licencias") &&
                    this.model.get("licencias").length &&
                    this.model.get("licencias").at(0);
                var ex_state = SIRHA.ESTADO.UNKNOWN;
                if (ex_lic) {
                    ex_state = ex_lic.get("estado");
                }
                exploracao.set(
                    {
                        estado_lic: ex_state,
                    },
                    {silent: true}
                );
            }
            this.license = new Backbone.SIXHIARA.Licencia({tipo_agua: this.tipo_agua});
            this.updateModelView.model = this.license;
            this.updateModelView.render();

            this.disableWidgets();
        }
    },

    disableWidgets: function() {
        this.isDisabled = true;
        this.$("label.set-enability").addClass("text-muted");
        this.$(".widget").prop("disabled", this.isDisabled);
        this.$(".widget-number").prop("disabled", this.isDisabled);
        this.$("button").prop("disabled", this.isDisabled);
    },

    enableWidgets: function() {
        this.isDisabled = false;
        this.$("label.set-enability").removeClass("text-muted");
        this.$(".widget").prop("disabled", this.isDisabled);
        this.$(".widget-number").prop("disabled", this.isDisabled);
        this.$("button").prop("disabled", this.isDisabled);
    },

    showModalEstadoLicencia: function() {
        new Backbone.SIXHIARA.ModalTooltipEstadoLicenciaView({
            collection: this.estadosLicencia,
            actual_state: this.license.get("estado"),
        }).show();
    },

    renderModal: function(e) {
        if (!this.domainsFilled) return;

        e.preventDefault();

        // override default action for okButtonClicked
        var self = this;
        var AddFonteModal = Backbone.UILib.ModalView.extend({
            okButtonClicked: function() {
                if (this.isSomeWidgetInvalid()) return;
                self.model.get("fontes").add(this.draftModel);
                this.$(".modal").modal("hide");
            },
        });

        var modalView = new AddFonteModal({
            model: new Backbone.SIXHIARA.Fonte({
                tipo_agua: this.tipo_agua,
            }),
            selectorTmpl: this.options.selectorModalFonte,
        });

        var fonteTipos = this.options.domains.byCategory("fonte_tipo");
        var tipoFontesView = new Backbone.UILib.SelectView({
            el: modalView.$("#tipo_fonte"),
            collection: fonteTipos.byParent(this.tipo_agua),
        }).render();
        modalView.addAuxView(tipoFontesView);

        modalView.render();
    },
});
