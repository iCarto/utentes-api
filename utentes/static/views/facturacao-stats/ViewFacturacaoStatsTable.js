Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewFacturacaoStatsTable = Backbone.View.extend({
    template: `
        <table class="table table-bordered table-hover">
        </table>`,

    initialize: function(options) {
        this.options = options || {};

        this.listenTo(this.model, "sync", this.updateTable);
    },

    render: function() {
        this.$el.append($(this.template));
        this.createDataTable();
        return this;
    },

    createDataTable: function() {
        var self = this;

        var columns = [
            {data: "gid", title: "ID", visible: false},
            {data: "utente", title: "Utente"},
            {data: "exp_id", title: "Exploraçao", className: "dt-center dt-value"},
            {
                data: "numero_facturas_esperadas",
                title: "Nº Facturas Esperadas",
                searchable: false,
                className: "dt-center dt-value",
            },
            {
                data: "consumo_facturas_esperadas",
                title: "Consumo Esperado",
                searchable: false,
                className: "dt-center dt-value",
            },
            {
                data: "importe_facturas_esperadas",
                title: "Valor Esperado (MT)",
                searchable: false,
                className: "dt-center dt-value",
            },
            {
                data: "numero_facturas_emitidas",
                title: "Nº Facturas Emitidas",
                searchable: false,
                className: "dt-center dt-value",
            },
            {
                data: "consumo_facturas_emitidas",
                title: "Consumo Emitidas",
                searchable: false,
                className: "dt-center dt-value",
            },
            {
                data: "importe_facturas_emitidas",
                title: "Valor Emitido (MT)",
                searchable: false,
                className: "dt-center dt-value",
            },
            {
                data: "numero_facturas_cobradas",
                title: "Nº Facturas Cobradas",
                searchable: false,
                className: "dt-center dt-value",
            },
            {
                data: "consumo_facturas_cobradas",
                title: "Consumo Cobradas",
                searchable: false,
                className: "dt-center dt-value",
            },
            {
                data: "importe_facturas_cobradas",
                title: "Valor Cobrado (MT)",
                searchable: false,
                className: "dt-center dt-value",
            },
        ];
        this.table = this.$("table").DataTable({
            columns,
            language: this.language,
            dom: '<"top"flB><t><"bottom"ip><"clear">',
            buttons: [
                {
                    extend: "excel",
                    className: "btn-sm",
                    text: "XLS",
                    exportOptions: {columns: ":visible"},
                },
            ],
        });

        this.table.on("search", function() {
            var filteredIds = [];
            self.table.rows({search: "applied"}).every(function(node) {
                filteredIds.push(this.data()["gid"]);
            });
            self.model.trigger("filter", filteredIds);
        });
    },

    updateTable: function(newModel) {
        this.model = newModel;
        this.table.clear();
        this.table.rows.add(this.model.toJSON());
        this.table.draw();

        this.table
            .buttons()
            .container()
            .appendTo(this.$el.find("#table-buttons"));
    },

    language: {
        sProcessing: "A processar...",
        sLengthMenu: "Mostrar _MENU_ registros",
        sZeroRecords: "Não foram encontrados resultados",
        sEmptyTable: "Não há dados disponíveis sobre esta tabela",
        // "sInfo":           "Mostrando registos del _START_ al _END_ de um total de _TOTAL_ registos",
        sInfo: "_START_/_END_ de _TOTAL_",
        sInfoEmpty: "0/0 de 0",
        sInfoFiltered: "(filtrado de _MAX_ registos no total)",
        sInfoPostFix: "",
        sSearch: "Procurar:",
        sUrl: "",
        sInfoThousands: ",",
        sLoadingRecords: "Cargando...",
        oPaginate: {
            sFirst: "Primeiro",
            sLast: "Último",
            sNext: "Seguinte",
            sPrevious: "Anterior",
        },
        oAria: {
            sSortAscending: ": Para classificar a coluna em ordem crescente",
            sSortDescending: ": Para classificar a coluna em ordem decrescente",
        },
    },
});
