Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewTecnico1 = Backbone.SIXHIARA.View1.extend({
    template: _.template(`
        <div id="bt-toolbar" class="row">
  <div class="col-xs-12">
    <div class="btn-group btn-group-justified" role="group">
        <div class="btn-group" role="group">
            <button id="file-modal" class="btn btn-default" role="button">Documentação</button>
        </div>
        <div class="btn-group uilib-enability uilib-hide-role-observador" role="group">
            <a id="bt-adicionar" class="btn btn-default" role="button" href="/adicionar_ficha?id=<%- id %>">Adicionar</a>
        </div>
        <div class="btn-group" role="group">
            <a id="bt-ficha" class="btn btn-default" role="button" href="/exploracao-show.html?id=<%- id %>">Ficha</a>
        </div>
    </div>
  </div>
</div>

<h4 style="margin-bottom: 20px;">
<%- formatter().formatDate(d_ultima_entrega_doc) + ' - ' %><span style="color:#00a2da"><%- exp_id + ' '%> <%- exp_name %></span> <span style="color: grey"><%= ' (' + (actividade && actividade.tipo || 'Não declarada') + ')' %></span>
<div class="licencias">
    <%- Backbone.SIXHIARA.formatter.formatTipoLicencias(licencias)[0] %> /
    <%- Backbone.SIXHIARA.formatter.formatTipoLicencias(licencias)[1] %>
</div>
</h4>

<div class="row panel-equal-height">
  <div class="col-xs-6">
<div class="panel">
    <div class="row">
      <div class="col-xs-12">
        <table class="table table-bordered table-checks">
          <thead>
            <tr><th>Tipo de documento</th><th>Pronto</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Análise da documentação</td>
              <td><input id="anali_doc" class="uilib-enability uilib-disable-role-observador" type="checkbox" <%- anali_doc ? 'checked=""' : '' %> required></td>
            </tr>
            <tr>
              <td>Solicitação da visitoria</td>
              <td><input id="soli_visit" class="uilib-enability uilib-disable-role-observador" type="checkbox" <%- soli_visit ? 'checked=""' : '' %> required></td>
            </tr>
            <tr>
              <td>Parecer da unidade</td>
              <td><input id="p_unid" class="uilib-enability uilib-disable-role-observador" type="checkbox" <%- p_unid ? 'checked=""' : '' %> required></td>
            </tr>
            <tr>
              <td>Parecer técnico</td>
              <td><input id="p_tec" class="uilib-enability uilib-disable-role-observador" type="checkbox" <%- p_tec ? 'checked=""' : '' %> required></td>
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
          <div id="js-btns-next">
            <!-- TODO. Los "siguientes estados" disponibles no deberían estar harcodeados en el html
            o bien, todos los botones deberían ser generados en otra parte, o de los dominios se deberían decidir que botones
            se pueden usar en el modo combo o algo así
            -->
            <button id="bt-ok" type="button" class="btn btn-default btn-sm uilib-enability uilib-hide-role-observador">Completa</button>
            <button id="bt-no" type="button" class="btn btn-primary btn-sm uilib-enability uilib-hide-role-observador">Incompleta</button>
            <button id="bt-noaprobada" type="button" class="btn btn-primary btn-sm uilib-enability uilib-hide-role-observador">Não aprovada</button>
            <button id="bt-defacto" type="button" class="btn btn-danger btn-sm uilib-enability uilib-hide-role-observador">Utente de facto</button>
          </div>
        </label>
        <textarea id="observacio" class="form-control widget uilib-enability uilib-disable-role-observador"></textarea>
        </div>
</div>
    </div>
</div>
 <div class="form-group">
     <label for="observacio_ant">Observações anteriores</label>
       <textarea class="form-control widget" id="observacio_ant" rows="7" disabled>
<% for (var i=0; i<req_obs.length - 1; i+=1) {
if (req_obs[i]['text']) {
print('O ' + formatter().formatDate(req_obs[i]['create_at']) + ', ' + req_obs[i]['author'] + ', escreveu: ' + req_obs[i]['text'] + '&#13;&#10;&#13;&#10;');
}
}
%>
       </textarea>
 </div>

    `),

    init: function() {
        Backbone.SIXHIARA.View1.prototype.init.call(this);
        var self = this;

        document
            .querySelectorAll('table input[type="checkbox"]')
            .forEach(function(input) {
                input.addEventListener("change", self.enableBts.bind(self), false);
            });

        this.enableBts();

        document
            .querySelectorAll('table input[type="checkbox"]')
            .forEach(function(input) {
                input.addEventListener("change", self.autosave.bind(self), false);
            });

        var defaultDataForFileModal = iAuth.getDefaultDataForFileModal(
            this.model.get("id")
        );
        new Backbone.DMS.FileModalView({
            openElementId: "#file-modal",
            title: "Arquivo Electr&oacute;nico",
            urlBase: defaultDataForFileModal.defaultUrlBase,
            id: defaultDataForFileModal.defaultFolderId,
        });
    },

    enableBts: function() {
        var validState = this.evaluateState();

        if (validState === SIRHA.ESTADO.PENDING_FIELD_VISIT) {
            this.enableBts_for_state_pending_field_visit();
        } else if (validState === SIRHA.ESTADO.PENDING_TECH_DECISION) {
            document.getElementById("bt-ok").disabled = true;
            document.getElementById("bt-ok").title =
                "Deve rechear correctamente a 'Ficha' dantes de completar";
            this.enableBts_for_state_pending_tech_decision();
        } else if (validState === "FICHA IS VALID") {
            var enableChb = SIRHA.Utils.DOM.allRequiredInputAreChecked(
                'table input[type="checkbox"]'
            );
            document.getElementById("bt-ok").disabled = !enableChb;
            document.getElementById("bt-ok").title = SIRHA.ESTADO.PENDING_EMIT_LICENSE;
            this.enableBts_for_state_pending_tech_decision();
        }

        this._subviews.forEach(v => v.enableBts());
    },

    evaluateState: function() {
        let validState = this.model.get("estado_lic");
        var expTest = this.model.cloneExploracao();
        if (expTest.get("estado_lic") === SIRHA.ESTADO.INCOMPLETE_DT) {
            expTest.setLicState(SIRHA.ESTADO.PENDING_FIELD_VISIT);
            if (expTest.isValid()) {
                validState = SIRHA.ESTADO.PENDING_TECH_DECISION;
            } else {
                validState = SIRHA.ESTADO.PENDING_FIELD_VISIT;
            }
        }
        if (validState === SIRHA.ESTADO.PENDING_TECH_DECISION) {
            expTest.setLicState(SIRHA.ESTADO.PENDING_TECH_DECISION);
            if (expTest.isValid()) {
                validState = "FICHA IS VALID";
            }
        }
        return validState;
    },

    enableBts_for_state_pending_field_visit: function() {
        SIRHA.Utils.DOM.enableBt("bt-adicionar");
        SIRHA.Utils.DOM.disableBt("bt-ficha");
        SIRHA.Utils.DOM.disableBt("bt-defacto");
        document.getElementById("p_unid").disabled = true;
        document.getElementById("p_tec").disabled = true;
        document.getElementById("bt-ok").disabled = true;
        document.getElementById("bt-ok").title =
            "Deve 'Adicionar' dantes de poder completar";
        document.getElementById("bt-defacto").title =
            "Deve 'Adicionar' dantes de poder criar uma 'Utente de facto'";
    },

    enableBts_for_state_pending_tech_decision: function() {
        SIRHA.Utils.DOM.disableBt("bt-adicionar");
        SIRHA.Utils.DOM.enableBt("bt-ficha");
        SIRHA.Utils.DOM.enableBt("bt-defacto");
        document.getElementById("p_unid").disabled = false;
        document.getElementById("p_tec").disabled = false;
    },

    fillExploracao: function(e, autosave) {
        var self = this;
        var exploracao = this.model;
        var nextState = wf.whichNextState(exploracao.get("estado_lic"), e);
        if (e && e.target && e.target.id === "bt-ok") {
            nextState = SIRHA.ESTADO.PENDING_EMIT_LICENSE;
        }

        if (autosave) {
            this.doFillExploracao(e, autosave);
        } else {
            bootbox.confirm(
                `A exploração vai mudar o seu a: <br> <strong>${nextState}</strong>`,
                function(result) {
                    if (result) {
                        self.doFillExploracao(e, autosave);
                    }
                }
            );
        }
    },

    doFillExploracao: function(e, autosave) {
        var self = this;
        var exploracao = this.model;

        var nextState = wf.whichNextState(exploracao.get("estado_lic"), e);

        var currentComment = exploracao.get("req_obs").slice(-1)[0];
        Object.assign(currentComment, {
            create_at: new Date(),
            author: iAuth.getUser(),
            text: document.getElementById("observacio").value,
            state: nextState,
        });

        if (!autosave) {
            exploracao.get("req_obs").push({
                create_at: null,
                author: null,
                text: null,
                state: null,
            });
        }

        exploracao.setLicState(nextState);

        document
            .querySelectorAll('table input[type="checkbox"]')
            .forEach(function(input) {
                exploracao.set(input.id, input.checked);
            });

        exploracao.urlRoot = Backbone.SIXHIARA.Config.apiRequerimentos;
        exploracao.save(null, {
            patch: true,
            validate: false,
            wait: true,
            success: function(model, response, options) {
                self.onSuccessfulSave(model, response, options, autosave);
            },
            error: function() {
                bootbox.alert(
                    '<span style="color: red;">Produziu-se um erro. Informe ao administrador.</strong>'
                );
            },
        });
    },
});
