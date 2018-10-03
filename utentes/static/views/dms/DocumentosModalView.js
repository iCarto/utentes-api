Backbone.DMS = Backbone.DMS || {};
Backbone.DMS.DocumentosModalView = Backbone.DMS.FileModalView.extend({

    events: {
        'click #uploadPanelButton': 'uploadPanelButtonClicked',
        'click #downloadPanelButton': 'downloadPanelButtonClicked',
    },

    navbarTemplate:  _.template(
            '<ul class="nav nav-pills nav-stacked">' +
                '<%if (departamento) {%><li id="uploadPanelButton" class="active"><i class="fa fa-cloud-upload"></i><h3><%=departamento%></h3><span>(Acrescentar Doc.)</span></li><%}%>' +
                '<li id="downloadPanelButton" <%if (!departamento) {%>class="active"<%}%>><i class="fa fa-download"></i><h3>Doc. Geral</h3><span>(Navegaçao e Descarga)</span></li>' +
            '</ul>'),

    initialize: function(options) {
        this.options = options || {};
        var exploracao = options.exploracao;
        this.model = new Backbone.DMS.DepartamentoFolder({
            'exploracao_id': exploracao.get('id'),
            'exploracao': exploracao.get('exp_id'),
            'utente': exploracao.get('utente').get('nome'),
            'departamento': this.getDefaultDepartamento()
        });
        this.reviewPermissionUpload();
        this.listenTo(this.model, 'change:name', this.reviewPermissionUpload);
    },

    uploadPanelButtonClicked: function() {
        this.model.set('name', this.getDefaultDepartamento());
        this.model.fetchFileCollection();
        this.$el.find('nav li').removeClass('active');
        this.$el.find('#uploadPanelButton').addClass('active');
    },

    downloadPanelButtonClicked: function() {
        this.model.fetchExploracaoRoot();
        this.$el.find('nav li').removeClass('active');
        this.$el.find('#downloadPanelButton').addClass('active');
    },

    getDefaultDepartamento: function() {
        if(this.isAdminOrDirector()) {
            return null;
        }
        return wf.getRole();
    },

    reviewPermissionUpload: function() {
        var role = wf.getRole();
        var permissionUpload = (role === this.model.get('name'));
        if(this.isAdminOrDirector(role)) {
            permissionUpload = false;
        }
        this.model.set('permissionUpload', permissionUpload);
    },

    isAdminOrDirector(role) {
        if(!role) {
            role = wf.getRole();
        }
        return role === ROL_ADMIN || role === ROL_DIRECCION;
    }

});
