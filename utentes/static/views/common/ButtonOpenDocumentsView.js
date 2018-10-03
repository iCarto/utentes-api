Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ButtonOpenDocumentsView = Backbone.View.extend({

    events: {
        "click": "openDocumentsDialog"
    },

    initialize: function(options) {
        this.options = options || {};
        this.openDefaultRoot = options.openDefaultRoot;
    },

    openDocumentsDialog: function(){
        var modalView = new Backbone.DMS.DocumentosModalView({
            title: 'Arquivo Electrónico',
            openDefaultRoot: this.openDefaultRoot,
            exploracao: this.model,
            modalSelectorTpl: '#documents-modal-tmpl',
            model: this.model
        });
        modalView.show();
    }

});
