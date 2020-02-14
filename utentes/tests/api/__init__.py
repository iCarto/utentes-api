import unittest

from pyramid import testing
from pyramid.paster import get_appsettings
from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound

import utentes.models.constants as c
from utentes.models.actividade import ActividadesPiscicultura
from utentes.models.exploracao import Exploracao, ExploracaoBase
from utentes.models.utente import Utente
from webob.multidict import MultiDict


settings = get_appsettings("development.ini", "main")
settings["sqlalchemy.url"] = "postgresql://postgres@localhost:9001/test_aranorte"
engine = engine_from_config(settings, "sqlalchemy.")
session_factory = sessionmaker()


class DBIntegrationTest(unittest.TestCase):
    def setUp(self):
        self.config = testing.setUp()

        from pyramid.threadlocal import get_current_registry

        settings = get_current_registry().settings
        settings["ara"] = "ARAN"

        self.connection = engine.connect()
        self.transaction = self.connection.begin()
        self.db_session = session_factory(bind=self.connection)
        self.request = testing.DummyRequest()
        self.request.GET = MultiDict()
        self.request.db = self.db_session

    def tearDown(self):
        testing.tearDown()
        self.transaction.rollback()
        self.db_session.close()
        self.connection.close()

    def get_test_exploracao(self):
        from utentes.models.exploracao import Exploracao
        from utentes.models.fonte import Fonte
        from utentes.models.licencia import Licencia
        from sqlalchemy import select, func

        # Explotación licenciada con al menos una fuente y una sóla licencia
        at_lest_one_source = (
            select([func.count(Exploracao.fontes)])
            .where(Exploracao.gid == Fonte.exploracao)
            .as_scalar()
        )
        only_one_license = (
            select([func.count(Exploracao.licencias)])
            .where(Exploracao.gid == Licencia.exploracao)
            .as_scalar()
        )
        exp = (
            self.request.db.query(Exploracao)
            .filter(
                Exploracao.estado_lic == "Licenciada", Exploracao.c_estimado != None
            )
            .filter(at_lest_one_source > 0)
            .filter(only_one_license == 1)
            .all()[0]
        )

        return exp

    def create_new_session(self):
        # La idea de generar una sesión distinta para este último chequeo
        # es que no haya cosas cacheadas en la sesión original
        from pyramid.paster import get_appsettings
        from sqlalchemy import engine_from_config
        from sqlalchemy.orm import sessionmaker

        settings = get_appsettings("development.ini", "main")
        settings[
            "sqlalchemy.url"
        ] = "postgresql://postgres@localhost:9001/test_aranorte"
        engine = engine_from_config(settings, "sqlalchemy.")
        session = sessionmaker()
        session.configure(bind=engine)
        return session()


class TanquesPiscicolasTests(DBIntegrationTest):
    def create_tanque_test(self, commit=False):
        actv = self.request.db.query(ActividadesPiscicultura).all()[0]
        query = "SELECT exp_id from utentes.exploracaos WHERE gid = " + str(
            actv.exploracao
        )
        exp = list(self.request.db.execute(query))
        actv_json = actv.__json__(self.request)
        actv_json["exp_id"] = exp[0][0]
        tanques = [
            f.__json__(self.request)["properties"]
            for f in actv_json["tanques_piscicolas"]["features"]
        ]
        tanques.append(
            {
                # "tanque_id": "2010-001-002",
                "estado": "Operacional",
                "esp_culti": "Peixe gato",
                "tipo": "Gaiola",
                "actividade": actv.gid,
            }
        )
        actv_json["tanques_piscicolas"] = tanques
        actv.update_from_json(actv_json)
        self.request.db.add(actv)
        commit and self.request.db.commit()
        return actv.tanques_piscicolas[-1]
