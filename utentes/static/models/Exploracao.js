Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.Exploracao = Backbone.GeoJson.Feature.extend({
    dateFields: ["d_soli", "d_ultima_entrega_doc"],

    urlRoot: Backbone.SIXHIARA.Config.apiExploracaos,

    defaults: {
        id: null,
        exp_id: null,
        exp_name: null,
        d_soli: null,
        d_ultima_entrega_doc: null,
        observacio: null,
        loc_provin: null,
        loc_distri: null,
        loc_posto: null,
        loc_nucleo: null,
        loc_endere: null,
        loc_unidad: null,
        loc_bacia: null,
        loc_subaci: null,
        loc_rio: null,
        cadastro_uni: null,
        c_soli: null,
        c_licencia: null,
        c_real: null,
        c_estimado: null,
        actividade: new Backbone.SIXHIARA.ActividadeNull(),
        area: null,
        geometry: null,
        utente: new Backbone.SIXHIARA.Utente(),
        licencias: new Backbone.SIXHIARA.LicenciaCollection(),
        fontes: new Backbone.SIXHIARA.FonteCollection(),
        facturacao: new Backbone.SIXHIARA.FacturaCollection(),
        geometry: new Backbone.Model(),
        geometry_edited: false,
        summary_pago_iva: null,
        carta_re: false,
        ficha_pe: false,
        ident_pro: false,
        certi_reg: false,
        duat: false,
        licen_am: false,
        mapa: false,
        licen_fu: false,
        rel_perf: false,
        b_a_agua: false,
        carta_re_v: false,
        ficha_pe_v: false,
        ident_pro_v: false,
        certi_reg_v: false,
        duat_v: false,
        licen_am_v: false,
        mapa_v: false,
        licen_fu_v: false,
        rel_perf_v: false,
        b_a_agua_v: false,
        anali_doc: false,
        soli_visit: false,
        p_unid: false,
        p_tec: false,
        doc_legal: false,
        p_juri: false,
        p_rel: false,
        req_obs: [
            {create_at: null, author: null, text: null, state: null},
            {create_at: null, author: null, text: null, state: null},
        ],
        created_at: null,
        estado_lic: SIRHA.ESTADO.UNKNOWN,
        lic_time_info: null,
        lic_time_enough: false,
        lic_time_warning: false,
        lic_time_over: false,
    },

    initialize: function() {
        // set some computed properties
        this.set("summary_licencia_val", this.updateSummaryEstado());
        this.set("summary_licencia_msg", "Licença");
        this.set("summary_consumo_val", this.updateSummaryConsumo());
        this.set("summary_consumo_msg", "Consumo");

        this.setLicenseTimeInfo();
        this.setListeners();
        this.on(
            "sync",
            function(model, response, options) {
                // TODO: on sync, how to off old listeners for licenses, if any?
                this.set("summary_licencia_val", this.updateSummaryEstado());
                this.set("summary_consumo_val", this.updateSummaryConsumo());
                this.set("summary_pago_iva", this.updateSummaryPagoIva());
                this.setLicenseTimeInfo();
                this.setListeners();
            },
            this
        );
    },

    setListeners: function() {
        var app = this;

        this.on("change:exp_id", function() {
            app.get("licencias").forEach(function(lic) {
                lic.set(
                    "lic_nro",
                    SIRHA.Services.IdService.calculateNewLicNro(
                        app.get("exp_id"),
                        lic.get("tipo_agua")
                    )
                );
            });
            if (app.getActividadeTipo() === "Agricultura de Regadio") {
                app.get("actividade")
                    .get("cultivos")
                    .forEach(function(cult) {
                        var oldId = cult.get("cult_id");
                        var newId =
                            app.get("exp_id") + oldId.substring(oldId.length - 4);
                        cult.set("cult_id", newId);
                    });
            }
            if (app.getActividadeTipo() === "Piscicultura") {
                app.get("actividade")
                    .get("tanques_piscicolas")
                    .forEach(function(tanque) {
                        var oldId = tanque.get("tanque_id");
                        var newId =
                            app.get("exp_id") + oldId.substring(oldId.length - 4);
                        tanque.set("tanque_id", newId);
                    });
            }
        });

        // licenses
        this.get("licencias").forEach(function(model) {
            model.on("change:c_soli_tot", app.updateCSoli, app);
            model.on("change:c_real_tot change:c_real_int", app.updateCReal, app);
            model.on("change:c_licencia", app.updateCLicencia, app);
            model.on("change:estado", app.updateSummaryEstado, app);
            model.on("change:pago_iva", app.updateSummaryPagoIva, app);
            // TODO: data should be shown as it is,
            // without updating computed properties first time
            app.updateCSoli();
            app.updateCReal();
            app.updateCLicencia();
            app.updateSummaryPagoIva();
        });
        this.get("licencias").on("add", function(model, collection, options) {
            model.on("change:c_soli_tot", app.updateCSoli, app);
            model.on("change:c_real_tot change:c_real_int", app.updateCReal, app);
            model.on("change:c_licencia", app.updateCLicencia, app);
            model.on("change:estado", app.updateSummaryEstado, app);
            model.on("change:pago_iva", app.updateSummaryPagoIva, app);
            // TODO: data should be shown as it is,
            // without updating computed properties first time
            app.updateCSoli();
            app.updateCReal();
            app.updateCLicencia();
            app.updateSummaryPagoIva();
        });
        this.get("licencias").on("remove", function(model, collection, options) {
            model.off("change:c_soli_tot", app.updateCSoli, app);
            model.off("change:c_real_tot change:c_real_int", app.updateCReal, app);
            model.off("change:c_licencia", app.updateCLicencia, app);
            model.off("change:estado", app.updateSummaryEstado, app);
            model.off("change:pago_iva", app.updateSummaryPagoIva, app);
            // TODO: data should be shown as it is,
            // without updating computed properties first time
            app.updateCSoli();
            app.updateCReal();
            app.updateCLicencia();
            app.updateSummaryPagoIva();
        });
        this.get("licencias").on("reset", function(collection, options) {
            collection.forEach(function(model) {
                model.on("change:c_soli_tot", app.updateCSoli, app);
                model.on("change:c_real_tot change:c_real_int", app.updateCReal, app);
                model.on("change:c_licencia", app.updateCLicencia, app);
                model.on("change:estado", app.updateSummaryEstado);
                model.on("change:pago_iva", app.updateSummaryPagoIva, app);
                // TODO: data should be shown as it is,
                // without updating computed properties first time
                app.updateCSoli();
                app.updateCReal();
                app.updateCLicencia();
                app.updateSummaryPagoIva();
            });
            collection.previousModels.forEach(function(model) {
                model.off("change:c_soli_tot", app.updateCSoli, app);
                model.off("change:c_real_tot", app.updateCReal, app);
                model.off("change:c_licencia", app.updateCLicencia, app);
                model.off("change:estado", app.updateSummaryEstado, app);
                model.off("change:pago_iva", app.updateSummaryPagoIva, app);
                // TODO: data should be shown as it is,
                // without updating computed properties first time
                app.updateCSoli();
                app.updateCReal();
                app.updateCLicencia();
                app.updateSummaryPagoIva();
            });
        });

        // fontes
        this.get("fontes").forEach(function(model) {
            model.on("change:c_soli", app.updateCSoliFon, app);
            model.on("change:c_real", app.updateCRealFon, app);
            // TODO: data should be shown as it is,
            // without updating computed properties first time
            app.updateCSoliFon();
            app.updateCRealFon();
            app.updateCSoli();
            app.updateCReal();
        });
        this.get("fontes").on("add", function(model, collection, options) {
            model.on("change:c_soli", app.updateCSoliFon, app);
            model.on("change:c_real", app.updateCRealFon, app);
            // TODO: data should be shown as it is,
            // without updating computed properties first time
            app.updateCSoliFon();
            app.updateCRealFon();
            app.updateCSoli();
            app.updateCReal();
        });
        this.get("fontes").on("remove", function(model, collection, options) {
            model.off("change:c_soli", app.updateCSoliFon, app);
            model.off("change:c_real", app.updateCRealFon, app);
            // TODO: data should be shown as it is,
            // without updating computed properties first time
            app.updateCSoliFon();
            app.updateCRealFon();
            app.updateCSoli();
            app.updateCReal();
        });
        this.get("fontes").on("reset", function(collection, options) {
            collection.forEach(function(model) {
                model.on("change:c_soli", app.updateCSoliFon, app);
                model.on("change:c_real", app.updateCRealFon, app);
                // TODO: data should be shown as it is,
                // without updating computed properties first time
                app.updateCSoliFon();
                app.updateCRealFon();
                app.updateCSoli();
                app.updateCReal();
            });
            collection.previousModels.forEach(function(license) {
                model.off("change:c_soli", app.updateCSoliFon, app);
                model.off("change:c_real", app.updateCRealFon, app);
                // TODO: data should be shown as it is,
                // without updating computed properties first time
                app.updateCSoliFon();
                app.updateCRealFon();
            });
        });

        // actividade
        this.get("actividade").on("change", app.updateCEstimado, app);
        this.on("change:actividade", app.changedActivity, app);

        this.once("change", app.aChangeHappens, app);
        this.get("utente").once("change", app.aChangeHappens, app);
        this.get("actividade").once("change", app.aChangeHappens, app);
        this.get("fontes").once("change", app.aChangeHappens, app);
        this.get("licencias").once("change", app.aChangeHappens, app);

        this.on(
            "change:c_licencia change:c_real change:c_estimado",
            app.updateSummaryConsumo
        );
    },

    changedActivity: function() {
        this.get("actividade").on("change", this.updateCEstimado, this);
        this.updateCEstimado();
    },

    updateCEstimado: function() {
        if (this.get("actividade")) {
            this.set("c_estimado", this.get("actividade").get("c_estimado"));
        }
    },

    updateCSoli: function() {
        this.set("c_soli", this.getCSoliTot());
    },

    getCSoliTot: function() {
        var c_soli = null;
        this.get("licencias").forEach(function(license) {
            c_soli += license.get("c_soli_tot");
        });
        return c_soli;
    },

    updateCSoliFon: function() {
        var c_soli_fon_sup = null;
        var c_soli_fon_sub = null;
        this.get("fontes")
            .where({tipo_agua: "Subterrânea"})
            .forEach(function(fonte) {
                c_soli_fon_sub += fonte.get("c_soli");
            });
        this.get("fontes")
            .where({tipo_agua: "Superficial"})
            .forEach(function(fonte) {
                c_soli_fon_sup += fonte.get("c_soli");
            });
        // TODO: how to choose the license between the possible list?
        var licSup = this.get("licencias").where({tipo_agua: "Superficial"})[0];
        if (licSup != null) {
            // this would trigger a recalculation of exploracao.c_soli
            licSup.set("c_soli_fon", c_soli_fon_sup);
        }
        var licSub = this.get("licencias").where({tipo_agua: "Subterrânea"})[0];
        if (licSub != null) {
            // this would trigger a recalculation of exploracao.c_soli
            licSub.set("c_soli_fon", c_soli_fon_sub);
        }
    },

    updateCReal: function() {
        this.set("c_real", this.getCRealTot());
    },

    getCRealTot: function() {
        var c_real = null;
        this.get("licencias").forEach(function(license) {
            c_real += license.get("c_real_int");
        });
        this.get("fontes").forEach(function(fonte) {
            c_real += fonte.get("c_real");
        });
        return c_real;
    },

    updateCRealFon: function() {
        var c_real_fon_sup = null;
        var c_real_fon_sub = null;
        this.get("fontes")
            .where({tipo_agua: "Subterrânea"})
            .forEach(function(fonte) {
                c_real_fon_sub += fonte.get("c_real");
            });
        this.get("fontes")
            .where({tipo_agua: "Superficial"})
            .forEach(function(fonte) {
                c_real_fon_sup += fonte.get("c_real");
            });
        // TODO: how to choose the license between the possible list?
        var licSup = this.get("licencias").where({tipo_agua: "Superficial"})[0];
        if (licSup != null) {
            // this would trigger a recalculation of exploracao.c_soli
            licSup.set("c_real_fon", c_real_fon_sup);
        }
        var licSub = this.get("licencias").where({tipo_agua: "Subterrânea"})[0];
        if (licSub != null) {
            // this would trigger a recalculation of exploracao.c_soli
            licSub.set("c_real_fon", c_real_fon_sub);
        }
    },

    updateCLicencia: function() {
        this.set("c_licencia", this.getCLicencia());
    },

    getCLicencia: function() {
        var c_lic = null;
        this.get("licencias").forEach(function(license) {
            c_lic += license.get("c_licencia");
        });
        return c_lic;
    },

    updateSummaryEstado: function() {
        var valid = this.get("licencias").some(function(lic) {
            return lic.isLicensed();
        });
        this.set("summary_licencia_val", valid);
        return valid;
    },

    updateSummaryConsumo: function() {
        var c_licencia = this.get("c_licencia"),
            c_real = this.get("c_real"),
            c_estimado = this.get("c_estimado"),
            valid = c_licencia >= c_real && c_licencia >= c_estimado;
        this.set("summary_consumo_val", valid);
        return valid;
    },

    updateSummaryPagoIva: function() {
        var summary_pago_iva = 0;
        this.get("licencias").forEach(function(lic) {
            summary_pago_iva += lic.get("pago_iva");
        });
        this.set("summary_pago_iva", summary_pago_iva);
        return summary_pago_iva;
    },

    urlShow: function() {
        return Backbone.SIXHIARA.Config.urlShow + this.id;
    },

    parse: function(response) {
        response = Backbone.SIXHIARA.Exploracao.__super__.parse.apply(this, arguments);

        if (_.has(response, "utente")) {
            response.utente = new Backbone.SIXHIARA.Utente(response.utente);
        }

        if (_.has(response, "licencias")) {
            response.licencias = new Backbone.SIXHIARA.LicenciaCollection(
                response.licencias,
                {parse: true}
            );
        }
        if (_.has(response, "fontes")) {
            response.fontes = new Backbone.SIXHIARA.FonteCollection(response.fontes, {
                parse: true,
            });
        }
        if (_.has(response, "renovacao")) {
            response.renovacao = new Backbone.SIXHIARA.Renovacao(response.renovacao, {
                parse: true,
            });
        }
        if (_.has(response, "facturacao")) {
            if (!this.get("facturacao")) {
                // si el objeto es nuevo entonces creamos una nueva colección
                response.facturacao = new Backbone.SIXHIARA.FacturaCollection(
                    response.facturacao,
                    {parse: true}
                );
            } else {
                // si el objeto ya es antiguo (es decir, viene de un "save"), entonces actualizamos la colección antigua
                // para poder seguir trabajando con ella en la vista
                var oldCollection = this.get("facturacao");
                var updatedFacturaArray = response.facturacao.map(
                    factura => new Backbone.SIXHIARA.Factura(factura)
                );
                oldCollection.set(updatedFacturaArray, {silent: true});
                response.facturacao = oldCollection;
            }
        }
        if (_.has(response, "actividade")) {
            if (response.actividade) {
                response.actividade = new Backbone.SIXHIARA.ActividadesFactory[
                    response.actividade.tipo
                ](response.actividade, {parse: true});
            } else {
                // Debería ser una factoría de verdad para evitar este if
                response.actividade = new Backbone.SIXHIARA.ActividadeNull();
            }
        }

        return response;
    },

    toJSON: function(options) {
        var attrs = Backbone.SIXHIARA.Exploracao.__super__.toJSON.apply(
            this,
            arguments
        );
        attrs.geometry = this.get("geometry") ? this.get("geometry").toJSON() : null;
        attrs.utente = this.get("utente").toJSON();
        attrs.licencias = this.get("licencias").toJSON();
        attrs.fontes = this.get("fontes").toJSON();
        if (this.get("renovacao")) {
            attrs.renovacao = this.get("renovacao").toJSON();
        }
        if (this.getActividadeTipo() === Backbone.SIXHIARA.MSG.NO_ACTIVITY) {
            attrs.actividade = null;
        } else {
            attrs.actividade = this.get("actividade").toJSON();
        }
        attrs.urlShow = this.urlShow();
        return attrs;
    },

    validate: function(attrs, options) {
        var messages = [];

        // exploracao rules
        var expValidator = validator(Object.assign([], EXPLORACAO_SCHEMA));

        expValidator.addRule("EXP_ID_FORMAT", {
            fails: SIRHA.Services.IdService.isNotValidExpId,
        });

        expValidator.addRule("ACTIVITY_NOT_NULL", {
            fails: function(value) {
                return (
                    value === null ||
                    value === undefined ||
                    value === "" ||
                    value.tipo === null ||
                    value.tipo === undefined ||
                    value.tipo === "" ||
                    value.tipo === Backbone.SIXHIARA.MSG.NO_ACTIVITY
                );
            },
        });

        if (this.validateFicha()) {
            expValidator.appendSchema(EXPLORACAO_SCHEMA_CON_FICHA);
        }
        expValidator.validate(this.toJSON()).forEach(function(msg) {
            messages.push(msg);
        });
        messages = messages.concat(this.validateActividade());
        messages = messages.concat(this.validateLicencia());

        // fonte rules
        var fonValidator = validator(FONTE_SCHEMA);
        this.get("fontes").forEach(function(fonte) {
            fonValidator.validate(fonte.toJSON()).forEach(function(msg) {
                messages.push(msg);
            });
        });

        // utente rules
        validator(UTENTE_SCHEMA)
            .validate(this.get("utente").toJSON())
            .forEach(function(msg) {
                messages.push(msg);
            });

        if (messages.length > 0) return messages;
    },

    validateActividade: function() {
        var messages = [];
        var tipo = this.getActividadeTipo();
        if (tipo && tipo !== Backbone.SIXHIARA.MSG.NO_ACTIVITY) {
            var toValidate = this.get("licencias").some(function(lic) {
                return lic.impliesValidateActivity();
            });
            if (toValidate) {
                var actividadeSchema = ActividadeSchema[tipo];
                validator(actividadeSchema)
                    .validate(this.get("actividade").toJSON())
                    .forEach(function(msg) {
                        messages.push(msg);
                    });

                var act = this.get("actividade");

                var subActivityMsgs = act.validateSubActivity();
                if (subActivityMsgs) {
                    messages = messages.concat(subActivityMsgs);
                }
            }
        }
        return messages;
    },

    validateLicencia: function() {
        var messages = [];
        /*
        La validación a los campos de la licencia en función del estado, se introdujo
        al meter taxa_fixa, tasa_uso, ... Hay que plantearse un renaming de
        impliesValidateActivity a algo más genérico. Y también si tiene sentido introducir
        en el schema de validación condicionales, del tipo este campo y concición sólo
        se valida para tal estado
        */
        var toValidate = this.get("licencias").some(function(lic) {
            return lic.impliesValidateActivity();
        });
        if (toValidate) {
            var licValidator = validator(LICENCIA_SCHEMA);

            licValidator.addRule("LIC_NRO_FORMAT", {
                fails: SIRHA.Services.IdService.isNotValidLicNro,
            });

            this.get("licencias").forEach(function(licencia) {
                licValidator.validate(licencia.toJSON()).forEach(function(msg) {
                    messages.push(msg);
                });
            });
        }
        return messages;
    },

    contains: function(where) {
        var values = _.omit(
            where.values(),
            "utente",
            "estado",
            "tipo_lic",
            "tipo_agua",
            "actividade",
            "geometria",
            "mapBounds",
            "ano_inicio",
            "ano_fim"
        );
        var properties = this.pick(_.keys(values));
        var containsAttrs = _.isEqual(properties, values);
        var containsUtente = true;
        if (where.attributes.utente) {
            containsUtente =
                this.getUtenteOrExploracaoName() === where.attributes.utente;
        }

        var containsEstado = true;
        if (where.attributes.estado) {
            containsEstado = false;
            if (this.get("renovacao")) {
                // Workaround. refs 1507#change-10870
                var renovacaoState = this.get("renovacao").get("estado");
                containsEstado =
                    containsEstado || where.attributes.estado === renovacaoState;
            } else {
                var whereEstado = _.pick(where.values(), "estado");
                var lics = this.get("licencias").where(whereEstado);
                if (lics.length > 0) {
                    containsEstado = true;
                }
                containsEstado =
                    containsEstado ||
                    where.attributes.estado === this.get("estado_lic");
            }
        }

        var containsLic = true;
        if (where.attributes.tipo_lic || where.attributes.tipo_agua) {
            containsLic = false;
            var whereLic = _.pick(where.values(), "tipo_lic", "tipo_agua");
            var lics = this.get("licencias").where(whereLic);
            if (lics.length > 0) {
                containsLic = true;
            }
        }
        var containsActividade = true;
        if (where.attributes.actividade) {
            containsActividade =
                this.get("actividade").get("tipo") === where.attributes.actividade;
        }
        var containsAno = true;
        if (where.attributes.ano_inicio || where.attributes.ano_fim) {
            var anoFromExpId = Number(
                SIRHA.Services.IdService.extractYearFromExpId(this)
            );
            if (where.attributes.ano_inicio) {
                containsAno =
                    containsAno && Number(where.attributes.ano_inicio) <= anoFromExpId;
            }
            if (where.attributes.ano_fim) {
                containsAno =
                    containsAno && Number(where.attributes.ano_fim) >= anoFromExpId;
            }
        }
        var containsGeometria = true;
        if (where.attributes.geometria) {
            var feature = this.toGeoJSON();
            var featureHasGeometria = !_.isEmpty(feature.geometry);
            containsGeometria =
                where.attributes.geometria === "Sim"
                    ? featureHasGeometria
                    : !featureHasGeometria;
        }

        var containsBounds = true;
        if (where.get("mapBounds")) {
            var feature = this.toGeoJSON();
            if (!_.isEmpty(feature.geometry)) {
                var bounds = L.GeoJSON.geometryToLayer(feature).getBounds();
                if (!where.get("mapBounds").intersects(bounds)) {
                    containsBounds = false;
                }
            }
        }

        return (
            containsAttrs &&
            containsUtente &&
            containsEstado &&
            containsLic &&
            containsActividade &&
            containsAno &&
            containsGeometria &&
            containsBounds
        );
    },

    getUtenteOrExploracaoName: function() {
        var utenteName = this.get("utente") && this.get("utente").get("nome");
        var name = utenteName || this.get("exp_name");
        return name.trim();
    },

    getActividadeTipo: function() {
        var tipo = Backbone.SIXHIARA.MSG.NO_ACTIVITY;
        if (this.get("actividade")) {
            tipo = this.get("actividade").get("tipo") || tipo;
        }
        return tipo;
    },

    aChangeHappens: function() {
        this.trigger("aChangeHappens");

        this.off("change", this.aChangeHappens, this);
        this.get("utente").off("change", this.aChangeHappens, this);
        this.get("actividade").off("change", this.aChangeHappens, this);
        this.get("fontes").off("change", this.aChangeHappens, this);
        this.get("licencias").off("change", this.aChangeHappens, this);
    },

    getInnerValue: function(obj, key) {
        if (typeof key === "function") {
            return key(obj);
        }
        return key.split(".").reduce(function(o, x) {
            return typeof o == "undefined" || o === null ? o : o[x];
        }, obj);
    },

    toSHP: function() {
        var self = this;
        var geojson = this.toGeoJSON();
        var json = geojson.properties;
        var properties = {};
        window.SIXHIARA.shpFieldsToExport.forEach(function(field) {
            properties[field.header] = self.getInnerValue(json, field.value);
        });

        if (!_.isEmpty(geojson.geometry)) {
            geojson.geometry.type = "Polygon";
        }
        return {
            type: "Feature",
            geometry: geojson.geometry,
            properties: properties,
        };
    },

    validateFicha: function() {
        return SIRHA.ESTADO.CATEGORY_VALIDATE_FICHA.includes(this.get("estado_lic"));
    },

    getLicencia: function(tipo) {
        var l = this.get("licencias").filter(function(lic) {
            return lic
                .get("tipo_agua")
                .toUpperCase()
                .startsWith(tipo.toUpperCase());
        });
        if (l.length === 1) {
            return l[0];
        } else {
            return new Backbone.Model();
        }
    },

    /*
        Called when the 'estado' of the lics and 'estado_lic' of the exploracao
        must be changed at the same time.
    */
    setLicState: function(state) {
        this.set("estado_lic", state);
        this.get("licencias").forEach(function(lic) {
            lic.set("estado", state);
        });
    },

    setDocPendenteUtente: function() {
        this.set("lic_time_info", "Pendente do utente", {silent: true});
        this.set("lic_time_enough", false, {silent: true});
        this.set("lic_time_warning", false, {silent: true});
        this.set("lic_time_over", false, {silent: true});
    },

    setDocPendenteUtenteRenovacao: function() {
        this.get("renovacao").set("lic_time_info", "Pendente do utente", {
            silent: true,
        });
        this.get("renovacao").set("lic_time_enough", false, {silent: true});
        this.get("renovacao").set("lic_time_warning", false, {silent: true});
        this.get("renovacao").set("lic_time_over", false, {silent: true});
    },

    cloneExploracao: function() {
        // Merge with toJSON and parse
        var exp = new Backbone.SIXHIARA.Exploracao(this.attributes);
        exp.set("actividade", this.get("actividade"));
        exp.set("utente", this.get("utente"));
        exp.set("licencias", this.get("licencias"));
        exp.set("fontes", this.get("fontes"));
        return exp;
    },

    getDifferenceTimeToString: function(initDate, warningDate, topDate, reverse) {
        var difference = moment.duration(warningDate.diff(initDate));

        var remainYears = parseInt(difference.get("years"));
        var remainMonths = parseInt(difference.get("months"));
        var remainDays = parseInt(difference.get("days"));
        var remainHours = parseInt(difference.get("hours"));

        var remainYearsStr =
            remainYears == 0 || remainYears > 1
                ? remainYears + " anos"
                : remainYears + " ano";
        var remainMonthsStr =
            remainMonths == 0 || remainMonths > 1
                ? remainMonths + " meses"
                : remainMonths + " mês";
        var remainDaysStr =
            remainDays == 0 || remainDays > 1
                ? remainDays + " dias"
                : remainDays + " dia";

        return remainYears > 0 && remainMonths > 0 && remainDays > 0
            ? remainYearsStr + ", " + remainMonthsStr + " e " + remainDaysStr
            : remainYears > 0 && !remainMonths && remainDays > 0
            ? remainYearsStr + " e " + remainDaysStr
            : remainYears > 0 && remainMonths > 0 && !remainDays
            ? remainYearsStr + " e " + remainMonthsStr
            : remainMonths > 0 && remainDays > 0
            ? remainMonthsStr + " e " + remainDaysStr
            : !remainMonths && remainDays > 0
            ? remainDaysStr
            : remainMonths > 0 && !remainDays
            ? remainMonthsStr
            : remainMonths === 0 && remainDays === 0 && remainHours > 0
            ? "Menos de um dia"
            : 0;
    },

    setLicenseTimeInfo: function() {
        if (
            SIRHA.ESTADO.CATEGORY_POST_LICENSED.indexOf(this.get("estado_lic")) === -1
        ) {
            this.setLicenseTimeInfoPendentes();
        } else {
            this.setLicenseTimeInfoExploracaos();
        }
        if (!_.isEmpty(this.get("renovacao"))) {
            this.setLicenseTimeInfoRenovacoes();
        }
    },

    setLicenseTimeInfoRenovacoes: function() {
        var renovacao = this.get("renovacao");
        if (
            renovacao.get("estado") == SIRHA.ESTADO_RENOVACAO.INCOMPLETE_DA ||
            renovacao.get("estado") == SIRHA.ESTADO_RENOVACAO.INCOMPLETE_DJ
        ) {
            this.setDocPendenteUtenteRenovacao();
            return;
        }
        if (renovacao.get("d_ultima_entrega_doc")) {
            var licenseDate = renovacao.get("d_ultima_entrega_doc");
            var now = moment();
            licenseDate = moment(licenseDate);
            var times = Backbone.SIXHIARA.tiemposRenovacion;
            var remainDays = times.limit - now.diff(licenseDate, "days");
            var remainDaysStr =
                remainDays == 1 ? remainDays + " dia" : remainDays + " dias";

            if (remainDays > 0 && remainDays < times.warning) {
                renovacao.set("lic_time_warning", true);
            } else if (remainDays <= 0) {
                remainDaysStr = "Prazo esgotado";
                renovacao.set("lic_time_over", true);
            } else if (remainDays >= times.warning) {
                renovacao.set("lic_time_enough", true);
            }

            var message;
            if (remainDaysStr) {
                if (
                    remainDaysStr == "Prazo esgotado" ||
                    remainDaysStr == "Licença cadudada"
                ) {
                    message = remainDaysStr;
                } else {
                    message =
                        "Ficam " +
                        remainDaysStr +
                        " para o fim do prazo de renovação da licença";
                }
            } else {
                message = "Sem informação";
            }
            renovacao.set("lic_time_info", message);
        }
    },
    setLicenseTimeInfoPendentes: function() {
        // Pendentes
        if (
            this.get("estado_lic") == SIRHA.ESTADO.INCOMPLETE_DA ||
            this.get("estado_lic") == SIRHA.ESTADO.INCOMPLETE_DJ
        ) {
            this.setDocPendenteUtente();
            return;
        }

        var licenseDate = this.get("d_ultima_entrega_doc");
        var now = moment();
        licenseDate = moment(licenseDate);
        var times = Backbone.SIXHIARA.tiemposRenovacion;
        var remainDays = times.limit - now.diff(licenseDate, "days");
        var remainDaysStr =
            remainDays == 0 || remainDays > 1
                ? remainDays + " dias"
                : remainDays + " dia";
        this.set("lic_time_info", remainDaysStr, {silent: true});

        if (remainDays > 0 && remainDays < times.warning) {
            this.set("lic_time_warning", true, {silent: true});
        } else if (remainDays <= 0) {
            this.set("lic_time_info", "Prazo esgotado", {silent: true});
            this.set("lic_time_over", true, {silent: true});
        } else if (remainDays >= times.warning) {
            this.set("lic_time_enough", true, {silent: true});
        }
    },

    setLicenseTimeInfoExploracaos: function() {
        var now = moment();
        var topDate = now.clone().add(2, "months");

        // store the first license to compare with
        var endsFirst = this.get("licencias").at(0);
        this.get("licencias").forEach(function(lic) {
            if (lic.get("d_validade")) {
                var licenseDate = moment(lic.get("d_validade"));
                lic.set(
                    "lic_time_info",
                    this.getDifferenceTimeToString(
                        now,
                        licenseDate,
                        now.clone().add(2, "months")
                    ),
                    {silent: true}
                );

                var topDate = licenseDate.clone().subtract(6, "months");
                var warningDate = licenseDate.clone().subtract(2, "months");

                if (now.isAfter(topDate) && now.isBefore(licenseDate)) {
                    if (now.isBetween(warningDate, licenseDate)) {
                        lic.set("lic_time_warning", true, {silent: true});
                    } else if (now.isBetween(topDate, warningDate)) {
                        lic.set("lic_time_enough", true, {silent: true});
                    }
                } else if (licenseDate.isBefore(now)) {
                    lic.set("lic_time_over", true, {silent: true});
                    lic.set("lic_time_info", "Licença cadudada", {silent: true});
                }

                // Select the license that ends first
                if (
                    moment(endsFirst.get("d_validade")).isAfter(
                        moment(lic.get("d_validade"))
                    )
                ) {
                    endsFirst = lic;
                }
            }
        }, this);
        this.set("lic_time_info", endsFirst.get("lic_time_info"), {silent: true});
        this.set("lic_time_enough", endsFirst.get("lic_time_enough"), {silent: true});
        this.set("lic_time_warning", endsFirst.get("lic_time_warning"), {silent: true});
        this.set("lic_time_over", endsFirst.get("lic_time_over"), {silent: true});
    },
});
