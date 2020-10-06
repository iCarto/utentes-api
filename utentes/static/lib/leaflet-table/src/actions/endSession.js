var EndSession = L.Toolbar2.Action.extend({
    options: {
        toolbarIcon: {
            html: '<i id="endSession" class="fa fa-times"></i>',
            tooltip: "Fechar Sessão",
        },
    },

    initialize: function(map, geoJsonLayer, table, options) {
        this.table = table;
    },

    addHooks: function() {
        var table = this.table;
        bootbox.confirm({
            message: "Tem certeza de que deseja apagar todos os pontos carregados?",
            callback: function(result) {
                if (result) {
                    table.endSession();
                }
                return;
            },
        });
    },
});
