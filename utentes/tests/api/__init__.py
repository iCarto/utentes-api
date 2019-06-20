# -*- coding: utf-8 -*-

import unittest

from pyramid import testing
from pyramid.paster import get_appsettings
from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound

settings = get_appsettings("development.ini", "main")
settings["sqlalchemy.url"] = "postgresql://postgres@localhost:5432/aranorte_test"
engine = engine_from_config(settings, "sqlalchemy.")
session_factory = sessionmaker()


class DBIntegrationTest(unittest.TestCase):
    def setUp(self):
        self.config = testing.setUp()
        self.connection = engine.connect()
        self.transaction = self.connection.begin()
        self.db_session = session_factory(bind=self.connection)
        self.request = testing.DummyRequest()
        self.request.db = self.db_session

    def tearDown(self):
        testing.tearDown()
        self.transaction.rollback()
        self.db_session.close()
        self.connection.close()

    def get_test_exploracao(self, exp_id="2010-002"):
        from utentes.models.exploracao import Exploracao

        try:
            return (
                self.request.db.query(Exploracao)
                .filter(Exploracao.exp_id == exp_id)
                .one()
            )
        except (MultipleResultsFound, NoResultFound):
            return None

    def create_new_session(self):
        # La idea de generar una sesión distinta para este último chequeo
        # es que no haya cosas cacheadas en la sesión original
        from pyramid.paster import get_appsettings
        from sqlalchemy import engine_from_config
        from sqlalchemy.orm import sessionmaker

        settings = get_appsettings("development.ini", "main")
        settings[
            "sqlalchemy.url"
        ] = "postgresql://postgres@localhost:5432/aranorte_test"
        engine = engine_from_config(settings, "sqlalchemy.")
        session = sessionmaker()
        session.configure(bind=engine)
        return session()
