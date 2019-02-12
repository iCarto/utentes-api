$(document).ready(function() {
    $('#wizard-exp').bootstrapWizard({
        'withVisible': false
    });
    document.body.style.cursor = 'wait';
});


var exploracao = new Backbone.SIXHIARA.Exploracao();
var domains = new Backbone.UILib.DomainCollection();
var expedientes = new Backbone.SIXHIARA.Expediente();
expedientes.fetch();

var exp_id = document.getElementById('exp_id');
exp_id.addEventListener('input', validateID);

var exp_name = document.getElementById('exp_name');
exp_name.addEventListener('input', validateName);

var dateId = 'd_soli';
var dateWidget = document.getElementById(dateId);
dateWidget.addEventListener('input', function(e){
    var dateWidget = e.target;
    var validDate = formatter().validDateFormat(dateWidget.value);
    if (validDate) {
        dateWidget.setCustomValidity('');
    } else {
        dateWidget.setCustomValidity('A data deve ter o formato correto');
    }
});


function validateID() {
  $("#form-exp_id-warning-message").hide()
  var expList = expedientes.get('list');
  for (exp in expList) {
    if (expList[exp]['exp_id'] === exp_id.value) {
      $("#form-exp_id-warning-message").show()
      return;
    }
  }
}

function validateName() {
  $("#form-exp_name-warning-message").hide()
  var expList = expedientes.get('list');
  var newName = accentNeutralise(exp_name.value)
  for (exp in expList) {
      var existentName = accentNeutralise(expList[exp]['exp_name']);
    if (existentName === newName) {
      $("#form-exp_name-warning-message").show()
      return;
    }
  }
}


var LIC_ST = Backbone.SIXHIARA.Estado;
var params = new URLSearchParams(document.location.search.substring(1));
var id = params.get('id');
if (id) {
    // Se llega a la página desde la de requerimentos
    exploracao.set('id', id, {silent: true});
    exploracao.fetch({
        parse: true,
        success: function(){
            domains.fetch({
                success: function(collection, response, options) {
                    fillComponentsWithDomains();
                    if ((exploracao.get('estado_lic') !== LIC_ST.PENDING_FIELD_VISIT) && (exploracao.get('estado_lic') !== LIC_ST.INCOMPLETE_DT)) {
                        // To avoid call it twice, for example clicking back browser button
                        window.location = Backbone.SIXHIARA.Config.urlShow + exploracao.get('id');
                    }
                    exploracao.set('d_soli', new Date(exploracao.get('created_at')), {silent: true});
                    doIt();
                    document.getElementById('exp_id').readOnly = true;
                    document.getElementById('d_soli').readOnly = true;
                    document.querySelectorAll('#licencia-superficial #estado')[0].parentNode.remove();
                    document.querySelectorAll('#licencia-subterranea #estado')[0].parentNode.remove();
                    var nextState = wf.whichNextState(exploracao.get('estado_lic'), {target: {id: 'bt-ok'}});
                    exploracao.set('state_to_set_after_validation', nextState, {silent: true});
                },
                error: function (collection, response, option) {
                    console.log('error fetching domains');
                }
            });
        },
        error: function(){
            console.log('Error recuperando exploração');
        }
    });
} else {
    domains.fetch({
        success: function(collection, response, options) {
            fillComponentsWithDomains();
            if (! window.SIRHA.is_single_user_mode()) {
                exploracao.set({
                    'estado_lic': LIC_ST.PENDING_FIELD_VISIT,
                    'd_soli': new Date(),
                }, {silent: true});
            }
            exploracao.set('exp_id', expedientes.get('new_exp_id'), {silent: true});
            document.getElementById('exp_id').placeholder = expedientes.get('new_exp_id');
            doIt();
            if (! window.SIRHA.is_single_user_mode()) {
                document.querySelectorAll('#licencia-superficial #estado')[0].parentNode.remove();
                document.querySelectorAll('#licencia-subterranea #estado')[0].parentNode.remove();
                exploracao.set('state_to_set_after_validation', Backbone.SIXHIARA.Estado.DE_FACTO, {silent: true});
                document.getElementById('save-button').innerHTML = 'Criar Utente de facto';
            }
        },
        error: function (collection, response, option) {
            console.log('error fetching domains');
        }
    });

}


