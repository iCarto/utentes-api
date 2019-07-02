Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewFactura = Backbone.View.extend({
    className: "view-facturacao",

    id: "edit-facturacao-modal",
    template: _.template(`
    <div class="row panel-equal-height">
        <div class="col-xs-6">
            <div id="lic-sub" class="panel panel-info panel-disabled">
                <div class="panel-heading">
                    <h3 class="panel-title"><strong>Licença Subterrânea</strong></h3>
                </div>
                <div class="panel-body row">
                    <div class="form-group col-xs-12">
                        <label for="consumo_tipo_sub"><strong>Tipo de consumo</strong></label>
                        <select class="form-control" id="consumo_tipo_sub" disabled >
                            <option>Fixo</option>
                            <option>Variável</option>
                        </select>
                    </div>

                    <div class="form-group col-xs-12">
                        <label for="c_licencia_sub">Consumo licenciado&nbsp;<i class="units">(m<sup>3</sup>/mês)</i></label>
                        <input type="text" class="form-control widget-number" id="c_licencia_sub" pattern="[0-9]{1,8}([,][0-9]{1,2})?" value="<%- formatter().formatNumber(c_licencia_sub, '0[.]00') %>" disabled>
                    </div>

                    <div class="form-group col-xs-12">
                        <label for="consumo_fact_sub">Consumo facturado&nbsp;<i class="units">(m<sup>3</sup>/mês)</i></label>
                        <input type="text" class="form-control widget-number" id="consumo_fact_sub" pattern="[0-9]{1,8}([,][0-9]{1,2})?" value="<%- formatter().formatNumber(consumo_fact_sub, '0[.]00') %>" disabled>
                    </div>

                    <div class="form-group col-xs-12">
                        <label for="taxa_fixa_sub">Taxa fixa&nbsp;<i class="units">(MT/mês)</i></label>
                        <input type="text" class="form-control widget-number" id="taxa_fixa_sub" pattern="[0-9]{1,8}([,][0-9]{1,2})?" value="<%- formatter().formatNumber(taxa_fixa_sub, '0[.]00') %>" disabled>
                    </div>

                    <div class="form-group col-xs-12">
                        <label for="taxa_uso_sub">Taxa de uso&nbsp;<i class="units">(MT/m<sup>3</sup>)</i></label>
                        <input type="text" class="form-control widget-number" id="taxa_uso_sub" pattern="[0-9]{1,8}([,][0-9]{1,2})?" value="<%- formatter().formatNumber(taxa_uso_sub, '0[.]00') %>" disabled>
                    </div>

                    <div class="form-group col-xs-12">
                        <label for="pago_mes_sub">Valor pago&nbsp;<i class="units js-change-mes">(MT/mês)</i></label>
                        <input type="text" class="form-control widget-number" id="pago_mes_sub" pattern="[0-9]{1,8}([,][0-9]{1,2})?" value="<%- formatter().formatNumber(pago_mes_sub, '0[.]00') %>" disabled>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xs-6">
            <div id="lic-sup" class="panel panel-info panel-disabled">
                <div class="panel-heading">
                    <h3 class="panel-title"><strong>Licença Superficial</strong></h3>
                </div>
                <div class="panel-body row">
                    <div class="form-group col-xs-12">
                        <label for="consumo_tipo_sup"><strong>Tipo de consumo</strong></label>
                        <select class="form-control" id="consumo_tipo_sup" disabled>
                            <option>Fixo</option>
                            <option>Variável</option>
                        </select>
                    </div>

                    <div class="form-group col-xs-12">
                        <label for="c_licencia_sup">Consumo licenciado&nbsp;<i class="units">(m<sup>3</sup>/mês)</i></label>
                        <input type="text" class="form-control widget-number" id="c_licencia_sup" pattern="[0-9]{1,8}([,][0-9]{1,2})?" value="<%- formatter().formatNumber(c_licencia_sup, '0[.]00') %>" disabled>
                    </div>

                    <div class="form-group col-xs-12">
                        <label for="consumo_fact_sup">Consumo facturado&nbsp;<i class="units">(m<sup>3</sup>/mês)</i></label>
                        <input type="text" class="form-control widget-number" id="consumo_fact_sup" pattern="[0-9]{1,8}([,][0-9]{1,2})?" value="<%- formatter().formatNumber(consumo_fact_sup, '0[.]00') %>" disabled>
                    </div>

                    <div class="form-group col-xs-12">
                        <label for="taxa_fixa_sup">Taxa fixa&nbsp;<i class="units">(MT/mês)</i></label>
                        <input type="text" class="form-control widget-number" id="taxa_fixa_sup" pattern="[0-9]{1,8}([,][0-9]{1,2})?" value="<%- formatter().formatNumber(taxa_fixa_sup, '0[.]00') %>" disabled>
                    </div>

                    <div class="form-group col-xs-12">
                        <label for="taxa_uso_sup">Taxa de uso&nbsp;<i class="units">(MT/m<sup>3</sup>)</i></label>
                        <input type="text" class="form-control widget-number" id="taxa_uso_sup" pattern="[0-9]{1,8}([,][0-9]{1,2})?" value="<%- formatter().formatNumber(taxa_uso_sup, '0[.]00') %>" disabled>
                    </div>

                    <div class="form-group col-xs-12">
                        <label for="pago_mes_sup">Valor pago&nbsp;<i class="units js-change-mes">(MT/mês)</i></label>
                        <input type="text" class="form-control widget-number" id="pago_mes_sup" pattern="[0-9]{1,8}([,][0-9]{1,2})?" disabled value="<%- formatter().formatNumber(pago_mes_sup, '0[.]00') %>" disabled>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row panel-equal-height">
        <div class="col-xs-6">
            <div class="panel panel-info">
                <div class="panel-heading">
                    <h3 class="panel-title"><strong>Facturação</strong></h3>
                </div>
                <div class="panel-body row">
                    <div class="form-group col-xs-3" style="padding: 0px 5px;">
                        <label for="iva">IVA&nbsp;<i class="units">(%)</i></label>
                        <input type="text"
                               class="form-control widget-number"
                               id="iva"
                               pattern="[0-9]{1,8}([,][0-9]{1,2})?"
                               value="<%- formatter().formatNumber(iva, '0[.]00') %>"
                               style="padding: 6px 6px;"
                               disabled
                        >
                    </div>

                    <div class="form-group col-xs-3" style="padding: 0px 5px;">
                        <label for="juros">Multa&nbsp;<i class="units">(%)</i></label>
                        <input type="text"
                               class="form-control widget-number"
                               id="juros"
                               pattern="[0-9]{1,8}([,][0-9]{1,2})?"
                               value="<%- formatter().formatNumber(juros, '0[.]00') %>"
                               style="padding: 6px 6px;"
                               disabled
                        >
                    </div>

                    <div class="form-group col-xs-6" style="padding: 0px 5px;">
                        <label for="pago_iva">Valor <i class="units js-change-mes">(MT/mês)</i></label>
                        <input type="text"
                               class="form-control widget-number"
                               id="pago_iva"
                               pattern="[0-9]{1,8}([,][0-9]{1,2})?"
                               value="<%- formatter().formatNumber(pago_iva, '0[.]00') %>"
                               disabled
                        >
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xs-6 panel-observacio">
            <div class="form-group">
                <label for="observacio">
                    <div style="display:inline-block; width: 24%">
                        Observações
                    </div>
                    <div id="js-btns-next">
                        <!-- TODO. Los "siguientes estados" disponibles no deberían estar harcodeados en el html
                        o bien, todos los botones deberían ser generados en otra parte, o de los dominios se deberían decidir que botones
                        se pueden usar en el modo combo o algo así
                        -->
                        <button id="bt-diferida" type="button" class="btn btn-default btn-sm uilib-enability uilib-hide-role-observador">Diferida</button>
                        <button id="bt-factura" type="button" class="btn btn-sm btn-primary uilib-enability uilib-hide-role-observador">Factura</button>
                        <button id="bt-recibo" type="button" class="btn btn-sm btn-primary uilib-enability uilib-hide-role-observador">Recibo</button>
                    </div>
                </label>
                <textarea id="observacio" class="form-control widget uilib-enability uilib-disable-role-observador"><%- observacio.slice(-1)[0].text %></textarea>
            </div>
        </div>

    </div>
    `),

    events: {
        "click #bt-diferida": "changeStateToPdteFactura",
        "click #bt-factura": "printFactura",
        "click #bt-recibo": "printRecibo",
    },

    initialize: function(options) {
        this.options = options || {};
        this.setListeners();
    },

    initFactPeriod: function() {
        let text = undefined;
        switch (this.options.exploracao.get("fact_tipo")) {
            case "Mensal":
                text = "mês";
                break;
            case "Trimestral":
                text = "trimestre";
                break;
            case "Anual":
                text = "ano";
                break;
        }
        let changeMesWidgets = document.getElementsByClassName("js-change-mes");
        for (e of changeMesWidgets) {
            e.innerText = `(MT/${text})`;
        }
    },

    modelChanged: function() {
        this.updatePagoIva();
        this.enableBts();
        this.initFactPeriod();
    },

    estadoChanged: function() {
        this.updateWidgets();
    },

    render: function() {
        var json = this.model.toJSON();
        this.$el.html(this.template(json));
        return this;
    },

    updateModel: function(newModel) {
        this.model = newModel;
        this.render();
        this.updateWidgets();
        this.setListeners();
    },

    setListeners: function() {
        this.listenTo(
            this.model,
            "change:iva change:juros change:observacio change:taxa_fixa_sub change:taxa_uso_sub change:consumo_fact_sub change:taxa_fixa_sup change:taxa_uso_sup change:consumo_fact_sup",
            this.modelChanged
        );
        this.listenTo(this.model, "change:fact_estado", this.estadoChanged);
        this.listenTo(this.options.exploracao, "change:fact_tipo", this.initFactPeriod);
    },

    updateWidgets: function() {
        this.disableWidgets();
        this.defineWidgetsToBeUsed();
        this.enabledWidgets();
        this.enableBts();
        iAuth.disabledWidgets();
        this.setWidgetsValue();
        this.initFactPeriod();
    },

    defineWidgetsToBeUsed: function() {
        this.widgets = [];
        var licenseWidgets = [];
        var self = this;
        // un observador no puede editar ningún campo
        if (iAuth.hasRoleObservador()) {
            return;
        }
        // un técnico puede editar el consumo y tipo de la licencia subterránea si se trata de una licencia de consumo variable
        if (iAuth.hasRoleTecnico()) {
            if (
                this.model.get("fact_estado") == window.SIRHA.ESTADO_FACT.PENDING_M3 &&
                this.options.tiposLicencia.includes("sub") &&
                this.model.get("consumo_tipo_sub") == "Variável"
            ) {
                licenseWidgets = ["consumo_tipo_sub", "consumo_fact_sub"];
            } else {
                return;
            }
        }

        // campos que se pueden editar
        if (this.model.get("fact_estado") != window.SIRHA.ESTADO_FACT.PENDING_M3) {
            // si la factura no está pendiente de introducir el consumo se pueden modificar los campos del financiero
            this.widgets = ["iva", "juros"];
            licenseWidgets = [
                "taxa_fixa_sup",
                "taxa_fixa_sub",
                "taxa_uso_sup",
                "taxa_uso_sub",
                "consumo_fact_sup",
                "consumo_fact_sub",
            ];
        } else {
            // si la factura está pendiente de introducir el consumo se pueden modificar los campos del técnico
            licenseWidgets = [
                "consumo_tipo_sup",
                "consumo_tipo_sub",
                "consumo_fact_sup",
                "consumo_fact_sub",
            ];
        }

        // pero nadie puede editar los tipos de consumo a menos que se trate de la última factura, por tanto, si no es el caso, los eliminamos de la lista
        if (this.model.id != this.options.exploracao.get("facturacao").at(0).id) {
            if (licenseWidgets.includes("consumo_tipo_sup")) {
                licenseWidgets.splice(licenseWidgets.indexOf("consumo_tipo_sup"), 1);
            }
            if (licenseWidgets.includes("consumo_tipo_sub")) {
                licenseWidgets.splice(licenseWidgets.indexOf("consumo_tipo_sub"), 1);
            }
        }

        this.options.tiposLicencia.forEach(function(tipo) {
            this.$("#lic-" + tipo).removeClass("panel-disabled");
            licenseWidgets.forEach(function(w) {
                if (w.endsWith(tipo)) {
                    self.widgets.push(w);
                }
            });
        });
    },

    disableWidgets: function() {
        if (this.widgets) {
            this.widgets.forEach(function(w) {
                var input = this.$("#edit-facturacao-modal #" + w);
                input.prop("disabled", true);
            });
        }
    },

    enabledWidgets: function() {
        var self = this;
        this.widgets.forEach(function(w) {
            var input = this.$("#edit-facturacao-modal #" + w);
            input.prop("disabled", false);
            input.prop("required", true);
            input.on("input", self.facturaUpdated.bind(self));
            input.on("input", self.enableBts.bind(self));
        });
        this.$("#observacio").on("input", this.observacioUpdated.bind(self));
    },

    enableBts: function() {
        var enable = this.widgets.every(function(w) {
            var input = this.$("#edit-facturacao-modal #" + w)[0];
            var e = input.value === 0 || input.value.trim();
            e = e && input.validity.valid;
            return e;
        });
        if (
            iAuth.hasRoleObservador() ||
            (iAuth.hasRoleTecnico() &&
                this.model.get("fact_estado") != window.SIRHA.ESTADO_FACT.PENDING_M3)
        ) {
            this.$("#bt-diferida").hide();
            this.$("#bt-factura").hide();
            this.$("#bt-recibo").hide();
        } else if (
            this.model.get("fact_estado") == window.SIRHA.ESTADO_FACT.PENDING_M3
        ) {
            this.$("#bt-diferida")
                .attr("disabled", !enable)
                .show();
            this.$("#bt-factura").hide();
            this.$("#bt-recibo").hide();
        } else {
            this.$("#bt-diferida").hide();
            this.$("#bt-factura")
                .attr("disabled", !enable)
                .show();
            this.$("#bt-recibo")
                .attr("disabled", !this.isReciboBtnEnabled() || !enable)
                .show();
        }
    },

    isReciboBtnEnabled() {
        return (
            this.model.get("fact_estado") != window.SIRHA.ESTADO_FACT.PENDING_INVOICE
        );
    },

    setWidgetsValue: function() {
        this.$("#consumo_tipo_sub").val(this.model.get("consumo_tipo_sub"));
        this.$("#consumo_tipo_sup").val(this.model.get("consumo_tipo_sup"));
    },

    facturaUpdated: function(evt) {
        var target = evt.currentTarget;
        if (target.validity.valid) {
            var modifiedAttributes = {};
            var trigger = false;
            if (target.nodeName == "INPUT") {
                modifiedAttributes[target.id] = formatter().unformatNumber(
                    target.value
                );
            } else if (target.nodeName == "SELECT") {
                modifiedAttributes[target.id] = target.value;
            }
            this.model.set(modifiedAttributes);
        }
    },

    observacioUpdated: function(evt) {
        var currentComment = this.model.get("observacio").slice(-1)[0];
        Object.assign(currentComment, {
            created_at: new Date(),
            autor: iAuth.getUser(),
            text: evt.currentTarget.value,
            state: this.model.get("fact_estado"),
        });
        this.model.trigger("change", this.model);
    },

    updatePagoMesLicencia: function(lic) {
        var taxa_fixa = formatter().unformatNumber(
            document.getElementById("taxa_fixa_" + lic).value
        );
        var taxa_uso = formatter().unformatNumber(
            document.getElementById("taxa_uso_" + lic).value
        );
        var consumo_fact = formatter().unformatNumber(
            document.getElementById("consumo_fact_" + lic).value
        );
        var pago_mes = taxa_fixa + taxa_uso * consumo_fact;
        var iva = formatter().unformatNumber(document.getElementById("iva").value) || 0;
        var pago_mes_iva = pago_mes * (1 + iva / 100);
        this.model.set("pago_mes_" + lic, pago_mes);
        this.model.set("pago_iva_" + lic, pago_mes_iva);
        this.model.set("iva_" + lic, iva);
        document.getElementById("pago_mes_" + lic).value = formatter().formatNumber(
            pago_mes,
            "0[.]00"
        );
    },

    updatePagoIva: function() {
        this.updatePagoMesLicencia("sup");
        this.updatePagoMesLicencia("sub");
        var pago_mes_sup =
            formatter().unformatNumber(document.getElementById("pago_mes_sup").value) ||
            0;
        var pago_mes_sub =
            formatter().unformatNumber(document.getElementById("pago_mes_sub").value) ||
            0;

        var juros =
            formatter().unformatNumber(document.getElementById("juros").value) || 0;
        var iva = formatter().unformatNumber(document.getElementById("iva").value) || 0;
        var pago_iva =
            (pago_mes_sup + pago_mes_sub) * (1 + iva / 100) * (1 + juros / 100);
        this.model.set({pago_iva: pago_iva});
        document.getElementById("pago_iva").value = formatter().formatNumber(
            pago_iva,
            "0[.]00"
        );
    },

    updateToState: function(state) {
        if (wf.isFacturacaoNewStateValid(this.model.get("fact_estado"), state)) {
            this.createNewObseracio();
            this.model.set("fact_estado", state);
        }
    },

    createNewObseracio: function() {
        this.model.get("observacio").push({
            created_at: null,
            autor: null,
            text: null,
            state: null,
        });
        this.$("#observacio").val("");
    },

    updateFacturaData: function(factId, factDate) {
        this.model.set("fact_id", factId);
        this.model.set("fact_date", factDate);
    },

    updateReciboData: function(reciboId, reciboDate) {
        this.model.set("recibo_id", reciboId);
        this.model.set("recibo_date", reciboDate);
    },

    changeStateToPdteFactura: function() {
        var self = this;
        bootbox.confirm(
            `A factura vai mudar o seu estado a: <br> <strong>${window.SIRHA.ESTADO_FACT.PENDING_INVOICE}</strong>`,
            function(result) {
                if (result) {
                    self.updateToState(window.SIRHA.ESTADO_FACT.PENDING_INVOICE);
                }
            }
        );
    },

    printFactura: function() {
        var data = this.getDataForFactura();
        data.urlTemplate = Backbone.SIXHIARA.tipoTemplates["Factura"];
        this.printFacturaDocument(data, window.SIRHA.ESTADO_FACT.PENDING_PAY);
    },

    printRecibo: function() {
        var data = this.getDataForRecibo();
        data.urlTemplate = Backbone.SIXHIARA.tipoTemplates["Recibo"];
        this.printReciboDocument(data, window.SIRHA.ESTADO_FACT.PAID);
    },

    getDataForFactura: function() {
        var json = this.options.exploracao.toJSON();

        if (!json.loc_unidad) {
            bootbox.alert("A exploração tem que ter uma Unidade de Gestão.");
            return;
        }
        // Create a copy of the model and remove nulls
        var data = JSON.parse(
            JSON.stringify(json, function(key, value) {
                if (value === null) {
                    return "";
                }
                return value;
            })
        );

        var factura = this.model.toJSON();

        var dateFactura = new moment(
            factura.fact_date ? new Date(factura.fact_date) : new Date()
        );
        data.dateFactura = formatter().formatDate(dateFactura);
        data.vencimento = formatter().formatDate(dateFactura.add(1, "M"));

        factura.licencias = {};
        data.licencias.forEach(function(licencia) {
            var tipo = licencia.tipo_agua.substring(0, 3).toLowerCase();
            factura.licencias[tipo] = {};
            factura.licencias[tipo].tipo = tipo;
            factura.licencias[tipo].consumo_fact = factura["consumo_fact_" + tipo];
            factura.licencias[tipo].taxa_fixa = factura["taxa_fixa_" + tipo];
            factura.licencias[tipo].taxa_uso = factura["taxa_uso_" + tipo];
            factura.licencias[tipo].pago_mes = factura["pago_mes_" + tipo];
            factura.licencias[tipo].iva = factura["iva_" + tipo];
            factura.licencias[tipo].pago_iva = factura["pago_iva_" + tipo];
        });
        data.factura = factura;

        data.nameFile = data.exp_id
            .concat("_")
            .concat(factura.mes)
            .concat("_")
            .concat(factura.ano)
            .concat(".docx");

        return data;
    },

    getDataForRecibo: function() {
        var json = this.options.exploracao.toJSON();

        if (!json.loc_unidad) {
            bootbox.alert("A exploração tem que ter uma Unidade de Gestão.");
            return;
        }
        // Create a copy of the model and remove nulls
        var data = JSON.parse(
            JSON.stringify(json, function(key, value) {
                if (value === null) {
                    return "";
                }
                return value;
            })
        );

        var factura = this.model.toJSON();
        data.numFactura = factura.fact_id;
        var dateRecibo = factura.recibo_date
            ? new Date(factura.recibo_date)
            : new Date();
        data.dateRecibo = formatter().formatDate(moment(dateRecibo));
        data.dateFactura = formatter().formatDate(moment(new Date(factura.fact_date)));
        data.tipoFacturacao = factura.fact_tipo;
        data.periodoFactura = factura.mes + "/" + factura.ano;
        data.valorPorRegularizar = factura.pago_iva;
        data.valorRegularizado = factura.pago_iva;
        data.valorAberto = 0;

        data.nameFile =
            "Recibo_" +
            data.exp_id
                .concat("_")
                .concat(factura.mes)
                .concat("_")
                .concat(factura.ano)
                .concat(".docx");

        return data;
    },

    printFacturaDocument: function(data, nextState) {
        if (nextState == this.model.get("fact_estado")) {
            nextState = null;
        }
        var self = this;
        var factura = new Backbone.SIXHIARA.NewFactura({id: this.model.id});
        var datosAra = new Backbone.SIXHIARA.AraGetData();
        datosAra.fetch({
            success: function(model, resp, options) {
                data.ara = resp;
                data.ara.logoUrl =
                    "static/print-templates/images/" +
                    window.SIRHA.getARA() +
                    "_factura.png";
                factura.fetch({
                    success: function(model, resp, options) {
                        data.numFactura = resp;
                        var docxGenerator = new Backbone.SIXHIARA.DocxGeneratorView({
                            model: self.model,
                            data: data,
                        });
                        self.updateFacturaData(data.numFactura, data.factDate);
                        if (nextState) {
                            self.updateToState(nextState);
                        }
                    },
                    error: function() {
                        bootbox.alert("Erro ao gerar a factura.");
                        return;
                    },
                });
            },
            error: function() {
                bootbox.alert(`Erro ao imprimir factura`);
            },
        });
    },

    printReciboDocument: function(data, nextState) {
        if (nextState == this.model.get("fact_estado")) {
            nextState = null;
        }
        var self = this;
        var factura = new Backbone.SIXHIARA.NewRecibo({id: this.model.id});
        var datosAra = new Backbone.SIXHIARA.AraGetData();
        datosAra.fetch({
            success: function(model, resp, options) {
                data.ara = resp;
                data.ara.logoUrl =
                    "static/print-templates/images/" +
                    window.SIRHA.getARA() +
                    "_factura.png";
                factura.fetch({
                    success: function(model, resp, options) {
                        data.numRecibo = resp;
                        var docxGenerator = new Backbone.SIXHIARA.DocxGeneratorView({
                            model: self.model,
                            data: data,
                        });
                        self.updateReciboData(data.numRecibo, data.reciboDate);
                        if (nextState) {
                            self.updateToState(nextState);
                        }
                    },
                    error: function() {
                        bootbox.alert("Erro ao gerar a factura.");
                        return;
                    },
                });
            },
            error: function() {
                bootbox.alert(`Erro ao imprimir factura`);
            },
        });
    },
});
