Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ModalHistoricoLicencias = Backbone.View.extend({
    html: `
      <div class="modal fade" id="historicoLicenciaModalView" tabindex="-1" role="dialog" aria-labelledby="modalViewLabel">
        <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Pechar"><span aria-hidden="true">&times;</span></button>
                <h4 id="modalViewLabel" class="modal-title exploracao_info"><%- lic_nro + ' - ' + exp_name %></h4>
                <div>Histórico de licenças</div>
            </div>
            <div class="modal-body">
            <table class="table">
            <thead>
                <tr>
                    <th>Nro de licença histórico</th>
                    <th>Nro de exploração</th>
                    <th>Tipo de licença</th>
                    <th>Data emissão</th>
                    <th>Data validade</th>
                    <th>Caudal licenciado</th>
                    <th>Último caudad facturado</th>
                </tr>
            </thead>

            <tbody>
            <%
            _.each(renovacoes,function(item){
                %>
                <tr>
                    <td><%- n_licen_a %></td>
                    <td><%- item.exp_id %></td>
                    <td><%- item.tipo_lic %></td>
                    <td><%- formatter().formatDate(item.d_emissao) %></td>
                    <td><%- formatter().formatDate(item.d_validade) %></td>
                    <td><%- item.c_licencia %></td>
                    <td><%- item.consumo_fact %></td>
                </tr>

                <%
            });
            %>
            </tbody>
            </table>

            </div> <!-- /modal-body -->
        </div>
        </div>
      </div>
    `,

    initialize: function(options) {
        this.options = options || {};
        this.template = _.template(this.html);
    },

    render: function() {
        var prefix = this.options.tipo_agua.substring(0, 3).toLowerCase();
        var licencia = this.model
            .get("licencias")
            .findWhere({tipo_agua: this.options.tipo_agua});

        this.$el.html(
            this.template({
                lic_nro: licencia.get("lic_nro"),
                exp_name: this.model.get("exp_name"),
                n_licen_a: licencia.get("n_licen_a"),
                renovacoes: this.options.renovacoes.map(function(d) {
                    return {
                        exp_id: d["exp_id"],
                        tipo_lic: d["tipo_lic_" + prefix + "_old"],
                        d_emissao: d["d_emissao_" + prefix + "_old"],
                        d_validade: d["d_validade_" + prefix + "_old"],
                        c_licencia: d["c_licencia_" + prefix + "_old"],
                        consumo_fact: d["consumo_fact_" + prefix + "_old"],
                    };
                }),
            })
        );
        return this;
    },

    show: function() {
        if (!this.options.renovacoes.length) {
            bootbox.alert("A exploração não tem dados históricos");
            return;
        }

        $(document.body).append(this.render().el);
        this.$(".modal-dialog").css("margin", "30px auto");

        var self = this;

        this.$(".modal").on("hidden.bs.modal", function() {
            self._close();
        });

        this.$(".modal").modal("show");
    },

    _close: function() {
        this.$(".modal").unbind();
        this.$(".modal").remove();
        this.remove();
    },
});
