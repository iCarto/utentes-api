var expedientes = new Backbone.SIXHIARA.Expediente();
expedientes.fetch();

var fileModalView = new Backbone.DMS.FileModalView({
    openElementId: '#file-modal',
    title: 'Arquivo Electr&oacute;nico',
    uploadInmediate: false,
    components: ["upload"]
});

function init() {

    document.querySelectorAll('form input[type="checkbox"]').forEach(function(input){
        input.addEventListener('change', enableBts);
    });
    document.getElementById('exp_name').addEventListener('input', enableBts);
    document.getElementById('d_soli').addEventListener('input', enableBts);
    document.getElementById('d_soli').value = moment().format("DD/MM/YYYY");


    document.getElementById('js-btns-next').addEventListener('click', function(e){
        fillExploracao(e);
    });

    var wf_tmp = Object.create(MyWorkflow);
    var NOT_EXISTS = Backbone.SIXHIARA.Estado.NOT_EXISTS;
    var nextStateOk = wf_tmp.whichNextState(NOT_EXISTS, {target:{id: 'bt-ok'}});
    var nextStateNo = wf_tmp.whichNextState(NOT_EXISTS, {target:{id: 'bt-no'}});
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
    var validDate = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/.test(document.getElementById("d_soli").value);
    var enableBtNo = exp_name.value && exp_name.value.length > 3 && validDate;

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

function savePendingFiles(model) {
    fileModalView.saveFiles({
        uploadFinished: function(success) {
            if(success) {
                fileModalView._close();
                bootbox.alert(`A exploração&nbsp;<strong>${model.get('exp_id')} - ${model.get('exp_name')}</strong>&nbsp;tem sido criada correctamente.`, function(){
                    window.location = Backbone.SIXHIARA.Config.urlPendentes;
                });
            }else{
                bootbox.alert(`<span style="color: red;">A exploração&nbsp;<strong>${model.get('exp_id')} - ${model.get('exp_name')}</strong>&nbsp;tem sido criada correctamente, pero produziu-se um erro ao enviar os arquivos. Informe ao administrador.</strong>`);
            }
        }
    });
}

function fillExploracao(e, autosave) {
    var exploracao = new Backbone.SIXHIARA.Exploracao({'estado_lic': Backbone.SIXHIARA.Estado.NOT_EXISTS});
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

    if (exploracao.get("estado_lic") == Backbone.SIXHIARA.Estado.INCOMPLETE_DA ||
        exploracao.get("estado_lic") == Backbone.SIXHIARA.Estado.INCOMPLETE_DJ) {
            exploracao.setDocPendenteUtente();
    }

    document.querySelectorAll('form input[type="checkbox"]').forEach(function(input){
        exploracao.set(input.id, input.checked);
    });

    var sTokens = document.getElementById("d_soli").value.split("/")
    var initialDate = new Date(sTokens[2], sTokens[1] - 1, sTokens[0], 1, 1, 1)
    exploracao.set('d_soli', initialDate);
    exploracao.set('d_ultima_entrega_doc', initialDate);

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

                    if(fileModalView.hasPendingFiles()) {
                        console.log('hasPendingFiles')
                        var departamento = wf.isAdmin() ? ROL_ADMINISTRATIVO : wf.getRole();
                        var url = Backbone.SIXHIARA.Config.apiExploracaos + '/' + model.get('id') + '/documentos';
                        fileModalView.show();
                        fileModalView.setUrlBase(url);
                        fileModalView.setId(departamento);
                        fileModalView.onShown(savePendingFiles, model);
                    }else{
                        bootbox.alert(`A exploração&nbsp;<strong>${model.get('exp_id')} - ${model.get('exp_name')}</strong>&nbsp;tem sido criada correctamente.`, function(){
                            window.location = Backbone.SIXHIARA.Config.urlPendentes;
                        });
                    }
                },
                'error': function() {
                    bootbox.alert('<span style="color: red;">Produziu-se um erro. Informe ao administrador.</strong>');
                }
            }
        );
    });

};

init();
