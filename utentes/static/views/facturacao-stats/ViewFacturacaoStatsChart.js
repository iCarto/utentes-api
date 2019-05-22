Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewFacturacaoStatsChart = Backbone.View.extend({

    template: `
        <div class="chart-options">
            <div>
                <input type = "radio"
                    name = "chartType"
                    id = "chartTypeConsumo"
                    value = "consumo"
                    checked = "checked" />
                <label for = "chartTypeConsumo">Consumo</label>
                &nbsp;&nbsp;
                <input type = "radio"
                    name = "chartType"
                    id = "chartTypeImporte"
                    value = "importe" />
                <label for = "chartTypeImporte">Importe</label>
            </div>
            <button id="export" class="btn btn-default btn-sm">PNG</button>
        </div>
        <canvas id="stats-chart"></canvas>          
    `,

    events: {
        "click #export": "exportChart"
    },

    initialize: function(options){
        this.options = options || {};
        
        this.listenTo(this.model, 'sync reset', this.updateChart)
    },

    render: function() {
        this.$el.append($(this.template));

        this.createChart();
        this.setListeners();

        return this;
    },

    setListeners: function() {
        var self = this;
        this.$('input[type=radio][name=chartType]').change(function() {
            self.updateChart();
        });
    },

    createChart: function() {
        var ctx = this.$("#stats-chart")[0].getContext('2d');

        // set background color for chart (to export with background)
        var backgroundColor = 'white';
        Chart.plugins.register({
            beforeDraw: function(c) {
                var ctx = c.chart.ctx;
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, c.chart.width, c.chart.height);
            }
        });
        
        var options = {
            legend: {
                display: true,
                position: 'bottom',
            },
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        };

        this.chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'bar',

            // The data for our dataset
            data: {
                labels: [],
                datasets: []
            },

            // Configuration options go here
            options
        });
    },

    updateModel: function(newModel) {
        this.model.reset(newModel);
    },

    updateChart: function() {
        var chartType = this.$('input[name=chartType]:checked').val();
        this.chart.data.labels = this.getLabels();
        this.chart.data.datasets = this.getDataset(chartType);
        this.chart.update();
    },

    getLabels: function() {
        return this.model.map(function(exploracao) {
            return exploracao.get('exp_id') + ' (' + exploracao.get('utente') + ')';
        });
    },

    getDataset(chartType) {
        return [
            this.getDatasetEsperadas(chartType),
            this.getDatasetEmitidas(chartType),
            this.getDatasetCobradas(chartType)
        ]
    },

    getDatasetEsperadas: function(tipo) {
        return {
            label: 'Esperadas',
            backgroundColor: 'rgb(51, 123, 183)',
            borderColor: 'rgb(18, 102, 171)',
            data: this.model.map(function(exploracao) {
                return exploracao.get(tipo + '_facturas_esperadas')
            })
        }
    },

    getDatasetEmitidas: function(tipo) {
        return {
            label: 'Emitidas',
            backgroundColor: 'rgb(83, 147, 200)',
            borderColor: 'rgb(18, 102, 171)',
            data: this.model.map(function(exploracao) {
                return exploracao.get(tipo + '_facturas_emitidas')
            })
        }
    },

    getDatasetCobradas: function(tipo) {
        return {
            label: 'Cobradas',
            backgroundColor: 'rgb(126, 177, 220)',
            borderColor: 'rgb(18, 102, 171)',
            data: this.model.map(function(exploracao) {
                return exploracao.get(tipo + '_facturas_cobradas')
            })
        }
    },

    exportChart: function() {
        this.$el.find("#stats-chart").get(0).toBlob(function(blob) {
            var blobUrl = URL.createObjectURL(blob);
            var link = document.createElement("a");
            link.href = blobUrl;
            link.download = "chart.png";
            document.body.appendChild(link);
            link.click();
            setTimeout(function() {
                window.URL.revokeObjectURL(blobUrl);
            }, 1000);
        });
    }

});
