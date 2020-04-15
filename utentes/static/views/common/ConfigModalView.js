Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ConfigModalView = Backbone.View.extend({
    html: `
      <div class="modal fade" id="configModalView" tabindex="-1" role="dialog" aria-labelledby="modalViewLabel">
        <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Pechar"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="modalViewLabel">Configuraçao</h4>
            </div>
            <div class="modal-body">

            <!--
            <div class="row">
                <div class="form-group">
                <label class="col-xs-offset-1" for="docPath">Ruta aos documentos</label>
                <div class="input-group col-xs-offset-1 col-xs-10">
                    <input type="text" class="form-control" id="docPath" aria-describedby="openFile" disabled>
                    <span class="input-group-addon btn btn-default" id="openFile">...</span>
                </div>
                </div>
            </div>

            <div class="row">
                <hr>
            </div>
            -->



            <div class="row">
            <div class="col-xs-offset-1 col-xs-10" style="padding-right: 0px; padding-left: 0px;">
            <form class="form-horizontal">
                <div class="panel panel-primary">
                    <div class="panel-heading">Base de dados</div>
                        <div class="panel-body">
                            <div id="db-msgs" class="panel hidden">
                                <div class="panel-heading">Erro de Base de dados</div>
                                <div class="panel-body">
                                    Error que tega
                                </div>
                            </div>
                        <div>

                        <div class="row panel-equal-height">
                            <div class="col-xs-6">
                                <div class="panel panel-default">
                                    <div class="panel-heading">Exportação de dados</div>
                                    <div class="panel-body">
                                        <span id="dump" class="btn btn-primary" style="margin-bottom: 20px;">Exportar</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-6">
                                <div class="panel panel-default">
                                    <div class="panel-heading">Importação de dados</div>
                                    <div class="panel-body">
                                        <span id="restore" class="btn btn-primary" style="margin-bottom: 20px;">Importar</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </form>
            </div>
            </div>


            </div> <!-- /modal-body -->
        </div>
        </div>
      </div>
    `,

    events: {
        // 'click #openFile': 'openFile',
        "click #restore": "restore",
        "click #dump": "dump",
    },

    initialize: function(options) {
        this.options = options || {};
        this.template = _.template(this.html);
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    show: function() {
        $(document.body).append(this.render().el);

        var self = this;
        this.$(".modal").on("hide.bs.modal", function() {
            self.s.save(null);
        });
        this.$(".modal").on("hidden.bs.modal", function() {
            self._close();
        });
        this.s = new Backbone.SIXHIARA.Setting();
        this.s.fetch({
            success: function() {
                self.setValue();
                self.$(".modal").modal("show");
            },
        });
    },

    _close: function() {
        this.$(".modal").unbind();
        this.$(".modal").remove();
        this.remove();
    },

    // openFile: function() {
    //    const {dialog} = nodeRequire('electron').remote;
    //     var file = dialog.showOpenDialog({
    //         properties: [ 'openDirectory' ],
    //         defaultPath: this.s.get('docPath'),
    //     });
    //
    //     if (file) {
    //         this.s.set('docPath', file[0]);
    //         this.setValue();
    //     }
    // },

    setValue: function() {
        // var docPath = this.s.get('docPath');
        // this.$('#docPath').val(docPath);
    },

    restore: function() {
        const {dialog} = nodeRequire("electron").remote;

        var file = dialog.showOpenDialog({
            filters: [{name: ".dump", extensions: ["dump"]}],
            properties: ["openFile"],
        });

        if (file && file.length) {
            if (file[0].slice(-4) !== "dump") {
                this.$(".modal").modal("hide");
                bootbox.alert("O arquivo deve ter uma extensão .dump");
                return;
            }
            document.body.style.cursor = "wait";
            $.getJSON("/api/db/restore", {file: file[0]})
                .done(function(data) {
                    bootbox.alert("Banco de dados restaurado com sucesso");
                    window.location.reload(true);
                })
                .fail(function(data) {
                    bootbox.alert(
                        '<h1 style="color:red">Erro</h1><br><br>' +
                            JSON.stringify(data.responseJSON.error)
                    );
                })
                .always(function() {
                    document.body.style.cursor = "default";
                });
        }
    },

    dump: function() {
        document.body.style.cursor = "wait";
        $.getJSON("/api/db/dump")
            .done(function(data) {
                bootbox.alert("O arquivo está em:<br><br>" + data.file);
            })
            .fail(function(data) {
                bootbox.alert(
                    '<h1 style="color:red">Erro</h1><br><br>' +
                        JSON.stringify(data.responseJSON.error)
                );
            })
            .always(function() {
                document.body.style.cursor = "default";
            });
    },
});
