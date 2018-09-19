function Workbook() {
    if(!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
};

Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ButtonExportXLSView = Backbone.View.extend({
    /* http://sheetjs.com/demos/Export2Excel.js */

    events: {
        "click #export-button-xls": "exportXLS",
    },

    initialize: function(options) {
        this.options = options || {};
    },

    render: function() {
        this.$el.append($('<button id="export-button-xls" type="button" class="btn btn-default btn-sm">XLS</button>'));
    },

    getInnerValue: function(obj, key) {
        if (typeof key === 'function') {
            return key(obj);
        }
        return key.split(".").reduce(function(o, x) {
            return (typeof o == "undefined" || o === null) ? o : o[x];
        }, obj);
    },

    getData: function(collection, sheet) {
        var self = this;
        var data = []
        data.push(SIXHIARA.xlsFieldsToExport[sheet].map(function(e){ return e.header }));
        collection.forEach(function(item) {
            var dataRow = SIXHIARA.xlsFieldsToExport[sheet].map(function(field) {
                return self.getInnerValue(item.toJSON(), field.value)
            });
            data.push(dataRow);
        });
        return data;
    },

    exportXLS: function(evt){
        var file = 'exploracaos.xlsx';
        if (!file) return;

        var exploracaos = this.options.listView.collection.sortBy(function(exp){
            return exp.get('utente').get('nome');
        });

        var dataExploracaos = this.getData(exploracaos, 'exploracaos');

        var wb = new Workbook();
        var wsExploracaos = this.sheet_from_array_of_arrays(dataExploracaos);

        /* add ranges to worksheet */
        /* ws['!merges'] = ranges; */

        /* add worksheet to workbook */
        var ws_name = "Explorações";

        wb.SheetNames.push(ws_name);
        wb.Sheets[ws_name] = wsExploracaos;

        if (SIRHA.ARA === 'DPMAIP') {

            // filter by actividade Piscicultura
            var exploracaosFiltered = _.filter(exploracaos, function(exp){
                    return exp.get('actividade').get('tipo') === 'Piscicultura';
            });

            var tanques = [];
            exploracaosFiltered.forEach(function(exp) {
                exp.get('actividade').get('tanques_piscicolas').forEach(function(tanque) {
                    tanque.set('utente', exp.get('utente').get('nome'));
                    tanque.set('exp_id', exp.get('exp_id'));
                    tanques.push(tanque);
                });
            });

            var dataTanques = this.getData(tanques, 'tanques');

            // add a new sheet
            var ws_name = "Tanques";
            wb.SheetNames.push(ws_name);

            var wsTanques = this.sheet_from_array_of_arrays(dataTanques);
            wb.Sheets[ws_name] = wsTanques;
        }

        var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:false, type: 'binary'});
        saveAs(new Blob([this.s2ab(wbout)],{type:"application/octet-stream"}), file);

    },

    sheet_from_array_of_arrays: function(data, opts) {
        var ws = {};
        var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
        for(var R = 0; R != data.length; ++R) {
            for(var C = 0; C != data[R].length; ++C) {
                if(range.s.r > R) range.s.r = R;
                if(range.s.c > C) range.s.c = C;
                if(range.e.r < R) range.e.r = R;
                if(range.e.c < C) range.e.c = C;
                var cell = {v: data[R][C] };
                if(cell.v == null) continue;
                var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

                if(typeof cell.v === 'number') cell.t = 'n';
                else if(typeof cell.v === 'boolean') cell.t = 'b';
                else if(cell.v instanceof Date) {
                    cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                    cell.v = this.datenum(cell.v);
                }
                else cell.t = 's';

                ws[cell_ref] = cell;
            }
        }
        if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
        return ws;
    },

    datenum: function(v, date1904) {
        if(date1904) v+=1462;
        var epoch = Date.parse(v);
        return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
    },

    s2ab: function(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    },


});
