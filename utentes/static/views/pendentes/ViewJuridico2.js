Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewJuridico2 = Backbone.SIXHIARA.View1.extend({

    template: _.template(`
        <div id="bt-toolbar" class="row">
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
    </div>
  </div>
</div>

<h4 style="margin-bottom: 20px;">
<%- formatter().formatDate(created_at) + ' - ' %><span style="color:#00a2da"><%- exp_id + ' '%> <%- exp_name %></span> <span style="color: grey"><%= ' (' + (actividade && actividade.tipo || 'Não declarada') + '). ' %></span>
<%- (licencias && licencias[0] && licencias[0].tipo_agua || '-') + ' / ' %><%- licencias && licencias[1] && licencias[1].tipo_agua || '-' %>
</h4>


<div class="row panel-equal-height">
  <div class="col-xs-6">
<div class="panel">
    <div class="row">
      <div class="col-xs-12">
        <table class="table table-bordered table-checks">
          <thead>
            <tr><th>Tipo de Documento</th><th>Pronto</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Documentação legal</td>
              <td><input id="doc_legal" type="checkbox" checked required disabled></td>
            </tr>
            <tr>
              <td>Parecer Técnico</td>
              <td><input id="p_juri" type="checkbox" <%- p_juri ? 'checked=""' : '' %> required></td>
            </tr>
            <tr>
              <td>Parecer de instituições relevantes</td>
              <td><input id="p_rel" type="checkbox" <%- p_rel ? 'checked=""' : '' %> required></td>
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
          <div style="display:inline-block; width: 18%">
          Observações
          </div>
          <div id="js-btns-next">
            <!-- TODO. Los "siguientes estados" disponibles no deberían estar harcodeados en el html
            o bien, todos los botones deberían ser generados en otra parte, o de los dominios se deberían decidir que botones
            se pueden usar en el modo combo o algo así
            -->
            <button id="bt-ok" type="button" class="btn btn-default btn-sm" style="padding-left:7px; padding-right: 7px;">Imprimir&nbsp;(licença)</button>
            <button id="bt-no" type="button" class="btn btn-primary btn-sm" style="padding-left:7px; padding-right: 7px;">Incompleta</button>
            <button id="bt-noaprobada" type="button" class="btn btn-primary btn-sm" style="padding-left:7px; padding-right: 7px;">Não aprovada</button>
            <button id="bt-defacto" type="button" class="btn btn-danger btn-sm" style="padding-left:7px; padding-right: 7px;">Utente de facto</button>
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
<% for (var i=0; i<req_obs.length - 1; i+=1) {
if (req_obs[i]['text']) {
print('El ' + formatter().formatDate(req_obs[i]['create_at']) + ', ' + req_obs[i]['author'] + ', escribió: ' + req_obs[i]['text'] + '&#13;&#10;&#13;&#10;');
}
}
%>
       </textarea>
 </div>

    `),


    init: function() {
        Backbone.SIXHIARA.View1.prototype.init.call(this);

        document.getElementById('bt-ok').setAttribute('data-foo', 'juridico2');

        var self = this;

        document.querySelectorAll('table input[type="checkbox"]').forEach(function(input){
            input.addEventListener('change', self.enableBts.bind(self), false);
        });

        // Para gestionar los dos estados de doc incompleta
        var wf_tmp = Object.create(MyWorkflow);
        var currentState = this.model.get('estado_lic');
        document.getElementById('bt-ok').setAttribute('data-foo', 'juridico2');
        var nextBtState = wf_tmp.whichNextState(currentState, {target:{id: 'bt-ok',
        attributes: {'data-foo': 'juridico2'}}});
        document.getElementById('bt-ok').title = nextBtState;

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
