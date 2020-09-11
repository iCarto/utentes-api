Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.Fonte = Backbone.Model.extend({
    dateFields: ["d_dado"],

    defaults: {
        id: null,
        tipo_agua: null,
        tipo_fonte: null,
        cadastro: null,
        red_monit: null,
        d_dado: null,
        bombeo: null,
        lat_lon: null,
        sist_med: null,
        metodo_est: null,
        c_max: null,
        prof_pozo: null,
        diametro: null,
        disp_a: null,
        c_soli: null,
        c_real: null,
        observacio: null,
    },
});
