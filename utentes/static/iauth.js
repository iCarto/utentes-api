/*
iCarto Authentication and Authorization

* Esta funcionalidad no contempla ahora mismo algunas situaciones de interés:

* Herencia de roles
* Orden de aplicación de roles (si hay permisos contradictorios)
* Usar permisos en lugar de usar roles para la autorización final
* **Ahora no gestionamos grupos vs roles**
*/

var IAuth = {
    getUser: function() {
        var user = document.cookie.replace(
            /(?:(?:^|.*;\s*)utentes_stub_user\s*\=\s*([^;]*).*$)|^.*$/,
            "$1"
        );
        return user;
    },

    getMainRole: function() {
        var role = document.cookie.replace(
            /(?:(?:^|.*;\s*)utentes_stub_role\s*\=\s*([^;]*).*$)|^.*$/,
            "$1"
        );
        role = decodeURIComponent(role);
        if (
            ![
                SIRHA.ROLE.SINGLE,
                SIRHA.ROLE.ADMIN,
                SIRHA.ROLE.OBSERVADOR,
                SIRHA.ROLE.UNIDAD,
                SIRHA.ROLE.ADMINISTRATIVO,
                SIRHA.ROLE.FINANCIERO,
                SIRHA.ROLE.DIRECCION,
                SIRHA.ROLE.TECNICO,
                SIRHA.ROLE.JURIDICO,
            ].includes(role)
        ) {
            throw Error("Not valid role");
        }
        return role;
    },

    getUnidade: function() {
        var unidade = document.cookie.replace(
            /(?:(?:^|.*;\s*)utentes_stub_unidade\s*\=\s*([^;]*).*$)|^.*$/,
            "$1"
        );
        unidade = decodeURIComponent(unidade);
        return unidade;
    },

    getRoles: function(safeRoleFormat) {
        safeRoleFormat = safeRoleFormat || "safe";
        switch (safeRoleFormat) {
            case "safe":
                return this.getAllRolesSafe();
            case "not-safe":
                return this.getAllRolesNotSafe();
            default:
                throw Error("This should never happen");
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
        var notSafeRoles = iAuth.getAllRolesNotSafe();
        var roles = notSafeRoles.map(r => iAuth.getMainRoleSafe(r));
        return roles;
    },

    getAllRolesNotSafe: function() {
        var roles = window.SIXHIARA.GROUPS_TO_ROLES[this.getMainRole()];
        return roles;
    },

    getMainRoleSafe: function(role) {
        if (!role) {
            var role = this.getMainRole();
        }
        switch (role) {
            case SIRHA.ROLE.ADMIN:
                return "administrador";
            case SIRHA.ROLE.OBSERVADOR:
                return "observador";
            case SIRHA.ROLE.ADMINISTRATIVO:
                return "administrativo";
            case SIRHA.ROLE.FINANCIERO:
                return "financieiro";
            case SIRHA.ROLE.DIRECCION:
                return "direccao";
            case SIRHA.ROLE.TECNICO:
                return "tecnico";
            case SIRHA.ROLE.UNIDAD:
                return "unidade";
            case SIRHA.ROLE.JURIDICO:
                return "juridico";
            case SIRHA.ROLE.SINGLE:
                return "single";
        }
    },

    asSafeRoles: function(roles) {
        roles = roles || [];
        roles = _.isArray(roles) ? roles : [roles];
        return roles.map(r => this.getMainRoleSafe(r));
    },

    isAdmin: function(role) {
        if (!role) {
            role = iAuth.getMainRole();
        }
        return role === SIRHA.ROLE.ADMIN;
    },

    isDirector: function(role) {
        if (!role) {
            role = iAuth.getMainRole();
        }
        return role === SIRHA.ROLE.DIRECCION;
    },

    isObservador: function(role) {
        if (!role) {
            role = iAuth.getMainRole();
        }
        return role === SIRHA.ROLE.OBSERVADOR;
    },

    hasRoleObservador: function(roles) {
        if (!roles) {
            var roles = this.getRoles("not-safe");
        }
        return roles.includes(SIRHA.ROLE.OBSERVADOR);
    },

    hasRoleTecnico: function(roles) {
        if (!roles) {
            var roles = this.getRoles("not-safe");
        }
        return roles.includes(SIRHA.ROLE.TECNICO);
    },

    disabledWidgets: function(selector, roles_only_read) {
        roles_only_read = roles_only_read || [];

        var baseElement = document;
        if (selector) {
            baseElement = document.querySelectorAll(selector)[0];
        }

        var elements = baseElement.getElementsByClassName("uilib-enability");
        Array.prototype.forEach.call(elements, function(w) {
            var rolesEnabled = [];
            var rolesDisabled = roles_only_read;
            var rolesShowed = [];
            var rolesHide = [];
            w.classList.forEach(function(c) {
                if (c.startsWith("uilib-enable-role")) {
                    rolesEnabled.push(c.split("role-")[1]);
                }
                if (c.startsWith("uilib-disable-role")) {
                    rolesDisabled.push(c.split("role-")[1]);
                }
                if (c.startsWith("uilib-show-role")) {
                    rolesShowed.push(c.split("role-")[1]);
                }
                if (c.startsWith("uilib-hide-role")) {
                    rolesHide.push(c.split("role-")[1]);
                }
            });
            if (!w.hasAttribute("disabled")) {
                if (
                    (rolesEnabled.length && !iAuth.user_roles_in(rolesEnabled)) ||
                    (rolesDisabled.length && iAuth.user_roles_in(rolesDisabled))
                ) {
                    w.disabled = true;
                }
            }
            if (
                (rolesShowed.length && !iAuth.user_roles_in(rolesShowed)) ||
                (rolesHide.length && iAuth.user_roles_in(rolesHide))
            ) {
                w.style.display = "none";
            }
        });
    },

    user_roles_in: function(roles, safeRoleFormat) {
        /* roles is an array of roles.
           safeRoleFormat defines if the `roles` array contains the roles in
           'safe' format mode or in 'not-safe' mode
        */
        roles = roles || [];
        var userRoles = this.getRoles(safeRoleFormat);
        // return _.intersection(userRoles, roles).length > 0;
        var intersection = [userRoles, roles].reduce((a, c) =>
            a.filter(i => c.includes(i))
        );
        return intersection.length > 0;
    },

    user_roles_not_in: function(roles, safeRoleFormat) {
        return !this.user_roles_in(roles, safeRoleFormat);
    },

    canDraw: function() {
        return [SIRHA.ROLE.TECNICO, SIRHA.ROLE.ADMIN].includes(this.getMainRole());
    },

    getDefaultDataForFileModal(exp_id) {
        var data = {
            defaultUrlBase: Backbone.SIXHIARA.Config.apiDocumentos,
            defaultFolderId: exp_id,
        };
        if (!this.isAdmin() && !this.isObservador()) {
            if (this.getMainRole() == SIRHA.ROLE.UNIDAD) {
                data.defaultUrlBase =
                    Backbone.SIXHIARA.Config.apiDocumentos +
                    "/" +
                    exp_id +
                    "/" +
                    this.getMainRole();
                data.defaultFolderId = this.getUnidade();
            } else {
                data.defaultUrlBase =
                    Backbone.SIXHIARA.Config.apiDocumentos + "/" + exp_id;
                data.defaultFolderId = this.getMainRole();
            }
        }
        return data;
    },
};

window.iAuth = Object.create(IAuth);

// https://stackoverflow.com/questions/9899372/
if (document.readyState !== "loading") {
    iAuth.disabledWidgets("menu");
} else {
    document.addEventListener("DOMContentLoaded", function() {
        document.removeEventListener("DOMContentLoaded", this);
        iAuth.disabledWidgets("menu");
    });
}
