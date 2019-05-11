Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewFacturacao = Backbone.View.extend({
    tagName:  'div',

    id: 'view-facturacao', // optional
    template: _.template(`
    <div id="bt-toolbar" class="row" style="margin-bottom: 10px; margin-top: 10px">
        <div class="col-xs-12">
            <div class="btn-group btn-group-justified" role="group">
                <div class="btn-group" role="group">
                    <button id="file-modal" class="btn btn-default" role="button">Documentaçao</button>
                </div>
                <div class="btn-group" role="group">
                    <a id="bt-ficha" class="btn btn-default" role="button" href="/exploracao-show.html?id=<%- id %>">Ficha</a>
                </div>
                <div class="btn-group uilib-enability uilib-hide-role-observador" role="group">
                    <button id="bt-emision" type="button" class="btn btn-default" disabled>Factura&nbsp;(emissão licença)</button>
                </div>
            </div>
        </div>
    </div>


<h4 style="margin-bottom: 10px;">
    <span style="color:#00a2da"><%- exp_id + ' '%> <%- exp_name %></span> <span style="color: grey"><%= ' (' + (actividade && actividade.tipo || 'Não declarada') + ') ' %></span>
    <div class="licencias">
        <%- Backbone.SIXHIARA.formatter.formatTipoLicencias(licencias)[0] %> / <%- Backbone.SIXHIARA.formatter.formatTipoLicencias(licencias)[1] %>
    </div>
</h4>

    <div class="row form-horizontal" style="margin-top: 10px">

        <div class="col-xs-4">
            <div class="form-group" style="margin-left: 0px; margin-right: 0px">
                <label for="pago_lic" class="control-label col-xs-9" style="text-align: left">Pagamento emissão licença</label>
                <div class="col-xs-3" style="padding-left: 10px; padding-right: 10px;">
                    <select class="form-control" style="padding: 3px 5px;" id="pago_lic" disabled>
                        <option <% print(pago_lic == true ? 'selected' : '') %> value="true">Sim</option>
                        <option <% print(pago_lic == false ? 'selected' : '') %> value="false">Não</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="col-xs-4">
            <div class="form-group" style="margin-left: 0px; margin-right: 0px">
                <label for="fact_tipo" class="control-label col-xs-7" style="text-align: left">Tipo de facturação</label>
                <div class="col-xs-5" style="padding-left: 10px; padding-right: 10px;">
                    <select class="form-control" style="padding: 3px 3px;" id="fact_tipo" disabled>
                        <option <% print(fact_tipo == 'Mensal' ? 'selected' : '') %>>Mensal</option>
                        <option <% print(fact_tipo == 'Trimestral' ? 'selected' : '') %>>Trimestral</option>
                        <option <% print(fact_tipo == 'Anual' ? 'selected' : '') %>>Anual</option>
                    </select>
                </div>
            </div>
        </div>

    </div>

    <div class="row panel-equal-height">

        <div id="facturacao-historico-view" class="col-xs-4" style="border-right: 1px solid #337ab7">
        </div>

        <div id="factura-view" class="col-xs-8">
        </div>

    </div>
    `),

    initialize: function (options) {
        this.options = options || {};

        var tiposLicencia = [];
        this.model.get('licencias').forEach(function(lic){
            var tipo = lic.get('tipo_agua').substring(0, 3).toLowerCase();
            tiposLicencia.push(tipo);
        });

        this.facturacaoHistoricoView = new Backbone.SIXHIARA.ViewFacturacaoHistorico({
            model: this.model.get('facturacao')
        });

        this.facturaSelected = this.model.get('facturacao').at(0).id;
        this.facturaView = new Backbone.SIXHIARA.ViewFacturacaoModal({
            model: this.model.get('facturacao').findWhere({id: this.facturaSelected}),
            tiposLicencia: tiposLicencia,
            exploracao: this.model
        });

        this.listenTo(this.model.get('facturacao'), 'change', this.facturacaoUpdated);
    },

    render: function() {
        var json = this.model.toJSON();
        json.c_licencia_sup = this.model.getLicencia('sup').get('c_licencia');
        json.c_licencia_sub = this.model.getLicencia('sub').get('c_licencia');
        this.$el.html(this.template(json));
        
        this.renderFacturacaoHistorico();
        this.renderFactura();
        return this;
    },

    renderFacturacaoHistorico: function () {
        this.$el.find('#facturacao-historico-view').empty().append(this.facturacaoHistoricoView.render().el);
    },

    renderFactura: function (event) {
        if(event) {
            event.preventDefault();
        }
        this.$el.find('#factura-view').empty().append(this.facturaView.render().el);
    },

    /*
    Esto en realidad está por no  usar jquery. Si se hace en render todavía no están en el
    DOM los elementos y no se puede usar document ¿?. Con jquery en cambio se quedan
    binded para después al usar this.$
    */
    init: function() {
        self = this;

        this.facturaView.updateWidgets();
        this.facturacaoHistoricoView.setSelected(this.facturaSelected);
        this.facturacaoHistoricoView.on('factura-selected', function(id) {
            self.facturaSelected = id;
            self.facturaView.updateModel(self.model.get('facturacao').findWhere({id}));
        });

        this.updateWidgets();

        var defaultDataForFileModal = iAuth.getDefaultDataForFileModal(this.model.get('id'));
        var fileModalView = new Backbone.DMS.FileModalView({
            openElementId: '#file-modal',
            title: 'Arquivo Electr&oacute;nico',
            urlBase: defaultDataForFileModal.defaultUrlBase,
            id: defaultDataForFileModal.defaultFolderId
        });

    },

    updateWidgets: function() {
        this.defineWidgetsToBeUsed();
        this.enabledWidgets();
    },

    defineWidgetsToBeUsed: function() {
        var self = this;
        if (iAuth.hasRoleObservador()) {
            this.widgets = [];
            return;
        }
        this.widgets = ['pago_lic', 'fact_tipo'];
    },

    enabledWidgets: function() {
        var self = this;
        this.widgets.forEach(function(w){
            var input = this.$('#view-facturacao #' + w);
            input.prop('disabled', false);
            input.prop('required', true);
            input.on('input', self.facturacaoFormFieldsUpdated.bind(self));
        });
    },

    facturacaoFormFieldsUpdated: function(evt) {
        var target = evt.currentTarget;
        console.log('facturacaoFormFieldsUpdated', target.nodeName, target.id, target.value, target.validity.valid)
        if (target.validity.valid) {
            var modifiedAttributes = {};
            if(target.nodeName == "INPUT") {
                modifiedAttributes[target.id] = formatter().unformatNumber(target.value);
            } else if(target.nodeName == "SELECT") {
                modifiedAttributes[target.id] = target.value;
            }
            this.model.set(modifiedAttributes);
            this.facturacaoUpdated(this.model);
        }
    },

    facturacaoUpdated: function(changedModel) {
        console.log('facturacaoUpdated', changedModel)
        if(changedModel.changed['fact_estado'] && changedModel.changed['fact_estado'] == window.SIRHA.ESTADO_FACT.PENDIND_INVOICE) {
            this.saveExploracao(this.model, false);
        }else{
            this.autosave(this.model);
        }
    },

    autosave: function(e) {
        // http://codetunnel.io/how-to-implement-autosave-in-your-web-app/
        //this.updateAutomatic();
        /*if (! this.isSaveable(e)) {
            return;
        }*/
        var self = this;
        var autosaveInfo = document.getElementById('autosave-info');
        autosaveInfo.innerHTML = 'Modificações pendentes'
        autosaveInfo.style.color = 'red';
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        if (this.autosaveInputTimeOutId) {
            clearTimeout(this.autosaveInputTimeOutId);
        }
        this.timeoutId = setTimeout(function () {
            self.doFillExploracao(null, true);
            autosaveInfo.innerHTML = 'Modificações gravadas'
            autosaveInfo.style.color = 'green';
            self.autosaveInputTimeOutId = setTimeout(function() {
                autosaveInfo.innerHTML = '';
            }, 1500)
        }, 750);
    },

    fillExploracao: function(e, autosave) {
        var self = this;
        var exploracao = this.model;

        var nextState = wf.whichNextState(exploracao.get('estado_lic'), e, exploracao);

        if (autosave) {
            this.saveExploracao(e, autosave);
        } else {
            bootbox.confirm(`A exploração vai mudar o seu estado a: <br> <strong>${nextState}</strong>`, function(result){
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

        var fact = this.facturaView.model;
        console.log('fact' , fact);
        var currentComment = fact.get('observacio').slice(-1)[0];
        Object.assign(currentComment, {
            'create_at': new Date(),
            'author': iAuth.getUser(),
            'text': document.getElementById('observacio').value,
            'state': nextState,
        });

        if (!autosave) {
            fact.get('observacio').push({
                'create_at': null,
                'author': null,
                'text': null,
                'state': null,
            });
        }

        this.saveExploracao(exploracao, autosave);
    },

    saveExploracao: function(exploracao, autosave) {
        var self = this;

        exploracao.urlRoot = Backbone.SIXHIARA.Config.apiFacturacaoExploracao;
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
                    if(model.get('fact_estado') == window.SIRHA.ESTADO_FACT.PAYED) {
                        bootbox.alert(`A exploração&nbsp;<strong>${exp_id} - ${exp_name}</strong>&nbsp;tem todas as facturas pagas.`, function(){
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

});
