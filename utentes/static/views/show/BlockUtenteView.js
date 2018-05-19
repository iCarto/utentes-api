Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockUtenteView = Backbone.View.extend({

    events: {
        'click #editBlockUtente': 'renderModal'
    },

    initialize: function () {

        var view = this;
        this.subViews = [];

        var utenteView = new Backbone.UILib.WidgetsView({
            el: this.el,
            model: this.model.get('utente')
        });
        utenteView.listenTo(this.model, 'change:utente', function (model, value, options) {
            this.model = model.get('utente');
            this.render();
        });
        this.subViews.push(utenteView);

        this.utentes = new Backbone.SIXHIARA.UtenteCollection();
        this.domainsFilled = false;
        this.utentes.on('sync', this.setDomainsFilled, this);
        this.utentes.fetch({
            success: function() {
                console.log('utentes loaded');
            },
            error: function () {
                // TODO: show message to user
                console.error('could not get utentes from API');
            }
        });

    },

    setDomainsFilled: function () {
        this.domainsFilled = true;
    },

    render: function () {
        _.invoke(this.subViews, 'render');

        return this;
    },

    renderModal: function (event) {

        if(!this.domainsFilled) return;

        // we do not want SelectUtenteView to update base model
        // so we work with a clone and update the model on okButtonClicked
        var exploracao = this.model.clone();
        var utente = exploracao.get('utente').clone();

        // override default action for okButtonClicked
        var self = this;
        var UtenteModalView = Backbone.UILib.ModalView.extend({
            okButtonClicked: function () {
                // in this context, this is the backbone modalView
                if(this.isSomeWidgetInvalid()) return;
                var newUtente = self.utentes.findWhere({'nome': this.draftModel.get('nome')});
                self.model.set('utente', newUtente);
                this.$('.modal').modal('hide');
            }
        });

        var modalView = new UtenteModalView({
            model: utente,
            selectorTmpl: '#block-utente-modal-tmpl'
        });

        // connect auxiliary views
        var selectUtente = new Backbone.SIXHIARA.SelectUtenteView({
            el: modalView.el,
            model: exploracao,
            collection: this.utentes,
        }).render();
        modalView.addAuxView(selectUtente);

        modalView.render();

    },

    remove: function () {
        Backbone.View.prototype.remove.call(this);
        _.invoke(this.subViews, 'remove');
    },

});
