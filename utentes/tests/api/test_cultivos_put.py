# -*- coding: utf-8 -*-


import unittest
from pyramid.httpexceptions import HTTPBadRequest

from utentes.tests.api import DBIntegrationTest
from utentes.models.cultivo import ActividadesCultivos
from utentes.api.cultivos import cultivos_update


def build_json(request, cultivo):
    expected_json = cultivo.__json__(request)
    expected_json.update(expected_json.pop('properties'))
    return expected_json


def create_new_session():
    # La idea de generar una sesión distinta para este último chequeo
    # es que no haya cosas cacheadas en la sesión original
    from pyramid.paster import get_appsettings
    from sqlalchemy import engine_from_config
    from sqlalchemy.orm import sessionmaker
    settings = get_appsettings('development.ini', 'main')
    engine = engine_from_config(settings, 'sqlalchemy.')
    session = sessionmaker()
    session.configure(bind=engine)
    return session()


class CultivosUpdateTests(DBIntegrationTest):

    def test_update_cultivo(self):
        expected = self.request.db.query(ActividadesCultivos).filter(ActividadesCultivos.cult_id == '2010-022-01').first()
        gid = expected.gid
        self.request.matchdict.update(dict(id=gid))
        expected_json = build_json(self.request, expected)
        # expected_json['gid'] = json.get('id')
        # expected_json['cult_id'] = json.get('cult_id')
        expected_json['cultivo'] = 'Verduras'
        expected_json['c_estimado'] = 3
        expected_json['rega'] = 'Gravidade'
        expected_json['eficiencia'] = 33
        # expected_json['area'] = 333 auto update from the_geom
        expected_json['observacio'] = 'uma observacio'
        expected_json['the_geom'] = None
        self.request.json_body = expected_json
        cultivos_update(self.request)
        actual = self.request.db.query(ActividadesCultivos).filter(ActividadesCultivos.gid == gid).first()
        self.assertEquals('Verduras', actual.cultivo)
        self.assertEquals(3, actual.c_estimado)
        self.assertEquals('Gravidade', actual.rega)
        self.assertEquals(33, actual.eficiencia)
        self.assertIsNone(actual.area)
        self.assertEquals('uma observacio', actual.observacio)
        self.assertIsNone(actual.the_geom)

    def test_update_cultivo_the_geom(self):
        expected = self.request.db.query(ActividadesCultivos).filter(ActividadesCultivos.cult_id == '2010-022-01').first()
        gid = expected.gid
        self.request.matchdict.update(dict(id=gid))
        expected_json = build_json(self.request, expected)
        expected_json['geometry_edited'] = True
        expected_json['geometry'] = {
            "type": "MultiPolygon",
            "coordinates": [[[
                [40.3566078671374, -12.8577371684984],
                [40.3773594643965, -12.8576290475983],
                [40.3774400124151, -12.8723906015176],
                [40.3566872025163, -12.8724988506617],
                [40.3566078671374, -12.8577371684984]
                ]]]
        }
        self.request.json_body = expected_json
        cultivos_update(self.request)
        actual = self.request.db.query(ActividadesCultivos).filter(ActividadesCultivos.gid == gid).first()
        self.assertAlmostEquals(367.77, float(actual.area))

    def test_not_update_cultivo_the_geom(self):
        expected = self.request.db.query(ActividadesCultivos).filter(ActividadesCultivos.cult_id == '2010-022-01').first()
        gid = expected.gid
        self.request.matchdict.update(dict(id=gid))
        expected_json = build_json(self.request, expected)
        expected_json['geometry_edited'] = False
        expected_json['geometry'] = {
            "type": "MultiPolygon",
            "coordinates": [[[
                [40.3566078671374, -12.8577371684984],
                [40.3773594643965, -12.8576290475983],
                [40.3774400124151, -12.8723906015176],
                [40.3566872025163, -12.8724988506617],
                [40.3566078671374, -12.8577371684984]
                ]]]
        }
        self.request.json_body = expected_json
        cultivos_update(self.request)
        actual = self.request.db.query(ActividadesCultivos).filter(ActividadesCultivos.gid == gid).first()
        self.assertIsNone(actual.the_geom)

    def test_update_cultivo_delete_the_geom(self):
        # TODO. Fixture for this entity should have a geometry
        expected = self.request.db.query(ActividadesCultivos).filter(ActividadesCultivos.cult_id == '2010-022-01').first()
        gid = expected.gid
        self.request.matchdict.update(dict(id=gid))
        expected_json = build_json(self.request, expected)
        expected_json['geometry_edited'] = True
        expected_json['geometry'] = None
        self.request.json_body = expected_json
        cultivos_update(self.request)
        actual = self.request.db.query(ActividadesCultivos).filter(ActividadesCultivos.gid == gid).first()
        self.assertIsNone(actual.the_geom)
        self.assertIsNone(actual.area)

    def test_update_cultivo_validation_fails(self):
        expected = self.request.db.query(ActividadesCultivos).filter(ActividadesCultivos.cult_id == '2010-022-01').first()
        gid = expected.gid
        self.request.matchdict.update(dict(id=gid))
        expected_json = build_json(self.request, expected)
        rega = expected_json['rega']
        expected_json['rega'] = None
        self.request.json_body = expected_json
        self.assertRaises(HTTPBadRequest, cultivos_update, self.request)
        s = create_new_session()
        actual = s.query(ActividadesCultivos).filter(ActividadesCultivos.gid == gid).first()
        self.assertEquals(rega, actual.rega)

if __name__ == '__main__':
    unittest.main()
