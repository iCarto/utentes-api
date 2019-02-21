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
                          <input type="text" class="form-control widget widget-date uilib-enability uilib-disable-role-observador" id="d_soli" placeholder="dd/mm/yyyy" pattern="^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\\d\\d$" value="<%- formatter().formatDate(renovacao.d_soli) %>">
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
                                <td><input id="carta_ren" class="uilib-enability uilib-disable-role-observador" type="checkbox" <%- renovacao.carta_ren ? 'checked=""' : '' %> required></td>
                             </tr>
                             <tr>
                                <td>Identificação do proprietário</td>
                                <td><input id="ident_pro" class="uilib-enability uilib-disable-role-observador" type="checkbox" <%- renovacao.ident_pro ? 'checked=""' : '' %> required></td>
                             </tr>
                             <tr>
                                <td>Certificado de registo comercial</td>
                                <td><input id="certi_reg" class="uilib-enability uilib-disable-role-observador" type="checkbox" <%- renovacao.certi_reg ? 'checked=""' : '' %> required></td>
                             </tr>
                             <tr>
                                <td>DUAT ou declaração das estructuras locais&nbsp;(bairro)</td>
                                <td><input id="duat" class="uilib-enability uilib-disable-role-observador" type="checkbox" <%- renovacao.duat ? 'checked=""' : '' %> required></td>
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
                       </div>
                    </label>
                    <textarea id="observacio" class="form-control widget uilib-enability uilib-disable-role-observador"></textarea>
                 </div>
              </div>
           </div>
        </div>

    `),

    init: function() {
        Backbone.SIXHIARA.View1.prototype.init.call(this);
        var self = this;

        document.querySelectorAll('table input[type="checkbox"]').forEach(function(input){
            input.addEventListener('change', self.enableBts.bind(self), false);
        });
        document.getElementById('d_soli').addEventListener('input', self.enableBts.bind(self), false);
        document.getElementById('d_soli').addEventListener('input', function(){
            if(self.isValidDate(this.value)){
                self.parseDate(this.value)
                self.autosave(self)
            }
        });
        if (self.model.get('renovacao').get('lic_time_info')) {
            document.getElementById('time-renovacao-info').style.display = 'block';
        }

        // Disable input of data solicitação if the time has ended
        if (this.model.get('renovacao').get('lic_time_info') ==  'Prazo esgotado') {
            document.getElementById('d_soli').readOnly = true;
        }

        this.enableBts();

        document.querySelectorAll('table input[type="checkbox"]').forEach(function(input){
            input.addEventListener('change', self.autosave.bind(self), false);
        });

        var defaultDepartamento = wfr.isAdmin() ? 'root' : wfr.getRole();
        var defaultUrlBase = Backbone.SIXHIARA.Config.apiRenovacoes + '/' + this.model.get('renovacao').get('id') + '/documentos'
        var fileModalView = new Backbone.DMS.FileModalView({
            openElementId: '#file-modal',
            title: 'Arquivo Electr&oacute;nico',
            urlBase: defaultUrlBase,
            id: defaultDepartamento
        });

    },

    enableBts: function() {
        var validDate = this.isValidDate(document.getElementById("d_soli").value)
        var enable = validDate && Array.from(
            document.querySelectorAll('table input[type="checkbox"]')
        ).every(input => {
            if (input.required) {
                return input.checked;
            }
            return true;
        });
        document.getElementById('bt-ok').disabled = !enable;
    },

    parseDate: function(e){
        var d_soliInput = document.getElementById("d_soli").value;
        var sTokens = d_soliInput.split("/")
        var initialDate = new Date(sTokens[2], sTokens[1] - 1, sTokens[0], 1, 1, 1)
        this.model.get("renovacao").set('d_soli', initialDate);
        this.model.get("renovacao").set('d_ultima_entrega_doc', initialDate);
    },

    isValidDate: function(date){
        if (this.isValidFormatDate(date) && moment(date, 'DD/MM/YYYY').isValid()) {
            return true
        }
        return false
    },
});
