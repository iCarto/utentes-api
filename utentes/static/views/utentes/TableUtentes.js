Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.TableUtentes = Backbone.View.extend({


    template: '<table class="table table-bordered table-hover"> <thead style="display: table-header-group;">  <tr id="header"> </tr> </thead> <tfoot style="display: table-header-group;"> <tr id="column-filter"> </tr> </tfoot> <tbody> </tbody> </table>',

    initialize: function(options){
        this.options = options || {};
        this.collection.on('reset', this.reset, this);
        this.columnNames = this.options.columnNames;
        this.columnTitles = this.options.columnTitles;
        this.formatValue = this.options.formatValue;
        this.customFiltering = this.options.customFiltering || [];
        this.colReorderOptions = this.options.colReorderOptions || false;
        this.columnsWithOutTitle = this.options.columnsWithOutTitle || [];

    },

    reset: function() {
        this.unrender();
        this.render();
    },

    unrender: function() {
        if (this.table) {
            this.table.destroy('true')
        }
        this.$el.empty();
    },

    render: function() {
        this.createHtmlTable();
        this.createDataTable();
        this.custom();
        wf.disabledWidgets();
    },

    createHtmlTable: function() {
        this.$el.append($(this.template));
        var trHeader = this.$el.find('table > thead #header');
        var trFilter = this.$el.find('table > tfoot #column-filter');
        var self = this;

        _.each(this.columnNames, function(v) {
            if (self.columnsWithOutTitle.indexOf(v) !== -1) {
                trHeader.append($('<th> </th>'));
                trFilter.append($('<th> </th>'));
            } else {
                var columnTitle = self.columnTitles[v];
                var s = '<th>' + columnTitle + '</th>';
                trHeader.append($(s));
                trFilter.append($('<th><input type="text" placeholder="'+ columnTitle +'" /></th>'));
            }

        });

        this.collection.forEach(this.appendRow, this);
    },

    appendRow: function(rowData){
        // FIXME. http://datatables.net/reference/option/rowId
        var s = '<tr id="gid-' + rowData.id + '">';
        var self = this;
        _.each(this.columnNames, function(field) {
            var v = rowData.get(field);
            v = self.formatValue(field, v, rowData);
            if (v !== null) {
                s += '<td>' + v + '</td>'
            }

        });

        s += '</tr>'
        $('tbody', this.el).append($(s));
    },

    createDataTable: function() {
        var self = this;
        var dataTableOptions = {
            dom: 'R<"#table-toolbar"l<"pull-left"i>>rtp',
            language: self.language,
            scrollx: false,
        };

        // FIXME. Introduce how to pass from the caller all posible options
        // of datatables
        var columnDefs = this.options.columnDefs || [];
        this.columnsWithOutTitle.forEach(function(column) {
            var idx = self.columnNames.indexOf(column)
            columnDefs.push({ "orderable": false, "targets": idx });
        });
        if (! _.isEmpty(columnDefs)) {
            dataTableOptions['columnDefs'] = columnDefs;
        }

        this.table = this.$('table').DataTable(dataTableOptions);

        /*
        If colReorder is set when a column is moved the search function must be
        reinitilized
        */
        if (this.colReorderOptions) {
            new $.fn.dataTable.ColReorder( this.table, {
                'reorderCallback': function () {
                    self.table.columns({order:'applied'}).eq(0).each(function(colIdx) {
                        self.table.column(colIdx).search('');
                        $('input', self.table.column(colIdx).footer()).unbind().val('').on('keyup change',function(){
                            self.table.column(colIdx).search(this.value).draw();
                        });
                    });
                    // self.table.search('');
                    self.table.draw();
                }
            });
        }

        this.table.columns().eq(0).each(function(colIdx) {
            $('input', self.table.column(colIdx).footer()).on('keyup change',function(){
                self.table.column(colIdx).search(this.value).draw();
            });
        });

        // http://datatables.net/examples/plug-ins/range_filtering.html
        // Allows combine DataTable filters with external filters
        this.customFiltering.forEach(function(customFilter){
            $.fn.dataTable.ext.search.push(customFilter);
        });
    },

    custom: function() {
        var self = this;
        $('.dataTables_length').append($('<button id="create-button" type="button" class="btn btn-primary col-xs-1 pull-right  uilib-enability uilib-show-role-administrador uilib-show-role-tecnico">Criar</button>'));
        $('#create-button').on('click', function(){
            var utente = new Backbone.SIXHIARA.Utente();
            self.renderModal(utente);
        });

        $('#the_utentes_table table').on('click', 'i.delete', function() {
            // table.row ( rowSelector ) http://datatables.net/reference/type/row-selector
            var id = self.table.row(this.parentElement).id().split('-')[1];
            var u = self.collection.filter({id:parseInt(id)})[0];

            bootbox.confirm('Tem certeza de que deseja excluir a utente e as exploracaos asociadas: <br><strong>' + u.get('nome') + '</strong>', result => {
                if (result) {
                    u.destroy({
                        wait: true,
                        success: function(model, resp, options) {
                            self.reset();
                        },
                        error: function(xhr, textStatus, errorThrown) {
                            alert(textStatus.statusText);
                        }
                    });
                }
            });
        });


        $('#the_utentes_table table').on('click', 'i.edit', function() {
            // table.row ( rowSelector ) http://datatables.net/reference/type/row-selector
            var id = self.table.row(this.parentElement).id().split('-')[1];
            var utente = self.collection.filter({id:parseInt(id)})[0];
            self.renderModal(utente);
        });

    },

    renderModal: function(utente) {

        // override default action for okButtonClicked
        var self = this;
        var UtenteModal = Backbone.UILib.ModalView.extend({
            okButtonClicked: function () {
                if(this.isSomeWidgetInvalid()) return;
                var atts = this.draftModel.pick(this.getAttsChanged());
                this.model.set(atts);
                if(!this.model.isValid()){
                    bootbox.alert(this.model.validationError);
                    return;
                }

                // update in server
                var selfModal = this;
                self.collection.create(this.model, {
                    merge: true,
                    wait: true,
                    success: function(model, resp, options) {
                        selfModal.$('.modal').modal('hide');
                        self.reset();
                    },
                    error: function(xhr, textStatus, errorThrown) {
                        if (textStatus && textStatus.responseJSON && textStatus.responseJSON.error) {
                            bootbox.alert(textStatus.responseJSON.error.join('\n'));
                        } else {
                            bootbox.alert(textStatus.statusText);
                        }
                    }
                });
            }
        });

        var modalView = new UtenteModal({
            model: utente,
            selectorTmpl: '#block-utente-modal-tmpl'
        });

        // connect auxiliary views
        var selectLocationView = new Backbone.SIXHIARA.SelectLocationView({
            el: $('#editUtenteModal'),
            model: modalView.draftModel,
            domains: this.options.domains,
            domainsKeys: ['utentes-provincia', 'utentes-distrito', 'utentes-posto'],
        }).render();
        modalView.addAuxView(selectLocationView);

        var selectUtenteTipo = new Backbone.UILib.SelectView({
            el: $('#uten_tipo'),
            collection: this.options.domains.byCategory('utentes_uten_tipo')
        }).render();
        modalView.addAuxView(selectUtenteTipo);


        modalView.render();
    },

    language: {
        "sProcessing":     "A processar...",
        "sLengthMenu":     "Mostrar _MENU_ registos",
        "sZeroRecords":    "Não foram encontrados resultados",
        "sEmptyTable":     "Não há dados disponíveis sobre esta tabela",
        // "sInfo":           "Mostrando registros del _START_ al _END_ de um total de _TOTAL_ registros",
        "sInfo":           "_START_/_END_ de _TOTAL_",
        "sInfoEmpty":      "0/0 de 0",
        "sInfoFiltered":   "(filtrado de _MAX_ registos no total)",
        "sInfoPostFix":    "",
        "sSearch":         "Procurar::",
        "sUrl":            "",
        "sInfoThousands":  ",",
        "sLoadingRecords": "Cargando...",
        "oPaginate": {
            "sFirst":    "Primeiro",
            "sLast":     "Último",
            "sNext":     "Seguinte",
            "sPrevious": "Anterior"
        },
        "oAria": {
            "sSortAscending":  ": Para classificar a coluna em ordem crescente",
            "sSortDescending": ": Para classificar a coluna em ordem decrescente",
        },
    },


});
