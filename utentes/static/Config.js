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
    apiUtentes: '/api/utentes',
    apiCultivos: '/api/cultivos',
    apiTanquesPiscicolas: '/api/tanques_piscicolas',
};

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
ROL_ADMINISTRATIVO = 'D. Administrativo';
ROL_FINANCIERO = 'D. Financeiro';
ROL_DIRECCION = 'Direcção';
ROL_TECNICO = 'D. Técnico';
ROL_JURIDICO = 'D. Jurídico';

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
