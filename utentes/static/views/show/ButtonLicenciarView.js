Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ButtonLicenciarView = Backbone.View.extend({
    events: {
        click: "doClick",
    },

    doClick: function() {
        var self = this;
        var ModalUltimaEntregaDoc = Backbone.SIXHIARA.UltimaEntregaDocModalView.extend({
            okButtonClicked: function() {
                var dateId = "d_ultima_entrega_doc";
                var dateWidget = document.getElementById(dateId);
                var dateObj = formatter().unformatDate(dateWidget.value);
                self.model.set(
                    {
                        d_ultima_entrega_doc: dateObj,
                        d_soli: dateObj,
                        state_to_set_after_validation:
                            SIRHA.ESTADO.PENDING_TECH_DECISION,
                    },
                    {silent: true}
                );
                self.model.get("licencias").forEach(function(lic) {
                    lic.set(
                        {
                            d_validade: null,
                            d_emissao: null,
                        },
                        {silent: true}
                    );
                });
                self.model.save(null, {
                    wait: true,
                    success: function(model, resp, options) {
                        window.location = model.urlShow();
                    },
                    error: function(xhr, textStatus, errorThrown) {
                        self.$(".modal").modal("hide");
                        bootbox.alert(textStatus.statusText);
                    },
                });
            },
        });
        var modalView = new ModalUltimaEntregaDoc({
            model: this.model,
            windowTitle: "Licenciar Exploração",
        });
        modalView.show();
    },
});
