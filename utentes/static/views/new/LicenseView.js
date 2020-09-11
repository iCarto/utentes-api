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

        this.license = this.createLicense();

        this.updateModelView = new Backbone.UILib.WidgetsView({
            el: this.el,
            model: this.license,
        });
        this.addView(this.updateModelView);

        var self = this;
        this.$(this.options.selectorButtonAddFonte).on("click", function(e) {
            self.renderModal(e);
        });

        this.estadosLicencia = this.options.domains
            .byCategory("licencia_estado")
            .byParent("precampo");
        var estadosView = new Backbone.UILib.SelectView({
            el: this.$("#estado"),
            collection: this.estadosLicencia,
        });
        this.addView(estadosView);
    },

    createLicense: function() {
        return new Backbone.SIXHIARA.Licencia({
            tipo_agua: this.tipo_agua,
            estado: this.model.get("estado_lic"),
            lic_nro: this.model.get("exp_id")
                ? SIRHA.Services.IdService.calculateNewLicNro(
                      this.model.get("exp_id"),
                      this.tipo_agua
                  )
                : null,
            taxa_fixa: null,
            taxa_uso: this.tipo_agua === "Subterrânea" ? 0.6 : null,
            iva: window.SIXHIARA.IVA,
        });
    },

    render: function() {
        Backbone.SIXHIARA.LicenseView.__super__.render.call(this);
        this.disableWidgets();
    },

    clickActive: function(e) {
        var self = this;
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
            this.license = this.createLicense();
            this.updateModelView.model = this.license;
            this.updateModelView.render();
            this.disableWidgets();
        }
    },

    disableWidgets: function() {
        this.isDisabled = true;
        this.el.classList.add("panel-disabled");
        this.$("label.set-enability").addClass("text-muted");
        this.$(".widget").prop("disabled", this.isDisabled);
        this.$(".widget-number").prop("disabled", this.isDisabled);
        this.$("button").prop("disabled", this.isDisabled);
    },

    enableWidgets: function() {
        this.isDisabled = false;
        this.el.classList.remove("panel-disabled");
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
        e.preventDefault();

        let domains = this.options.domains.reject(
            e =>
                e.get("category") === "fonte_tipo" && e.get("parent") !== this.tipo_agua
        );
        domains = new Backbone.UILib.DomainCollection(domains);
        var modalView = new Backbone.UILib.ModalView({
            modalSelectorTpl: this.options.selectorModalFonte,
            collection: this.model.get("fontes"),
            collectionModel: Backbone.SIXHIARA.Fonte,
            model: new Backbone.SIXHIARA.Fonte({
                tipo_agua: this.tipo_agua,
            }),
            domains: domains,
            creating: true,
            editing: false,
            selectViewWrapper: true,
            domainMap: {tipo_fonte: "fonte_tipo", red_monit: "red_monit"},
        });
        modalView.render();
    },
});
