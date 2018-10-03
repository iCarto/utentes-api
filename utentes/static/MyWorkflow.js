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

    /*
    Un usuario debería poder tener varios roles. Por razones históricas se ha
    asumido una relación 1:1 en la mayoría del código, llamadas a getRole
    Pero hay que ir refactorizando para usar una relación 1:n
    O mejor todavía pasar aun sistema basado en permisos y no en roles

    Todo esto del rol del usuario habría que cachearlo y no generarlo cada vez
    que se haga la petición
    */
    getAllRolesSafe: function() {
        var roles = [this.getRoleSafe()];

        if (this.getUser() === this.UNIQUE_USER) {
            roles.push('unique');
        }
        return roles;
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


    isAdminOrDirector(role) {
        if(!role) {
            role = wf.getRole();
        }
        return role === ROL_ADMIN || role === ROL_DIRECCION;
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

        if (ROL_FINANCIERO === user) {
            document.getElementById('requerimento-pendente').parentNode.remove();
        }

        document.getElementById('user-info').innerHTML = this.getUser();

        if (this.getUser() === this.UNIQUE_USER) {
            document.getElementById('requerimento-new').parentNode.remove();
            document.getElementById('facturacao').parentNode.remove();
            document.getElementById('requerimento-pendente').parentNode.remove();
            document.getElementById('search-all').parentNode.remove();
            var navAdmin = document.getElementById('nav-admin');
            var settings = document.getElementById('settings');
            navAdmin.replaceWith(settings);
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
        var LIC_ST = Backbone.SIXHIARA.Estado;

        if (!exp) {
            return Backbone.SIXHIARA.ViewNoData;
        }

        var state = this.getCurrentState(exp);
        var role = this.getRole();

        if (LIC_ST.CATEGORY_POST_LICENSED.includes(state)) {
            return this.whichFacturacaoView(exp, next);
        }

        switch (state) {
        case LIC_ST.NOT_EXISTS:
            break;
        case LIC_ST.INCOMPLETE_DA:
            return Backbone.SIXHIARA.ViewDocIncompletaAdm;
        case LIC_ST.INCOMPLETE_DIR:
            return Backbone.SIXHIARA.ViewSecretaria1;
        case LIC_ST.INCOMPLETE_DJ:
            if (exp.get('req_obs').filter(function(o){
                return o.state === LIC_ST.PENDING_EMIT_LICENSE;
            }).length > 0) {
                return Backbone.SIXHIARA.ViewJuridico2;
            }

            if (role === ROL_JURIDICO || role === ROL_ADMIN) {
                return Backbone.SIXHIARA.ViewJuridico1;
            };
            if (role === ROL_TECNICO) {
                return Backbone.SIXHIARA.ViewJuridicoNotEditable1;
            };
        case LIC_ST.INCOMPLETE_DF:
            return Backbone.SIXHIARA.UpsView;
        case LIC_ST.PENDING_REVIEW_DIR:
            return Backbone.SIXHIARA.ViewSecretaria1;
        case LIC_ST.PENDING_REVIEW_DJ:
            if (role === ROL_JURIDICO || role === ROL_ADMIN) {
                return Backbone.SIXHIARA.ViewJuridico1;
            };
            if (role === ROL_TECNICO) {
                return Backbone.SIXHIARA.ViewJuridicoNotEditable1;
            };
        case LIC_ST.INCOMPLETE_DT:
        case LIC_ST.PENDING_FIELD_VISIT:
        case LIC_ST.PENDING_TECH_DECISION:
            /*
             admin, tecnico. Hay que ponerlo. Si no, si por ejemplo jurídico
             pudiera ver este estado se le estaría renderizando esto.
            */
            return Backbone.SIXHIARA.ViewTecnico1;
        case LIC_ST.PENDING_EMIT_LICENSE:
            // admin, juridico
            return Backbone.SIXHIARA.ViewJuridico2;
        case LIC_ST.PENDING_DIR_SIGN:
            // admin, secretaria
            return Backbone.SIXHIARA.ViewSecretaria2;
        default:
            return Backbone.SIXHIARA.UpsView;
        }

        return Backbone.SIXHIARA.UpsView;
    },

    whichFacturacaoView: function(exp, next) {
        var LIC_ST = Backbone.SIXHIARA.Estado;
        var estado_lic = this.getCurrentState(exp);
        var fact_estado = exp.get('fact_estado');
        var role = this.getRole();

        if (! LIC_ST.CATEGORY_POST_LICENSED.includes(estado_lic)) {
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
        // var state1 = (lics.at(0) && lics.at(0).get('estado')) || Backbone.SIXHIARA.Estado.NOT_EXISTS;
        // var state2 = (lics.at(1) && lics.at(1).get('estado')) || Backbone.SIXHIARA.Estado.NOT_EXISTS;
        //
        // state1 = state1 !== Backbone.SIXHIARA.Estado.NOT_EXISTS ? state1 : state2;

        return exp.get('estado_lic') || Backbone.SIXHIARA.Estado.NOT_EXISTS;
    },

    whichNextState: function(currentState, data, exp) {
        // Igual en lugar de currentState se le puede pasar la explotación
        var LIC_ST = Backbone.SIXHIARA.Estado;

        if (LIC_ST.CATEGORY_POST_LICENSED.includes(currentState)) {
            return this.whichFacturacaoNextState(currentState, data, exp);
        }

        if (!data) {
            return currentState;
        }

        switch (currentState) {
        case LIC_ST.NOT_EXISTS:
            return this.nextStateAfterNoExiste(data);
        case LIC_ST.INCOMPLETE_DA:
            return this.nextStateAfterNoExiste(data);
        case LIC_ST.INCOMPLETE_DIR:
            return this.nextStateAfterPteRevDir(data);
        case LIC_ST.INCOMPLETE_DJ:
            return this.nextStateAfterPteRevJuri(data);
        case LIC_ST.INCOMPLETE_DT:
            return this.nextStateAfterVisitaCampo(data);
        case LIC_ST.INCOMPLETE_DF:
            throw 'Error';
        case LIC_ST.PENDING_REVIEW_DIR:
            return this.nextStateAfterPteRevDir(data);
        case LIC_ST.PENDING_REVIEW_DJ:
            return this.nextStateAfterPteRevJuri(data);
        case LIC_ST.PENDING_FIELD_VISIT:
            return this.nextStateAfterVisitaCampo(data);
        case LIC_ST.PENDING_TECH_DECISION:
            return this.nextStateAfterPteRevDT(data);
        case LIC_ST.PENDING_EMIT_LICENSE:
            return this.nextStatePteEmiJuri(data);
        case LIC_ST.PENDING_DIR_SIGN:
            return this.nextStatePteFirmaDir(data);
        default:
            throw 'Error';
        }
    },

    nextStateAfterNoExiste: function(data) {
        var LIC_ST = Backbone.SIXHIARA.Estado;
        var nextState = undefined;
        if (data.target.id === 'bt-ok') {
            nextState = LIC_ST.PENDING_REVIEW_DIR;
        }

        if (data.target.id === 'bt-no') {
            nextState = LIC_ST.INCOMPLETE_DA;
        }
        return nextState;
    },

    nextStateAfterPteRevDir: function(data) {
        var LIC_ST = Backbone.SIXHIARA.Estado;
        var nextState = undefined;
        if (data.target.id === 'bt-ok') {
            nextState = LIC_ST.PENDING_REVIEW_DJ;
        }

        if (data.target.id === 'bt-no') {
            nextState = LIC_ST.INCOMPLETE_DIR;
        }
        return nextState;
    },

    nextStateAfterPteRevJuri: function(data) {
        var LIC_ST = Backbone.SIXHIARA.Estado;
        var nextState = undefined;
        if (data.target.attributes && data.target.attributes['data-foo']) {
            return this.nextStatePteEmiJuri(data);
        }

        if (data.target.id === 'bt-ok') {
            nextState = LIC_ST.PENDING_FIELD_VISIT;
        }

        if (data.target.id === 'bt-no') {
            nextState = LIC_ST.INCOMPLETE_DJ;
        }

        if (data.target.id === 'bt-noaprobada') {
            nextState = LIC_ST.NOT_APPROVED;
        }
        return nextState;
    },

    nextStateAfterVisitaCampo: function(data) {
        var LIC_ST = Backbone.SIXHIARA.Estado;
        var nextState = undefined;
        if (data.target.id === 'bt-ok') {
            nextState = LIC_ST.PENDING_TECH_DECISION;
        }

        if (data.target.id === 'bt-no') {
            nextState = LIC_ST.INCOMPLETE_DT;
        }

        if (data.target.id === 'bt-noaprobada') {
            nextState = LIC_ST.NOT_APPROVED;
        }

        if (data.target.id === 'bt-defacto') {
            nextState = LIC_ST.DE_FACTO;
        }

        return nextState;
    },

    nextStateAfterPteRevDT: function(data) {
        var LIC_ST = Backbone.SIXHIARA.Estado;

        var nextState = undefined;
        if (data.target.id === 'bt-ok') {
            nextState = LIC_ST.PENDING_EMIT_LICENSE;
        }

        if (data.target.id === 'bt-no') {
            nextState = LIC_ST.INCOMPLETE_DT;
        }

        if (data.target.id === 'bt-noaprobada') {
            nextState = LIC_ST.NOT_APPROVED;
        }

        if (data.target.id === 'bt-defacto') {
            nextState = LIC_ST.DE_FACTO;
        }

        return nextState;
    },

    nextStatePteEmiJuri: function(data) {
        var LIC_ST = Backbone.SIXHIARA.Estado;

        var nextState = undefined;
        if (data.target.id === 'bt-ok') {
            nextState = LIC_ST.PENDING_DIR_SIGN;
        }

        if (data.target.id === 'bt-no') {
            nextState = LIC_ST.INCOMPLETE_DJ;
        }

        if (data.target.id === 'bt-noaprobada') {
            nextState = LIC_ST.NOT_APPROVED;
        }

        if (data.target.id === 'bt-defacto') {
            nextState = LIC_ST.DE_FACTO;
        }
        return nextState;
    },

    nextStatePteFirmaDir: function(data) {
        var LIC_ST = Backbone.SIXHIARA.Estado;

        var nextState = undefined;
        if (data.target.id === 'bt-ok') {
            nextState = LIC_ST.LICENSED;
        }

        if (data.target.id === 'bt-noaprobada') {
            nextState = LIC_ST.NOT_APPROVED;
        }
        return nextState;
    },

    whichFacturacaoNextState: function(currentState, data, exp) {
        var LIC_ST = Backbone.SIXHIARA.Estado;

        // puede tener sentido agrupar en whichNextState
        var fact_estado = exp.get('fact_estado');
        var role = this.getRole();

        if (! LIC_ST.CATEGORY_POST_LICENSED.includes(currentState)) {
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
            if (wf.user_roles_in(rolesDisabled)) {
                disabled = true;
            }
            if (wf.user_roles_in(rolesEnabled)) {
                disabled = false;
            }
            if (rolesEnabled.length || rolesDisabled.lengh) {
                w.disabled = disabled;
            }

            var hide = true;
            if (wf.user_roles_in(rolesHide)) {
                hide = true;
            }
            if (wf.user_roles_in(rolesShowed)) {
                hide = false;
            }
            if ((rolesShowed.length || rolesHide.length) && hide) {
                w.style.display = 'none';
            }
        });
    },

    user_roles_in: function(roles) {
        var userRoles = wf.getAllRolesSafe();
        return _.intersection(userRoles, roles).length > 0;
    },

    canDraw: function() {
        return [ROL_TECNICO, ROL_ADMIN].includes(this.getRole());
    }
};

window['wf'] = Object.create(MyWorkflow);
$(document).ready(function() {
    wf.fixMenu();
    wf.disabledWidgets('menu');
});
