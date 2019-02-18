Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.EstadoRenovacao = Backbone.UILib.Domain.extend({

    urlRoot: '/api/domains/licencia_estado_renovacao',

    defaults: {
        'category': 'licencia_estado_renovacao',
        'alias':    '',
        'text':     '',
        'order':    0,
        'parent':   null,
    }
});

Backbone.SIXHIARA.EstadoRenovacao.LICENSED = 'Licenciada';
Backbone.SIXHIARA.EstadoRenovacao.DE_FACTO = 'Utente de facto';
Backbone.SIXHIARA.EstadoRenovacao.IRREGULAR = 'Irregular';
Backbone.SIXHIARA.EstadoRenovacao.PENDING_RENOV_LICENSE = 'Pendente Renovação da licença (DA)';
Backbone.SIXHIARA.EstadoRenovacao.PENDING_REVIEW_DIR = 'Pendente Revisão Renovação (Direcção)';
Backbone.SIXHIARA.EstadoRenovacao.PENDING_REVIEW_DJ = 'Pendente Análise Renovação Licença (DJ)';
Backbone.SIXHIARA.EstadoRenovacao.PENDING_TECH_DECISION = 'Pendente Parecer Técnico Renovação (DT)';
Backbone.SIXHIARA.EstadoRenovacao.PENDING_EMIT_LICENSE = 'Pendente Emisão Renovação Licença (DJ)';
Backbone.SIXHIARA.EstadoRenovacao.PENDING_DADOS_LICENSE = 'Pendente Dados Renovação Licença (DJ)';
Backbone.SIXHIARA.EstadoRenovacao.PENDING_DIR_SIGN = 'Pendente Firma Renovação Licença (Direcção)';

Backbone.SIXHIARA.EstadoRenovacao.NOT_APPROVED = 'Não aprovada';
Backbone.SIXHIARA.EstadoRenovacao.INCOMPLETE_DA =  'Documentação incompleta (Pendente utente - DA)';
Backbone.SIXHIARA.EstadoRenovacao.INCOMPLETE_DIR = 'Documentação incompleta (Pendente utente - Direcção)';
Backbone.SIXHIARA.EstadoRenovacao.INCOMPLETE_DJ =  'Documentação incompleta (Pendente utente - DJ)';
Backbone.SIXHIARA.EstadoRenovacao.INCOMPLETE_DT =  'Documentação incompleta (Pendente utente - DT)';
