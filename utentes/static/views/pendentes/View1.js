Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.View1 = Backbone.View.extend({
    tagName: "div",

    // optional, you can assign multiple classes to
    // this property like so: 'container homepage'
    className: "myclass",

    // Note: When declaring a View, options, el, tagName, id and className
    // may be defined as functions, if you want their values to be determined
    // at runtime.
    id: "myid", // optional

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
        var currentComment = this.model.get("req_obs").slice(-1)[0];
        if (currentComment.text) {
            document.getElementById("observacio").value = currentComment.text;
        }

        document
            .getElementById("observacio")
            .addEventListener("input", self.autosave.bind(self), false);

        var wf_tmp = Object.create(MyWorkflow);
        var currentState = this.model.get("estado_lic");
        document.querySelectorAll("#js-btns-next > button").forEach(function(bt) {
            var nextBtState = wf_tmp.whichNextState(currentState, {
                target: {id: bt.id},
            });
            bt.title = nextBtState;
        });

        $('[data-toggle="tooltip"]').tooltip();

        document.getElementById("js-btns-next").addEventListener("click", function(e) {
            if (wf.isNeedAskForEnteredDocumentationDate(self.model, e)) {
                var ModalUltimaEntregaDoc = Backbone.SIXHIARA.UltimaEntregaDocModalView.extend(
                    {
                        okButtonClicked: function() {
                            var dateId = "d_ultima_entrega_doc";
                            var dateWidget = document.getElementById(dateId);
                            var dateObj = formatter().unformatDate(dateWidget.value);
                            self.model.set(dateId, dateObj);
                            self.model.save({wait: true});
                            this.$(".modal").modal("hide");
                            self.fillExploracao(e);
                        },
                    }
                );
                var modalView = new ModalUltimaEntregaDoc({
                    model: self.model,
                });
                modalView.show();
            } else {
                self.fillExploracao(e);
            }
        });

        this.tabBarTitle = new Backbone.SIXHIARA.TabBarTitle({
            el: document.querySelector("#map-container ul.nav.nav-tabs"),
            model: currentState,
        }).render();
    },

    autosave: function() {
        // http://codetunnel.io/how-to-implement-autosave-in-your-web-app/
        var self = this;
        var autosaveInfo = document.getElementById("autosave-info");
        autosaveInfo.innerHTML = "Modificações pendentes.";
        autosaveInfo.style.color = "red";
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        if (this.autosaveInputTimeOutId) {
            clearTimeout(this.autosaveInputTimeOutId);
        }
        this.timeoutId = setTimeout(function() {
            self.fillExploracao(null, true);
            autosaveInfo.innerHTML = "Modificações gravadas";
            autosaveInfo.style.color = "green";
            self.autosaveInputTimeOutId = setTimeout(function() {
                autosaveInfo.innerHTML = "";
            }, 1000);
        }, 750);
    },

    fillExploracao: function(e, autosave) {
        var self = this;
        var exploracao = this.model;

        var nextState = wf.whichNextState(exploracao.get("estado_lic"), e);

        if (autosave) {
            this.doFillExploracao(e, autosave);
        } else {
            bootbox.confirm(
                `A exploração vai mudar o seu a: <br> <strong>${nextState}</strong>`,
                function(result) {
                    if (result) {
                        self.doFillExploracao(e, autosave);
                    }
                }
            );
        }
    },

    doFillExploracao: function(e, autosave) {
        var exploracao = this.model;

        var nextState = wf.whichNextState(exploracao.get("estado_lic"), e);

        var currentComment = exploracao.get("req_obs").slice(-1)[0];
        Object.assign(currentComment, {
            create_at: formatter().now(),
            author: iAuth.getUser(),
            text: document.getElementById("observacio").value,
            state: nextState,
        });

        if (!autosave) {
            exploracao.get("req_obs").push({
                create_at: null,
                author: null,
                text: null,
                state: null,
            });
        }

        exploracao.setLicState(nextState);

        document
            .querySelectorAll('table input[type="checkbox"]')
            .forEach(function(input) {
                exploracao.set(input.id, input.checked);
            });

        exploracao.urlRoot = Backbone.SIXHIARA.Config.apiRequerimentos;
        exploracao.save(null, {
            patch: true,
            validate: false,
            wait: true,
            success: function(model) {
                var exp_id = model.get("exp_id");
                var exp_name = model.get("exp_name");
                if (autosave) {
                    // console.log('autosaving');
                } else {
                    bootbox.alert(
                        `A exploração&nbsp;<strong>${exp_id} - ${exp_name}</strong>&nbsp;tem sido gravada correctamente.`,
                        function() {
                            exploracao.trigger("show-next-exp", exploracao);
                        }
                    );
                }
            },
            error: function() {
                bootbox.alert(
                    '<span style="color: red;">Produziu-se um erro. Informe ao administrador.</strong>'
                );
            },
        });
    },

    remove: function() {
        this.tabBarTitle.remove();
        Backbone.View.prototype.remove.call(this);
    },
});
