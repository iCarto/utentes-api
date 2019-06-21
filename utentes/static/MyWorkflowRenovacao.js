var MyWorkflowRenovacao = {
    renderView: function(exp) {
        var oldExpId =
            this.activeView &&
            this.activeView.model &&
            this.activeView.model.get("exp_id");
        oldExpId &&
            exp &&
            exp.trigger("leaflet", {
                type: "mouseleave",
                exp_id: oldExpId,
            });
        this.activeView && this.activeView.remove && this.activeView.remove();
        var viewClass = this.whichView(exp);
        this.activeView = new viewClass({
            model: exp,
        });
        document.getElementById("insert-data").appendChild(this.activeView.render().el);
        this.activeView.init && this.activeView.init();
        exp &&
            exp.trigger("leaflet", {
                type: "mouseover",
                exp_id: exp.get("exp_id"),
                notscroll: true,
            });
        iAuth.disabledWidgets("#insert-data");
    },

    whichView: function(exp, next) {
        if (!exp) {
            return Backbone.SIXHIARA.ViewNoData;
        }

        var state = this.getCurrentState(exp);

        switch (state) {
            case SIRHA.ESTADO_RENOVACAO.PENDING_RENOV_LICENSE:
                return Backbone.SIXHIARA.ViewSecretaria0;
            case SIRHA.ESTADO_RENOVACAO.INCOMPLETE_DA:
                return Backbone.SIXHIARA.ViewSecretaria0;
            case SIRHA.ESTADO_RENOVACAO.INCOMPLETE_DIR:
                return Backbone.SIXHIARA.ViewSecretaria1;
            case SIRHA.ESTADO_RENOVACAO.INCOMPLETE_DJ:
                if (this.isNotCompleteForFirstDJState(exp)) {
                    return Backbone.SIXHIARA.ViewJuridico2;
                }
                return Backbone.SIXHIARA.ViewJuridico1;
            case SIRHA.ESTADO_RENOVACAO.PENDING_REVIEW_DIR:
                return Backbone.SIXHIARA.ViewSecretaria1;
            case SIRHA.ESTADO_RENOVACAO.PENDING_REVIEW_DJ:
                return Backbone.SIXHIARA.ViewJuridico1;
            case SIRHA.ESTADO_RENOVACAO.INCOMPLETE_DT:
            case SIRHA.ESTADO_RENOVACAO.PENDING_FIELD_VISIT:
            case SIRHA.ESTADO_RENOVACAO.PENDING_TECH_DECISION:
                return Backbone.SIXHIARA.ViewTecnico;
            case SIRHA.ESTADO_RENOVACAO.PENDING_EMIT_LICENSE:
                return Backbone.SIXHIARA.ViewJuridico2;
            case SIRHA.ESTADO_RENOVACAO.PENDING_DADOS_LICENSE:
                return Backbone.SIXHIARA.ViewJuridicoDados;
            case SIRHA.ESTADO_RENOVACAO.PENDING_DIR_SIGN:
                return Backbone.SIXHIARA.ViewSecretaria2;
            default:
                return Backbone.SIXHIARA.UpsView;
        }
        return Backbone.SIXHIARA.UpsView;
    },

    isNotCompleteForFirstDJState: function(exp) {
        return (
            exp
                .get("renovacao")
                .get("obser")
                .filter(function(o) {
                    return o.state === SIRHA.ESTADO_RENOVACAO.PENDING_EMIT_LICENSE;
                }).length > 0
        );
    },

    isNeedAskForEnteredDocumentationDate: function(exp, data) {
        var estado = exp.get("renovacao").get("estado");
        var nextState = this.whichNextState(estado, data);

        if (data.target.id == "bt-ok") {
            if (estado == SIRHA.ESTADO_RENOVACAO.INCOMPLETE_DA) {
                return true;
            }
            if (
                estado == SIRHA.ESTADO_RENOVACAO.INCOMPLETE_DJ &&
                nextState == SIRHA.ESTADO_RENOVACAO.PENDING_TECH_DECISION &&
                !this.isNotCompleteForFirstDJState(exp)
            ) {
                return true;
            }
        }
        return false;
    },

    getCurrentState: function(exp) {
        return exp.get("renovacao").get("estado") || SIRHA.ESTADO_RENOVACAO.NOT_EXISTS;
    },

    whichNextState: function(currentState, data, exp) {
        // Igual en lugar de currentState se le puede pasar la explotación
        if (!data) {
            return currentState;
        }

        switch (currentState) {
            case SIRHA.ESTADO_RENOVACAO.NOT_EXISTS:
                return this.nextStateAfterNoExiste(data);
            case SIRHA.ESTADO_RENOVACAO.PENDING_RENOV_LICENSE:
                return this.nextStateAfterNoExiste(data);
            case SIRHA.ESTADO_RENOVACAO.INCOMPLETE_DA:
                return this.nextStateAfterNoExiste(data);
            case SIRHA.ESTADO_RENOVACAO.INCOMPLETE_DIR:
                return this.nextStateAfterPteRevDir(data);
            case SIRHA.ESTADO_RENOVACAO.PENDING_DADOS_LICENSE:
                return this.nextStateAfterPteDadosLic(data);
            case SIRHA.ESTADO_RENOVACAO.INCOMPLETE_DJ:
                return this.nextStateAfterPteRevJuri(data);
            case SIRHA.ESTADO_RENOVACAO.INCOMPLETE_DT:
                return this.nextStateAfterVisitaCampo(data);
            case SIRHA.ESTADO_RENOVACAO.PENDING_REVIEW_DIR:
                return this.nextStateAfterPteRevDir(data);
            case SIRHA.ESTADO_RENOVACAO.PENDING_REVIEW_DJ:
                return this.nextStateAfterPteRevJuri(data);
            case SIRHA.ESTADO_RENOVACAO.PENDING_FIELD_VISIT:
                return this.nextStateAfterVisitaCampo(data);
            case SIRHA.ESTADO_RENOVACAO.PENDING_TECH_DECISION:
                return this.nextStateAfterPteRevDT(data);
            case SIRHA.ESTADO_RENOVACAO.PENDING_EMIT_LICENSE:
                return this.nextStatePteEmiJuri(data);
            case SIRHA.ESTADO_RENOVACAO.PENDING_DIR_SIGN:
                return this.nextStatePteFirmaDir(data);
            default:
                throw "Error";
        }
    },

    nextStateAfterNoExiste: function(data) {
        var nextState = undefined;
        if (data.target.id === "bt-ok") {
            nextState = SIRHA.ESTADO_RENOVACAO.PENDING_REVIEW_DIR;
        }
        if (data.target.id === "bt-no") {
            nextState = SIRHA.ESTADO_RENOVACAO.INCOMPLETE_DA;
        }
        return nextState;
    },

    nextStateAfterPteRevDir: function(data) {
        var nextState = undefined;
        if (data.target.id === "bt-ok") {
            nextState = SIRHA.ESTADO_RENOVACAO.PENDING_REVIEW_DJ;
        }

        if (data.target.id === "bt-no") {
            nextState = SIRHA.ESTADO_RENOVACAO.INCOMPLETE_DIR;
        }
        return nextState;
    },

    nextStateAfterPteRevJuri: function(data) {
        var nextState = undefined;
        if (data.target.attributes && data.target.attributes["data-foo"]) {
            return this.nextStatePteEmiJuri(data);
        }

        if (data.target.id === "bt-ok") {
            nextState = SIRHA.ESTADO_RENOVACAO.PENDING_TECH_DECISION;
        }

        if (data.target.id === "bt-no") {
            nextState = SIRHA.ESTADO_RENOVACAO.INCOMPLETE_DJ;
        }

        if (data.target.id === "bt-noaprobada") {
            nextState = SIRHA.ESTADO_RENOVACAO.NOT_APPROVED;
        }
        return nextState;
    },

    nextStateAfterVisitaCampo: function(data) {
        var nextState = undefined;
        if (data.target.id === "bt-ok") {
            nextState = SIRHA.ESTADO_RENOVACAO.PENDING_TECH_DECISION;
        }

        if (data.target.id === "bt-no") {
            nextState = SIRHA.ESTADO_RENOVACAO.INCOMPLETE_DT;
        }

        if (data.target.id === "bt-noaprobada") {
            nextState = SIRHA.ESTADO_RENOVACAO.NOT_APPROVED;
        }

        if (data.target.id === "bt-defacto") {
            nextState = SIRHA.ESTADO_RENOVACAO.DE_FACTO;
        }

        return nextState;
    },

    nextStateAfterPteRevDT: function(data) {
        var nextState = undefined;
        if (data.target.id === "bt-ok") {
            nextState = SIRHA.ESTADO_RENOVACAO.PENDING_EMIT_LICENSE;
        }

        if (data.target.id === "bt-no") {
            nextState = SIRHA.ESTADO_RENOVACAO.INCOMPLETE_DT;
        }

        if (data.target.id === "bt-noaprobada") {
            nextState = SIRHA.ESTADO_RENOVACAO.NOT_APPROVED;
        }

        if (data.target.id === "bt-defacto") {
            nextState = SIRHA.ESTADO_RENOVACAO.DE_FACTO;
        }

        return nextState;
    },

    nextStatePteEmiJuri: function(data) {
        var id = data.target.id;

        var nextState = undefined;
        if (data.target.id === "bt-ok") {
            nextState = SIRHA.ESTADO_RENOVACAO.PENDING_DADOS_LICENSE;
        }

        if (data.target.id === "bt-no") {
            nextState = SIRHA.ESTADO_RENOVACAO.INCOMPLETE_DJ;
        }

        if (data.target.id === "bt-noaprobada") {
            nextState = SIRHA.ESTADO_RENOVACAO.NOT_APPROVED;
        }

        if (data.target.id === "bt-defacto") {
            nextState = SIRHA.ESTADO_RENOVACAO.DE_FACTO;
        }
        return nextState;
    },

    nextStatePteFirmaDir: function(data) {
        var nextState = undefined;
        if (data.target.id === "bt-ok") {
            nextState = SIRHA.ESTADO_RENOVACAO.LICENSED;
        }

        if (data.target.id === "bt-noaprobada") {
            nextState = SIRHA.ESTADO_RENOVACAO.NOT_APPROVED;
        }
        return nextState;
    },
    nextStateAfterPteDadosLic: function(data) {
        var nextState = undefined;
        if (data.target.id === "bt-ok") {
            nextState = SIRHA.ESTADO_RENOVACAO.PENDING_DIR_SIGN;
        }

        if (data.target.id === "bt-noaprobada") {
            nextState = SIRHA.ESTADO_RENOVACAO.NOT_APPROVED;
        }
        return nextState;
    },

    isFirstState: function(currentState) {
        var nextState = this.whichNextState(currentState);
        return (
            nextState == SIRHA.ESTADO_RENOVACAO.PENDING_RENOV_LICENSE ||
            nextState == SIRHA.ESTADO_RENOVACAO.INCOMPLETE_DA
        );
    },
};

window["wfr"] = Object.create(MyWorkflowRenovacao);
