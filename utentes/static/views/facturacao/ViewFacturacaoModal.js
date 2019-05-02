Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewFacturacaoModal = Backbone.View.extend({

    className: 'view-facturacao',

    id: 'edit-facturacao-modal',
    template: _.template(`
    <h4 class="
    <%
        if(fact_estado === "Pendente Acrescentar Consumo (R. Cad DT)") {
            print('text-label-pdt-consumo');
        }else if(fact_estado === "Pendente Emisão Factura (D. Fin)"){
            print('text-label-pdt-factura');
        }else if(fact_estado === "Pendente Pagamento (Utente)"){
            print('text-label-pdt-pagamento');
        }else if(fact_estado === "Pagada"){
            print('text-label-pagada');
        }
    %>
    ">
        <%- mes %>/<%- ano %> (<%- fact_estado %>)
    </h4>
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
                            <option selected>Fixo</option>
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
                        <label for="taxa_fixa_sub">Taxa fixa&nbsp;<i class="units">(MZN/mês)</i></label>
                        <input type="text" class="form-control widget-number" id="taxa_fixa_sub" pattern="[0-9]{1,8}([,][0-9]{1,2})?" value="<%- formatter().formatNumber(taxa_fixa_sub, '0[.]00') %>" disabled>
                    </div>

                    <div class="form-group col-xs-12">
                        <label for="taxa_uso_sub">Taxa de uso&nbsp;<i class="units">(MZN/m<sup>3</sup>)</i></label>
                        <input type="text" class="form-control widget-number" id="taxa_uso_sub" pattern="[0-9]{1,8}([,][0-9]{1,2})?" value="<%- formatter().formatNumber(taxa_uso_sub, '0[.]00') %>" disabled>
                    </div>

                    <div class="form-group col-xs-12">
                        <label for="pago_mes_sub">Valor pago mês&nbsp;<i class="units">(MZN/més)</i></label>
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
                        <select class="form-control" id="consumo_tipo_sup" disabled >
                            <option selected>Fixo</option>
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
                        <label for="taxa_fixa_sup">Taxa fixa&nbsp;<i class="units">(MZN/mês)</i></label>
                        <input type="text" class="form-control widget-number" id="taxa_fixa_sup" pattern="[0-9]{1,8}([,][0-9]{1,2})?" value="<%- formatter().formatNumber(taxa_fixa_sup, '0[.]00') %>" disabled>
                    </div>

                    <div class="form-group col-xs-12">
                        <label for="taxa_uso_sup">Taxa de uso&nbsp;<i class="units">(MZN/m<sup>3</sup>)</i></label>
                        <input type="text" class="form-control widget-number" id="taxa_uso_sup" pattern="[0-9]{1,8}([,][0-9]{1,2})?" value="<%- formatter().formatNumber(taxa_uso_sup, '0[.]00') %>" disabled>
                    </div>

                    <div class="form-group col-xs-12">
                        <label for="pago_mes_sup">Valor pago mês&nbsp;<i class="units">(MZN/més)</i></label>
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
                    <div class="form-group col-xs-3">
                        <label for="iva">IVA&nbsp;<i class="units">(%)</i></label>
                        <input type="text" class="form-control widget-number" id="iva" pattern="[0-9]{1,8}([,][0-9]{1,2})?" value="<%- formatter().formatNumber(iva, '0[.]00') %>" disabled>
                    </div>

                    <div class="form-group col-xs-3">
                    <label for="iva">Juros&nbsp;<i class="units">(%)</i></label>
                    <input type="text" class="form-control widget-number" id="juro" pattern="[0-9]{1,8}([,][0-9]{1,2})?" value="<%- formatter().formatNumber(juro, '0[.]00') %>" disabled>    
                    </div>

                    <div class="form-group col-xs-6">
                        <label for="pago_iva">Valor <i class="units">(MZN/mês)</i></label>
                        <input type="text" class="form-control widget-number" id="pago_iva" pattern="[0-9]{1,8}([,][0-9]{1,2})?" value="<%- formatter().formatNumber(pago_iva, '0[.]00') %>" disabled>
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
                        <button id="bt-factura" type="button" class="btn btn-sm btn-primary js-btns-next uilib-enability uilib-hide-role-observador">Factura</button>
                        <button id="bt-recibo" type="button" class="btn btn-sm btn-primary js-btns-next uilib-enability uilib-hide-role-observador">Recibo</button>
                    </div>
                </label>
                <textarea id="observacio" value="<%- observacio.slice(-1)[0].text %>" class="form-control widget uilib-enability uilib-disable-role-observador"></textarea>
            </div>
        </div>

    </div>
    `),

    events: {
        'click #bt-diferida': 'changeStateToPdteFactura',
        'click #bt-factura': 'printFactura',
        'click #bt-recibo': 'printRecibo',
    },

    initialize: function (options) {
        this.options = options || {};
        this.setListeners();
    },

    modelChanged: function() {
        this.updatePagoIva();
        this.enableBts();
        console.log('modelChanged', this.model);
    },

    render: function() {
        var json = this.model.toJSON();
        this.$el.html(this.template(json));
        return this;
    },

    updateModel: function(newModel) {
        console.log('updateModel', newModel)
        this.model = newModel;
        this.render();
        this.updateWidgets();
        this.setListeners();
    },

    setListeners: function() {
        console.log('listeners para', this.model.cid);
        this.listenTo(this.model, 'change:fact_estado change:iva change:juro change:taxa_fixa_sub change:taxa_uso_sub change:consumo_fact_sub change:taxa_fixa_sup change:taxa_uso_sup change:consumo_fact_sup', this.modelChanged)
    },

    updateWidgets: function() {
        this.defineWidgetsToBeUsed();
        this.enabledWidgets();
        this.enableBts();
    },

    defineWidgetsToBeUsed: function() {
        var self = this;
        if (iAuth.hasRoleObservador()) {
            this.widgets = [];
            return;
        }
        this.widgets = ['iva', 'juro'];
        this.options.tiposLicencia.forEach(function(tipo){
            this.$('#lic-' + tipo).removeClass('panel-disabled');
            ['taxa_fixa_sup', 'taxa_fixa_sub', 'taxa_uso_sup', 'taxa_uso_sub', 'consumo_fact_sup', 'consumo_fact_sub'].forEach(function(w){
                if (w.endsWith(tipo)) {
                    self.widgets.push(w);
                }
            });
        });
    },

    enabledWidgets: function() {
        var self = this;
        this.widgets.forEach(function(w){
            var input = this.$('#edit-facturacao-modal #' + w);
            input.prop('disabled', false);
            input.prop('required', true);
            input.on('input', self.facturaUpdated.bind(self));
            input.on('input', self.enableBts.bind(self));
        });
    },

    enableBts: function() {
        var enable = this.widgets.every(function(w){
            var input = this.$('#edit-facturacao-modal #' + w)[0];
            var e = input.value === 0 || input.value.trim();
            e = e && input.validity.valid;
            return e;
        });
        if(this.model.get('fact_estado') == window.SIRHA.ESTADO_FACT.PENDING_M3) {
            this.$('#bt-diferida').attr('disabled', !enable).show();
            this.$('#bt-factura').hide();
            this.$('#bt-recibo').hide();
        }else{
            this.$('#bt-diferida').hide();
            this.$('#bt-factura').attr('disabled', !enable).show();
            this.$('#bt-recibo').attr('disabled', !this.isReciboBtnEnabled() || !enable).show();
        }
    },

    isReciboBtnEnabled() {
        return this.model.get('fact_estado') != window.SIRHA.ESTADO_FACT.PENDIND_INVOICE;
    },

    facturaUpdated: function(evt) {
        var target = evt.currentTarget;
        console.log('facturaUpdated', target.nodeName, target.id, target.value, target.validity.valid)
        if (target.validity.valid) {
            var modifiedAttributes = {};
            if(target.nodeName == "INPUT") {
                modifiedAttributes[target.id] = formatter().unformatNumber(target.value);
            } else if(target.nodeName == "SELECT") {
                modifiedAttributes[target.id] = target.value;
            }
            this.model.set(modifiedAttributes);
        }
    },
    
    updatePagoMesLicencia: function(lic) {
        var taxa_fixa = formatter().unformatNumber(document.getElementById('taxa_fixa_' + lic).value);
        var taxa_uso = formatter().unformatNumber(document.getElementById('taxa_uso_' + lic).value);
        var consumo_fact = formatter().unformatNumber(document.getElementById('consumo_fact_' + lic).value);
        var pago_mes = taxa_fixa + (taxa_uso * consumo_fact);
        var iva = formatter().unformatNumber(document.getElementById('iva').value) || 0;
        var pago_mes_iva = pago_mes * (1 + iva / 100);
        this.model.set('pago_mes_' + lic, pago_mes);
        this.model.set('pago_iva_' + lic, pago_mes_iva);
        this.model.set('iva_' + lic, iva);
        document.getElementById('pago_mes_' + lic).value = formatter().formatNumber(pago_mes, '0[.]00');
    },

    updatePagoIva: function() {
        this.updatePagoMesLicencia('sup');
        this.updatePagoMesLicencia('sub');
        var pago_mes_sup = formatter().unformatNumber(document.getElementById('pago_mes_sup').value) || 0;
        var pago_mes_sub = formatter().unformatNumber(document.getElementById('pago_mes_sub').value) || 0;

        var juro = formatter().unformatNumber(document.getElementById('juro').value) || 0;
        var iva = formatter().unformatNumber(document.getElementById('iva').value) || 0;
        var pago_iva = ((pago_mes_sup + pago_mes_sub) * (1 + iva / 100) * (1 + juro / 100));
        this.model.set({'pago_iva': pago_iva});
        document.getElementById('pago_iva').value = formatter().formatNumber(pago_iva, '0[.]00');
    },

    updateToState: function(state) {
        this.model.set('fact_estado', state);
    },

    changeStateToPdteFactura: function() {
        var self = this;
        bootbox.confirm(`A factura vai mudar o seu estado a: <br> <strong>${window.SIRHA.ESTADO_FACT.PENDIND_INVOICE}</strong>`, function(result){
            if (result) {
                self.updateToState(window.SIRHA.ESTADO_FACT.PENDIND_INVOICE);
            }
        });
    },

    printFactura: function(){
        var data = this.getDataForFactura();
        data.urlTemplate = Backbone.SIXHIARA.tipoTemplates['Factura'];
        this.printDocument(data, window.SIRHA.ESTADO_FACT.PENDING_PAY);
    },

    printRecibo: function(){
        var data = this.getDataForRecibo();
        data.urlTemplate = Backbone.SIXHIARA.tipoTemplates['Recibo'];
        this.printDocument(data, window.SIRHA.ESTADO_FACT.PAYED);
    },

    getDataForFactura: function() {
        var json = this.options.exploracao.toJSON();

        if (!json.loc_unidad) {
            bootbox.alert("A exploração tem que ter uma Unidade de Gestão.");
            return;
        }
        // Create a copy of the model and remove nulls
        var data = JSON.parse(JSON.stringify(json, function(key, value) {
            if(value === null) {
                return "";
            }
            return value;
        }));

        var date = moment(new Date());
        data.dateFactura = formatter().formatDate(date);
        data.vencimento = formatter().formatDate(date.add(1, 'M'));

        var factura = this.model.toJSON();
        factura.licencias = {}
        data.licencias.forEach(function(licencia){
            var tipo = licencia.tipo_agua.substring(0, 3).toLowerCase();
            factura.licencias[tipo] = {};
            factura.licencias[tipo].tipo = tipo;
            factura.licencias[tipo].consumo_fact = factura['consumo_fact_' + tipo];
            factura.licencias[tipo].taxa_fixa = factura['taxa_fixa_' + tipo];
            factura.licencias[tipo].taxa_uso = factura['taxa_uso_' + tipo];
            factura.licencias[tipo].pago_mes = factura['pago_mes_' + tipo];
            factura.licencias[tipo].iva = factura['iva_' + tipo];
            factura.licencias[tipo].pago_iva = factura['pago_iva_' + tipo];
        });
        data.factura = factura;

        data.nameFile = data.exp_id.concat("_")
                                   .concat(factura.mes)
                                   .concat('_')
                                   .concat(factura.ano)
                                   .concat('.docx');

        return data;
    },

    getDataForRecibo: function() {
        console.log('getDataForRecibo')
        var json = this.options.exploracao.toJSON();

        if (!json.loc_unidad) {
            bootbox.alert("A exploração tem que ter uma Unidade de Gestão.");
            return;
        }
        // Create a copy of the model and remove nulls
        var data = JSON.parse(JSON.stringify(json, function(key, value) {
            if(value === null) {
                return "";
            }
            return value;
        }));

        var factura = this.model.toJSON();
        data.numRecibo = '001-'+ factura.fact_id;
        data.numFactura = factura.fact_id;
        data.dateFactura =  formatter().formatDate(moment(new Date(factura.created_at)));
        data.tipoFacturacao = factura.fact_tipo;
        data.periodoFactura = factura.mes + '/' + factura.ano;
        data.valorPorRegularizar = factura.pago_iva;
        data.valorRegularizado = factura.pago_iva;
        data.valorAberto = 0;

        var date = moment(new Date());
        data.dateRecibo = formatter().formatDate(date);

        data.nameFile = data.exp_id.concat("_")
                                   .concat(factura.mes)
                                   .concat('_')
                                   .concat(factura.ano)
                                   .concat('.docx');

        return data;
    },

    printDocument: function(data, nextState) {
        if(nextState == this.model.get('fact_estado')) {
            nextState = null;
        }
        var self = this;
        var factura = new Backbone.SIXHIARA.NewFactura({id: this.model.id});
        var datosAra = new Backbone.SIXHIARA.AraGetData();
        console.log(data)
        datosAra.fetch({
            success: function(model, resp, options) {
                data.ara = resp
                data.ara.logoUrl = 'static/print-templates/images/' + window.SIRHA.getARA() + '_factura.png';
                factura.fetch({
                    success: function(model, resp, options) {
                        data.numFactura = resp;
                        var docxGenerator = new Backbone.SIXHIARA.DocxGeneratorView({
                            model: self.model,
                            data: data
                        });
                        if(nextState) {
                            self.updateToState(nextState);
                        }
                    },
                    error: function(){
                        bootbox.alert("Erro ao gerar a factura.");
                        return;
                    }
                });
            },
            error: function() {
                bootbox.alert(`Erro ao imprimir factura`);
            }
        });
    }

});
