# -*- coding: utf-8 -*-


import unittest

from pyramid.httpexceptions import HTTPBadRequest

from utentes.api.tanques_piscicolas import tanques_piscicolas_update
from utentes.models.tanques_piscicolas import ActividadesTanquesPiscicolas as Entity
from utentes.tests.api import DBIntegrationTest


def build_json(request, entity):
    expected_json = entity.__json__(request)
    expected_json.update(expected_json.pop("properties"))
    return expected_json


class TanquesPiscicolasUpdateTests(DBIntegrationTest):
    def create_tanque_test(self, commit=False):
        exp = self.get_test_exploracao("2010-001")
        json = {
            "tanque_id": "2010-001-002",
            "estado": "Operacional",
            "esp_culti": "Peixe gato",
            "tipo": "Gaiola",
            "actividade": exp.actividade.gid,
        }
        tanque = Entity.create_from_json(json)
        self.request.db.add(tanque)
        commit and self.request.db.commit()
        return tanque

    def test_update_tanque(self):
        expected = self.create_tanque_test(commit=True)
        gid = expected.gid
        self.request.matchdict.update(dict(id=gid))
        expected_json = build_json(self.request, expected)
        expected_json["tipo"] = "Tanque"
        expected_json["cumprimen"] = 3
        expected_json[
            "observacio"
        ] = "Un texto largo con ñ y palabras con tilde como camión"
        expected_json["venda"] = 33
        self.request.json_body = expected_json
        tanques_piscicolas_update(self.request)
        actual = self.request.db.query(Entity).filter(Entity.gid == gid).first()
        self.assertEquals("Tanque", actual.tipo)
        self.assertEquals(3, actual.cumprimen)
        self.assertEquals(
            "Un texto largo con ñ y palabras con tilde como camión", actual.observacio
        )
        self.assertEquals(33, actual.venda)
        self.assertIsNone(actual.the_geom)

    def test_update_tanque_the_geom(self):
        expected = self.create_tanque_test(commit=True)
        gid = expected.gid
        self.assertIsNone(expected.the_geom)
        self.request.matchdict.update(dict(id=gid))
        expected_json = build_json(self.request, expected)
        expected_json["geometry_edited"] = True
        expected_json["geometry"] = {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [40.3566078671374, -12.8577371684984],
                        [40.3773594643965, -12.8576290475983],
                        [40.3774400124151, -12.8723906015176],
                        [40.3566872025163, -12.8724988506617],
                        [40.3566078671374, -12.8577371684984],
                    ]
                ]
            ],
        }
        self.request.json_body = expected_json
        tanques_piscicolas_update(self.request)
        actual = self.request.db.query(Entity).filter(Entity.gid == gid).first()
        # self.assertAlmostEquals(367.77, float(actual.area))
        self.assertTrue(actual.the_geom is not None)

    def test_not_update_tanque_the_geom(self):
        expected = self.create_tanque_test(commit=True)
        gid = expected.gid
        self.assertIsNone(expected.the_geom)
        self.request.matchdict.update(dict(id=gid))
        expected_json = build_json(self.request, expected)
        expected_json["geometry_edited"] = False
        expected_json["geometry"] = {
            "type": "MultiPolygon",
            "coordinates": [
                [
                    [
                        [40.3566078671374, -12.8577371684984],
                        [40.3773594643965, -12.8576290475983],
                        [40.3774400124151, -12.8723906015176],
                        [40.3566872025163, -12.8724988506617],
                        [40.3566078671374, -12.8577371684984],
                    ]
                ]
            ],
        }
        self.request.json_body = expected_json
        tanques_piscicolas_update(self.request)
        actual = self.request.db.query(Entity).filter(Entity.gid == gid).first()
        self.assertIsNone(actual.the_geom)

    def test_update_tanque_delete_the_geom(self):
        # TODO. Fixture for this entity should have a geometry
        # TODO. Fix this test
        # expected = self.create_tanque_test(commit=True)
        # gid = expected.gid
        # self.assertIsNone(expected.the_geom)
        # self.request.matchdict.update(dict(id=gid))
        # expected_json = build_json(self.request, expected)
        # expected_json['geometry_edited'] = True
        # expected_json['geometry'] = None
        # self.request.json_body = expected_json
        # tanques_piscicolas_update(self.request)
        # actual = self.request.db.query(Entity).filter(Entity.gid == gid).first()
        # self.assertIsNone(actual.the_geom)
        # self.assertIsNone(actual.area)
        pass

    def test_update_tanque_validation_fails(self):
        expected = self.create_tanque_test(commit=True)
        gid = expected.gid
        self.request.matchdict.update(dict(id=gid))
        expected_json = build_json(self.request, expected)
        cumprimen = expected_json["cumprimen"]
        expected_json["cumprimen"] = "texto"
        # TODO. Probar con un not null
        self.request.json_body = expected_json
        self.assertRaises(HTTPBadRequest, tanques_piscicolas_update, self.request)
        s = self.create_new_session()
        actual = s.query(Entity).filter(Entity.gid == gid).first()
        self.assertEquals(cumprimen, actual.cumprimen)


if __name__ == "__main__":
    unittest.main()
