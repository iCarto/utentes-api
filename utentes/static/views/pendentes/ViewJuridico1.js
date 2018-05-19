Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewJuridico1 = Backbone.SIXHIARA.View1.extend({

    template: _.template(`
        <div class="row" style="margin-bottom: 35px; margin-top: 10px">
  <div class="col-xs-12">
    <div id="bt-toolbar" class="btn-group btn-group-justified" role="group">
        <div class="btn-group" role="group">
            <button type="button" class="btn btn-default" disabled>Transferir Documentação (<i class="fa fa-download"></i>)</button>
        </div>
        <div class="btn-group" role="group">
            <button id="bt-ver-doc" type="button" class="btn btn-default" disabled>Transferir Documentação (<i class="fa fa-download"></i>)</button>
        </div>
    </div>
  </div>
</div>

<h3>
<%- formatter().formatDate(created_at) %> - <span style="color:#00a2da"><%- exp_name %>
</h3>
<h4 style="margin-bottom: 20px;"><%- exp_id %></h4>


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
              <td><input id="carta_re" type="checkbox" <%- carta_re ? 'checked' : '' %> required></td>
              <td><input id="carta_re_v" type="checkbox" <%- carta_re_v ? 'checked' : '' %> required></td>
            </tr>
            <tr>
              <td>Ficha de pedido preenchida</td>
              <td><input id="ficha_pe" type="checkbox" <%- ficha_pe ? 'checked' : '' %> required></td>
              <td><input id="ficha_pe_v" type="checkbox" <%- ficha_pe_v ? 'checked' : '' %> required></td>
            </tr>
            <tr>
              <td>Identificação do proprietário</td>
              <td><input id="ident_pro" type="checkbox" <%- ident_pro ? 'checked' : '' %> required></td>
              <td><input id="ident_pro_v" type="checkbox" <%- ident_pro_v ? 'checked' : '' %> required></td>
            </tr>
            <tr>
              <td>Certificado de registro comercial</td>
              <td><input id="certi_reg" type="checkbox" <%- certi_reg ? 'checked' : '' %> required></td>
              <td><input id="certi_reg_v" type="checkbox" <%- certi_reg_v ? 'checked' : '' %> required></td>
            </tr>
            <tr>
              <td>DUAT</td>
              <td><input id="duat" type="checkbox" <%- duat ? 'checked' : '' %> required></td>
              <td><input id="duat_v" type="checkbox" <%- duat_v ? 'checked' : '' %> required></td>
            </tr>
            <tr>
              <td>Licença Ambiental (Se é preciso)</td>
              <td><input id="licen_am" type="checkbox" <%- licen_am ? 'checked' : '' %>></td>
              <td><input id="licen_am_v" type="checkbox" <%- licen_am_v ? 'checked' : '' %>></td>
            </tr>
            <tr>
              <td>Mapa de localização</td>
              <td><input id="mapa" type="checkbox" <%- mapa ? 'checked' : '' %> required></td>
              <td><input id="mapa_v" type="checkbox" <%- mapa_v ? 'checked' : '' %> required></td>
            </tr>
            <tr>
              <td>Autorização de apertura de poço/furo (Se é preciso)</td>
              <td><input id="licen_fu" type="checkbox" <%- licen_fu ? 'checked' : '' %>></td>
              <td><input id="licen_fu_v" type="checkbox" <%- licen_fu_v ? 'checked' : '' %>></td>
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
          <div id="js-btns-next" class="text-right" style="display:inline-block; width: 70%" >
            <!-- TODO. Los "siguientes estados" disponibles no deberían estar harcodeados en el html
            o bien, todos los botones deberían ser generados en otra parte, o de los dominios se deberían decidir que botones
            se pueden usar en el modo combo o algo así
            -->
            <button id="bt-ok" type="button" class="btn btn-default">Completa</button>
            <button id="bt-no" type="button" class="btn btn-primary">Incompleta</button>
            <button id="bt-noaprobada" type="button" class="btn btn-primary">Não aprovada</button>
          </div>
        </label>
        <textarea id="observacio" class="form-control widget"></textarea>

          <label for="observacio_ant">Observações anteriores</label>
            <textarea class="form-control widget" id="observacio_ant" disabled>
<% for (var i=0; i<req_obs.length - 1; i+=1) {
if (req_obs[i]['text']) {
print('El ' + formatter().formatDate(req_obs[i]['create_at']) + ', ' + req_obs[i]['author'] + ', escribió: ' + req_obs[i]['text'] + '&#13;&#10;&#13;&#10;');
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
