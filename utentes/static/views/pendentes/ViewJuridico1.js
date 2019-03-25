Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewJuridico1 = Backbone.SIXHIARA.View1.extend({

    template: _.template(`
        <div id="bt-toolbar" class="row">
  <div class="col-xs-12">
    <div class="btn-group btn-group-justified" role="group">
        <div class="btn-group" role="group">
            <button id="file-modal" class="btn btn-default" role="button">Documentaçao</button>
        </div>
    </div>
  </div>
</div>

<h4 style="margin-bottom: 20px;">
<%- formatter().formatDate(d_ultima_entrega_doc) + ' - ' %><span style="color:#00a2da"><%- exp_id + ' '%> <%- exp_name %></span>
</h4>


<div class="row panel-equal-height">
  <div class="col-xs-6">
  <div class="panel">
    <div class="row">
      <div class="col-xs-12">
        <table class="table table-bordered table-checks">
          <thead>
            <tr><th>Tipo de Documento</th><th>Entrega</th><th>Validação</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Carta de requerimento de solicitação</td>
              <td><input id="carta_re" type="checkbox" <%- carta_re ? 'checked=""' : '' %> required></td>
              <td><input id="carta_re_v" class="uilib-enability uilib-disable-role-observador" type="checkbox" <%- carta_re_v ? 'checked=""' : '' %> required></td>
            </tr>
            <tr>
              <td>Ficha de pedido preenchida</td>
              <td><input id="ficha_pe" type="checkbox" <%- ficha_pe ? 'checked=""' : '' %> required></td>
              <td><input id="ficha_pe_v" class="uilib-enability uilib-disable-role-observador" type="checkbox" <%- ficha_pe_v ? 'checked=""' : '' %> required></td>
            </tr>
            <tr>
              <td>Identificação do proprietário</td>
              <td><input id="ident_pro" type="checkbox" <%- ident_pro ? 'checked=""' : '' %> required></td>
              <td><input id="ident_pro_v" class="uilib-enability uilib-disable-role-observador" type="checkbox" <%- ident_pro_v ? 'checked=""' : '' %> required></td>
            </tr>
            <tr>
              <td>Certificado de registo comercial</td>
              <td><input id="certi_reg" type="checkbox" <%- certi_reg ? 'checked=""' : '' %>></td>
              <td><input id="certi_reg_v" class="uilib-enability uilib-disable-role-observador" type="checkbox" <%- certi_reg_v ? 'checked=""' : '' %> required></td>
            </tr>
            <tr>
              <td>DUAT ou declaração das estructuras locais&nbsp;(bairro)</td>
              <td><input id="duat" type="checkbox" <%- duat ? 'checked=""' : '' %>></td>
              <td><input id="duat_v" class="uilib-enability uilib-disable-role-observador" type="checkbox" <%- duat_v ? 'checked=""' : '' %> required></td>
            </tr>
            <tr>
              <td>Mapa de localização</td>
              <td><input id="mapa" type="checkbox" <%- mapa ? 'checked=""' : '' %>></td>
              <td><input id="mapa_v" class="uilib-enability uilib-disable-role-observador" type="checkbox" <%- mapa_v ? 'checked=""' : '' %> required></td>
            </tr>
            <tr>
              <td>Boletim de análise de água</td>
              <td><input id="b_a_agua" type="checkbox" <%- b_a_agua ? 'checked=""' : '' %>></td>
              <td><input id="b_a_agua_v" class="uilib-enability uilib-disable-role-observador" type="checkbox" <%- b_a_agua_v ? 'checked=""' : '' %>></td>
            </tr>
            <tr>
              <td>Licença Ambiental&nbsp;(Se é preciso)</td>
              <td><input id="licen_am" type="checkbox" <%- licen_am ? 'checked=""' : '' %>></td>
              <td><input id="licen_am_v" class="uilib-enability uilib-disable-role-observador" type="checkbox" <%- licen_am_v ? 'checked=""' : '' %>></td>
            </tr>
            <tr>
              <td>Autorização de apertura de poço/furo&nbsp;(Se é preciso)</td>
              <td><input id="licen_fu" type="checkbox" <%- licen_fu ? 'checked=""' : '' %>></td>
              <td><input id="licen_fu_v" class="uilib-enability uilib-disable-role-observador" type="checkbox" <%- licen_fu_v ? 'checked=""' : '' %>></td>
            </tr>
            <tr>
              <td>Relatório técnico de perforação&nbsp;(Se é preciso)</td>
              <td><input id="r_perf" type="checkbox" <%- r_perf ? 'checked=""' : '' %>></td>
              <td><input id="r_perf_v" class="uilib-enability uilib-disable-role-observador" type="checkbox" <%- r_perf_v ? 'checked=""' : '' %>></td>
            </tr>
          </tbody>
        </table>
      </div>
     </div>
    </div>
  </div>

  <div class="col-xs-6 panel-observacio">
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
        <textarea id="observacio" class="form-control widget uilib-enability uilib-disable-role-observador"></textarea>

          <label for="observacio_ant">Observações anteriores</label>
            <textarea class="form-control widget" id="observacio_ant" disabled>
<% for (var i=0; i<req_obs.length - 1; i+=1) {
if (req_obs[i]['text']) {
print('O ' + formatter().formatDate(req_obs[i]['create_at']) + ', ' + req_obs[i]['author'] + ', escreveu: ' + req_obs[i]['text'] + '&#13;&#10;&#13;&#10;');
}
}
%>
            </textarea>
      </div>
      </div>
    </div>
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

        this.enableBts();

        document.querySelectorAll('table input[type="checkbox"]').forEach(function(input){
            input.addEventListener('change', self.autosave.bind(self), false);
        });

        
        var defaultDataForFileModal = wf.getDefaultDataForFileModal(this.model.get('id'));
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
