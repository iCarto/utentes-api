Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ExploracaoShowView = Backbone.View.extend({
    initialize: function() {
        // in this view, all WidgetsView would display '-' as nullValues,
        // unless it is set otherwise in a specific WidgetsView
        Backbone.UILib.WidgetsView.prototype.displayNull = function(name) {
            return "-";
        };

        this.subViews = [];
    },

    workaroundForEstadoCombo: function(domains) {
        // TODO. Do not hide this here
        /* En el modo no-escritorio, el combo de estado en la ficha de la licencia
        sólo puede mostrar o bien el estado actual de la licencia, cuando todavía está
        en proceso. O bien uno de los posibles estados post-lic "de facto", "irregular",
        "licenciada"

        Y si es de usos comuns sólo ese estado
        */
        if (!window.SIRHA.is_single_user_mode()) {
            var actualState = domains.where({
                text: this.model.get("estado_lic"),
                category: "licencia_estado",
            })[0];
            var isUsosComuns = actualState.get("text") === SIRHA.ESTADO.USOS_COMUNS;
            domains.forEach(function(d) {
                if (d.get("category") === "licencia_estado") {
                    if (isUsosComuns) {
                        if (d.get("text") !== actualState.get("text")) {
                            d.set("category", "ignore", {silent: true});
                        }
                    } else if (actualState.get("parent") === "post-licenciada") {
                        if (
                            d.get("parent") !== "post-licenciada" ||
                            d.get("text") === SIRHA.ESTADO.USOS_COMUNS
                        ) {
                            d.set("category", "ignore", {silent: true});
                        }
                    } else {
                        if (d.get("text") !== actualState.get("text")) {
                            d.set("category", "ignore", {silent: true});
                        }
                    }
                }
            });
        }
    },

    render: function() {
        var self = this;

        var exploracao = this.model;

        var domains = new Backbone.UILib.DomainCollection();
        domains.fetch({
            success: function(collection, response, options) {
                self.workaroundForEstadoCombo(domains);

                self.listenTo(exploracao, "aChangeHappens", function() {
                    this.$("menu a")
                        .not(".dropdown-toggle")
                        .on("click", function(evt) {
                            var refreshConfirmation = confirm(
                                "Hai mudanzas sem gravar. ¿Deseja sair igualmente?"
                            );
                            if (!refreshConfirmation) {
                                evt.preventDefault();
                            }
                        });
                });

                var defaultUrlBase = Backbone.SIXHIARA.Config.apiDocumentos;
                var fileModalView = new Backbone.DMS.FileModalView({
                    openElementId: "#file-modal",
                    title: "Arquivo Electr&oacute;nico",
                    urlBase: defaultUrlBase,
                    id: exploracao.get("id"),
                });

                /** Buttons View are here, because after the domains are loaded,
                'change' events are triggered in the model. If a button like refresh
                is listening it to be enabled, we must wait here **/

                // TODO: do not listen to events if button is disabled
                var buttonSaveView = new Backbone.SIXHIARA.ButtonSaveView({
                    el: $("#save-button"),
                    model: exploracao,
                });
                self.subViews.push(buttonSaveView);

                var buttonDeleteView = new Backbone.SIXHIARA.ButtonDeleteView({
                    el: $("#delete-button"),
                    model: exploracao,
                });
                self.subViews.push(buttonDeleteView);

                var buttonRefreshView = new Backbone.SIXHIARA.ButtonRefreshView({
                    el: $("#refresh-button"),
                    model: exploracao,
                });
                self.subViews.push(buttonRefreshView);

                var buttonLicenciarView = new Backbone.SIXHIARA.ButtonLicenciarView({
                    el: document.getElementById("licenciar-button"),
                    model: exploracao,
                });
                self.subViews.push(buttonLicenciarView);

                var blockInfoLicenseView = new Backbone.SIXHIARA.BlockInfoLicenseView({
                    el: $("#license-info"),
                    model: exploracao,
                });
                self.subViews.push(blockInfoLicenseView);
            },
            error: function() {
                // TODO: show message to user
                console.error("could not get domains from API");
            },
        });

        var blockMapView = new Backbone.SIXHIARA.BlockMapView({
            model: exploracao,
        });
        this.subViews.push(blockMapView);

        var blockInfoView = new Backbone.SIXHIARA.BlockInfoView({
            el: $("#block-info"),
            model: exploracao,
            domains: domains,
        }).render();
        this.subViews.push(blockInfoView);

        var blockLocationView = new Backbone.SIXHIARA.BlockLocationView({
            el: $("#block-location"),
            model: exploracao,
            domains: domains,
        }).render();
        this.subViews.push(blockLocationView);

        var blockUtenteView = new Backbone.SIXHIARA.BlockUtenteView({
            el: $("#block-utente"),
            model: exploracao,
            domains: domains,
        }).render();
        this.subViews.push(blockUtenteView);

        var blockActivityView = new Backbone.SIXHIARA.BlockActivityView({
            el: $("#block-activity"),
            model: exploracao,
            domains: domains,
        }).render();
        this.subViews.push(blockActivityView);

        var blockConsumosView = new Backbone.UILib.WidgetsView({
            el: $("#block-consumos"),
            model: exploracao,
        }).render();
        blockConsumosView.listenTo(
            exploracao.get("fontes"),
            "add destroy",
            blockConsumosView.render
        );
        blockConsumosView.listenTo(exploracao, "change", blockConsumosView.render);
        var changeColor = function changeColor() {
            let licenciaWidget = document.getElementById("c_licencia");
            let licenciaValue = exploracao.get("c_licencia");
            let realWidget = document.getElementById("c_real");
            let realValue = exploracao.get("c_real");
            if (licenciaWidget) {
                let widget = licenciaWidget.parentElement.parentElement;
                widget.classList.remove("redcolor");
                if (!licenciaValue) {
                    widget.classList.add("redcolor");
                }
            } else {
                let widget = realWidget.parentElement.parentElement;
                widget.classList.remove("redcolor");
                if (!realValue) {
                    widget.classList.add("redcolor");
                }
            }
        };

        blockConsumosView.listenTo(
            exploracao,
            "change:c_licencia change:c_real",
            changeColor
        );
        this.subViews.push(blockConsumosView);
        changeColor();

        var blockSuperficialView = new Backbone.SIXHIARA.BlockLicenseView({
            el: $("#block-superficial"),
            model: exploracao,
            domains: domains,
            tipo_agua: "Superficial",
        }).render();
        this.subViews.push(blockSuperficialView);

        var blockSubterraneaView = new Backbone.SIXHIARA.BlockLicenseView({
            el: $("#block-subterranea"),
            model: exploracao,
            domains: domains,
            tipo_agua: "Subterrânea",
        }).render();
        this.subViews.push(blockSubterraneaView);

        var blockFontesView = new Backbone.SIXHIARA.BlockFontesView({
            el: $("#block-fontes"),
            collection: exploracao.get("fontes"),
            domains: domains,
        }).render();
        this.subViews.push(blockFontesView);

        return this;
    },

    remove: function() {
        Backbone.View.prototype.remove.call(this);
        _.invoke(this.subViews, "remove");
    },
});
