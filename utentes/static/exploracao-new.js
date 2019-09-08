$(document).ready(function() {
    $("#wizard-exp").bootstrapWizard({
        withVisible: false,
    });
    document.body.style.cursor = "wait";
});

var exploracao = new Backbone.SIXHIARA.Exploracao();
var domains = new Backbone.UILib.DomainCollection();
var expedientes = new Backbone.SIXHIARA.Expediente();
var utentes = new Backbone.SIXHIARA.UtenteCollection();
var newExpId;

var fetchPromises = function fetchPromises(id) {
    var jqxhr = _.invoke([domains, utentes, expedientes], "fetch", {parse: true});

    if (isNaN(id)) {
        var mock = {
            fetch: function() {
                return Promise.resolve().then(() => exploracao.toJSON());
            },
        };
    } else {
        // Se llega a la página desde la de requerimentos
        exploracao.set("id", id, {silent: true});
        var mock = exploracao;
    }
    jqxhr.push(mock.fetch({parse: true}));

    // "utenet de usos comuns" o "utente de facto"
    var backendNextState = document.getElementById("next_state").value;
    var newExpIdDeferred = SIRHA.Services.IdService.getNewExpIdFromApi(
        backendNextState
    ).then(function(v) {
        newExpId = v.exp_id;
    });
    jqxhr.push(newExpIdDeferred);

    return _.invoke(jqxhr, "promise");
};

var configureBasedOnId = function configureBasedOnId(id) {
    if (id) {
        document.getElementById("exp_id").readOnly = true;
        document.getElementById("d_soli").readOnly = true;

        var nextState = wf.whichNextState(exploracao.get("estado_lic"), {
            target: {id: "bt-ok"},
        });
        exploracao.set("state_to_set_after_validation", nextState, {
            silent: true,
        });
    } else {
        exploracao.set("exp_id", newExpId, {silent: true});
        document.getElementById("exp_id").placeholder = newExpId;

        if (!window.SIRHA.is_single_user_mode()) {
            var backendNextState = document.getElementById("next_state").value;
            exploracao.set(
                {
                    estado_lic: SIRHA.ESTADO.PENDING_FIELD_VISIT,
                    state_to_set_after_validation: backendNextState,
                },
                {silent: true}
            );
        }
    }
};

var whenAllDataIsFetched = function whenAllDataIsFetched() {
    configureBasedOnId(id);
    fillComponentsWithDomains();
    doIt();
};

var id = SIRHA.Utils.getIdFromSearchParams();

Promise.all(fetchPromises(id))
    .then(function() {
        whenAllDataIsFetched();
    })
    .catch(function(error) {
        console.log(error);
    })
    .finally(function() {
        document.body.style.cursor = "default";
    });

function doIt() {
    new Backbone.SIXHIARA.UtenteView({
        el: document.getElementById("utente"),
        collection: utentes,
    });

    new Backbone.SIXHIARA.InfoView({
        el: document.getElementById("info"),
        expedientes: expedientes,
    });

    // save action
    new Backbone.SIXHIARA.ButtonSaveView({
        el: $("#save-button"),
        model: exploracao,
    }).render();

    // page info
    new Backbone.UILib.WidgetsView({
        el: $("#info"),
        model: exploracao,
    }).render();

    // page utente
    new Backbone.UILib.WidgetsView({
        el: $("#utente"),
        model: exploracao.get("utente"),
    }).render();

    // page licencias & fontes: superficial
    var licenseSupView = new Backbone.SIXHIARA.LicenseView({
        el: $("#licencia-superficial"),
        model: exploracao,
        domains: domains,
        tipo_agua: "Superficial",
        selectorButtonAddFonte: "#fonte-superficial",
        selectorModalFonte: "#fonte-superficial-modal",
    }).render();

    // page licencias & fontes: subterranea
    var licenseSubView = new Backbone.SIXHIARA.LicenseView({
        el: $("#licencia-subterranea"),
        model: exploracao,
        domains: domains,
        tipo_agua: "Subterrânea",
        selectorButtonAddFonte: "#fonte-subterranea",
        selectorModalFonte: "#fonte-subterranea-modal",
    }).render();

    // page licencias & fontes: fontes table
    var tableFontesView = new Backbone.SIXHIARA.TableView({
        el: $("#fontes"),
        collection: exploracao.get("fontes"),
        domains: domains,
        rowViewModel: Backbone.SIXHIARA.RowFonteView,
        noDataText: "NON HAI FONTES",
    }).render();
    tableFontesView.listenTo(exploracao.get("fontes"), "update", function(
        model,
        collection,
        options
    ) {
        this.update(exploracao.get("fontes"));
    });
}

function fillComponentsWithDomains() {
    var actividades = domains.byCategory("actividade");

    // page info: actividade
    new Backbone.UILib.SelectView({
        el: $("#actividade"),
        collection: actividades,
    }).render();
    new Backbone.SIXHIARA.SelectActividadeView({
        el: $("#actividade-select"),
        model: exploracao,
    });

    // page info: localizacao
    new Backbone.SIXHIARA.SelectLocationView({
        domains: domains,
        model: exploracao,
        domainsKeys: ["provincia", "distrito", "posto"],
        el: $("#info"),
    }).render();
    new Backbone.SIXHIARA.SelectBaciaView({
        domains: domains,
        model: exploracao,
        el: $("#info"),
    }).render();

    new Backbone.SIXHIARA.SelectLocationView({
        domains: domains,
        model: exploracao.get("utente"),
        domainsKeys: ["utentes-provincia", "utentes-distrito", "utentes-posto"],
        el: $("#utente"),
    }).render();

    var selectUtenteTipo = new Backbone.UILib.SelectView({
        el: $("#uten_tipo"),
        collection: domains.byCategory("utentes_uten_tipo"),
    }).render();
}
