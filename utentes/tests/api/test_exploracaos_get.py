
import unittest

from utentes.models.exploracao import Exploracao
from utentes.tests.api import DBIntegrationTest


class ExploracaosGET_IntegrationTests(DBIntegrationTest):
    def test_exploracao_get_length(self):
        from utentes.api.exploracaos import exploracaos_get

        actual = exploracaos_get(self.request)
        exp_count = self.request.db.query(Exploracao).count()
        self.assertEqual(len(actual["features"]), exp_count)

    def test_exploracao_get_returns_a_geojson(self):
        from utentes.api.exploracaos import exploracaos_get

        expected = (
            self.request.db.query(Exploracao)
            .filter(Exploracao.the_geom.isnot(None))
            .all()[0]
        )
        self.request.matchdict.update(dict(id=expected.gid))
        actual = exploracaos_get(self.request).__json__(self.request)
        self.assertTrue("geometry" in actual)
        self.assertTrue("type" in actual)
        self.assertTrue("properties" in actual)


if __name__ == "__main__":
    unittest.main()
