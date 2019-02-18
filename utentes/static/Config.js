Backbone.SIXHIARA = Backbone.SIXHIARA || {};

Backbone.SIXHIARA.Config = {
    urlSearch: '/exploracao-search.html',
    urlShow: '/exploracao-show.html?id=',
    urlUtentes: '/utentes.html',
    urlPendentes: '/requerimento-pendente.html',
    urlOfflineData: '/static/offline/data/',
    urlOfflineDataLeged: '/static/offline/legend/Cidadesevilas.png',
    apiDomains: '/api/domains',
    apiExploracaos: '/api/exploracaos',
    apiRequerimentos: '/api/requerimento',
    apiFacturacao: '/api/facturacao',
    apiRenovacoes: '/api/renovacao',
    apiHistoricoRenovacoes: '/api/renovacao_historico',
    apiUtentes: '/api/utentes',
    apiCultivos: '/api/cultivos',
    apiTanquesPiscicolas: '/api/tanques_piscicolas',
};

Backbone.SIXHIARA.formatter = formatter();
Backbone.SIXHIARA.formatter.formatTipoLicencias = function(licencias){
    var licenciasStr = [ "-", "-" ];
    licencias.forEach(function(lic){
        var tipo = lic['tipo_agua'];
        if( tipo === 'Subterrânea' ){
            licenciasStr[0] = tipo;
        }
        if( tipo === 'Superficial'){
            licenciasStr[1] = tipo;
        }
    })
    return licenciasStr;
}

Backbone.SIXHIARA.MSG = {
    NO_ACTIVITY: 'Actividade non declarada',
};

$(document).ready(function() {
    var navBar = new Backbone.SIXHIARA.NavBarView({
        model: new Backbone.Model(),
        el: $('menu'),
    }).render();

    $('#settings').on('click', function(e){
        e.preventDefault();
        var configModalView = new Backbone.SIXHIARA.ConfigModalView({model: new Backbone.Model()});
        configModalView.show();
    });
});


Backbone.UILib.DomainCollection = Backbone.UILib.DomainCollection.extend({
    url: Backbone.SIXHIARA.Config.apiDomains,
});


ROL_ADMIN = 'Administrador';
ROL_ADMINISTRATIVO = 'Departamento Administrativo'; // DA
ROL_FINANCIERO = 'Departamento Financeiro'; // DF
ROL_DIRECCION = 'Direcção';
ROL_TECNICO = 'Departamento Técnico';  // DT
ROL_JURIDICO = 'Departamento Jurídico'; // DJ
ROL_SINGLE_SAFE = 'single'

var role_domains_collection = new Backbone.UILib.DomainCollection([
    {
        'category': 'groups',
        'text': null,
        'order': 0,
    },
    {
        'category': 'groups',
        'text': ROL_ADMIN,
        'order': 1,
    },
    {
        'category': 'groups',
        'text': ROL_ADMINISTRATIVO,
        'order': 2,
    },
    {
        'category': 'groups',
        'text': ROL_DIRECCION,
        'order': 3,
    },
    {
        'category': 'groups',
        'text': ROL_FINANCIERO,
        'order': 4,
    },
    {
        'category': 'groups',
        'text': ROL_JURIDICO,
        'order': 5,
    },
    {
        'category': 'groups',
        'text': ROL_TECNICO,
        'order': 6,
    },
]);

Backbone.SIXHIARA.tiemposRenovacion = {
    limit: 90,
    warning: 30
};

Backbone.SIXHIARA.duracionLicencias = {
    'Licença': '5',
    'Autorização': '1-2',
    'Concessão': '6-50',
};

Backbone.SIXHIARA.tipoTemplates = {
    Licença: 'static/print-templates/Modelo_Licenca_Autorizacion_SIRHA.docx',
    Autorização: 'static/print-templates/Modelo_Licenca_Autorizacion_SIRHA.docx',
    Concessão: 'static/print-templates/Modelo_Concesao_SIRHA.docx',
    Factura: 'static/print-templates/Modelo_Factura_SIRHAS_desarrollo.docx',
};

window.bootbox && bootbox.addLocale('pt-mz', {
    OK: 'Aceitar',
    CANCEL : 'Cancelar',
    CONFIRM : 'Aceitar',
});
window.bootbox && bootbox.setDefaults({
    locale: 'pt-mz',
    closeButton: false,
    backdrop: null,
    buttons: {
        cancel: {
            label: '<i class="fa fa-times"></i> Cancelar'
        },
        confirm: {
            label: '<i class="fa fa-check"></i> Aceitar'
        }
    },
});
