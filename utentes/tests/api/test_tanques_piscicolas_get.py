# -*- coding: utf-8 -*-


import unittest
from utentes.tests.api import DBIntegrationTest
from utentes.models.tanques_piscicolas import ActividadesTanquesPiscicolas
from utentes.api.tanques_piscicolas import tanques_piscicolas_get


class TanquesPiscicolasGET_IntegrationTests(DBIntegrationTest):
    def create_tanque_test(self, commit=False):
        exp = self.get_test_exploracao("2010-001")
        json = {
            "tanque_id": "2010-001-002",
            "estado": "Operacional",
            "esp_culti": "Peixe gato",
            "actividade": exp.actividade.gid,
        }
        tanque = ActividadesTanquesPiscicolas.create_from_json(json)
        self.request.db.add(tanque)
        commit and self.request.db.commit()
        return tanque

    def test_tanque_get_length(self):
        actual = tanques_piscicolas_get(self.request)
        count = self.request.db.query(ActividadesTanquesPiscicolas).count()
        self.assertEquals(len(actual["features"]), count)
        self.assertEquals(0, count)
        self.create_tanque_test()
        actual = tanques_piscicolas_get(self.request)
        count = self.request.db.query(ActividadesTanquesPiscicolas).count()
        self.assertEquals(len(actual["features"]), count)
        self.assertEquals(1, count)

    def test_tanque_get_returns_a_geojson_collection(self):
        actual = tanques_piscicolas_get(self.request)
        self.assertTrue("features" in actual)
        self.assertTrue("type" in actual)
        self.assertEquals("FeatureCollection", actual["type"])

    def test_tanque_get_id_returns_a_geojson(self):
        expected = self.create_tanque_test(commit=True)
        self.request.matchdict.update(dict(id=expected.gid))
        actual = tanques_piscicolas_get(self.request).__json__(self.request)
        self.assertTrue("geometry" in actual)
        self.assertTrue("type" in actual)
        self.assertTrue("properties" in actual)


if __name__ == "__main__":
    unittest.main()
