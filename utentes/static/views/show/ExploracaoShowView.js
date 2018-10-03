Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ExploracaoShowView = Backbone.View.extend({

    initialize: function(){

        // in this view, all WidgetsView would display '-' as nullValues,
        // unless it is set otherwise in a specific WidgetsView
        Backbone.UILib.WidgetsView.prototype.displayNull = function(name){
            return '-';
        }

        this.subViews = [];
    },

    render: function(){

        var view = this;
        var exploracao = this.model;

        var domains = new Backbone.UILib.DomainCollection();
        domains.fetch({
            success: function(collection, response, options) {

                // TODO. Do not hide this here
                if (estados.getARA() === 'ARAS') {
                    var actualState = domains.where({'text':view.model.get('estado_lic')})[0];
                    domains.forEach(function(d){
                        if (d.get('category') === 'licencia_estado') {
                            if (actualState.get('parent') === 'post-licenciada') {
                                if (d.get('parent') !== 'post-licenciada') {
                                    d.set('category', 'ignore', {silent: true});
                                }
                            } else {
                                if (d.get('text') !== actualState.get('text')) {
                                    d.set('category', 'ignore', {silent: true});
                                }
                            }
                        }
                    });
                }


                view.listenTo(exploracao, 'aChangeHappens', function(){
                    this.$('menu a').not('.dropdown-toggle').on('click', function(evt){
                        var refreshConfirmation = confirm('Hai mudanzas sem gravar. ¿Deseja sair igualmente?');
                        if (!refreshConfirmation) {
                            evt.preventDefault();
                        }
                    })
                });

                /** Buttons View are here, because after the domains are loaded,
                'change' events are triggered in the model. If a button like refresh
                is listening it to be enabled, we must wait here **/
                var openDocumentsView = new Backbone.SIXHIARA.ButtonOpenDocumentsView({
                    el: $('#documentos'),
                    model: exploracao,
                    openDefaultRoot: true,
                });
                view.subViews.push(openDocumentsView);

                // TODO: do not listen to events if button is disabled
                var buttonSaveView = new Backbone.SIXHIARA.ButtonSaveView({
                    el: $('#save-button'),
                    model: exploracao
                });
                view.subViews.push(buttonSaveView);

                var buttonDeleteView = new Backbone.SIXHIARA.ButtonDeleteView({
                    el: $('#delete-button'),
                    model: exploracao
                });
                view.subViews.push(buttonDeleteView);

                var buttonRefreshView = new Backbone.SIXHIARA.ButtonRefreshView({
                    el: $('#refresh-button'),
                    model: exploracao
                });
                view.subViews.push(buttonRefreshView);
            },
            error: function () {
                // TODO: show message to user
                console.error('could not get domains from API');
            }
        });

        var blockMapView = new Backbone.SIXHIARA.BlockMapView({
            model: exploracao
        });
        this.subViews.push(blockMapView);

        var blockInfoView = new Backbone.SIXHIARA.BlockInfoView({
            el: $('#block-info'),
            model: exploracao,
            domains: domains,
        }).render();
        this.subViews.push(blockInfoView);

        var blockLocationView = new Backbone.SIXHIARA.BlockLocationView({
            el: $('#block-location'),
            model: exploracao,
            domains: domains,
        }).render();
        this.subViews.push(blockLocationView);

        var blockUtenteView = new Backbone.SIXHIARA.BlockUtenteView({
            el: $('#block-utente'),
            model: exploracao,
        }).render();
        this.subViews.push(blockUtenteView);

        var blockActivityView = new Backbone.SIXHIARA.BlockActivityView({
            el: $('#block-activity'),
            model: exploracao,
            domains: domains,
        }).render();
        this.subViews.push(blockActivityView);

        var blockConsumosView = new Backbone.UILib.WidgetsView({
            el: $('#block-consumos'),
            model: exploracao
        }).render();
        blockConsumosView.listenTo(exploracao.get('fontes'), 'add destroy', blockConsumosView.render);
        blockConsumosView.listenTo(exploracao, 'change', blockConsumosView.render);
        this.subViews.push(blockConsumosView);

        var blockSuperficialView = new Backbone.SIXHIARA.BlockLicenseView({
            el: $('#block-superficial'),
            model: exploracao,
            domains: domains,
            tipo_agua: 'Superficial',
        }).render();
        this.subViews.push(blockSuperficialView);

        var blockSubterraneaView = new Backbone.SIXHIARA.BlockLicenseView({
            el: $('#block-subterranea'),
            model: exploracao,
            domains: domains,
            tipo_agua: 'Subterrânea',
        }).render();
        this.subViews.push(blockSubterraneaView);

        var blockFontesView = new Backbone.SIXHIARA.BlockFontesView({
            el: $('#block-fontes'),
            collection: exploracao.get('fontes'),
            domains: domains,
        }).render();
        this.subViews.push(blockFontesView);

        return this;
    },

    remove: function () {
        Backbone.View.prototype.remove.call(this);
        _.invoke(this.subViews, 'remove');
    }

});
