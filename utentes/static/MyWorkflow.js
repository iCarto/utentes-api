var MyWorkflow = {

    SINGLE_USER: 'SINGLE_USER',
    USER_COOKIE_KEY: 'utentes_stub_user',

    getUser: function() {
        var user = document.cookie.replace(/(?:(?:^|.*;\s*)utentes_stub_user\s*\=\s*([^;]*).*$)|^.*$/, '$1');
        return user;
    },

    getMainRole: function() {
        // Usar además del ROL el ARA o tener un ROL_SINGLE_USER
        // En todo caso los ROLES deberian ser una clase aparte
        var role = document.cookie.replace(/(?:(?:^|.*;\s*)utentes_stub_role\s*\=\s*([^;]*).*$)|^.*$/, '$1');
        role = decodeURIComponent(role);
        if (![SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.UNIDAD, SIRHA.ROLE.ADMINISTRATIVO, SIRHA.ROLE.FINANCIERO, SIRHA.ROLE.DIRECCION, SIRHA.ROLE.TECNICO, SIRHA.ROLE.JURIDICO].includes(role)) {
            throw Error('Not valid role');
        }
        return role;
    },

    getUnidade: function() {
        var unidade = document.cookie.replace(/(?:(?:^|.*;\s*)utentes_stub_unidade\s*\=\s*([^;]*).*$)|^.*$/, '$1');
        unidade = decodeURIComponent(unidade);
        return unidade;
    },

    getRoles: function(safeRoleFormat) {
        safeRoleFormat = safeRoleFormat || 'safe';
        switch (safeRoleFormat) {
            case 'safe':
                return this.getAllRolesSafe();
            case 'not-safe':
                return this.getAllRolesNotSafe();
            default:
                throw Error('This should never happen');
        }
    },

    /*
    Un usuario debería poder tener varios roles. Por razones históricas se ha
    asumido una relación 1:1 en la mayoría del código, llamadas a getMainRole
    Pero hay que ir refactorizando para usar una relación 1:n
    O mejor todavía pasar aun sistema basado en permisos y no en roles

    Todo esto del rol del usuario habría que cachearlo y no generarlo cada vez
    que se haga la petición
    */
    getAllRolesSafe: function() {
        var roles = [this.getMainRoleSafe()];

        if (this.getUser() === this.SINGLE_USER) {
            roles.push(SIRHA.ROLE.SINGLE_SAFE);
        }
        if (roles.includes(this.getMainRoleSafe(SIRHA.ROLE.UNIDAD))) {
            roles.push(this.getMainRoleSafe(SIRHA.ROLE.OBSERVADOR));
        }
        return roles;
    },

    getAllRolesNotSafe: function() {
        var roles = [this.getMainRole()];
        if (this.getUser() === this.SINGLE_USER) {
            roles.push(SIRHA.ROLE.SINGLE_SAFE);
        }
        if (roles.includes(SIRHA.ROLE.UNIDAD)) {
            roles.push(SIRHA.ROLE.OBSERVADOR);
        }
        return roles;
    },

    getMainRoleSafe: function(role) {
        if (!role){
            var role = this.getMainRole();
        }
        switch (role) {
        case SIRHA.ROLE.ADMIN:
            return 'administrador';
        case SIRHA.ROLE.OBSERVADOR:
            return 'observador';
        case SIRHA.ROLE.ADMINISTRATIVO:
            return 'administrativo';
        case SIRHA.ROLE.FINANCIERO:
            return 'financieiro';
        case SIRHA.ROLE.DIRECCION:
            return 'direccao';
        case SIRHA.ROLE.TECNICO:
            return 'tecnico';
        case SIRHA.ROLE.UNIDAD:
            return 'unidade';
        case SIRHA.ROLE.JURIDICO:
            return 'juridico';
        }
    },

    isAdmin: function(role) {
        if(!role) {
            role = wf.getMainRole();
        }
        return role === SIRHA.ROLE.ADMIN;
    },

    isDirector: function(role) {
        if(!role) {
            role = wf.getMainRole();
        }
        return role === SIRHA.ROLE.DIRECCION;
    },

    isObservador: function(role) {
        if(!role) {
            role = wf.getMainRole();
        }
        return role === SIRHA.ROLE.OBSERVADOR;
    },

    hasRoleObservador: function(roles) {
        if(!roles) {
            var roles = this.getRoles('not-safe');
        }
        return roles.includes(SIRHA.ROLE.OBSERVADOR);
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
        wf.disabledWidgets('#insert-data');
    },

    whichView: function(exp, next) {
        if (!exp) {
            return Backbone.SIXHIARA.ViewNoData;
        }

        var state = this.getCurrentState(exp);
        var role = this.getMainRole();

        if (SIRHA.ESTADO.CATEGORY_POST_LICENSED.includes(state)) {
            return this.whichFacturacaoView(exp, next);
        }

        switch (state) {
        case SIRHA.ESTADO.NOT_EXISTS:
            break;
        case SIRHA.ESTADO.INCOMPLETE_DA:
            return Backbone.SIXHIARA.ViewDocIncompletaAdm;
        case SIRHA.ESTADO.INCOMPLETE_DIR:
            return Backbone.SIXHIARA.ViewSecretaria1;
        case SIRHA.ESTADO.INCOMPLETE_DJ:
            if (this.isNotCompleteForFirstDJState(exp)) {
                return Backbone.SIXHIARA.ViewJuridico2;
            }

            if (role === SIRHA.ROLE.JURIDICO || role === SIRHA.ROLE.ADMIN || role === SIRHA.ROLE.OBSERVADOR) {
                return Backbone.SIXHIARA.ViewJuridico1;
            };
            if (role === SIRHA.ROLE.TECNICO) {
                return Backbone.SIXHIARA.ViewJuridicoNotEditable1;
            };
        case SIRHA.ESTADO.INCOMPLETE_DF:
            return Backbone.SIXHIARA.UpsView;
        case SIRHA.ESTADO.PENDING_REVIEW_DIR:
            return Backbone.SIXHIARA.ViewSecretaria1;
        case SIRHA.ESTADO.PENDING_REVIEW_DJ:
            if (role === SIRHA.ROLE.JURIDICO || role === SIRHA.ROLE.ADMIN || role === SIRHA.ROLE.OBSERVADOR) {
                return Backbone.SIXHIARA.ViewJuridico1;
            };
            if (role === SIRHA.ROLE.TECNICO) {
                return Backbone.SIXHIARA.ViewJuridicoNotEditable1;
            };
        case SIRHA.ESTADO.INCOMPLETE_DT:
        case SIRHA.ESTADO.PENDING_FIELD_VISIT:
        case SIRHA.ESTADO.PENDING_TECH_DECISION:
            /*
             admin, tecnico, unidad. Hay que ponerlo. Si no, si por ejemplo jurídico
             pudiera ver este estado se le estaría renderizando esto.
            */
            return Backbone.SIXHIARA.ViewTecnico1;
        case SIRHA.ESTADO.PENDING_EMIT_LICENSE:
            // admin, juridico
            return Backbone.SIXHIARA.ViewJuridico2;
        case SIRHA.ESTADO.PENDING_DIR_SIGN:
            // admin, secretaria
            return Backbone.SIXHIARA.ViewSecretaria2;
        default:
            return Backbone.SIXHIARA.UpsView;
        }

        return Backbone.SIXHIARA.UpsView;
    },

    isNotCompleteForFirstDJState: function(exp) {
        return exp.get('req_obs').filter(function(o){
                return o.state === SIRHA.ESTADO.PENDING_EMIT_LICENSE;
            }).length > 0
    },

    isNeedAskForEnteredDocumentationDate(exp, data) {
        var estado_lic = exp.get("estado_lic");
        var nextState = this.whichNextState(estado_lic, data)

        if (data.target.id == 'bt-ok') {
            if (estado_lic == SIRHA.ESTADO.INCOMPLETE_DA) {
                    return true
            }
            if (estado_lic == SIRHA.ESTADO.INCOMPLETE_DJ &&
                nextState == SIRHA.ESTADO.PENDING_FIELD_VISIT &&
                !this.isNotCompleteForFirstDJState(exp)) {
                    return true;
            }
        }
        return false
    },

    whichFacturacaoView: function(exp, next) {
        var estado_lic = this.getCurrentState(exp);
        var fact_estado = exp.get('fact_estado');
        var role = this.getMainRole();

        if (! SIRHA.ESTADO.CATEGORY_POST_LICENSED.includes(estado_lic)) {
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
        // var state1 = (lics.at(0) && lics.at(0).get('estado')) || SIRHA.ESTADO.NOT_EXISTS;
        // var state2 = (lics.at(1) && lics.at(1).get('estado')) || SIRHA.ESTADO.NOT_EXISTS;
        //
        // state1 = state1 !== SIRHA.ESTADO.NOT_EXISTS ? state1 : state2;

        return exp.get('estado_lic') || SIRHA.ESTADO.NOT_EXISTS;
    },

    whichNextState: function(currentState, data, exp) {
        // Igual en lugar de currentState se le puede pasar la explotación
        if (SIRHA.ESTADO.CATEGORY_POST_LICENSED.includes(currentState)) {
            return this.whichFacturacaoNextState(currentState, data, exp);
        }

        if (!data) {
            return currentState;
        }

        switch (currentState) {
        case SIRHA.ESTADO.NOT_EXISTS:
            return this.nextStateAfterNoExiste(data);
        case SIRHA.ESTADO.INCOMPLETE_DA:
            return this.nextStateAfterNoExiste(data);
        case SIRHA.ESTADO.INCOMPLETE_DIR:
            return this.nextStateAfterPteRevDir(data);
        case SIRHA.ESTADO.INCOMPLETE_DJ:
            return this.nextStateAfterPteRevJuri(data);
        case SIRHA.ESTADO.INCOMPLETE_DT:
            return this.nextStateAfterVisitaCampo(data);
        case SIRHA.ESTADO.INCOMPLETE_DF:
            throw 'Error';
        case SIRHA.ESTADO.PENDING_REVIEW_DIR:
            return this.nextStateAfterPteRevDir(data);
        case SIRHA.ESTADO.PENDING_REVIEW_DJ:
            return this.nextStateAfterPteRevJuri(data);
        case SIRHA.ESTADO.PENDING_FIELD_VISIT:
            return this.nextStateAfterVisitaCampo(data);
        case SIRHA.ESTADO.PENDING_TECH_DECISION:
            return this.nextStateAfterPteRevDT(data);
        case SIRHA.ESTADO.PENDING_EMIT_LICENSE:
            return this.nextStatePteEmiJuri(data);
        case SIRHA.ESTADO.PENDING_DIR_SIGN:
            return this.nextStatePteFirmaDir(data);
        default:
            throw 'Error';
        }
    },

    nextStateAfterNoExiste: function(data) {
        var nextState = undefined;
        if (data.target.id === 'bt-ok') {
            nextState = SIRHA.ESTADO.PENDING_REVIEW_DIR;
        }

        if (data.target.id === 'bt-no') {
            nextState = SIRHA.ESTADO.INCOMPLETE_DA;
        }
        return nextState;
    },

    nextStateAfterPteRevDir: function(data) {
        var nextState = undefined;
        if (data.target.id === 'bt-ok') {
            nextState = SIRHA.ESTADO.PENDING_REVIEW_DJ;
        }

        if (data.target.id === 'bt-no') {
            nextState = SIRHA.ESTADO.INCOMPLETE_DIR;
        }
        return nextState;
    },

    nextStateAfterPteRevJuri: function(data) {
        var nextState = undefined;
        if (data.target.attributes && data.target.attributes['data-foo']) {
            return this.nextStatePteEmiJuri(data);
        }

        if (data.target.id === 'bt-ok') {
            nextState = SIRHA.ESTADO.PENDING_FIELD_VISIT;
        }

        if (data.target.id === 'bt-no') {
            nextState = SIRHA.ESTADO.INCOMPLETE_DJ;
        }

        if (data.target.id === 'bt-noaprobada') {
            nextState = SIRHA.ESTADO.NOT_APPROVED;
        }
        return nextState;
    },

    nextStateAfterVisitaCampo: function(data) {
        var nextState = undefined;
        if (data.target.id === 'bt-ok') {
            nextState = SIRHA.ESTADO.PENDING_TECH_DECISION;
        }

        if (data.target.id === 'bt-no') {
            nextState = SIRHA.ESTADO.INCOMPLETE_DT;
        }

        if (data.target.id === 'bt-noaprobada') {
            nextState = SIRHA.ESTADO.NOT_APPROVED;
        }

        if (data.target.id === 'bt-defacto') {
            nextState = SIRHA.ESTADO.DE_FACTO;
        }

        return nextState;
    },

    nextStateAfterPteRevDT: function(data) {
        var nextState = undefined;
        if (data.target.id === 'bt-ok') {
            nextState = SIRHA.ESTADO.PENDING_EMIT_LICENSE;
        }

        if (data.target.id === 'bt-no') {
            nextState = SIRHA.ESTADO.INCOMPLETE_DT;
        }

        if (data.target.id === 'bt-noaprobada') {
            nextState = SIRHA.ESTADO.NOT_APPROVED;
        }

        if (data.target.id === 'bt-defacto') {
            nextState = SIRHA.ESTADO.DE_FACTO;
        }

        return nextState;
    },

    nextStatePteEmiJuri: function(data) {
        var nextState = undefined;
        if (data.target.id === 'bt-ok') {
            nextState = SIRHA.ESTADO.PENDING_DIR_SIGN;
        }

        if (data.target.id === 'bt-no') {
            nextState = SIRHA.ESTADO.INCOMPLETE_DJ;
        }

        if (data.target.id === 'bt-noaprobada') {
            nextState = SIRHA.ESTADO.NOT_APPROVED;
        }

        if (data.target.id === 'bt-defacto') {
            nextState = SIRHA.ESTADO.DE_FACTO;
        }
        return nextState;
    },

    nextStatePteFirmaDir: function(data) {
        var nextState = undefined;
        if (data.target.id === 'bt-ok') {
            nextState = SIRHA.ESTADO.LICENSED;
        }

        if (data.target.id === 'bt-noaprobada') {
            nextState = SIRHA.ESTADO.NOT_APPROVED;
        }
        return nextState;
    },

    whichFacturacaoNextState: function(currentState, data, exp) {
        // puede tener sentido agrupar en whichNextState
        var fact_estado = exp.get('fact_estado');
        var role = this.getMainRole();

        if (! SIRHA.ESTADO.CATEGORY_POST_LICENSED.includes(currentState)) {
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
            if (!w.hasAttribute('disabled')) {
                if (rolesEnabled.length && !wf.user_roles_in(rolesEnabled) ||
                    rolesDisabled.length && wf.user_roles_in(rolesDisabled)) {
                    w.disabled = true;
                }
            }
            if (rolesShowed.length && !wf.user_roles_in(rolesShowed) ||
                rolesHide.length && wf.user_roles_in(rolesHide)) {
                    w.style.display = 'none';
            }
        });
    },

    user_roles_in: function(roles, safeRoleFormat) {
        /* roles is an array of roles.
           safeRoleFormat defines if the `roles` array contains the roles in
           'safe' format mode or in 'not-safe' mode
        */

        var userRoles = this.getRoles(safeRoleFormat);
        return _.intersection(userRoles, roles).length > 0;
    },

    user_roles_not_in: function(roles, safeRoleFormat) {
        return !this.user_roles_in(roles, safeRoleFormat);
    },

    canDraw: function() {
        return [SIRHA.ROLE.TECNICO, SIRHA.ROLE.ADMIN].includes(this.getMainRole());
    },

    getDefaultDataForFileModal(exp_id) {
        var data = {
            defaultUrlBase:  Backbone.SIXHIARA.Config.apiDocumentos,
            defaultFolderId: exp_id
        }
        if(!this.isAdmin() && !this.isObservador()) {
            if(this.getMainRole() == SIRHA.ROLE.UNIDAD) {
                data.defaultUrlBase = Backbone.SIXHIARA.Config.apiDocumentos + '/' + exp_id + '/' + this.getMainRole();
                data.defaultFolderId = this.getUnidade();
            }else{
                data.defaultUrlBase = Backbone.SIXHIARA.Config.apiDocumentos + '/' + exp_id;
                data.defaultFolderId = this.getMainRole();
            }
        }
        return data;
    }
};

window['wf'] = Object.create(MyWorkflow);
$(document).ready(function() {
    wf.disabledWidgets('menu');

});
