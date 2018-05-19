var MyWorkflow = {

    UNIQUE_USER: 'UNIQUE_USER',
    USER_COOKIE_KEY: 'utentes_stub_user',

    getUser: function() {
        var user = document.cookie.replace(/(?:(?:^|.*;\s*)utentes_stub_user\s*\=\s*([^;]*).*$)|^.*$/, '$1');
        return user;
    },

    getRole: function() {
        // Usar además del ROL el ARA o tener un ROL_UNIQUE_USER
        // En todo caso los ROLES deberian ser una clase aparte
        var role = document.cookie.replace(/(?:(?:^|.*;\s*)utentes_stub_role\s*\=\s*([^;]*).*$)|^.*$/, '$1');
        role = decodeURIComponent(role);
        if (![ROL_ADMIN, ROL_ADMINISTRATIVO, ROL_FINANCIERO, ROL_DIRECCION, ROL_TECNICO, ROL_JURIDICO].includes(role)) {
            throw Error('Not valid role');
        }
        return role;
    },

    getRoleSafe: function(role) {
        if (!role){
            var role = this.getRole();
        }
        switch (role) {
        case ROL_ADMIN:
            return 'administrador';
        case ROL_ADMINISTRATIVO:
            return 'administrativo';
        case ROL_FINANCIERO:
            return 'financieiro';
        case ROL_DIRECCION:
            return 'direccao';
        case ROL_TECNICO:
            return 'tecnico';
        case ROL_JURIDICO:
            return 'juridico';
        }
    },

    fixMenu: function() {
        var user = this.getRole();

        if ([ROL_ADMIN, ROL_ADMINISTRATIVO].indexOf(user) === -1) {
            document.getElementById('requerimento-new').parentNode.remove();
        }

        if ([ROL_ADMIN, ROL_TECNICO].indexOf(user) === -1) {
            document.getElementById('new').parentNode.remove();
            document.getElementById('gps').parentNode.remove();
        }

        if ([ROL_ADMIN, ROL_TECNICO, ROL_FINANCIERO].indexOf(user) === -1) {
            document.getElementById('facturacao').parentNode.remove();
        }

        document.getElementById('user-info').innerHTML = this.getUser();

        if (this.getUser() === this.UNIQUE_USER) {
            document.getElementById('requerimento-new').parentNode.remove();
            document.getElementById('facturacao').parentNode.remove();
            document.getElementById('requerimento-pendente').parentNode.remove();
            document.getElementById('user-info').remove();
            var navAdmin = document.getElementById('nav-admin');
            var settings = document.getElementById('settings');
            navAdmin.replaceWith(settings)
        }
    },

    init: function() {
    },

    renderView: function(exp) {
        var oldExpId = this.activeView && this.activeView.model && this.activeView.model.get('exp_id');
        oldExpId && exp && exp.trigger('leaflet', {
            'type': 'mouseleave',
            'exp_id': oldExpId,
        });
        this.activeView && this.activeView.remove && this.activeView.remove();
        var viewClass = this.whichView(exp);
        this.activeView = new viewClass({
            model: exp,
        });
        document.getElementById('insert-data').appendChild(this.activeView.render().el);
        this.activeView.init && this.activeView.init();
        exp && exp.trigger('leaflet', {
            'type': 'mouseover',
            'exp_id': exp.get('exp_id'),
            'notscroll': true,
        });
    },

    whichView: function(exp, next) {

        if (!exp) {
            return Backbone.SIXHIARA.ViewNoData;
        }

        var state = this.getCurrentState(exp);
        var role = this.getRole();

        if (['Licenciada', 'Irregular', 'Utente de facto'].includes(state)) {
            return this.whichFacturacaoView(exp, next);
        }

        switch (state) {
        case 'Não existe':
            break;
        case 'Documentação incompleta (Pendente utente - D. Adm)':
            return Backbone.SIXHIARA.ViewDocIncompletaAdm;
        case 'Documentação incompleta (Pendente utente - Direcção)':
            return Backbone.SIXHIARA.ViewSecretaria1;
        case 'Documentação incompleta (Pendente utente - D. Jur)':
            if (exp.get('req_obs').filter(function(o){
                return o.state === 'Pendente Emisão Licença (D. Jur)';
            }).length > 0) {
                return Backbone.SIXHIARA.ViewJuridico2;
            }

            if (role === ROL_JURIDICO || role === ROL_ADMIN) {
                return Backbone.SIXHIARA.ViewJuridico1;
            };
            if (role === ROL_TECNICO) {
                return Backbone.SIXHIARA.ViewJuridicoNotEditable1;
            };
        case 'Documentação incompleta (Pendente utente - D. Fin)':
            return Backbone.SIXHIARA.UpsView;
        case 'Pendente Revisão Pedido Licença (Direcção)':
            return Backbone.SIXHIARA.ViewSecretaria1;
        case 'Pendente Análise Pedido Licença (D. Jur)':
            if (role === ROL_JURIDICO || role === ROL_ADMIN) {
                return Backbone.SIXHIARA.ViewJuridico1;
            };
            if (role === ROL_TECNICO) {
                return Backbone.SIXHIARA.ViewJuridicoNotEditable1;
            };
        case 'Documentação incompleta (Pendente utente - R. Cad DT)':
        case 'Pendente Visita Campo (R. Cad DT)':
        case 'Pendente Parecer Técnico (R. Cad DT)':
            /*
             admin, tecnico. Hay que ponerlo. Si no, si por ejemplo jurídico
             pudiera ver este estado se le estaría renderizando esto.
            */
            return Backbone.SIXHIARA.ViewTecnico1;
        case 'Pendente Emisão Licença (D. Jur)':
            // admin, juridico
            return Backbone.SIXHIARA.ViewJuridico2;
        case 'Pendente Firma Licença (Direcção)':
            // admin, secretaria
            return Backbone.SIXHIARA.ViewSecretaria2;
        default:
            return Backbone.SIXHIARA.UpsView;
        }

        return Backbone.SIXHIARA.UpsView;
    },

    whichFacturacaoView: function(exp, next) {
        var estado_lic = this.getCurrentState(exp);
        var fact_estado = exp.get('fact_estado');
        var role = this.getRole();

        if (! ['Licenciada', 'Irregular', 'Utente de facto'].includes(estado_lic)) {
            return Backbone.SIXHIARA.UpsView;
        }

        switch (fact_estado) {
        case FACTURACAO_ESTADOS.PENDING_M3:
            return Backbone.SIXHIARA.ViewFacturacaoTecnico;
        case FACTURACAO_ESTADOS.PENDIND_INVOICE:
            return Backbone.SIXHIARA.ViewFacturacao;
        case FACTURACAO_ESTADOS.PENDING_PAY:
            return Backbone.SIXHIARA.ViewFacturacao;
        default:
            return Backbone.SIXHIARA.UpsView;
        }
    },

    getCurrentState: function(exp) {
        // var lics = exp.get('licencias');
        // var state1 = (lics.at(0) && lics.at(0).get('estado')) || 'Não existe';
        // var state2 = (lics.at(1) && lics.at(1).get('estado')) || 'Não existe';
        //
        // state1 = state1 !== 'Não existe' ? state1 : state2;

        return exp.get('estado_lic') || 'Não existe';
    },

    whichNextState: function(currentState, data, exp) {
        // Igual en lugar de currentState se le puede pasar la explotación

        if (['Licenciada', 'Irregular', 'Utente de facto'].includes(currentState)) {
            return this.whichFacturacaoNextState(currentState, data, exp);
        }

        if (!data) {
            return currentState;
        }

        switch (currentState) {
        case 'Não existe':
            return this.nextStateAfterNoExiste(data);
        case 'Documentação incompleta (Pendente utente - D. Adm)':
            return this.nextStateAfterNoExiste(data);
        case 'Documentação incompleta (Pendente utente - Direcção)':
            return this.nextStateAfterPteRevDir(data);
        case 'Documentação incompleta (Pendente utente - D. Jur)':
            return this.nextStateAfterPteRevJuri(data);
        case 'Documentação incompleta (Pendente utente - R. Cad DT)':
            return this.nextStateAfterVisitaCampo(data);
        case 'Documentação incompleta (Pendente utente - D. Fin)':
            throw 'Error';
        case 'Pendente Revisão Pedido Licença (Direcção)':
            return this.nextStateAfterPteRevDir(data);
        case 'Pendente Análise Pedido Licença (D. Jur)':
            return this.nextStateAfterPteRevJuri(data);
        case 'Pendente Visita Campo (R. Cad DT)':
            return this.nextStateAfterVisitaCampo(data);
        case 'Pendente Parecer Técnico (R. Cad DT)':
            return this.nextStateAfterPteRevDT(data);
        case 'Pendente Emisão Licença (D. Jur)':
            return this.nextStatePteEmiJuri(data);
        case 'Pendente Firma Licença (Direcção)':
            return this.nextStatePteFirmaDir(data);
        default:
            throw 'Error';
        }
    },

    nextStateAfterNoExiste: function(data) {
        var nextState = undefined;
        if (data.target.id === 'bt-ok') {
            nextState = 'Pendente Revisão Pedido Licença (Direcção)';
        }

        if (data.target.id === 'bt-no') {
            nextState = 'Documentação incompleta (Pendente utente - D. Adm)';
        }
        return nextState;
    },

    nextStateAfterPteRevDir: function(data) {
        var nextState = undefined;
        if (data.target.id === 'bt-ok') {
            nextState = 'Pendente Análise Pedido Licença (D. Jur)';
        }

        if (data.target.id === 'bt-no') {
            nextState = 'Documentação incompleta (Pendente utente - Direcção)';
        }
        return nextState;
    },

    nextStateAfterPteRevJuri: function(data) {
        var nextState = undefined;
        if (data.target.attributes && data.target.attributes['data-foo']) {
            return this.nextStatePteEmiJuri(data);
        }

        if (data.target.id === 'bt-ok') {
            nextState = 'Pendente Visita Campo (R. Cad DT)';
        }

        if (data.target.id === 'bt-no') {
            nextState = 'Documentação incompleta (Pendente utente - D. Jur)';
        }

        if (data.target.id === 'bt-noaprobada') {
            nextState = 'Não aprovada';
        }
        return nextState;
    },

    nextStateAfterVisitaCampo: function(data) {
        var nextState = undefined;
        if (data.target.id === 'bt-ok') {
            nextState = 'Pendente Parecer Técnico (R. Cad DT)';
        }

        if (data.target.id === 'bt-no') {
            nextState = 'Documentação incompleta (Pendente utente - R. Cad DT)';
        }

        if (data.target.id === 'bt-noaprobada') {
            nextState = 'Não aprovada';
        }

        if (data.target.id === 'bt-defacto') {
            nextState = 'Utente de facto';
        }

        return nextState;
    },

    nextStateAfterPteRevDT: function(data) {
        var nextState = undefined;
        if (data.target.id === 'bt-ok') {
            nextState = 'Pendente Emisão Licença (D. Jur)';
        }

        if (data.target.id === 'bt-no') {
            nextState = 'Documentação incompleta (Pendente utente - R. Cad DT)';
        }

        if (data.target.id === 'bt-noaprobada') {
            nextState = 'Não aprovada';
        }

        if (data.target.id === 'bt-defacto') {
            nextState = 'Utente de facto';
        }

        return nextState;
    },

    nextStatePteEmiJuri: function(data) {
        var nextState = undefined;
        if (data.target.id === 'bt-ok') {
            nextState = 'Pendente Firma Licença (Direcção)';
        }

        if (data.target.id === 'bt-no') {
            nextState = 'Documentação incompleta (Pendente utente - D. Jur)';
        }

        if (data.target.id === 'bt-noaprobada') {
            nextState = 'Não aprovada';
        }

        if (data.target.id === 'bt-defacto') {
            nextState = 'Utente de facto';
        }
        return nextState;
    },

    nextStatePteFirmaDir: function(data) {
        var nextState = undefined;
        if (data.target.id === 'bt-ok') {
            nextState = 'Licenciada';
        }

        if (data.target.id === 'bt-noaprobada') {
            nextState = 'Não aprovada';
        }
        return nextState;
    },

    whichFacturacaoNextState: function(currentState, data, exp) {
        // puede tener sentido agrupar en whichNextState
        var fact_estado = exp.get('fact_estado');
        var role = this.getRole();

        if (! ['Licenciada', 'Irregular', 'Utente de facto'].includes(currentState)) {
            throw 'Error';
        }

        var nextState = undefined;
        if (!data) {
            return fact_estado;
        }

        if (data.target.id !== 'bt-ok') {
            throw 'Error';
        }

        switch (fact_estado) {
        case FACTURACAO_ESTADOS.PENDING_M3:
            return FACTURACAO_ESTADOS.PENDIND_INVOICE;
        case FACTURACAO_ESTADOS.PENDIND_INVOICE:
            // return FACTURACAO_ESTADOS.PENDING_PAY;
            return FACTURACAO_ESTADOS.PAYED;
        case FACTURACAO_ESTADOS.PENDING_PAY:
            return FACTURACAO_ESTADOS.PAYED;
        default:
            throw 'Error';
        }
    },

    disabledWidgets: function(selector) {
        var role = this.getRoleSafe();
        var baseElement = document;
        if (selector) {
            baseElement = document.querySelectorAll(selector)[0];
        }

        var elements = baseElement.getElementsByClassName('uilib-enability');
        Array.prototype.forEach.call(elements, function(w) {
            var rolesEnabled = [];
            var rolesDisabled = [];
            var rolesShowed = [];
            var rolesHide = [];
            w.classList.forEach(function(c){
                if (c.startsWith('uilib-enable-role')) {
                    rolesEnabled.push(c.split('role-')[1]);
                }
                if (c.startsWith('uilib-disable-role')) {
                    rolesDisabled.push(c.split('role-')[1]);
                }
                if (c.startsWith('uilib-show-role')) {
                    rolesShowed.push(c.split('role-')[1]);
                }
                if (c.startsWith('uilib-hide-role')) {
                    rolesHide.push(c.split('role-')[1]);
                }
            });
            var disabled = true;
            if (rolesDisabled.includes(role)) {
                disabled = true;
            }
            if (rolesEnabled.includes(role)) {
                disabled = false;
            }
            if (rolesEnabled.length || rolesDisabled.lengh) {
                w.disabled = disabled;
            }

            var hide = true;
            if (rolesHide.includes(role)) {
                hide = true;
            }
            if (rolesShowed.includes(role)) {
                hide = false;
            }
            if ((rolesShowed.length || rolesHide.length) && hide) {
                w.style.display = 'none';
            }
        });
    },

    canDraw: function() {
        return [ROL_TECNICO, ROL_ADMIN].includes(this.getRole());
    }
};


$(document).ready(function() {
    window['wf'] = Object.create(MyWorkflow);
    wf.fixMenu();
    wf.disabledWidgets('menu');
});
