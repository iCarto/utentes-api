/* global formatter, moment */

// ***=loc_unidad*** - ***=cbase.unidades.nome***
SIRHA.Services.PrintService = (function(formatter) {
    function removeNull(data) {
        // Create a copy of the main object since both types of licenses share fields
        // In adition, remove its nulls to avoid problems during the template generation
        return JSON.parse(
            JSON.stringify(data, function(key, value) {
                if (value === null) {
                    return "";
                }
                return value;
            })
        );
    }

    function isValidForPrint(exploracao, lic) {
        if (lic && !lic.get("tipo_lic")) {
            return "A exploração tem que ter uma tipo de licença.";
        }
        const locUnidad = exploracao.get
            ? exploracao.get("loc_unidad")
            : exploracao.loc_unidad;
        if (!locUnidad) {
            return "A exploração tem que ter uma Unidade de Gestão.";
        }
    }

    function fillData(_model, dataARA, tipoAgua, fontes, es_renovacao) {
        var json = _model.toJSON();
        if (fontes) {
            json.fontes = fontes;
        }

        var data = removeNull(json);

        // We filter fontes by tipo_agua (Subterrânea / Superficial)
        data.fontes = data.fontes.filter(function(fonte) {
            return fonte.tipo_agua == tipoAgua;
        });

        data.licencia = data.licencias.filter(lic => lic.tipo_agua === tipoAgua)[0];
        if (es_renovacao) {
            fillLicenseDataFromRenovacao(data.licencia, data.renovacao);
        }

        data.licencia.d_emissao = formatter.formatDate(data.licencia.d_emissao) || "";
        data.licencia.d_validade = formatter.formatDate(data.licencia.d_validade) || "";

        data.urlTemplate = Backbone.SIXHIARA.tipoTemplates[data.licencia.tipo_lic];
        data.licencia.duration =
            Backbone.SIXHIARA.duracionLicencias[data.licencia.tipo_lic];

        data.nameFile = data.licencia.tipo_lic
            .concat("_")
            .concat(data.licencia.lic_nro)
            .concat("_")
            .concat(data.exp_name)
            .concat(".docx");

        data.ara = dataARA;

        data.unidade_long_name = data.ara.unidades.reduce(
            (mem, u) => (u.nome.startsWith(data.loc_unidad) ? mem + u.nome : mem),
            ""
        );
        data.ara.logoUrl =
            "static/print-templates/images/" + window.SIRHA.getARA() + "_cabecera.png";
        data.ara.portadaUrl =
            "static/print-templates/images/" + window.SIRHA.getARA() + "_portada.png";
        return data;
    }

    function fillLicenseDataFromRenovacao(lic, renovacao) {
        var prefix = lic.tipo_agua.substring(0, 3).toLowerCase();
        lic.d_emissao = renovacao["d_emissao_" + prefix];
        lic.d_validade = renovacao["d_validade_" + prefix];
        lic.c_licencia = renovacao["c_licencia_" + prefix];
        lic.tipo_lic = renovacao["tipo_lic_" + prefix];
        return lic;
    }

    function licenses(_model, es_renovacao) {
        return fetch(`/api/fontes/${_model.get("id")}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(fontes => {
                const licsTipoAgua = _model.get("licencias").pluck("tipo_agua");
                const printedLics = licsTipoAgua.map(tipoAgua =>
                    license(_model, tipoAgua, fontes, es_renovacao)
                );
                return Promise.all(printedLics);
            });
    }

    function license(_model, tipoAgua, fontes, es_renovacao) {
        const lic = _model.get("licencias").findWhere({tipo_agua: tipoAgua});
        const errorMsg = isValidForPrint(_model, lic);
        if (errorMsg) {
            return Promise.reject(errorMsg);
        }

        return fetch("/api/get_datos_ara")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(function(dataARA) {
                var data = fillData(_model, dataARA, tipoAgua, fontes, es_renovacao);

                new Backbone.SIXHIARA.DocxGeneratorView({
                    data: data,
                });
                return data;
            });
    }

    function factura(invoiceData) {
        return billing(invoiceData, "Factura");
    }

    function recibo(invoiceData) {
        return billing(invoiceData, "Recibo");
    }

    function billing(invoiceData, template) {
        const errorMsg = isValidForPrint(invoiceData);
        if (errorMsg) {
            return Promise.reject(errorMsg);
        }
        return fetch("/api/get_datos_ara")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(function(dataARA) {
                var data = fillBillingData(invoiceData, dataARA, template);
                return data;
            })
            .then(function(data) {
                const id = invoiceData.factura.id;
                const url = `/api/facturacao/${id}/emitir_${template.toLowerCase()}`;
                return fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Network response was not ok");
                        }
                        return response.json();
                    })
                    .then(function(fact_id) {
                        data[`num${template}`] = fact_id;
                        return data;
                    });
            })
            .then(function(data) {
                new Backbone.SIXHIARA.DocxGeneratorView({
                    data: data,
                });
                return data;
            });
    }

    function fillBillingData(invoiceData, dataARA, template) {
        var data = removeNull(invoiceData);

        data.urlTemplate = Backbone.SIXHIARA.tipoTemplates[template];
        data.nameFile = `${template}_${data.exp_id}_${data.factura.mes}_${data.factura.ano}.docx`;

        data.dateFactura_ = data.factura.fact_date
            ? new Date(data.factura.fact_date)
            : new Date();
        data.dateFactura = formatter.formatDate(data.dateFactura_);

        var dateVencimento = moment(data.dateFactura_).add(1, "M");
        data.vencimento = formatter.formatDate(dateVencimento);

        data.periodoFactura = SIRHA.Services.InvoiceService.billingPeriod(
            data.factura.fact_tipo,
            data.factura.mes,
            data.factura.ano
        );
        data.ara = dataARA;
        data.ara.logoUrl =
            "static/print-templates/images/" + window.SIRHA.getARA() + "_factura.png";

        if (template === "Factura") {
            data.licencias.forEach(function(licencia) {
                var tipo = licencia.tipo_agua.substring(0, 3).toLowerCase();
                licencia.consumo_fact = data.factura["consumo_fact_" + tipo];
                licencia.taxa_fixa = data.factura["taxa_fixa_" + tipo];
                licencia.taxa_uso = data.factura["taxa_uso_" + tipo];
                licencia.pago_mes = data.factura["pago_mes_" + tipo];
                licencia.iva = data.factura["iva_" + tipo];
                licencia.pago_iva = data.factura["pago_iva_" + tipo];
            });
        }
        if (template === "Recibo") {
            data.dateRecibo_ = data.factura.recibo_date
                ? new Date(data.factura.recibo_date)
                : new Date();
            data.dateRecibo = formatter.formatDate(data.dateRecibo_);
        }

        return data;
    }

    const publicAPI = {license, licenses, factura, recibo};
    return publicAPI;
})(formatter());
