var domains = new Backbone.UILib.DomainCollection();
domains.url = Backbone.SIXHIARA.Config.apiDomains;
domains.fetch();

var utentes = new Backbone.SIXHIARA.UtenteCollection();

var formatValue = function(k, v, rowData) {
    var urlShow = Backbone.SIXHIARA.Config.urlShow;
    if (k === "nome") {
        v = v + "<br>" + (rowData.get("nuit") || "");
    } else if (k === "nuit") {
        v = null;
    } else if (k === "exploracaos") {
        var lis = v
            .map(function(e) {
                var url = urlShow + e.gid;
                var icon;
                var color;
                if (e.estado_lic === SIRHA.ESTADO.NOT_APPROVED) {
                    icon = "fa-ban";
                    color = "#d9534f";
                }
                if (e.estado_lic === SIRHA.ESTADO.USOS_COMUNS) {
                    icon = "fa-water";
                    color = "#1f78b4";
                }
                if (SIRHA.ESTADO.CATEGORY_IN_PROCESS.includes(e.estado_lic)) {
                    icon = "fa-hourglass-half";
                    color = "#787878";
                }
                if (e.estado_lic === SIRHA.ESTADO.LICENSED) {
                    icon = "fa-tint";
                    color = "#1f78b4";
                }
                if (e.estado_lic === SIRHA.ESTADO.IRREGULAR) {
                    icon = "fa-tint";
                    color = "#d9534f";
                }
                if (e.estado_lic === SIRHA.ESTADO.DE_FACTO) {
                    icon = "fa-tint-slash";
                    color = "#1f78b4";
                }

                return `
                <li><span class="fa-li">
                <i class="fas ${icon} fa-fw" style="color: ${color}; margin-right:10px;"></i>
                </span>
                <a href="${url}">${e.exp_id}&nbsp;${e.exp_name}</a>:&nbsp;
                <small style="color: grey; font-size: 75%">(${e.actividade.tipo})</small>
                </li>
                `;
            })
            .join("");
        v = '<ul class="fa-ul">' + lis + "</ul>";
    } else if (k === "edit") {
        v =
            '<i class="edit fas fa-edit uilib-enability uilib-show-role-administrador uilib-show-role-tecnico uilib-show-role-juridico"></i>';
    } else if (k === "delete") {
        v =
            '<i class="delete fas fa-trash-alt uilib-enability uilib-show-role-administrador"></i>';
    } else if (k === "registo") {
        var com = rowData.get("reg_comerc"),
            zon = rowData.get("reg_zona");

        if (!com && !zon) {
            v = "";
        } else {
            v = (com || "-") + " / " + (zon || "-");
        }
    } else if (k === "localizacion") {
        var prov = rowData.get("loc_provin"),
            dist = rowData.get("loc_distri"),
            post = rowData.get("loc_posto"),
            nucl = rowData.get("loc_nucleo");

        if (!prov && !dist) {
            v = "";
        } else {
            v = (prov || "-") + " / " + (dist || "-");
        }

        if (post) v += '<br><span class="title">Posto:</span> ' + post;
        if (nucl) v += '<br><span class="title">Bairro:</span> ' + nucl;
    } else if (_.isEmpty(v)) {
        v = "";
    } else if (v === false) {
        v = "No";
    } else if (v === true) {
        v = "Sí";
    } else if (typeof v === "number") {
        v = formatter().format(v);
    }
    return v;
};

var tableUtentes = new Backbone.SIXHIARA.TableUtentes({
    el: $("#the_utentes_table"),
    collection: utentes,
    domains: domains,
    columnNames: [
        "nome",
        "uten_tipo",
        "registo",
        "localizacion",
        "exploracaos",
        "observacio",
        "edit",
        "delete",
    ],
    // 'edit' & 'delete' column are used to render the buttons
    // 'nuit', Is show with 'nome' and not it its own column
    // 'reg_comerc', 'reg_zona' are shown as 'registo'
    // 'loc_provin', 'loc_distri', 'loc_posto', 'loc_nucleo' are shown as 'localizacion'
    columnsWithOutTitle: ["edit", "delete"],
    columnTitles: {
        id: "ID",
        nome: "Nome / Nuit",
        uten_tipo: "Tipo de utente",
        nuit: "Nuit",
        registo: "Registro Comercial",
        reg_comerc: "Número de Registo Comercial",
        reg_zona: "Local do registro",
        localizacion: "Localizaçao",
        loc_provin: "Província",
        loc_distri: "Distrito",
        loc_posto: "Posto",
        loc_nucleo: "Bairro",
        exploracaos: "Exploraçôes",
        observacio: "Observaçôes",
        edit: "",
        delete: "",
    },
    formatValue: formatValue,
    colReorderOptions: false,
    columnDefs: [
        {
            type: "localesort",
            targets: "_all",
        },
    ],
});

utentes.fetch({
    parse: true,
    reset: true,
});
