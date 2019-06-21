Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ModalTooltipEstadoLicenciaView = Backbone.View.extend({
    /*
  new Backbone.SIXHIARA.ModalTooltipEstadoLicenciaView({
    model: domains.byCategory('licencia_estado'),
    estado: exploracao.get('licencia').get('estado') || null
  });

  */
    html: `
      <div class="modal fade" id="tooltipEstadoLicenciaModalView" tabindex="-1" role="dialog" aria-labelledby="modalViewLabel">
        <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Pechar"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="modalViewLabel">Pasos no estado na licencia</h4>
            </div>
            <div class="modal-body">
            <table class="table">
            <thead>
            <tr><th>Orden</th><th>Estado</th><th>Descripción</th></tr>
            </thead>

            <tbody>
            <%
            _.each(estados,function(item,key,list){
                var clasz = item.text === actual_state ? 'done' : '';
            %>
            <tr class="<%- clasz %>">
            <td><%- key %></td>
            <td><%- item.text %></td>
            <td><%- item.tooltip %></td>
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
        var t = _.reject(this.collection.toJSON(), function(e) {
            return e.order === 0;
        });
        this.$el.html(
            this.template({
                estados: t,
                actual_state: this.options.actual_state,
            })
        );
        return this;
    },

    show: function() {
        $(document.body).append(this.render().el);
        this.$(".modal-dialog").css("margin", "30px 10px");

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
