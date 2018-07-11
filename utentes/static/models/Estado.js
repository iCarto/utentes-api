Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.Estado = Backbone.UILib.Domain.extend({

    urlRoot: '/api/domains/licencia_estado',

    defaults: {
        'category': 'licencia_estado',
        'alias':    '',
        'text':     '',
        'order':    0,
        'parent':   'precampo',
    }
});

Backbone.SIXHIARA.Estado.LICENSED = 'Licenciada';
Backbone.SIXHIARA.Estado.DE_FACTO = 'Utente de facto';
Backbone.SIXHIARA.Estado.IRREGULAR = 'Irregular';
Backbone.SIXHIARA.Estado.PENDING_REVIEW_DIR = 'Pendente Revisão Pedido Licença (Direcção)';
Backbone.SIXHIARA.Estado.PENDING_REVIEW_DJ = 'Pendente Análise Pedido Licença (DJ)';
Backbone.SIXHIARA.Estado.PENDING_FIELD_VISIT = 'Pendente Visita Campo (DT)';
Backbone.SIXHIARA.Estado.PENDING_TECH_DECISION = 'Pendente Parecer Técnico (DT)';
Backbone.SIXHIARA.Estado.PENDING_EMIT_LICENSE = 'Pendente Emisão Licença (DJ)';
Backbone.SIXHIARA.Estado.PENDING_DIR_SIGN = 'Pendente Firma Licença (Direcção)';

Backbone.SIXHIARA.Estado.NOT_EXISTS = 'Não existe';
Backbone.SIXHIARA.Estado.UNKNOWN = 'Desconhecido';
Backbone.SIXHIARA.Estado.NOT_APPROVED = 'Não aprovada';
Backbone.SIXHIARA.Estado.INCOMPLETE_DA = 'Documentação incompleta (Pendente utente - DA)';
Backbone.SIXHIARA.Estado.INCOMPLETE_DIR = 'Documentação incompleta (Pendente utente - Direcção)';
Backbone.SIXHIARA.Estado.INCOMPLETE_DJ = 'Documentação incompleta (Pendente utente - DJ)';
Backbone.SIXHIARA.Estado.INCOMPLETE_DT = 'Documentação incompleta (Pendente utente - DT)';
Backbone.SIXHIARA.Estado.INCOMPLETE_DF = 'Documentação incompleta (Pendente utente - DF)';

Backbone.SIXHIARA.Estado.CATEGORY_POST_LICENSED = [
    Backbone.SIXHIARA.Estado.LICENSED, Backbone.SIXHIARA.Estado.IRREGULAR, Backbone.SIXHIARA.Estado.DE_FACTO
];
