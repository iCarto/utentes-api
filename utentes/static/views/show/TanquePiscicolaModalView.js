Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.TanquePiscicolaModalView = Backbone.SIXHIARA.ModalView.extend({

    customConfiguration: function() {
        new Backbone.UILib.SelectView({
            el: this.$('#tipo'),
            collection: this.options.domains.byCategory('tanque_piscicola_tipo')
        }).render();

        new Backbone.UILib.SelectView({
            el: this.$('#estado'),
            collection: this.options.domains.byCategory('tanque_piscicola_estado')
        }).render();

        var checkboxList_esp_culti = new Backbone.SIXHIARA.CheckBoxList({
            model: this.widgetModel,
            model_attr_name: 'esp_culti',
            el: this.$('.modal').find('#esp_culti'),
            enable_others: {
                'childId': 'esp_cul_o',
                'enabledValues': 'Outros',
            }
        }).render();

        var checkboxList_prov_alev = new Backbone.SIXHIARA.CheckBoxList({
            model: this.widgetModel,
            model_attr_name: 'prov_alev',
            el: this.$('.modal').find('#prov_alev'),
            enable_others: {
                'childId': 'prov_al_o',
                'enabledValues': 'Outros',
            }
        }).render();

        new Backbone.UILib.SelectView({
            el: this.$('#fert_agua'),
            collection: this.options.domains.byCategory('tanque_piscicola_fert_agua')
        }).render();

        var checkboxList_tipo_alim = new Backbone.SIXHIARA.CheckBoxList({
            model: this.widgetModel,
            model_attr_name: 'tipo_alim',
            el: this.$('.modal').find('#tipo_alim'),
            enable_others: {
                'childId': 'tipo_al_o',
                'enabledValues': 'Outros',
            }
        }).render();

        var inputFertAguaOutros = this.$("#fert_a_o");
        if (this.widgetModel.get("fert_agua")==="Outros"){
            inputFertAguaOutros.prop("disabled", false);
        }
        this.listenTo(this.widgetModel, "change:fert_agua", function(model, value, options){
            if (value==="Outros") {
                inputFertAguaOutros.prop("disabled", false);
            } else {
                model.set('fert_a_o', null);
                inputFertAguaOutros[0].value = null;
                inputFertAguaOutros.prop("disabled", true);
            }
        });

        this.confUpdateAreaVol();
        this.confUpdateProdAnu();
    },

    confUpdateAreaVol: function() {
        var inputArea = this.$("#area");
        var inputVolume = this.$("#volume");
        var cumprimen_exist = false;
        var largura_exist = false;
        var profundid_exist = false;
        this.listenTo(this.widgetModel, "change:cumprimen", function(model, value, options){
            if (value===null){
                cumprimen_exist = false;
            } else {
                cumprimen_exist = true;
            }
        });
        this.listenTo(this.widgetModel, "change:largura", function(model, value, options){
            if (value===null){
                largura_exist = false;
            } else {
                largura_exist = true;
            }
        });
        this.listenTo(this.widgetModel, "change:profundid", function(model, value, options){
            if (value===null){
                profundid_exist = false;
            } else {
                profundid_exist = true;
            }
        });
        this.listenTo(this.widgetModel, "change:cumprimen change:largura change:profundid", function(model, value, options){
            var actualValueArea = this.widgetModel.get('area');
            var actualValueVolume = this.widgetModel.get('volume');
            inputVolume.prop("disabled", false);
            inputArea.prop("disabled", false);
            if (cumprimen_exist && largura_exist && profundid_exist){
                inputVolume.val(formatter().formatNumber(actualValueVolume, '0[.]00'));
                inputArea.val(formatter().formatNumber(actualValueArea, '0[.]00'));

            } else if (cumprimen_exist && largura_exist) {
                inputArea.val(formatter().formatNumber(actualValueArea, '0[.]00'));
                inputVolume.val(null);
            } else {
                inputArea.val(null);
                inputVolume.val(null);
            }
        });
    },

    confUpdateProdAnu: function() {
        var inputProAnual = this.$("#pro_anual");
        var consumo_exist = false;
        var venda_exist = false;
        this.listenTo(this.widgetModel, "change:venda", function(model, value, options){
            if (value===null){
                venda_exist = false;
            } else {
                venda_exist = true;
            }
        });
        this.listenTo(this.widgetModel, "change:consumo", function(model, value, options){
            if (value===null){
                consumo_exist = false;
            } else {
                consumo_exist = true;
            }
        });
        this.listenTo(this.widgetModel, "change:venda change:consumo", function(model, value, options){
            var actualValueProAnual = this.widgetModel.get('pro_anual');
            inputProAnual.prop("disabled", false);
            if (venda_exist && consumo_exist) {
                inputProAnual.val(formatter().formatNumber(actualValueProAnual, '0[.]00'));
            } else {
                inputProAnual.val(null);
            }
        });
    },

    okButtonClicked: function(){
        if(this.isSomeWidgetInvalid()) return;
        Backbone.SIXHIARA.ModalView.prototype.okButtonClicked.call(this);
    },

    isSomeWidgetInvalid: function () {
        // we only use Constraint API with input elements, so check only those
        var widgets = this.$('.modal').find('input.widget, input.widget-number, input.widget-date, select.widget');
        var someInvalid = false;
        widgets.each(function (index, widget) {
            if(!widget.validity.valid) {
                someInvalid = true;
            }
        });
        return someInvalid;
    },

});
