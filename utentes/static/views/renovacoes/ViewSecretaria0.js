Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewSecretaria0 = Backbone.SIXHIARA.View1.extend({
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
              <%- Backbone.SIXHIARA.formatter.formatTipoLicencias(licencias)[0] %> / <%- Backbone.SIXHIARA.formatter.formatTipoLicencias(licencias)[1] %>
           </div>
        </h4>
        <div id="renovacao-block" class="row panel-equal-height">
           <div class="col-xs-6">
              <div class="panel">
                 <div class="row">
                    <div class="col-xs-12">
                       <div class="form-group">
                          <label for="d_soli">Data de solicitação</label>
                          <input type="text" class="form-control widget widget-date uilib-enability uilib-disable-role-observador uilib-disable-role-juridico" id="d_soli" placeholder="dd/mm/yyyy" pattern="^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\\d\\d$" value="<%- formatter().formatDate(renovacao.d_soli) %>" required>
                          <span id="helpBlock_d_soli" class="help-block" style="padding-top: 2px; display: none;">&nbsp;</span>
                       </div>
                       <table class="table table-bordered table-checks">
                          <thead>
                             <tr>
                                <th>Tipo de Documento</th>
                                <th>Entrega</th>
                             </tr>
                          </thead>
                          <tbody>
                             <tr>
                                <td>Carta de requerimento de renovação</td>
                                <td><input id="carta_ren" class="uilib-enability uilib-disable-role-observador uilib-disable-role-juridico" type="checkbox" <%- renovacao.carta_ren ? 'checked=""' : '' %> required></td>
                             </tr>
                             <tr>
                                <td>Identificação do proprietário</td>
                                <td><input id="ident_pro" class="uilib-enability uilib-disable-role-observador uilib-disable-role-juridico" type="checkbox" <%- renovacao.ident_pro ? 'checked=""' : '' %>></td>
                             </tr>
                             <tr>
                                <td>Certificado de registo comercial</td>
                                <td><input id="certi_reg" class="uilib-enability uilib-disable-role-observador uilib-disable-role-juridico" type="checkbox" <%- renovacao.certi_reg ? 'checked=""' : '' %>></td>
                             </tr>
                             <tr>
                                <td>DUAT ou declaração das estructuras locais&nbsp;(bairro)</td>
                                <td><input id="duat" class="uilib-enability uilib-disable-role-observador uilib-disable-role-juridico" type="checkbox" <%- renovacao.duat ? 'checked=""' : '' %>></td>
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
                          <button id="bt-ok" type="button" class="btn btn-default uilib-enability uilib-hide-role-observador uilib-disable-role-juridico">Completa</button>
                          <button id="bt-no" type="button" class="btn btn-primary uilib-enability uilib-hide-role-observador uilib-disable-role-juridico">Incompleta</button>
                       </div>
                    </label>
                    <textarea id="observacio" class="form-control widget uilib-enability uilib-disable-role-observador uilib-disable-role-juridico"></textarea>
                 </div>
              </div>
           </div>
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
        document
            .getElementById("d_soli")
            .addEventListener("input", self.enableBts.bind(self), false);
        document.getElementById("d_soli").addEventListener("input", function(e) {
            if (self.isValidDate(this)) {
                var dateId = "d_soli";
                var dateObj = self.parseDate(dateId);
                self.model.get("renovacao").set(dateId, dateObj);
                self.model.get("renovacao").set("d_ultima_entrega_doc", dateObj);
                self.autosave(self);
            }
        });

        if (self.model.get("renovacao").get("lic_time_info")) {
            document.getElementById("time-renovacao-info").style.display = "block";
        }

        this.enableBts();

        document
            .querySelectorAll('table input[type="checkbox"]')
            .forEach(function(input) {
                input.addEventListener("change", self.autosave.bind(self), false);
            });

        var defaultDataForFileModal = iAuth.getDefaultDataForFileModal(
            this.model.get("id")
        );
        var fileModalView = new Backbone.DMS.FileModalView({
            openElementId: "#file-modal",
            title: "Arquivo Electr&oacute;nico",
            urlBase: defaultDataForFileModal.defaultUrlBase,
            id: defaultDataForFileModal.defaultFolderId,
        });
    },

    enableBts: function() {
        var validDate = this.isValidDate(document.getElementById("d_soli"));
        var enable =
            validDate &&
            Array.from(document.querySelectorAll('table input[type="checkbox"]')).every(
                input => {
                    if (input.required) {
                        return input.checked;
                    }
                    return true;
                }
            );
        document.getElementById("bt-ok").disabled = !enable;
    },

    isValidDate: function(dateWidget) {
        if (!dateWidget.value) return false;
        var dateObj = formatter().unformatDate(dateWidget.value);
        var validDate =
            dateObj &&
            formatter().validDateFormat(dateWidget.value) &&
            !formatter().isFuture(dateObj);
        if (validDate) {
            dateWidget.setCustomValidity("");
        } else {
            dateWidget.setCustomValidity(
                "A data deve ter o formato correto, ser posterior à data da solicitação e não ser posterior a hoje."
            );
        }

        var helpBlock = document.getElementById("helpBlock_d_soli");
        if (validDate) {
            helpBlock.innerText = "";
            helpBlock.style.color = null;
            helpBlock.style.display = "none";
            return true;
        } else {
            helpBlock.innerText =
                "A data deve ter o formato correto, ser posterior à data da solicitação e não ser posterior a hoje.";
            helpBlock.style.color = "red";
            helpBlock.style.display = "block";
            return false;
        }
    },
});
