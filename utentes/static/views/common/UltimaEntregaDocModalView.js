Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.UltimaEntregaDocModalView = Backbone.View.extend({

    events: {
        'click #okbutton': 'okButtonClicked'
    },

    html: `
      <div class="modal fade" id="ultimaEntregaDocModalView" tabindex="-1" role="dialog" aria-labelledby="ultimaEntregaDocModalView">
        <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Pechar"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="modalViewLabel">Requerimento Pendente</h4>
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
                                           <label for="exp_id">Insira a nova data de entrega da documentação</label>
                                           <input type="text" class="form-control widget widget-date" id="d_ultima_entrega_doc" placeholder="dd/mm/yyyy" pattern="^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\\d\\d$">
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
                     <button type="button" class="btn btn-primary" id="okbutton">Aceitar</button>
                  </div>
               </div>
            </div>
        </div>
        </div>
      </div>
    `,

    initialize: function(options) {
        this.options = options || {};
        this.template = _.template(this.html);
    },

    render: function() {
        this.$el.html(this.template())
        return this;
    },

    isValidDate: function(value){
        return /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/.test(value);
    },

    isAfterNow: function(value){
        var sTokens = value.split('/');
        var date = new Date(sTokens[2], sTokens[1] - 1, sTokens[0]);
        return date > new Date();
    },

    isBeforeSolicitacao: function(value){
        var sTokens = value.split('/');
        var date = new Date(sTokens[2], sTokens[1] - 1, sTokens[0], 1, 1, 1);
        return date < this.model.get("d_soli");
    },

    showDefaultDate: function() {
        document.getElementById('d_ultima_entrega_doc').value = moment().format("DD/MM/YYYY");
    },

    show: function() {
        $(document.body).append(this.render().el);
        this.showDefaultDate()

        var self = this;

        this.$('.modal').on('hidden.bs.modal', function(){
            self._close();
        });

        this.$('.modal').modal('show');
    },

    _close: function() {
        this.$('.modal').unbind();
        this.$('.modal').remove();
        this.remove();
    },

});
