Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewSecretaria2 = Backbone.SIXHIARA.View1.extend({

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


      <div class="form-group" style="margin-top: 40px">
        <label for="observacio" style="width: 100%; margin-bottom: 0px">
          <div style="display:inline-block; width: 29%">
          Observações
          </div>
          <div id="js-btns-next" class="text-right" style="display:inline-block; width: 70%" >
            <!-- TODO. Los "siguientes estados" disponibles no deberían estar harcodeados en el html
            o bien, todos los botones deberían ser generados en otra parte, o de los dominios se deberían decidir que botones
            se pueden usar en el modo combo o algo así
            -->
            <button id="bt-ok" type="button" class="btn btn-default">Licença Assinada<small>&nbsp;(Director)</small></button>
            <button id="bt-noaprobada" type="button" class="btn btn-primary">Não aprovada<small>&nbsp;(Director)</small></button>

          </div>
        </label>
        <textarea id="observacio" class="form-control widget" rows="7"></textarea>
      </div>

 <div class="form-group" style="margin-top: 40px">
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
        this.enableBts();
    },

    enableBts: function() {
        var enable = true;
        document.getElementById('bt-ok').disabled = !enable;
    },

});
