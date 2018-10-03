Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ButtonOpenDocumentsView = Backbone.View.extend({

    events: {
        "click": "openDocumentsDialog"
    },

    initialize: function() {
    },

    openDocumentsDialog: function(){
        var modalView = new Backbone.DMS.DocumentosModalView({
            title: 'Arquivo Electrónico',
            model: this.model,
            exploracao: this.model,
            modalSelectorTpl: '#documents-modal-tmpl',
        });
        modalView.show();
    }

});
