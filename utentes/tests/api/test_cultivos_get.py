# -*- coding: utf-8 -*-


import unittest
from utentes.tests.api import DBIntegrationTest
from utentes.models.cultivo import ActividadesCultivos


class CultivosGET_IntegrationTests(DBIntegrationTest):
    def test_cultivo_get_length(self):
        from utentes.api.cultivos import cultivos_get

        actual = cultivos_get(self.request)
        count = self.request.db.query(ActividadesCultivos).count()
        self.assertEquals(len(actual["features"]), count)

    def test_cultivo_get_returns_a_geojson_collection(self):
        from utentes.api.cultivos import cultivos_get

        actual = cultivos_get(self.request)
        self.assertTrue("features" in actual)
        self.assertTrue("type" in actual)
        self.assertEquals("FeatureCollection", actual["type"])

    def test_cultivo_get_id_returns_a_geojson(self):
        from utentes.api.cultivos import cultivos_get

        expected = (
            self.request.db.query(ActividadesCultivos)
            .filter(ActividadesCultivos.cult_id == "2010-022-01")
            .first()
        )
        self.request.matchdict.update(dict(id=expected.gid))
        actual = cultivos_get(self.request).__json__(self.request)
        self.assertTrue("geometry" in actual)
        self.assertTrue("type" in actual)
        self.assertTrue("properties" in actual)


if __name__ == "__main__":
    unittest.main()
