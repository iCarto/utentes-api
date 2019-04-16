Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewJuridico1 = Backbone.SIXHIARA.View1.extend({

    template: _.template(`
        <div id="bt-toolbar" class="row">
           <div class="col-xs-12">
              <div class="btn-group btn-group-justified" role="group">
                 <div class="btn-group" role="group">
                    <button id="file-modal" class="btn btn-default" role="button">Documentaçao</button>
                 </div>
                 <div class="btn-group uilib-enability uilib-hide-role-observador" role="group">
                    <a id="bt-geometria" class="btn btn-default" role="button" href="/exploracao-gps.html" disabled>Geometria</a>
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
              <%- Backbone.SIXHIARA.formatter.formatTipoLicencias(licencias)[0] %> / <%- Backbone.SIXHIARA.formatter.formatTipoLicencias(licencias)[1] %>
           </div>
        </h4>
        <div id="renovacao-block" class="row panel-equal-height">
           <div class="col-xs-6">
              <div class="panel">
                 <div class="row">
                    <div class="col-xs-12">
                       <table class="table table-bordered table-checks">
                          <thead>
                             <tr>
                                <th>Tipo de Documento</th>
                                <th>Entrega</th>
                                <th>Validação</th>
                             </tr>
                          </thead>
                          <tbody>
                             <tr>
                                <td>Carta de requerimento de renovação</td>
                                <td><input id="carta_ren" class="uilib-enability uilib-disable-role-observador" type="checkbox" <%- renovacao.carta_ren ? 'checked=""' : '' %> required></td>
                                <td><input id="carta_ren_v" class="uilib-enability uilib-disable-role-observador" type="checkbox" <%- renovacao.carta_ren_v ? 'checked=""' : '' %> required></td>
                             </tr>
                             <tr>
                                <td>Identificação do proprietário</td>
                                <td><input id="ident_pro" class="uilib-enability uilib-disable-role-observador" type="checkbox" <%- renovacao.ident_pro ? 'checked=""' : '' %>></td>
                                <td><input id="ident_pro_v" class="uilib-enability uilib-disable-role-observador" type="checkbox" <%- renovacao.ident_pro_v ? 'checked=""' : '' %>></td>
                             </tr>
                             <tr>
                                <td>Certificado de registo comercial</td>
                                <td><input id="certi_reg" class="uilib-enability uilib-disable-role-observador" type="checkbox" <%- renovacao.certi_reg ? 'checked=""' : '' %>></td>
                                <td><input id="certi_reg_v" class="uilib-enability uilib-disable-role-observador" type="checkbox" <%- renovacao.certi_reg_v ? 'checked=""' : '' %>></td>
                             </tr>
                             <tr>
                                <td>DUAT ou declaração das estructuras locais&nbsp;(bairro)</td>
                                <td><input id="duat" class="uilib-enability uilib-disable-role-observador" type="checkbox" <%- renovacao.duat ? 'checked=""' : '' %>></td>
                                <td><input id="duat_v" class="uilib-enability uilib-disable-role-observador" type="checkbox" <%- renovacao.duat_v ? 'checked=""' : '' %>></td>
                             </tr>
                          </tbody>
                       </table>
                    </div>
                 </div>
              </div>
           </div>
           <div class="col-xs-6 panel-observacio renovacao">
              <div class="panel">
                 <div class="form-group">
                    <label for="observacio">
                       <div style="display:inline-block; width: 29%">
                          Observações
                       </div>
                       <div id="js-btns-next">
                          <!-- TODO. Los "siguientes estados" disponibles no deberían estar harcodeados en el html
                             o bien, todos los botones deberían ser generados en otra parte, o de los dominios se deberían decidir que botones
                             se pueden usar en el modo combo o algo así
                             -->
                          <button id="bt-ok" type="button" class="btn btn-default uilib-enability uilib-hide-role-observador">Completa</button>
                          <button id="bt-no" type="button" class="btn btn-primary uilib-enability uilib-hide-role-observador">Incompleta</button>
                          <button id="bt-noaprobada" type="button" class="btn btn-primary uilib-enability uilib-hide-role-observador">Não aprovada</button>
                       </div>
                    </label>
                    <textarea id="observacio" class="form-control widget"></textarea>
                 </div>
              </div>
           </div>
        </div>
        <div class="form-group">
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
        var self = this;
        document.querySelectorAll('table input[type="checkbox"]').forEach(function(input){
            if (!input.id.endsWith('_v')) {
                input.disabled = true;
            }
        });

        document.querySelectorAll('table input[type="checkbox"]').forEach(function(input){
            input.addEventListener('change', self.enableBts);
        });

        if (self.model.get('renovacao').get('lic_time_info')) {
            document.getElementById('time-renovacao-info').style.display = 'block';
        }

        this.enableBts();

        document.querySelectorAll('table input[type="checkbox"]').forEach(function(input){
            input.addEventListener('change', self.autosave.bind(self), false);
        });

        var defaultDataForFileModal = iAuth.getDefaultDataForFileModal(this.model.get('id'));
        var fileModalView = new Backbone.DMS.FileModalView({
            openElementId: '#file-modal',
            title: 'Arquivo Electr&oacute;nico',
            urlBase: defaultDataForFileModal.defaultUrlBase,
            id: defaultDataForFileModal.defaultFolderId
        });
    },

    enableBts: function() {
        var enable = Array.from(
            document.querySelectorAll('table input[type="checkbox"]')
        ).every(input => {
            if (input.required) {
                return input.checked;
            }
            return true;
        });
        document.getElementById('bt-ok').disabled = !enable;
    },

});
