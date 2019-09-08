SIRHA.Services.IdService = {
    getNewExpIdFromApi: function getNewExpIdFromApi(state) {
        var jqxhr = $.getJSON(Backbone.SIXHIARA.Config.apiNewExpId, {state: state});
        return jqxhr;
    },

    getExpIdRegExp: function getExpIdRegExp() {
        var ara = window.SIRHA.getARA();
        return new RegExp("^\\d{3}/" + ara + "/\\d{4}/(UF|SL|CL)$");
    },

    setExpIdPatternOnWidget: function setExpIdPatternOnWidget(selector) {
        selector = selector || "input#exp_id"; // don't remove 'input'
        var widget = document.querySelector(selector);
        widget.pattern = SIRHA.Services.IdService.getExpIdRegExp().source;
    },

    isNotValidExpId: function isNotValidExpId(expId) {
        var re = SIRHA.Services.IdService.getExpIdRegExp();
        return !expId || !re.test(expId);
    },

    extractYearFromExpId: function extractYearFromExpId(exp) {
        /*
        Take care. But the name, the `exp` parameter could be:
        * a Backbone Exploracao Model
        * a json with an exp_id property
        */
        var expId = exp.exp_id || exp.get("exp_id");
        return expId.split("/")[2];
    },

    calculateNewLicNro: function calculateNewLicNro(expId, tipoAgua) {
        return expId + "/" + tipoAgua.substring(0, 3);
    },

    isNotValidLicNro: function isNotValidLicNro(licNro) {
        var expId = licNro.substring(0, 16);
        var tipoAgua = licNro.substring(16);

        // Si el exp_id no es válido, lic_nro no es válido
        if (SIRHA.Services.IdService.isNotValidExpId(expId)) {
            return true;
        }

        // Si tipo agua no es válido, lic_nro no es válido
        if (!["/Sub", "/Sup"].includes(tipoAgua)) {
            return true;
        }

        // Si no ha fallado todavía es que lic_nro es válido
        return false;
    },

    extractSeqFromChildId: function extractSeqFromChildId(childId) {
        return childId.slice(-3);
    },
};
