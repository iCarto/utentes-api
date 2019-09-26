Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.UltimaEntregaDocModalView = Backbone.View.extend({
    events: {
        "click #okButton": "okButtonClicked",
    },

    html: `
      <div class="modal fade" id="ultimaEntregaDocModalView" tabindex="-1" role="dialog" aria-labelledby="ultimaEntregaDocModalView">
        <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Pechar"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="modalViewLabel"><%- windowTitle %></h4>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-xs-offset-1 col-xs-10">
                        <div class="panel panel-info">
                            <div class="panel-heading">
                                <h3 class="panel-title"><strong>Data de entrega da documentação</strong></h3>
                            </div>
                            <div class="panel-body">
                                <div class="col-xs-12">
                                    <div class="row">
                                        <div class="form-group">
                                           <label class="control-label" for="d_ultima_entrega_doc">Insira a nova data de entrega da documentação</label>
                                           <input type="text" class="form-control widget-date" id="d_ultima_entrega_doc" placeholder="dd/mm/yyyy" aria-describedby="helpBlock_d_ultima_entrega_doc" required>
                                           <span id="helpBlock_d_ultima_entrega_doc" class="help-block" style="padding-top: 2px;">&nbsp;</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> <!-- /modal-body -->
            <div class="modal-footer">
               <div class="row">
                  <div class="col-xs-offset-1 col-xs-10">
                     <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                     <button type="button" class="btn btn-primary" id="okButton" disabled>Aceitar</button>
                  </div>
               </div>
            </div>
        </div>
        </div>
      </div>
    `,

    initialize: function(options) {
        var defaultOptions = {
            windowTitle: "Requerimento Pendente",
        };
        this.options = Object.assign({}, defaultOptions, options);
        this.template = _.template(this.html);
    },

    render: function() {
        this.$el.html(this.template(this.options));
        return this;
    },

    isBeforeSolicitacao: function(value) {
        var d_soli = this.model.get("d_soli");
        if (!d_soli) {
            return false;
        }
        return formatter().isFirstDateBeforeSecondDate(value, d_soli);
    },

    show: function() {
        var self = this;
        $(document.body).append(this.render().el);
        var dateWidget = document.getElementById("d_ultima_entrega_doc");
        dateWidget.addEventListener(
            "input",
            function(e) {
                var dateWidget = e.target;
                var dateObj = formatter().unformatDate(dateWidget.value);
                var validDate =
                    dateObj &&
                    formatter().validDateFormat(dateWidget.value) &&
                    !formatter().isFuture(dateObj) &&
                    !self.isBeforeSolicitacao(dateObj);
                if (validDate) {
                    dateWidget.setCustomValidity("");
                } else {
                    dateWidget.setCustomValidity(
                        "A data deve ter o formato correto, ser posterior à data da solicitação e não ser posterior a hoje."
                    );
                }

                var helpBlock = document.getElementById(
                    "helpBlock_d_ultima_entrega_doc"
                );
                if (validDate) {
                    helpBlock.innerText = "";
                    helpBlock.style.color = null;
                } else {
                    helpBlock.innerText =
                        "A data deve ter o formato correto, ser posterior à data da solicitação e não ser posterior a hoje.";
                    helpBlock.style.color = "red";
                }

                document.getElementById("okButton").disabled = !validDate;
            },
            false
        );

        this.$(".modal").on("hidden.bs.modal", function() {
            self._close();
        });
        this.$(".modal").on("shown.bs.modal", function() {
            dateWidget.focus();
        });

        this.$(".modal").modal("show");
    },

    _close: function() {
        this.$(".modal").unbind();
        this.$(".modal").remove();
        this.remove();
    },
});
