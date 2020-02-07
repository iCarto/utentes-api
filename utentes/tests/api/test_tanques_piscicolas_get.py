# -*- coding: utf-8 -*-


import unittest

import utentes.models.constants as c
from utentes.api.tanques_piscicolas import tanques_piscicolas_get
from utentes.models.actividade import ActividadesPiscicultura
from utentes.models.tanques_piscicolas import ActividadesTanquesPiscicolas
from utentes.tests.api import TanquesPiscicolasTests


class TanquesPiscicolasGET_IntegrationTests(TanquesPiscicolasTests):
    def test_tanque_get_length(self):
        actual = tanques_piscicolas_get(self.request)
        previous_count = self.request.db.query(ActividadesTanquesPiscicolas).count()
        self.assertEqual(len(actual["features"]), previous_count)
        self.create_tanque_test()
        actual = tanques_piscicolas_get(self.request)
        count = self.request.db.query(ActividadesTanquesPiscicolas).count()
        self.assertEqual(len(actual["features"]), count)
        self.assertEqual(previous_count + 1, count)

    def test_tanque_get_returns_a_geojson_collection(self):
        actual = tanques_piscicolas_get(self.request)
        self.assertTrue("features" in actual)
        self.assertTrue("type" in actual)
        self.assertEqual("FeatureCollection", actual["type"])

    def test_tanque_get_id_returns_a_geojson(self):
        expected = self.create_tanque_test(commit=True)
        self.request.matchdict.update(dict(id=expected.gid))
        actual = tanques_piscicolas_get(self.request).__json__(self.request)
        self.assertTrue("geometry" in actual)
        self.assertTrue("type" in actual)
        self.assertTrue("properties" in actual)


if __name__ == "__main__":
    unittest.main()
