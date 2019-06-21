Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.Fonte = Backbone.Model.extend({
    dateFields: ["d_dado"],

    defaults: {
        id: null,
        tipo_agua: null,
        tipo_fonte: null,
        cadastro: null,
        disp_a: null,
        lat_lon: null,
        d_dado: null,
        c_soli: null,
        c_max: null,
        c_real: null,
        sist_med: null,
        metodo_est: null,
        observacio: null,
    },
});
