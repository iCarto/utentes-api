Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.View1 = Backbone.View.extend({
    tagName: 'div',

    // optional, you can assign multiple classes to
    // this property like so: 'container homepage'
    className: 'myclass',

    // Note: When declaring a View, options, el, tagName, id and className
    // may be defined as functions, if you want their values to be determined
    // at runtime.
    id: 'myid', // optional

    initialize: function(options) {
        this.options = options || {};
    },

    render: function() {
        var json = this.model.toJSON();
        this.$el.html(this.template(json));
        return this;
    },

    /*
    Esto en realidad está por no  usar jquery. Si se hace en render todavía no están en el
    DOM los elementos y no se puede usar document ¿?. Con jquery en cambio se quedan
    binded para después al usar this.$
    */
    init: function() {
        var self = this;
        var renovacao = this.model.get('renovacao')

        var currentComment = renovacao.get('obser') && renovacao.get('obser').slice(-1)[0];
        if (currentComment.text) {
            document.getElementById('observacio').value = currentComment.text;
        }

        document
            .getElementById('observacio')
            .addEventListener('input', self.autosave.bind(self), false);

        var wfr_tmp = Object.create(MyWorkflowRenovacao);
        var currentState = renovacao.get('estado');

        document.querySelectorAll('#js-btns-next > button').forEach(function(bt) {
            var nextBtState = wfr_tmp.whichNextState(currentState, {target:{id: bt.id}});
            bt.title = nextBtState;
        });

        $('[data-toggle="tooltip"]').tooltip();
        document.getElementById('js-btns-next').addEventListener('click', function(e){
            if(wfr.isNeedAskForEnteredDocumentationDate(self.model, e)){
                    var ModalUltimaEntregaDoc = Backbone.SIXHIARA.UltimaEntregaDocModalView.extend({
                        okButtonClicked: function() {
                            var el = document.getElementById("d_ultima_entrega_doc");
                            var strDate = el.value;
                            var sTokens = strDate.split('/');
                            var dateDoc = new Date(sTokens[2], sTokens[1] - 1, sTokens[0], 1, 1, 1);

                            if (this.isValidDate(strDate)) {
                                if (this.isAfterNow(strDate) || this.isBeforeSolicitacao(strDate)) {
                                    var d_soli = formatter().formatDate(self.model.get('renovacao').get('d_soli'));
                                    bootbox.alert({
                                        message:`A data não pode ser posterior à actual nem antes da data da solicitação (${d_soli}).`,
                                        callback: this.showDefaultDate
                                    });
                                }else{
                                    self.model.get('renovacao').set('d_ultima_entrega_doc', dateDoc);
                                    self.model.save({ wait: true });
                                    this.$('.modal').modal('hide');
                                    self.fillRenovacao(e)
                                }
                            }else {
                                bootbox.alert({
                                    message:'A data não é válida.',
                                    callback: this.showDefaultDate
                                });

                            }
                        }
                    });
                    var modalView = new ModalUltimaEntregaDoc({
                        model: self.model
                    })
                    modalView.show();

            }else {
                self.fillRenovacao(e);
            }
        });

        this.tabBarTitle = new Backbone.SIXHIARA.TabBarTitle({
            el: document.querySelector('#map-container ul.nav.nav-tabs'),
            model: currentState
        }).render();
    },

    updateUltimaEntregaDoc: function(date, date2) {
        var d_soli = this.model.get("renovacao").get("d_soli")
        var d_ultima = this.model.get("renovacao").get("d_ultima_entrega_doc")
        if (d_ultima < d_soli) {
            this.model.get("renovacao").set("d_ultima_entrega_doc", d_soli)
        }
    },
    autosave: function() {
        // http://codetunnel.io/how-to-implement-autosave-in-your-web-app/
        var self = this;
        var autosaveInfo = document.getElementById('autosave-info');
        autosaveInfo.innerHTML = 'Modificações pendentes.';
        autosaveInfo.style.color = 'red';
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        if (this.autosaveInputTimeOutId) {
            clearTimeout(this.autosaveInputTimeOutId);
        }
        this.timeoutId = setTimeout(function() {
            self.fillRenovacao(null, true);
            autosaveInfo.innerHTML = 'Modificações gravadas';
            autosaveInfo.style.color = 'green';
            self.autosaveInputTimeOutId = setTimeout(function() {
                autosaveInfo.innerHTML = '';
            }, 1000);
        }, 750);
    },

    fillRenovacao: function(e, autosave) {
        var self = this;
        var renovacao = this.model.get('renovacao');

        var nextState = wfr.whichNextState(renovacao.get('estado'), e);

        if (autosave) {
            this.doFillRenovacao(e, autosave);
        } else {
            bootbox.confirm(
                `A exploração vai mudar o seu a: <br> <strong>${nextState}</strong>`,
                function(result) {
                    if (result) {
                        self.doFillRenovacao(e, autosave);
                    }
                }
            );
        }
    },

    doFillRenovacao: function(e, autosave) {
        var renovacao = this.model.get('renovacao');
        var exploracao = this.model;

        var nextState = wfr.whichNextState(renovacao.get('estado'), e);

        if (!renovacao.get("d_ultima_entrega_doc")) {
            renovacao.set("d_ultima_entrega_doc", new Date());
        }

        if(!renovacao.get("d_soli") && document.getElementById("d_soli").value){
            this.parseDate()
        }
        // which is earlier
        if (renovacao.get("d_soli") && renovacao.get("d_ultima_entrega_doc")) {
            this.updateUltimaEntregaDoc();
        }
        if (!renovacao.get("obser")) {
            renovacao.set('obser', [{
                'create_at': null,
                'author': null,
                'text': null,
                'state': null,
            }]);
        }

        var currentComment = renovacao.get('obser').slice(-1)[0];
        Object.assign(currentComment, {
            create_at: new Date(),
            author: wfr.getUser(),
            text: document.getElementById('observacio').value,
            state: nextState
        });

        if (!autosave) {
            renovacao.get('obser').push({
                create_at: null,
                author: null,
                text: null,
                state: null
            });
        }

        renovacao.setLicState(nextState);

        document
            .querySelectorAll('table input[type="checkbox"]')
            .forEach(function(input) {
                renovacao.set(input.id, input.checked);
            });

        exploracao.urlRoot = Backbone.SIXHIARA.Config.apiRenovacoes;
        exploracao.save(null, {
            patch: true,
            validate: false,
            wait: true,
            success: function(model) {
                var exp_id = model.get('exp_id');
                var exp_name = model.get('exp_name');
                if (autosave) {
                    console.log('autosaving');
                } else {
                    bootbox.alert(
                        `A exploração&nbsp;<strong>${exp_id} - ${exp_name}</strong>&nbsp;tem sido gravada correctamente.`, function() {
                            exploracao.trigger('show-next-exp', exploracao);
                        }
                    );
                }
            },
            error: function() {
                bootbox.alert(
                    '<span style="color: red;">Produziu-se um erro. Informe ao administrador.</strong>'
                );
            }
        });
    },

    remove: function() {
        this.tabBarTitle.remove();
        Backbone.View.prototype.remove.call(this);
    },

    isValidDate: function(date){
        if (this.isValidFormatDate(date) && moment(date, 'DD/MM/YYYY').isValid() && this.isAfterNow(date)) {
            return true
        }
        return false
    },

    isValidFormatDate: function(date){
        return /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/.test(date);
    },

    isAfterNow: function(value){
        var sTokens = value.split('/');
        var date = new Date(sTokens[2], sTokens[1] - 1, sTokens[0], 1, 1, 1);
        return date > new Date();
    },
});
