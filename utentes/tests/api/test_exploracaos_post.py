# -*- coding: utf-8 -*-


import unittest

from pyramid.httpexceptions import HTTPBadRequest

from utentes.api.exploracaos import exploracaos_create
from utentes.models.exploracao import Exploracao
from utentes.models.utente import Utente
from utentes.tests.api import DBIntegrationTest


class ExploracaoCreateTests(DBIntegrationTest):

    EXP_ID = "2022-001"

    def build_json(self):
        expected_json = {}
        expected_json["exp_id"] = self.EXP_ID
        expected_json["exp_name"] = "new name"
        expected_json["d_soli"] = "2001-01-01"
        expected_json["observacio"] = "new observ"
        expected_json["loc_provin"] = "Niassa"
        expected_json["loc_distri"] = "Lago"
        expected_json["loc_posto"] = "Cobue"
        expected_json["loc_nucleo"] = "new loc_nucleo"
        expected_json["loc_endere"] = "new enderezo"
        expected_json["loc_bacia"] = "Megaruma"
        expected_json["loc_subaci"] = "Megaruma"
        expected_json["loc_rio"] = "Megaruma"
        expected_json["c_soli"] = 19.02
        expected_json["c_licencia"] = 29
        expected_json["c_real"] = 92
        expected_json["c_estimado"] = 42.23
        expected_json["utente"] = {
            "nome": "nome",
            "nuit": "nuit",
            "uten_tipo": "uten_tipo",
            "reg_comerc": "reg_comerc",
            "reg_zona": "reg_zona",
            "loc_provin": "Niassa",
            "loc_distri": "Lago",
            "loc_posto": "Cobue",
            "loc_nucleo": "loc_nucleo",
            "observacio": "observacio",
        }
        expected_json["actividade"] = {
            "tipo": "Saneamento",
            "c_estimado": None,
            "habitantes": 120000,
        }
        expected_json["licencias"] = [
            {
                "lic_nro": None,
                "tipo_agua": "Subterrânea",
                "cadastro": "cadastro",
                "estado": "Irregular",
                "d_emissao": "2020-2-2",
                "d_validade": "2010-10-10",
                "c_soli_tot": 4.3,
                "c_soli_int": 2.3,
                "c_soli_fon": 2,
                "c_licencia": 10,
                "c_real_tot": 4.3,
                "c_real_int": 2.3,
                "c_real_fon": 2,
            }
        ]
        expected_json["fontes"] = [
            {
                "tipo_agua": "Subterrânea",
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
        exploracaos_create(self.request)
        actual = (
            self.request.db.query(Exploracao)
            .filter(Exploracao.exp_id == self.EXP_ID)
            .first()
        )
        utente = self.request.db.query(Utente).filter(Utente.nome == "nome").first()
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
        self.assertEquals("uten_tipo", utente.uten_tipo)
        self.assertEquals("reg_comerc", utente.reg_comerc)
        self.assertEquals("reg_zona", utente.reg_zona)
        self.assertEquals("Niassa", utente.loc_provin)
        self.assertEquals("Lago", utente.loc_distri)
        self.assertEquals("Cobue", utente.loc_posto)
        self.assertEquals("loc_nucleo", utente.loc_nucleo)
        self.assertEquals("observacio", utente.observacio)
        self.assertEquals("Saneamento", actual.actividade.tipo)
        self.assertEquals(None, actual.actividade.c_estimado)
        self.assertEquals(120000, actual.actividade.habitantes)
        self.assertEquals(actual.exp_id + "-001", licencia.lic_nro)
        self.assertEquals("Subterrânea", licencia.tipo_agua)
        self.assertEquals("cadastro", licencia.cadastro)
        self.assertEquals("Irregular", licencia.estado)
        self.assertEquals("2020-02-02", licencia.d_emissao.isoformat())
        self.assertEquals("2010-10-10", licencia.d_validade.isoformat())
        self.assertEquals(4.3, float(licencia.c_soli_tot))
        self.assertEquals(2.3, float(licencia.c_soli_int))
        self.assertEquals(2, float(licencia.c_soli_fon))
        self.assertEquals(10, float(licencia.c_licencia))
        self.assertEquals(4.3, float(licencia.c_real_tot))
        self.assertEquals(2.3, float(licencia.c_real_int))
        self.assertEquals(2, float(licencia.c_real_fon))
        self.assertEquals("Subterrânea", fonte.tipo_agua)
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
        rega = "Agricultura de Regadio"
        expected_json = self.build_json()
        expected_json["actividade"] = {"tipo": rega, "c_estimado": None, "cultivos": []}
        self.request.json_body = expected_json
        exploracaos_create(self.request)
        actual = (
            self.request.db.query(Exploracao)
            .filter(Exploracao.exp_id == self.EXP_ID)
            .first()
        )
        self.assertEquals(rega, actual.actividade.tipo)
        self.assertEquals(0, len(actual.actividade.cultivos))

    def test_all_activities_can_be_created_without_validations_fails(self):
        expected_json = self.build_json()

        exp_id = "9999-999"
        expected_json["actividade"] = {"tipo": "Abastecimento", "c_estimado": None}
        expected_json["exp_id"] = exp_id
        self.request.json_body = expected_json
        exploracaos_create(self.request)
        actual = (
            self.request.db.query(Exploracao)
            .filter(Exploracao.exp_id == exp_id)
            .first()
        )
        self.assertEquals(exp_id, actual.exp_id)
        self.assertEquals("Abastecimento", actual.actividade.tipo)

        exp_id = "9999-998"
        expected_json["actividade"] = {"tipo": "Agricultura de Regadio", "cultivos": []}
        expected_json["exp_id"] = exp_id
        self.request.json_body = expected_json
        exploracaos_create(self.request)
        actual = (
            self.request.db.query(Exploracao)
            .filter(Exploracao.exp_id == exp_id)
            .first()
        )
        self.assertEquals(exp_id, actual.exp_id)
        self.assertEquals("Agricultura de Regadio", actual.actividade.tipo)

        exp_id = "9999-997"
        expected_json["actividade"] = {"tipo": "Indústria"}
        expected_json["exp_id"] = exp_id
        self.request.json_body = expected_json
        exploracaos_create(self.request)
        actual = (
            self.request.db.query(Exploracao)
            .filter(Exploracao.exp_id == exp_id)
            .first()
        )
        self.assertEquals(exp_id, actual.exp_id)
        self.assertEquals("Indústria", actual.actividade.tipo)

        exp_id = "9999-996"
        expected_json["actividade"] = {"tipo": "Pecuária", "reses": []}
        expected_json["exp_id"] = exp_id
        self.request.json_body = expected_json
        exploracaos_create(self.request)
        actual = (
            self.request.db.query(Exploracao)
            .filter(Exploracao.exp_id == exp_id)
            .first()
        )
        self.assertEquals(exp_id, actual.exp_id)
        self.assertEquals("Pecuária", actual.actividade.tipo)

        exp_id = "9999-995"
        expected_json["actividade"] = {"tipo": "Piscicultura"}
        expected_json["exp_id"] = exp_id
        self.request.json_body = expected_json
        exploracaos_create(self.request)
        actual = (
            self.request.db.query(Exploracao)
            .filter(Exploracao.exp_id == exp_id)
            .first()
        )
        self.assertEquals(exp_id, actual.exp_id)
        self.assertEquals("Piscicultura", actual.actividade.tipo)

        exp_id = "9999-994"
        expected_json["actividade"] = {"tipo": "Producção de energia"}
        expected_json["exp_id"] = exp_id
        self.request.json_body = expected_json
        exploracaos_create(self.request)
        actual = (
            self.request.db.query(Exploracao)
            .filter(Exploracao.exp_id == exp_id)
            .first()
        )
        self.assertEquals(exp_id, actual.exp_id)
        self.assertEquals("Producção de energia", actual.actividade.tipo)

        exp_id = "9999-993"
        expected_json["actividade"] = {"tipo": "Saneamento"}
        expected_json["exp_id"] = exp_id
        self.request.json_body = expected_json
        exploracaos_create(self.request)
        actual = (
            self.request.db.query(Exploracao)
            .filter(Exploracao.exp_id == exp_id)
            .first()
        )
        self.assertEquals(exp_id, actual.exp_id)
        self.assertEquals("Saneamento", actual.actividade.tipo)


if __name__ == "__main__":
    unittest.main()
