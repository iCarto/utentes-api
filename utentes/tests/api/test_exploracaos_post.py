# -*- coding: utf-8 -*-


import unittest

from pyramid.httpexceptions import HTTPBadRequest

import utentes.models.constants as c
from utentes.api.exploracaos import exploracaos_create
from utentes.models.exploracao import Exploracao
from utentes.models.utente import Utente
from utentes.services.id_service import calculate_new_exp_id
from utentes.tests.api import DBIntegrationTest


class ExploracaoCreateTests(DBIntegrationTest):
    def build_json(self):
        expected_json = {}
        expected_json["exp_id"] = calculate_new_exp_id(self.request)
        expected_json["exp_name"] = "new name"
        expected_json["d_soli"] = "2001-01-01"
        expected_json["observacio"] = "new observ"
        expected_json["loc_provin"] = "Niassa"
        expected_json["loc_distri"] = "Lago"
        expected_json["loc_posto"] = "Cobue"
        expected_json["loc_nucleo"] = "new loc_nucleo"
        expected_json["loc_endere"] = "new enderezo"
        expected_json["loc_unidad"] = "UGBC"
        expected_json["loc_bacia"] = "Megaruma"
        expected_json["loc_subaci"] = "Megaruma"
        expected_json["loc_rio"] = "Megaruma"
        expected_json["c_soli"] = 19.02
        expected_json["c_licencia"] = 29
        expected_json["c_real"] = 92
        expected_json["c_estimado"] = 42.23
        expected_json["estado_lic"] = u"Licenciada"
        expected_json["utente"] = {
            "nome": "nome",
            "nuit": "nuit",
            "uten_tipo": u"Sociedade",
            "reg_comerc": "reg_comerc",
            "reg_zona": "reg_zona",
            "loc_provin": "Niassa",
            "loc_distri": "Lago",
            "loc_posto": "Cobue",
            "loc_nucleo": "loc_nucleo",
        }
        expected_json["actividade"] = {
            "tipo": c.K_SANEAMENTO,
            "c_estimado": 3,
            "habitantes": 120000,
        }
        expected_json["licencias"] = [
            {
                "lic_nro": None,
                "tipo_agua": c.K_SUBTERRANEA,
                "estado": u"Licenciada",
                "d_emissao": "2020-2-2",
                "d_validade": "2010-10-10",
                "c_soli_tot": 4.3,
                "c_soli_int": 2.3,
                "c_soli_fon": 2,
                "c_licencia": 10,
                "c_real_tot": 4.3,
                "c_real_int": 2.3,
                "c_real_fon": 2,
                "iva": 12.75,
                "consumo_tipo": u"Fixo",
            }
        ]
        expected_json["fontes"] = [
            {
                "tipo_agua": c.K_SUBTERRANEA,
                "tipo_fonte": "Outros",
                "lat_lon": "23,23 42,21",
                "d_dado": "2001-01-01",
                "c_soli": 23.42,
                "c_max": 42.23,
                "c_real": 4.3,
                "sist_med": "Contador",
                "metodo_est": "manual",
                "observacio": "observacio",
            }
        ]
        return expected_json

    def test_create_exploracao(self):
        self.request.json_body = self.build_json()
        actual_exp_id = self.request.json_body["exp_id"]
        exploracaos_create(self.request)
        actual = (
            self.request.db.query(Exploracao)
            .filter(Exploracao.exp_id == actual_exp_id)
            .all()[0]
        )
        utente = self.request.db.query(Utente).filter(Utente.nome == "nome").all()[0]
        licencia = actual.licencias[0]
        fonte = actual.fontes[0]
        self.assertEquals("new name", actual.exp_name)
        self.assertEquals("2001-01-01", actual.d_soli.isoformat())
        self.assertEquals("new observ", actual.observacio)
        self.assertEquals("Niassa", actual.loc_provin)
        self.assertEquals("Lago", actual.loc_distri)
        self.assertEquals("Cobue", actual.loc_posto)
        self.assertEquals("new loc_nucleo", actual.loc_nucleo)
        self.assertEquals("new enderezo", actual.loc_endere)
        self.assertEquals("UGBC", actual.loc_unidad)
        self.assertEquals("Megaruma", actual.loc_bacia)
        self.assertEquals("Megaruma", actual.loc_subaci)
        self.assertEquals("Megaruma", actual.loc_rio)
        self.assertEquals(19.02, float(actual.c_soli))
        self.assertEquals(29, float(actual.c_licencia))
        self.assertEquals(92, float(actual.c_real))
        self.assertEquals(42.23, float(actual.c_estimado))
        self.assertEquals(utente, actual.utente_rel)
        self.assertEquals("nome", utente.nome)
        self.assertEquals("nuit", utente.nuit)
        self.assertEquals(u"Sociedade", utente.uten_tipo)
        self.assertEquals("reg_comerc", utente.reg_comerc)
        self.assertEquals("reg_zona", utente.reg_zona)
        self.assertEquals("Niassa", utente.loc_provin)
        self.assertEquals("Lago", utente.loc_distri)
        self.assertEquals("Cobue", utente.loc_posto)
        self.assertEquals("loc_nucleo", utente.loc_nucleo)
        self.assertEquals(c.K_SANEAMENTO, actual.actividade.tipo)
        self.assertEquals(3, actual.actividade.c_estimado)
        self.assertEquals(120000, actual.actividade.habitantes)
        self.assertEquals(actual.exp_id + "/Sub", licencia.lic_nro)
        self.assertEquals(c.K_SUBTERRANEA, licencia.tipo_agua)
        self.assertEquals(u"Licenciada", licencia.estado)
        self.assertEquals("2020-02-02", licencia.d_emissao.isoformat())
        self.assertEquals("2010-10-10", licencia.d_validade.isoformat())
        self.assertEquals(4.3, float(licencia.c_soli_tot))
        self.assertEquals(2.3, float(licencia.c_soli_int))
        self.assertEquals(2, float(licencia.c_soli_fon))
        self.assertEquals(10, float(licencia.c_licencia))
        self.assertEquals(4.3, float(licencia.c_real_tot))
        self.assertEquals(2.3, float(licencia.c_real_int))
        self.assertEquals(2, float(licencia.c_real_fon))
        self.assertEquals(c.K_SUBTERRANEA, fonte.tipo_agua)
        self.assertEquals("Outros", fonte.tipo_fonte)
        self.assertEquals("23,23 42,21", fonte.lat_lon)
        self.assertEquals("2001-01-01", fonte.d_dado.isoformat())
        self.assertEquals(23.42, float(fonte.c_soli))
        self.assertEquals(42.23, float(fonte.c_max))
        self.assertEquals(4.3, float(fonte.c_real))
        self.assertEquals("Contador", fonte.sist_med)
        self.assertEquals("manual", fonte.metodo_est)
        self.assertEquals("observacio", fonte.observacio)

    def test_create_exploracao_validation_fails(self):
        expected_json = self.build_json()
        expected_json["exp_name"] = None
        self.request.json_body = expected_json
        self.assertRaises(HTTPBadRequest, exploracaos_create, self.request)

    def test_create_exploracao_validation_fails_due_void_licenses_array(self):
        expected_json = self.build_json()
        expected_json["licencias"] = []
        self.request.json_body = expected_json
        self.assertRaises(HTTPBadRequest, exploracaos_create, self.request)

    def test_create_exploracao_actividade_rega_without_cultivos(self):
        expected_json = self.build_json()
        expected_json["actividade"] = {
            "tipo": c.K_AGRICULTURA,
            "c_estimado": 5,
            "cultivos": [],
        }
        self.request.json_body = expected_json
        actual_exp_id = self.request.json_body["exp_id"]
        exploracaos_create(self.request)
        actual = (
            self.request.db.query(Exploracao)
            .filter(Exploracao.exp_id == actual_exp_id)
            .all()[0]
        )
        self.assertEquals(c.K_AGRICULTURA, actual.actividade.tipo)
        self.assertEquals(0, len(actual.actividade.cultivos))

    def test_all_activities_can_be_created_without_validations_fails(self):
        expected_json = self.build_json()
        expected_exp_id = expected_json["exp_id"]
        expected_json["actividade"] = {
            "tipo": c.K_ABASTECIMENTO,
            "c_estimado": 1,
            "habitantes": 2,
            "dotacao": 3,
        }
        self.request.json_body = expected_json
        exploracaos_create(self.request)
        actual = (
            self.request.db.query(Exploracao)
            .filter(Exploracao.exp_id == expected_exp_id)
            .all()[0]
        )
        self.assertEquals(expected_exp_id, actual.exp_id)
        self.assertEquals(c.K_ABASTECIMENTO, actual.actividade.tipo)

        expected_json = self.build_json()
        expected_exp_id = expected_json["exp_id"]
        expected_json["actividade"] = {
            "tipo": c.K_AGRICULTURA,
            "cultivos": [],
            "c_estimado": 1,
        }
        self.request.json_body = expected_json
        exploracaos_create(self.request)
        actual = (
            self.request.db.query(Exploracao)
            .filter(Exploracao.exp_id == expected_exp_id)
            .all()[0]
        )
        self.assertEquals(expected_exp_id, actual.exp_id)
        self.assertEquals(c.K_AGRICULTURA, actual.actividade.tipo)

        expected_json = self.build_json()
        expected_exp_id = expected_json["exp_id"]
        expected_json["actividade"] = {"tipo": c.K_INDUSTRIA, "c_estimado": 1}
        self.request.json_body = expected_json
        exploracaos_create(self.request)
        actual = (
            self.request.db.query(Exploracao)
            .filter(Exploracao.exp_id == expected_exp_id)
            .all()[0]
        )
        self.assertEquals(expected_exp_id, actual.exp_id)
        self.assertEquals(c.K_INDUSTRIA, actual.actividade.tipo)

        expected_json = self.build_json()
        expected_exp_id = expected_json["exp_id"]
        expected_json["actividade"] = {
            "tipo": c.K_PECUARIA,
            "reses": [],
            "c_estimado": 1,
        }
        self.request.json_body = expected_json
        exploracaos_create(self.request)
        actual = (
            self.request.db.query(Exploracao)
            .filter(Exploracao.exp_id == expected_exp_id)
            .all()[0]
        )
        self.assertEquals(expected_exp_id, actual.exp_id)
        self.assertEquals(c.K_PECUARIA, actual.actividade.tipo)

        expected_json = self.build_json()
        expected_exp_id = expected_json["exp_id"]
        expected_json["actividade"] = {"tipo": c.K_PISCICULTURA, "c_estimado": 1}
        self.request.json_body = expected_json
        exploracaos_create(self.request)
        actual = (
            self.request.db.query(Exploracao)
            .filter(Exploracao.exp_id == expected_exp_id)
            .all()[0]
        )
        self.assertEquals(expected_exp_id, actual.exp_id)
        self.assertEquals(c.K_PISCICULTURA, actual.actividade.tipo)

        expected_json = self.build_json()
        expected_exp_id = expected_json["exp_id"]
        expected_json["actividade"] = {"tipo": c.K_ENERGIA, "c_estimado": 1}
        self.request.json_body = expected_json
        exploracaos_create(self.request)
        actual = (
            self.request.db.query(Exploracao)
            .filter(Exploracao.exp_id == expected_exp_id)
            .all()[0]
        )
        self.assertEquals(expected_exp_id, actual.exp_id)
        self.assertEquals(c.K_ENERGIA, actual.actividade.tipo)

        expected_json = self.build_json()
        expected_exp_id = expected_json["exp_id"]
        expected_json["actividade"] = {"tipo": c.K_SANEAMENTO, "c_estimado": 1}
        self.request.json_body = expected_json
        exploracaos_create(self.request)
        actual = (
            self.request.db.query(Exploracao)
            .filter(Exploracao.exp_id == expected_exp_id)
            .all()[0]
        )
        self.assertEquals(expected_exp_id, actual.exp_id)
        self.assertEquals(c.K_SANEAMENTO, actual.actividade.tipo)


if __name__ == "__main__":
    unittest.main()
