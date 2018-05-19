Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.NavBarView = Backbone.View.extend({

    html:`
        <nav class="navbar navbar-static-top">
            <div class="container-fluid">
                <div class="navbar-header">
                    <img class="navbar-brand" src="/static/img/logo.png" alt="Logo" />
                </div>

                <ul class="nav navbar-nav">
                    <li><a id="earch" href="exploracao-search.html">
                        <strong>EXPLORAÇÕES</strong>
                    </a></li>
                    <li><a id="utentes" href="utentes.html">
                        <strong>UTENTES</strong>
                    </a></li>
                    <li><a id="requerimento-new" href="requerimento-new.html">
                        <strong>CRIAR</strong>
                    </a></li>

                    <li><a id="facturacao" href="facturacao.html">
                        <strong>FACTURAÇÃO</strong>
                    </a></li>

                    <li><a id="requerimento-pendente" href="requerimento-pendente.html">
                        <strong>PENDENTES</strong>
                    </a></li>

                    <li><a id="search-all" href="exploracao-search.html?all">
                        <strong>TODAS</strong>
                    </a></li>

                    <li id="nav-adicionar" class="dropdown uilib-enability uilib-show-role-administrador uilib-show-role-tecnico">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
                           aria-expanded="false"><strong>ADICIONAR <span class="caret"></span></strong></a>
                        <ul class="dropdown-menu">
                          <li><a id="new" href="exploracao-new.html"><strong>EXPLORAÇAO</strong></a></li>
                          <li><a id="gps" href="exploracao-gps.html"><strong>XEOMETRÍA</strong></a></li>
                        </ul>
                    </li>
                </ul>


                <ul class="nav navbar-nav navbar-right">
                    <li id="nav-admin" class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
                           aria-expanded="false"><span id="user-info">Utilizador</span> <span class="caret"></span></a>
                        <ul class="dropdown-menu">
                          <li><a id="user-info-link" href="/utilizador">Perfil</a></li>
                          <li class="uilib-enability uilib-show-role-administrador"><a href="/utilizadores">Utilizadores</a></li>
                          <li id="settings" class="uilib-enability uilib-show-role-administrador"><a href="#">
                            Configuração <i class="fa fa-cog"></i>
                          </a></li>
                          <li role="separator" class="divider"></li>
                          <li class="dropdown-header"></li>
                          <li><a href="/logout">Cerrar Sesión</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav`,

    initialize: function(options) {
        this.options = options || {};
        this.template = _.template(this.html);
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        var active = window.location.href.split('/').splice(-1)[0];
        // var active = window.location.pathname.split("/").pop();
        this.$('a[href="' + active + '"]').addClass('active');
        return this;
    },

});