var utentes = new Backbone.SIXHIARA.UtenteCollection();
utentes.fetch({
    success: function(collection, response, options) {
        fillSelectUtente();
        document.body.style.cursor = 'default';
    },
    error: function (collection, response, options) {
        console.log('error fetching utentes');
    }
});


function doIt() {
    document.getElementById('exp_id').pattern = Backbone.SIXHIARA.Exploracao.EXP_ID_REGEXP().source;

    // save action
    new Backbone.SIXHIARA.ButtonSaveView({
        el: $('#save-button'),
        model: exploracao
    }).render();

    // page info
    new Backbone.UILib.WidgetsView({
        el: $('#info'),
        model: exploracao
    }).render();

    // page utente
    new Backbone.UILib.WidgetsView({
        el: $('#utente'),
        model: exploracao.get('utente')
    }).render();

    // page licencias & fontes: superficial
    var licenseSupView = new Backbone.SIXHIARA.LicenseView({
        el: $('#licencia-superficial'),
        model: exploracao,
        domains: domains,
        tipo_agua: 'Superficial',
        selectorButtonAddFonte: '#fonte-superficial',
        selectorModalFonte: '#fonte-superficial-modal',
    }).render();

    // page licencias & fontes: subterranea
    var licenseSubView = new Backbone.SIXHIARA.LicenseView({
        el: $('#licencia-subterranea'),
        model: exploracao,
        domains: domains,
        tipo_agua: 'Subterrânea',
        selectorButtonAddFonte: '#fonte-subterranea',
        selectorModalFonte: '#fonte-subterranea-modal',
    }).render();

    // page licencias & fontes: fontes table
    var tableFontesView = new Backbone.SIXHIARA.TableView({
        el: $('#fontes'),
        collection: exploracao.get('fontes'),
        domains: domains,
        rowViewModel: Backbone.SIXHIARA.RowFonteView,
        noDataText: 'NON HAI FONTES',
    }).render();
    tableFontesView.listenTo(exploracao.get('fontes'), 'update', function(model, collection, options){
        this.update(exploracao.get('fontes'));
    });
}

function fillSelectUtente(){
    new Backbone.SIXHIARA.SelectUtenteView({
        el: $('#utente'),
        collection: utentes
    }).render();
}


function fillComponentsWithDomains(){

    var actividades = domains.byCategory('actividade');

    // page info: actividade
    new Backbone.UILib.SelectView({
        el: $('#actividade'),
        collection: actividades
    }).render();
    new Backbone.SIXHIARA.SelectActividadeView({
        el: $('#actividade-select'),
        model: exploracao
    });

    // page info: localizacao
    new Backbone.SIXHIARA.SelectLocationView({
        domains: domains,
        model: exploracao,
        domainsKeys: ['provincia', 'distrito', 'posto'],
        el: $('#info'),
    }).render();
    new Backbone.SIXHIARA.SelectBaciaView({
        domains: domains,
        model: exploracao,
        el: $('#info'),
    }).render();

    // No entra aquí en la de adicionar con id, vamos no se ejecuta el código de dentro
    // page utente: localizacion
    new Backbone.SIXHIARA.SelectLocationView({
        domains: domains,
        model: exploracao.get('utente'),
        domainsKeys: ['utentes-provincia', 'utentes-distrito', 'utentes-posto'],
        el: $('#utente'),
    }).render();

    var selectUtenteTipo = new Backbone.UILib.SelectView({
        el: this.$('#uten_tipo'),
        collection: domains.byCategory('utentes_uten_tipo')
    }).render();

}
