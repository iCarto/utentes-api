var expedientes = new Backbone.SIXHIARA.Expediente();
expedientes.fetch();

function init() {

    document.querySelectorAll('form input[type="checkbox"]').forEach(function(input){
        input.addEventListener('change', enableBts);
    });
    document.getElementById('exp_name').addEventListener('input', enableBts);

    document.getElementById('js-btns-next').addEventListener('click', function(e){
        fillExploracao(e);
    });

    var wf_tmp = Object.create(MyWorkflow);
    var nextStateOk = wf_tmp.whichNextState('Não existe', {target:{id: 'bt-ok'}});
    var nextStateNo = wf_tmp.whichNextState('Não existe', {target:{id: 'bt-no'}});
    document.getElementById('bt-ok').title = nextStateOk;
    document.getElementById('bt-no').title = nextStateNo;

    enableBts();

    $('[data-toggle="tooltip"]').tooltip();

}

function validateName(name) {
  $("#form-exp_name-warning-message").hide()
  var expList = expedientes.get('list');
  var newName = accentNeutralise(name)
  for (exp in expList) {
        var existentName = accentNeutralise(expList[exp]['exp_name']);
    if (existentName === newName) {
      $("form-exp_name-warning-message").show();
      return;
    }
  }
}

function enableBts() {
    var exp_name = document.getElementById('exp_name');
    var enableBtNo = exp_name.value && exp_name.value.length > 3;
    document.getElementById('bt-no').disabled = !enableBtNo;

    var enable = enableBtNo && Array.from(
        document.querySelectorAll('form input[type="checkbox"]')
    ).every(input => {
        if (input.required) {
            return input.checked;
        }
        return true;
    });

    document.getElementById('bt-ok').disabled = !enable;

    validateName(exp_name.value);
};


function fillExploracao(e, autosave) {
    var exploracao = new Backbone.SIXHIARA.Exploracao({'estado_lic': 'Não existe'});
    exploracao.set('req_obs', [{
        'create_at': null,
        'author': null,
        'text': null,
        'state': null,
    }]);
    exploracao.set('exp_name', document.getElementById('exp_name').value);


    var nextState = wf.whichNextState(exploracao.get('estado_lic'), e);
    var currentComment = exploracao.get('req_obs').slice(-1)[0];
    Object.assign(currentComment, {
        'create_at': new Date(),
        'author': wf.getUser(),
        'text': document.getElementById('observacio').value,
        'state': nextState,
    })
    if (!autosave) {
        exploracao.get('req_obs').push({
            'create_at': null,
            'author': null,
            'text': null,
            'state': null,
        });
    }

    exploracao.setLicState(nextState);

    document.querySelectorAll('form input[type="checkbox"]').forEach(function(input){
        exploracao.set(input.id, input.checked);
    });

    exploracao.urlRoot = Backbone.SIXHIARA.Config.apiRequerimentos;
    bootbox.confirm(`Vai criar-se uma nova exploração com estado: <br> <strong>${nextState}</strong>`, function(result){
        if (!result) {
            return;
        }
        exploracao.save(
            null,
            {
                'patch': true,
                'validate': false,
                'wait': true,
                'success': function(model) {
                    var exp_id = model.get('exp_id');
                    var exp_name = model.get('exp_name');
                    bootbox.alert(`A exploração <strong>${exp_id} - ${exp_name}</strong> tem sido criada correctamente.`, function(){
                        window.location = Backbone.SIXHIARA.Config.urlPendentes;
                    });
                },
                'error': function() {
                    bootbox.alert('<span style="color: red;">Produziu-se um erro. Informe ao administrador.</strong>');
                },
            }
        );
    });
};


init();
