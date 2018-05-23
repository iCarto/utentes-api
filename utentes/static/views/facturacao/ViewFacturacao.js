Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewFacturacao = Backbone.View.extend({
    tagName:  'div',

    // optional, you can assign multiple classes to
    // this property like so: 'container homepage'
    className: 'myclass',

    // Note: When declaring a View, options, el, tagName, id and className
    // may be defined as functions, if you want their values to be determined
    // at runtime.
    id: 'myid', // optional
    template: _.template(`
    <div id="bt-toolbar" class="row" style="margin-bottom: 10px; margin-top: 10px">
        <div class="col-xs-12">
            <div class="btn-group btn-group-justified" role="group">
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-default" disabled>Anexar Documentação&nbsp;(<i class="fa fa-upload"></i>)</button>
                </div>
                <div class="btn-group" role="group">
                    <button id="bt-ver-doc" type="button" class="btn btn-default" disabled>Transferir Documentação&nbsp;(<i class="fa fa-download"></i>)</button>
                </div>
                <div class="btn-group" role="group">
                    <a id="bt-ficha" class="btn btn-default" role="button" href="/exploracao-show.html?id=<%- id %>">Ficha</a>
                </div>
                <div class="btn-group" role="group">
                    <button id="bt-emision" type="button" class="btn btn-default" disabled>Factura&nbsp;(emissão licença)</button>
                </div>
                <div class="btn-group" role="group">
                    <button id="bt-consumo" type="button" class="btn btn-default" disabled>Factura&nbsp;(consumo)</button>
                </div>
            </div>
        </div>
    </div>


<h4 style="margin-bottom: 10px;">
<span style="color:#00a2da"><%- exp_id + ' '%> <%- exp_name %></span> <span style="color: grey"><%= ' (' + (actividade && actividade.tipo || 'Não declarada') + '). ' %></span>
<%- (licencias && licencias[0] && licencias[0].tipo_agua || '-') + ' / ' %><%- licencias && licencias[1] && licencias[1].tipo_agua || '-' %>
<br>
<small style="font-size: 50%;" class="label <%- summary_licencia_val ? 'label-success' : 'label-danger' %>" id="summary_licencia"><%- summary_licencia_msg.charAt(0) %></small>
&nbsp;<small style="font-size: 50%;" class="label <%- summary_consumo_val ? 'label-success' : 'label-danger' %>" id="summary_consumo"><%- summary_consumo_msg.charAt(0) %></small>
&nbsp;<small style="font-size: 50%;" class="label <%- summary_pagos_val === null ? 'label-default' : (summary_pagos_val ? 'label-success' : 'label-danger') %>" id="summary_pagos"><%- summary_pagos_msg.charAt(0) %></small>
&nbsp;<small style="font-size: 65%;" ><%- utente['nome'] %></small>
</h4>

    <div class="row form-horizontal" style="margin-top: 10px">

        <div class="col-xs-4">
            <div class="form-group" style="margin-left: 0px; margin-right: 0px">
                <label for="pago_lic" class="control-label col-xs-9" style="text-align: left">Pagamento emissão licença</label>
                <div class="col-xs-3" style="padding-left: 10px; padding-right: 10px;">
                    <select class="form-control" style="padding: 3px 5px;" id="pago_lic" disabled>
                        <option>Sim</option>
                        <option selected>Não</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="col-xs-4">
            <div class="form-group" style="margin-left: 0px; margin-right: 0px">
                <label for="pagos" class="control-label col-xs-9" style="text-align: left">Pagamento consumos</label>
                <div class="col-xs-3" style="padding-left: 10px; padding-right: 10px;">
                    <select class="form-control" style="padding: 3px 5px;" id="pagos" disabled>
                        <option>Sim</option>
                        <option selected>Não</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="form-group col-xs-4">
            <div class="form-group" style="margin-left: 0px; margin-right: 0px">
                <label for="fact_tipo" class="control-label col-xs-7" style="text-align: left">Tipo de facturação</label>
                <div class="col-xs-5" style="padding-left: 10px; padding-right: 10px;">
                    <select class="form-control" style="padding: 3px 3px;" id="fact_tipo" disabled>
                        <option selected>Mensal</option>
                        <option>Trimestral</option>
                        <option>Anual</option>
                    </select>
                </div>
            </div>
        </div>

    </div>

    <div class="row panel-equal-height">

        <div class="col-xs-4">
            <div id="lic-sup" class="panel panel-info panel-disabled">
                <div class="panel-heading">
                    <h3 class="panel-title"><strong>Licença Superficial</strong></h3>
                </div>
                <div class="panel-body row">
                    <div class="form-group col-xs-12">
                        <label for="consumo_tipo_sup"><strong>Tipo de consumo</strong></label>
                        <select class="form-control" id="consumo_tipo_sup" disabled >
                            <option>Fixo</option>
                            <option selected>Variável</option>
                        </select>
                    </div>

                    <div class="form-group col-xs-12">
                        <label for="c_licencia_sup">Consumo licenciado&nbsp;<i class="units">(m<sup>3</sup>/mês)</i></label>
                        <input type="text" class="form-control widget-number" id="c_licencia_sup" pattern="[0-9]{1,8}([,][0-9]{1,2})?" value="<%- formatter().formatNumber(c_licencia_sup, '0[.]00') %>" disabled>
                    </div>

                    <div class="form-group col-xs-12">
                        <label for="consumo_fact_sup">Consumo facturado&nbsp;<i class="units">(m<sup>3</sup>/mês)</i></label>
                        <input type="text" class="form-control widget-number" id="consumo_fact_sup" pattern="[0-9]{1,8}([,][0-9]{1,2})?" value="<%- formatter().formatNumber(facturacao[facturacao.length - 1].consumo_fact_sup, '0[.]00') %>" disabled>
                    </div>

                    <div class="form-group col-xs-12">
                        <label for="taxa_fixa_sup">Taxa fixa&nbsp;<i class="units">(MZN/mês)</i></label>
                        <input type="text" class="form-control widget-number" id="taxa_fixa_sup" pattern="[0-9]{1,8}([,][0-9]{1,2})?" value="<%- formatter().formatNumber(facturacao[facturacao.length - 1].taxa_fixa_sup, '0[.]00') %>" disabled>
                    </div>

                    <div class="form-group col-xs-12">
                        <label for="taxa_uso_sup">Taxa de uso&nbsp;<i class="units">(MZN/m<sup>3</sup>)</i></label>
                        <input type="text" class="form-control widget-number" id="taxa_uso_sup" pattern="[0-9]{1,8}([,][0-9]{1,2})?" value="<%- formatter().formatNumber(facturacao[facturacao.length - 1].taxa_uso_sup, '0[.]00') %>" disabled>
                    </div>

                    <div class="form-group col-xs-12">
                        <label for="pago_mes_sup">Valor pago mês&nbsp;<i class="units">(MZN/més)</i></label>
                        <input type="text" class="form-control widget-number" id="pago_mes_sup" pattern="[0-9]{1,8}([,][0-9]{1,2})?" disabled value="<%- formatter().formatNumber(facturacao[facturacao.length - 1].pago_mes_sup, '0[.]00') %>" disabled>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xs-4">
            <div id="lic-sub" class="panel panel-info panel-disabled">
                <div class="panel-heading">
                    <h3 class="panel-title"><strong>Licença Subterrânea</strong></h3>
                </div>
                <div class="panel-body row">
                    <div class="form-group col-xs-12">
                        <label for="consumo_tipo_sub"><strong>Tipo de consumo</strong></label>
                        <select class="form-control" id="consumo_tipo_sub" disabled >
                            <option>Fixo</option>
                            <option selected>Variável</option>
                        </select>
                    </div>

                    <div class="form-group col-xs-12">
                        <label for="c_licencia_sub">Consumo licenciado&nbsp;<i class="units">(m<sup>3</sup>/mês)</i></label>
                        <input type="text" class="form-control widget-number" id="c_licencia_sub" pattern="[0-9]{1,8}([,][0-9]{1,2})?" value="<%- formatter().formatNumber(c_licencia_sub, '0[.]00') %>" disabled>
                    </div>

                    <div class="form-group col-xs-12">
                        <label for="consumo_fact_sub">Consumo facturado&nbsp;<i class="units">(m<sup>3</sup>/mês)</i></label>
                        <input type="text" class="form-control widget-number" id="consumo_fact_sub" pattern="[0-9]{1,8}([,][0-9]{1,2})?" value="<%- formatter().formatNumber(facturacao[facturacao.length - 1].consumo_fact_sub, '0[.]00') %>" disabled>
                    </div>

                    <div class="form-group col-xs-12">
                        <label for="taxa_fixa_sub">Taxa fixa&nbsp;<i class="units">(MZN/mês)</i></label>
                        <input type="text" class="form-control widget-number" id="taxa_fixa_sub" pattern="[0-9]{1,8}([,][0-9]{1,2})?" value="<%- formatter().formatNumber(facturacao[facturacao.length - 1].taxa_fixa_sub, '0[.]00') %>" disabled>
                    </div>

                    <div class="form-group col-xs-12">
                        <label for="taxa_uso_sub">Taxa de uso&nbsp;<i class="units">(MZN/m<sup>3</sup>)</i></label>
                        <input type="text" class="form-control widget-number" id="taxa_uso_sub" pattern="[0-9]{1,8}([,][0-9]{1,2})?" value="<%- formatter().formatNumber(facturacao[facturacao.length - 1].taxa_uso_sub, '0[.]00') %>" disabled>
                    </div>

                    <div class="form-group col-xs-12">
                        <label for="pago_mes_sub">Valor pago mês&nbsp;<i class="units">(MZN/més)</i></label>
                        <input type="text" class="form-control widget-number" id="pago_mes_sub" pattern="[0-9]{1,8}([,][0-9]{1,2})?" value="<%- formatter().formatNumber(facturacao[facturacao.length - 1].pago_mes_sub, '0[.]00') %>" disabled>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xs-4" style="border-left: 1px solid #337ab7">
            <div class="panel panel-info">
                <div class="panel-heading">
                    <h3 class="panel-title"><strong>Histórico</strong></h3>
                </div>
                <div class="panel-body row">
                    <ul id="historico">
                    <% for (var i=0; i < facturacao.length ; i+=1) {
                        print('<li><strong>' + facturacao[i].mes + '/' + facturacao[i].ano + '</strong>. Valor com IVA: ' + (formatter().formatNumber(facturacao[i].pago_iva, '0[.]00') || '-') + ' MZN </li>')
                        print('<ul><li>Superficial: ' + (formatter().formatNumber(facturacao[i].consumo_fact_sup, '0[.]00') || '-') +  ' m<sup>3</sup></li><li>Subterrânea: ' + (formatter().formatNumber(facturacao[i].consumo_fact_sub, '0[.]00') || '-') + ' m<sup>3</sup></li></ul>')
                    }
                    %>
                    </ul>
                </div>
            </div>
        </div>

    </div> <!-- /panel-equal-height -->

    <div class="row panel-equal-height">
      <div class="col-xs-8">
          <div class="panel panel-info">
              <div class="panel-heading">
                  <h3 class="panel-title"><strong>Facturação</strong></h3>
              </div>
              <div class="panel-body row">

                  <div class="form-group col-xs-6">
                      <label for="iva">IVA&nbsp;<i class="units">(%)</i></label>
                      <input type="text" class="form-control widget-number" id="iva" pattern="[0-9]{1,8}([,][0-9]{1,2})?" value="<%- formatter().formatNumber(facturacao[facturacao.length - 1].iva, '0[.]00') %>" disabled>
                  </div>

                  <div class="form-group col-xs-6">
                      <label for="pago_iva">Valor com IVA&nbsp;<i class="units">(MZN/mês)</i></label>
                      <input type="text" class="form-control widget-number" id="pago_iva" pattern="[0-9]{1,8}([,][0-9]{1,2})?" value="<%- formatter().formatNumber(facturacao[facturacao.length - 1].pago_iva, '0[.]00') %>" disabled>
                  </div>
              </div>
          </div>
      </div>

      <div class="col-xs-4 panel-observacio">
      <div class="panel">
        <div class="form-group">
            <label for="observacio">
                <div style="display:inline-block; width: 24%">
                    Observações
                </div>
                <div id="js-btns-next" class="text-right" style="display:inline-block; width: 74%" >
                    <!-- TODO. Los "siguientes estados" disponibles no deberían estar harcodeados en el html
                    o bien, todos los botones deberían ser generados en otra parte, o de los dominios se deberían decidir que botones
                    se pueden usar en el modo combo o algo así
                    -->
                    <button id="bt-ok" type="button" class="btn btn-default btn-sm">Diferida</button>
                </div>
            </label>
            <textarea id="observacio" class="form-control widget"></textarea>
        </div>
      </div>
      </div>

    </div>
    `),

    initialize: function (options) {
        this.options = options || {};
    },

    render: function() {
        var json = this.model.toJSON();
        json.c_licencia_sup = this.model.getLicencia('sup').get('c_licencia');
        json.c_licencia_sub = this.model.getLicencia('sub').get('c_licencia');
        this.$el.html(this.template(json));
        return this;
    },

    /*
    Esto en realidad está por no  usar jquery. Si se hace en render todavía no están en el
    DOM los elementos y no se puede usar document ¿?. Con jquery en cambio se quedan
    binded para después al usar this.$
    */
    init: function() {
        self = this;
        var fact = this.model.get('facturacao').slice(-1)[0];
        var currentComment = fact['observacio'].slice(-1)[0];
        if (currentComment.text) {
            document.getElementById('observacio').value = currentComment.text;
        }

        document.getElementById('js-btns-next').addEventListener('click', function(e){
            self.fillExploracao(e);
        });

        // var wf_tmp = Object.create(MyWorkflow);
        // var currentState = this.model.get('estado_lic');
        // document.querySelectorAll('#js-btns-next > button').forEach(function(bt) {
        //     var nextBtState = wf_tmp.whichNextState(currentState, {target:{id: bt.id}}, self.model);
        //     bt.title = nextBtState;
        // });

        this.widgetsToBeUsed();
        this.enabledWidgets();
        this.enableBts();

        $('[data-toggle="tooltip"]').tooltip();

        $('#historico li a').click(function(){
            var i = $(this).parent().index();
            self.renderModal(i);
        });

        this.initSelects()
        document.getElementById('observacio').addEventListener('input', self.autosave.bind(self), false);
    },

    widgetsToBeUsed: function() {
        var self = this;
        this.widgets = ['pago_lic', 'pagos', 'fact_tipo', 'iva'];
        this.model.get('licencias').forEach(function(lic){
            var tipo = lic.get('tipo_agua').substring(0, 3).toLowerCase();
            document.getElementById('lic-' + tipo).classList.remove('panel-disabled');
            ['taxa_fixa_sup', 'taxa_fixa_sub', 'taxa_uso_sup', 'taxa_uso_sub'].forEach(function(w){
                if (w.endsWith(tipo)) {
                    self.widgets.push(w);
                }
            });
        });
    },

    enabledWidgets: function() {
        this.widgets.forEach(function(w){
            var input = document.querySelectorAll('#myid #' + w)[0];
            input.disabled = false;
            input.required = true;
            input.addEventListener('input', self.enableBts.bind(self), false);
            input.addEventListener('input', self.autosave.bind(self), false);
        });
    },

    enableBts: function() {
        var enable = this.widgets.every(function(w){
            var input = document.querySelectorAll('#myid #' + w)[0];
            var e = input.value === 0 || input.value.trim();
            e = e && input.validity.valid;
            return e;
        });

        document.getElementById('bt-ok').disabled = !enable;
        return enable
    },

    updatePagoMes: function(lic) {
        var taxa_fixa = formatter().unformatNumber(document.getElementById('taxa_fixa_' + lic).value);
        var taxa_uso = formatter().unformatNumber(document.getElementById('taxa_uso_' + lic).value);
        var consumo_fact = formatter().unformatNumber(document.getElementById('consumo_fact_' + lic).value);
        var pago_mes = taxa_fixa + (taxa_uso * consumo_fact);
        document.getElementById('pago_mes_' + lic).value = formatter().formatNumber(pago_mes, '0[.]00');
        return pago_mes
    },

    updateAutomatic: function() {
        var pago_mes_sup = this.updatePagoMes('sup') || 0;
        var pago_mes_sub = this.updatePagoMes('sub') || 0;

        var iva = formatter().unformatNumber(document.getElementById('iva').value);
        var pago_iva = (pago_mes_sup + pago_mes_sub) * (1 + iva / 100);
        document.getElementById('pago_iva').value = formatter().formatNumber(pago_iva, '0[.]00');
    },

    autosave: function(e) {
        // http://codetunnel.io/how-to-implement-autosave-in-your-web-app/
        this.updateAutomatic();
        if (! this.isSaveable(e)) {
            return;
        }
        var self = this;
        var autosaveInfo = document.getElementById('autosave-info');
        autosaveInfo.innerHTML = 'Modificacións pendentes'
        autosaveInfo.style.color = 'red';
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        if (this.autosaveInputTimeOutId) {
            clearTimeout(this.autosaveInputTimeOutId);
        }
        this.timeoutId = setTimeout(function () {
            self.fillExploracao(null, true);
            autosaveInfo.innerHTML = 'Modificacións gardadas'
            autosaveInfo.style.color = 'green';
            self.autosaveInputTimeOutId = setTimeout(function() {
                autosaveInfo.innerHTML = '';
            }, 1500)
        }, 750);
    },

    isSaveable: function(e) {
        if (['pagos', 'pago_lic', 'fact_tipo'].indexOf(e.currentTarget.id) !== -1) {
            return true;
        }
        if (document.getElementById('observacio').value) {
            return true;
        }
        var enable = this.widgets.some(function(w){
            var input = document.querySelectorAll('#myid input#' + w)[0];
            return input && input.validity.valid;
        });
        return enable;
    },

    fillExploracao: function(e, autosave) {
        var self = this;
        var exploracao = this.model;

        var nextState = wf.whichNextState(exploracao.get('estado_lic'), e, exploracao);

        if (autosave) {
            this.doFillExploracao(e, autosave);
        } else {
            bootbox.confirm(`A exploração vai mudar o seu a: <br> <strong>${nextState}</strong>`, function(result){
                if (result) {
                    self.doFillExploracao(e, autosave);
                }
            });
        }
    },

    doFillExploracao: function(e, autosave) {
        var self = this;
        var exploracao = this.model;

        var nextState = wf.whichNextState(exploracao.get('estado_lic'), e, exploracao);

        var fact = exploracao.get('facturacao').slice(-1)[0];
        var currentComment = fact['observacio'].slice(-1)[0];
        Object.assign(currentComment, {
            'create_at': new Date(),
            'author': wf.getUser(),
            'text': document.getElementById('observacio').value,
            'state': nextState,
        });

        if (!autosave) {
            fact['observacio'].push({
                'create_at': null,
                'author': null,
                'text': null,
                'state': null,
            });
        }

        document.querySelectorAll('#myid input').forEach(function(input) {
            if (input.validity.valid) {
                fact[input.id] = formatter().unformatNumber(input.value);
            }
        });
        document.querySelectorAll('#myid select').forEach(function(select){
            fact[select.id] = select.options[select.selectedIndex].text;
            if (select.id === 'pagos' || select.id === 'pago_lic') {
                fact[select.id] = fact[select.id] === 'Não' ? false : true;
            }
        });
        fact['fact_estado'] = nextState;

        exploracao.set('fact_estado', nextState);
        exploracao.set('fact_tipo', fact['fact_tipo'])
        exploracao.set('pagos', fact['pagos'])
        exploracao.set('pago_lic', fact['pago_lic'])
        exploracao.getLicencia('sup').set('consumo_tipo', fact['consumo_tipo_sup'])
        exploracao.getLicencia('sub').set('consumo_tipo', fact['consumo_tipo_sub'])

        exploracao.urlRoot = Backbone.SIXHIARA.Config.apiFacturacao;
        exploracao.save(
            null,
            {
                'validate': false,
                'wait': true,
                'success': function(model) {
                    var exp_id = model.get('exp_id');
                    var exp_name = model.get('exp_name');
                    if (autosave) {
                        console.log('autosaving');
                    } else {
                        bootbox.alert(`A exploração&nbsp;<strong>${exp_id} - ${exp_name}</strong>&nbsp;tem sido gravada correctamente.`, function(){
                            exploracao.trigger('show-next-exp', exploracao);
                        });
                    }
                },
                'error': function() {
                    bootbox.alert('<span style="color: red;">Produziu-se um erro. Informe ao administrador.</strong>');
                },
            }
        );
    },

    initSelects: function() {
        var fact = this.model.get('facturacao').slice(-1)[0]
        document.querySelectorAll('#myid select').forEach(function(s){
            var text = fact[s.id]
            if (text === false) text = 'Não';
            if (text === true)  text = 'Sim';
            for (var i = 0; i< s.options.length; i+=1) {
                if (s.options[i].text !== text) {
                    s.options[i].selected = false;
                } else {
                    s.options[i].selected = true;
                }
            }
        });
    },

    getSelectText: function(selectId) {
        var s = document.querySelectorAll('#myid selectId')[0]
        return s.options[s.selectedIndex].text;
    },

});
