Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewTecnico1 = Backbone.SIXHIARA.View1.extend({

    template: _.template(`
        <div class="row" style="margin-bottom: 35px; margin-top: 10px">
  <div class="col-xs-12">
    <div id="bt-toolbar" class="btn-group btn-group-justified" role="group">
        <div class="btn-group" role="group">
            <button type="button" class="btn btn-default" disabled>Anexar Documentação (<i class="fa fa-upload"></i>)</button>
        </div>
        <div class="btn-group" role="group">
            <button id="bt-ver-doc" type="button" class="btn btn-default" disabled>Transferir Documentação (<i class="fa fa-download"></i>)</button>
        </div>
        <div class="btn-group" role="group">
            <a id="bt-adicionar" class="btn btn-default" role="button" href="/exploracao-new.html?id=<%- id %>">Adicionar</a>
        </div>
        <div class="btn-group" role="group">
            <a class="btn btn-default" role="button" href="/exploracao-gps.html">Geometria</a>
        </div>
        <div class="btn-group" role="group">
            <a id="bt-ficha" class="btn btn-default" role="button" href="/exploracao-show.html?id=<%- id %>">Ficha</a>
        </div>
    </div>
  </div>
</div>

<h3>
<%- formatter().formatDate(created_at) %> - <span style="color:#00a2da"><%- exp_name %></span> <span style="color: grey"><%= '(' + (actividade && actividade.tipo || 'Não declarada') + ').' %></span>
<%- licencias && licencias[0] && licencias[0].tipo_agua || '-' %> / <%- licencias && licencias[1] && licencias[1].tipo_agua || '-' %>
</h3>
<h4 style="margin-bottom: 20px;"><%- exp_id %></h4>

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
              <td>Análise da documentação</td>
              <td><input id="anali_doc" type="checkbox" <%- anali_doc ? 'checked' : '' %> required></td>
            </tr>
            <tr>
              <td>Solicitação da visitoria</td>
              <td><input id="soli_visit" type="checkbox" <%- soli_visit ? 'checked' : '' %> required></td>
            </tr>
            <tr>
              <td>Parecer da Unidade</td>
              <td><input id="p_unid" type="checkbox" <%- p_unid ? 'checked' : '' %> required></td>
            </tr>
            <tr>
              <td>Parecer Técnico</td>
              <td><input id="p_tec" type="checkbox" <%- p_tec ? 'checked' : '' %> required></td>
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
          <div style="display:inline-block; width: 24%">
          Observações
          </div>
          <div id="js-btns-next" class="text-right" style="display:inline-block; width: 74%" >
            <!-- TODO. Los "siguientes estados" disponibles no deberían estar harcodeados en el html
            o bien, todos los botones deberían ser generados en otra parte, o de los dominios se deberían decidir que botones
            se pueden usar en el modo combo o algo así
            -->
            <button id="bt-ok" type="button" class="btn btn-default btn-sm">Completa</button>
            <button id="bt-no" type="button" class="btn btn-primary btn-sm">Incompleta</button>
            <button id="bt-noaprobada" type="button" class="btn btn-primary btn-sm">Não aprovada</button>
            <button id="bt-defacto" type="button" class="btn btn-info btn-sm">Utente de facto</button>
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
        var self = this;

        document.querySelectorAll('table input[type="checkbox"]').forEach(function(input){
            input.addEventListener('change', self.enableBts.bind(self), false);
        });

        this.enableBts();

        document.querySelectorAll('table input[type="checkbox"]').forEach(function(input){
            input.addEventListener('change', self.autosave.bind(self), false);
        });
    },

    enableBts: function() {
        var enableState = false;
        var enableChb = Array.from(
            document.querySelectorAll('table input[type="checkbox"]')
        ).every(input => {
            if (input.required) {
                return input.checked;
            }
            return true;
        });


        var validState = this.model.get('estado_lic');
        var expTest = this.model.cloneExploracao();
        if (expTest.get('estado_lic') === 'Documentação incompleta (Pendente utente - R. Cad DT)') {
            expTest.setLicState('Pendente Visita Campo (R. Cad DT)');
            if (expTest.isValid()) {
                validState = 'Pendente Parecer Técnico (R. Cad DT)';
            } else {
                validState = 'Pendente Visita Campo (R. Cad DT)';
            }
        }
        if (validState === 'Pendente Visita Campo (R. Cad DT)') {
            document.getElementById('bt-adicionar').classList.remove('disabled');
            document.getElementById('bt-adicionar').removeAttribute('aria-disabled');
            document.getElementById('bt-ficha').classList.add('disabled');
            document.getElementById('bt-ficha').setAttribute('aria-disabled', 'true');
            document.getElementById('bt-defacto').classList.add('disabled');
            document.getElementById('bt-defacto').setAttribute('aria-disabled', 'true');

            enableState = false;
            document.getElementById('bt-ok').title = "Deve 'Adicionar' dantes de poder completar";
            document.getElementById('bt-defacto').title = "Deve 'Adicionar' dantes de poder criar uma 'Utente de facto'";

        } else if (validState === 'Pendente Parecer Técnico (R. Cad DT)') {
            expTest.setLicState('Pendente Parecer Técnico (R. Cad DT)');
            if (expTest.isValid()) {
                enableState = true;
                document.getElementById('bt-ok').title = 'Pendente Emisão Licença (D. Jur)';
            } else {
                enableState = false;
                document.getElementById('bt-ok').title = "Deve rechear correctamente a 'Ficha' dantes de completar";
            }
            document.getElementById('bt-adicionar').classList.add('disabled');
            document.getElementById('bt-adicionar').setAttribute('aria-disabled', 'true');
            document.getElementById('bt-ficha').classList.remove('disabled');
            document.getElementById('bt-ficha').removeAttribute('aria-disabled');
            document.getElementById('bt-defacto').classList.remove('disabled');
            document.getElementById('bt-defacto').removeAttribute('aria-disabled');
        } else {
            throw 'Error';
        }

        document.getElementById('bt-ok').disabled = ! (enableChb && enableState);
    },

    fillExploracao: function(e, autosave) {
        var self = this;
        var exploracao = this.model;

        var nextState = wf.whichNextState(exploracao.get('estado_lic'), e);
        if (e && e.target && (e.target.id === 'bt-ok')) {
            nextState = 'Pendente Emisão Licença (D. Jur)';
        }

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

        var nextState = wf.whichNextState(exploracao.get('estado_lic'), e);

        var currentComment = exploracao.get('req_obs').slice(-1)[0];
        Object.assign(currentComment, {
            'create_at': new Date(),
            'author': wf.getUser(),
            'text': document.getElementById('observacio').value,
            'state': nextState,
        });

        if (!autosave) {
            exploracao.get('req_obs').push({
                'create_at': null,
                'author': null,
                'text': null,
                'state': null,
            });
        }

        exploracao.setLicState(nextState);

        document.querySelectorAll('table input[type="checkbox"]').forEach(function(input){
            exploracao.set(input.id, input.checked);
        });

        exploracao.urlRoot = Backbone.SIXHIARA.Config.apiRequerimentos;
        exploracao.save(
            null,
            {
                'patch': true,
                'validate': false,
                'wait': true,
                'success': function(model) {
                    var exp_id = model.get('exp_id');
                    var exp_name = model.get('exp_name');
                    if (autosave) {
                        console.log('autosaving');
                    } else {
                        bootbox.alert(`A exploração <strong>${exp_id} - ${exp_name}</strong> tem sido gravada correctamente.`, function(){
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
