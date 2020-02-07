
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
        estado_lic = c.K_LICENSED
        expected = {}
        expected["exp_id"] = calculate_new_exp_id(self.request, estado_lic)
        expected["exp_name"] = "new name"
        expected["d_soli"] = "2001-01-01"
        expected["observacio"] = "new observ"
        expected["loc_provin"] = "Niassa"
        expected["loc_distri"] = "Lago"
        expected["loc_posto"] = "Cobue"
        expected["loc_nucleo"] = "new loc_nucleo"
        expected["loc_endere"] = "new enderezo"
        expected["loc_unidad"] = "UGBC"
        expected["loc_bacia"] = "Megaruma"
        expected["loc_subaci"] = "Megaruma"
        expected["loc_rio"] = "Megaruma"
        expected["c_soli"] = 19.02
        expected["c_licencia"] = 29
        expected["c_real"] = 92
        expected["c_estimado"] = 42.23
        expected["estado_lic"] = estado_lic
        expected["utente"] = {
            "nome": "nome",
            "nuit": "nuit",
            "uten_tipo": "Sociedade",
            "reg_comerc": "reg_comerc",
            "reg_zona": "reg_zona",
            "loc_provin": "Niassa",
            "loc_distri": "Lago",
            "loc_posto": "Cobue",
            "loc_nucleo": "loc_nucleo",
        }
        expected["actividade"] = {
            "tipo": c.K_SANEAMENTO,
            "c_estimado": 3,
            "habitantes": 120000,
        }
        expected["licencias"] = [
            {
                "lic_nro": None,
                "tipo_agua": c.K_SUBTERRANEA,
                "estado": "Licenciada",
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
                "consumo_tipo": "Fixo",
            }
        ]
        expected["fontes"] = [
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
        return expected

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
        self.assertEqual("new name", actual.exp_name)
        self.assertEqual("2001-01-01", actual.d_soli.isoformat())
        self.assertEqual("new observ", actual.observacio)
        self.assertEqual("Niassa", actual.loc_provin)
        self.assertEqual("Lago", actual.loc_distri)
        self.assertEqual("Cobue", actual.loc_posto)
        self.assertEqual("new loc_nucleo", actual.loc_nucleo)
        self.assertEqual("new enderezo", actual.loc_endere)
        self.assertEqual("UGBC", actual.loc_unidad)
        self.assertEqual("Megaruma", actual.loc_bacia)
        self.assertEqual("Megaruma", actual.loc_subaci)
        self.assertEqual("Megaruma", actual.loc_rio)
        self.assertEqual(19.02, float(actual.c_soli))
        self.assertEqual(29, float(actual.c_licencia))
        self.assertEqual(92, float(actual.c_real))
        self.assertEqual(42.23, float(actual.c_estimado))
        self.assertEqual(utente, actual.utente_rel)
        self.assertEqual("nome", utente.nome)
        self.assertEqual("nuit", utente.nuit)
        self.assertEqual("Sociedade", utente.uten_tipo)
        self.assertEqual("reg_comerc", utente.reg_comerc)
        self.assertEqual("reg_zona", utente.reg_zona)
        self.assertEqual("Niassa", utente.loc_provin)
        self.assertEqual("Lago", utente.loc_distri)
        self.assertEqual("Cobue", utente.loc_posto)
        self.assertEqual("loc_nucleo", utente.loc_nucleo)
        self.assertEqual(c.K_SANEAMENTO, actual.actividade.tipo)
        self.assertEqual(3, actual.actividade.c_estimado)
        self.assertEqual(120000, actual.actividade.habitantes)
        self.assertEqual(actual.exp_id + "/Sub", licencia.lic_nro)
        self.assertEqual(c.K_SUBTERRANEA, licencia.tipo_agua)
        self.assertEqual("Licenciada", licencia.estado)
        self.assertEqual("2020-02-02", licencia.d_emissao.isoformat())
        self.assertEqual("2010-10-10", licencia.d_validade.isoformat())
        self.assertEqual(4.3, float(licencia.c_soli_tot))
        self.assertEqual(2.3, float(licencia.c_soli_int))
        self.assertEqual(2, float(licencia.c_soli_fon))
        self.assertEqual(10, float(licencia.c_licencia))
        self.assertEqual(4.3, float(licencia.c_real_tot))
        self.assertEqual(2.3, float(licencia.c_real_int))
        self.assertEqual(2, float(licencia.c_real_fon))
        self.assertEqual(c.K_SUBTERRANEA, fonte.tipo_agua)
        self.assertEqual("Outros", fonte.tipo_fonte)
        self.assertEqual("23,23 42,21", fonte.lat_lon)
        self.assertEqual("2001-01-01", fonte.d_dado.isoformat())
        self.assertEqual(23.42, float(fonte.c_soli))
        self.assertEqual(42.23, float(fonte.c_max))
        self.assertEqual(4.3, float(fonte.c_real))
        self.assertEqual("Contador", fonte.sist_med)
        self.assertEqual("manual", fonte.metodo_est)
        self.assertEqual("observacio", fonte.observacio)

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
        self.assertEqual(c.K_AGRICULTURA, actual.actividade.tipo)
        self.assertEqual(0, len(actual.actividade.cultivos))

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
        self.assertEqual(expected_exp_id, actual.exp_id)
        self.assertEqual(c.K_ABASTECIMENTO, actual.actividade.tipo)

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
        self.assertEqual(expected_exp_id, actual.exp_id)
        self.assertEqual(c.K_AGRICULTURA, actual.actividade.tipo)

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
        self.assertEqual(expected_exp_id, actual.exp_id)
        self.assertEqual(c.K_INDUSTRIA, actual.actividade.tipo)

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
        self.assertEqual(expected_exp_id, actual.exp_id)
        self.assertEqual(c.K_PECUARIA, actual.actividade.tipo)

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
        self.assertEqual(expected_exp_id, actual.exp_id)
        self.assertEqual(c.K_PISCICULTURA, actual.actividade.tipo)

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
        self.assertEqual(expected_exp_id, actual.exp_id)
        self.assertEqual(c.K_ENERGIA, actual.actividade.tipo)

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
        self.assertEqual(expected_exp_id, actual.exp_id)
        self.assertEqual(c.K_SANEAMENTO, actual.actividade.tipo)


if __name__ == "__main__":
    unittest.main()
