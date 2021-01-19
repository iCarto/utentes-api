Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewWeapExportButton = Backbone.View.extend({
    init: function() {
        var json = this.model.toJSON();
        var exportBthtml = _.template(`
            <div class="btn-group" role="group">
                <a id="bt-export-demand" class="btn btn-default" role="button" href="/api/weap/demand?id=<%- id %>">Exportar demandas</a>
            </div>
        `)(json);

        const exportBtEl = SIRHA.Utils.DOM.htmlToElement(exportBthtml);
        document
            .getElementById("bt-ficha")
            .parentNode.parentNode.appendChild(exportBtEl);

        var checkboxesHtml = _.template(`
            <tr class="tr-parentcheckbox-in-tables">
              <td>Parecer técnico</td>
              <td bo><input id="p_tec" class="uilib-enability uilib-disable-role-observador" type="checkbox" <%- p_tec ? 'checked=""' : '' %> required></td>
            </tr>
            <tr class="tr-childcheckbox-in-tables">
              <td>Avaliação disponibilidade hídrica (WEAP WAM-T)</td>
              <td><input id="p_tec_disp_hidrica" class="uilib-enability uilib-disable-role-observador" type="checkbox" <%- p_tec_disp_hidrica ? 'checked=""' : '' %> ></td>
            </tr>
        `)(json);

        const checkboxesEl = SIRHA.Utils.DOM.htmlToElements(checkboxesHtml);
        document
            .getElementById("p_tec")
            .parentNode.parentNode.replaceWith(...checkboxesEl);

        return this;
    },

    enableBts: function() {
        document.getElementById(
            "p_tec_disp_hidrica"
        ).disabled = document.getElementById("p_tec").disabled;

        const fichaBt = document.getElementById("bt-ficha");
        if (fichaBt.classList.contains("disabled")) {
            SIRHA.Utils.DOM.disableBt("bt-export-demand");
        } else {
            SIRHA.Utils.DOM.enableBt("bt-export-demand");
        }
    },
});
