Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewSecretaria2 = Backbone.SIXHIARA.View1.extend({

    template: _.template(`
        <div id="bt-toolbar" class="row">
           <div class="col-xs-12">
              <div class="btn-group btn-group-justified" role="group">
                 <div class="btn-group" role="group">
                    <button id="file-modal" class="btn btn-default" role="button">Documentaçao</button>
                 </div>
                 <div class="btn-group" role="group">
                    <a id="bt-ficha" class="btn btn-default" role="button" href="/exploracao-show.html?id=<%- id %>">Ficha</a>
                 </div>
              </div>
           </div>
        </div>
        <div id="time-renovacao-info" class="info-pill <%- renovacao.lic_time_over ? 'label-danger' : (renovacao.lic_time_warning ? 'label-warning' : renovacao.lic_time_enough ? 'label-success' : 'label-default') %>"> <%- renovacao.lic_time_info || 'Sem informação' %></div>
        <h4 style="margin-bottom: 20px;">
           <%- (renovacao.d_ultima_entrega_doc ? formatter().formatDate(renovacao.d_ultima_entrega_doc) + ' - ' : '') %><span style="color:#00a2da"><%- exp_id + ' '%> <%- exp_name %></span> <span style="color: grey"><%= ' (' + (actividade && actividade.tipo || 'Não declarada ') + ') ' %></span>
           <div class="licencias">
              <%- Backbone.SIXHIARA.formatter.formatTipoLicencias(licencias)[0] %> /
              <%- Backbone.SIXHIARA.formatter.formatTipoLicencias(licencias)[1] %>
           </div>
        </h4>
        <div id="renovacao-block" class="form-group" style="margin-top: 40px">
           <label for="observacio" style="width: 100%; margin-bottom: 0px">
              <div style="display:inline-block; width: 29%">
                 Observações
              </div>
              <div id="js-btns-next">
                 <!-- TODO. Los "siguientes estados" disponibles no deberían estar harcodeados en el html
                    o bien, todos los botones deberían ser generados en otra parte, o de los dominios se deberían decidir que botones
                    se pueden usar en el modo combo o algo así
                    -->
                 <button id="bt-ok" type="button" class="btn btn-default uilib-enability uilib-hide-role-observador">Licença Assinada<small>&nbsp;(Director)</small></button>
                 <button id="bt-noaprobada" type="button" class="btn btn-primary uilib-enability uilib-hide-role-observador">Não aprovada<small>&nbsp;(Director)</small></button>
              </div>
           </label>
           <textarea id="observacio" class="form-control widget uilib-enability uilib-disable-role-observador" rows="7"></textarea>
        </div>
        <div class="form-group" style="margin-top: 40px">
           <label for="observacio_ant">Observações anteriores</label>
           <textarea class="form-control widget" id="observacio_ant" rows="7" disabled>
           <% for (var i=0; i<renovacao.obser.length - 1; i+=1) {
                 if (renovacao.obser[i]['text']) {
                    print('O ' + formatter().formatDate(renovacao.obser[i]['create_at']) + ', ' + renovacao.obser[i]['author'] + ', escreveu: ' + renovacao.obser[i]['text'] + '&#13;&#10;&#13;&#10;');
                 }
              }
              %>
           </textarea>
        </div>
    `),

    init: function() {
        Backbone.SIXHIARA.View1.prototype.init.call(this);
        this.enableBts();

        if (this.model.get('renovacao').get('lic_time_info')) {
            document.getElementById('time-renovacao-info').style.display = 'block';
        }

        var defaultDataForFileModal = iAuth.getDefaultDataForFileModal(this.model.get('id'));
        var fileModalView = new Backbone.DMS.FileModalView({
            openElementId: '#file-modal',
            title: 'Arquivo Electr&oacute;nico',
            urlBase: defaultDataForFileModal.defaultUrlBase,
            id: defaultDataForFileModal.defaultFolderId
        });
    },

    enableBts: function() {
        var enable = true;
        document.getElementById('bt-ok').disabled = !enable;
    },

    updateRenovacaoConsumoFact: function(model) {
        var renovacao  = this.model.get('renovacao');
        var facturacao = this.model.get('facturacao');

        if (!_.isEmpty(facturacao)) {
            // Use data from facturacao instead of Renovacao in order to be the most updated data available
            model.get('licencias').forEach(function(lic){
                var tipo = lic.get('tipo_agua').substring(0, 3).toLowerCase();
                var last_invoice = facturacao.last();
                var last_consumo = last_invoice.get('consumo_fact_' + tipo);
                renovacao.set('consumo_fact_' + tipo + '_old', last_consumo);
            });
        }

    },

    fillExploracaoFromRenovacao: function(){
        var renovacao = this.model.get('renovacao')
        this.model.get('licencias').forEach(function(lic){
            var tipo = lic.get('tipo_agua').substring(0, 3).toLowerCase();
            lic.set('tipo_lic', renovacao.get('tipo_lic_' + tipo))
            lic.set('d_emissao', renovacao.get('d_emissao_' + tipo))
            lic.set('d_validade', renovacao.get('d_validade_' + tipo))
            lic.set('c_licencia', renovacao.get('c_licencia_' + tipo))
            lic.set('estado', renovacao.get('estado'))

        })
        this.model.set('d_soli', renovacao.get('d_soli'))
        this.model.set('d_ultima_entrega_doc', renovacao.get('d_ultima_entrega_doc'))

    },

    fillRenovacao: function(e, autosave) {
        var self = this;
        var exploracao = this.model;
        var renovacao = this.model.get("renovacao");

        var nextState = wfr.whichNextState(renovacao.get('estado'), e);

        if (autosave) {
            this.doFillRenovacao(e, autosave);
        } else {
            bootbox.confirm(
                `A exploração vai mudar o seu a: <br> <strong>${nextState}</strong>`,
                function(result) {
                    if (result) {
                        self.doFillRenovacao(e, autosave);
                    }
                }
            );
        }
    },

    doFillRenovacao: function(e, autosave) {
        var exploracao = this.model;
        var renovacao = this.model.get("renovacao");

        var nextState = wfr.whichNextState(renovacao.get('estado'), e);

        var currentComment = renovacao.get('obser').slice(-1)[0];
        Object.assign(currentComment, {
            create_at: new Date(),
            author: iAuth.getUser(),
            text: document.getElementById('observacio').value,
            state: nextState
        });

        if (!autosave) {
            renovacao.get('obser').push({
                create_at: null,
                author: null,
                text: null,
                state: null
            });
        }

        renovacao.setLicState(nextState);
        this.updateRenovacaoConsumoFact(exploracao);

        // Pass Renovacao data to Exploracao
        this.fillExploracaoFromRenovacao();

        exploracao.urlRoot = Backbone.SIXHIARA.Config.apiRenovacoes;
        exploracao.save(null, {
            patch: true,
            validate: false,
            wait: true,
            success: function(model) {
                var exp_id = model.get('exp_id');
                var exp_name = model.get('exp_name');
                if (autosave) {
                    console.log('autosaving');
                } else {
                    bootbox.alert(`A exploração&nbsp;<strong>${exp_id} - ${exp_name}</strong>&nbsp;tem sido gravada correctamente.`, function(){
                        exploracao.trigger('show-next-exp', exploracao);
                        exploracao.urlRoot = Backbone.SIXHIARA.Config.apiExploracaos;
                        exploracao.save({ wait: true });
                    });
                }
            },
            error: function() {
                bootbox.alert(
                    '<span style="color: red;">Produziu-se um erro. Informe ao administrador.</strong>'
                );
            }
        });
    },

});
