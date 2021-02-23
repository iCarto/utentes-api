import datetime
import json
import os

from pyramid import testing
from pyramid.paster import get_appsettings
from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker

from utentes.lib.utils.dicts import merge_nested_dict
from utentes.models.exploracao import Exploracao
from utentes.models.renovacao import Renovacao
from utentes.models.user import User


def create_test_admin(request):
    request.db.query(User).filter(User.username == "test_admin").delete()
    user = User(username="test_admin", usergroup="Administrador")
    user.set_password("test_admin")
    request.db.add(user)
    request.db.commit()


def delete_test_admin(request):
    request.db.query(User).filter(User.username == "test_admin").delete()
    request.db.commit()


def delete_exp(request, exp_id):
    request.db.query(Exploracao).filter(Exploracao.exp_id == exp_id).delete()
    request.db.commit()


def create_exp(request, data):
    delete_exp(request, data["exp_id"])
    Exploracao._which_exp_id_should_be_used = lambda other, request, body: data.get(
        "exp_id"
    )
    e = Exploracao.create_from_json(request, data)
    e.utente = 588
    request.db.add(e)
    request.db.commit()
    return e


def get_data_file(name):
    current_path = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(current_path, "data", name)


def get_data():
    file_data = get_data_file("exp.json")
    with open(file_data) as f:
        data = json.load(f)
    return data


def create_renovacao(request, state, other):
    data = merge_nested_dict(get_data(), other)
    exp = create_exp(request, data)

    renovacao = Renovacao()
    renovacao.exploracao = exp.gid
    renovacao.exp_id = exp.exp_id
    renovacao.estado = state
    request.db.add(renovacao)
    request.db.commit()


def create_exp_piscicola(request):
    data = get_data()
    file_data = get_data_file("piscicultura.json")
    with open(file_data) as f:
        data["actividade"] = json.load(f)
    return create_exp(request, data)


def validate_exp(self):
    expected = get_data()
    e = (
        self.testing_database.request.db.query(Exploracao)
        .filter(Exploracao.exp_id == expected["exp_id"])
        .one()
    )
    self.assertEqual(e.estado_lic, expected["estado_lic"])
    self.assertEqual(e.c_licencia, 1000)
    self.assertEqual(len(e.licencias), 1)
    self.assertEqual(e.licencias[0].c_licencia, 1000)
    self.assertEqual(e.licencias[0].d_emissao, datetime.date.today())
    validate_actv_regadio(self, e.actividade, expected["actividade"])
    validate_fontes(self, e.fontes, expected["fontes"])


def validate_fontes(self, actual, expected):
    self.assertEqual(len(actual), 1)
    self.assertEqual(actual[0].tipo_agua, expected[0]["tipo_agua"])


def validate_actv_regadio(self, actual, expected):
    self.assertEqual(actual.tipo, expected["tipo"])
    self.assertEqual(actual.c_estimado, expected["c_estimado"])
    self.assertEqual(actual.n_cul_tot, expected["n_cul_tot"])
    self.assertEqual(actual.area_medi, expected["area_medi"])
    validate_cultivos(self, actual.cultivos, expected["cultivos"])


def validate_cultivos(self, actual, expected):
    self.assertEqual(len(actual), 1)
    self.assertEqual(actual[0].cult_id, expected[0]["cult_id"])
    self.assertEqual(
        actual[0].c_estimado,
        expected[0]["c_estimado"],
    )
    self.assertEqual(actual[0].cultivo, expected[0]["cultivo"])


class TestingDatabase(object):
    def start(self):
        settings = get_appsettings("development.ini")
        engine = engine_from_config(settings, "sqlalchemy.")
        session_factory = sessionmaker()
        self.connection = engine.connect()
        # self.transaction = self.connection.begin()
        self.db_session = session_factory(bind=self.connection)
        self.request = testing.DummyRequest()
        self.request.registry.settings["ara"] = "ARAS"
        # self.request.GET = MultiDict()
        self.request.db = self.db_session

        e = create_exp(self.request, get_data())
        self.exp_id = e.exp_id
        self.test_e = e
        create_test_admin(self.request)

    def stop(self):
        delete_test_admin(self.request)
        delete_exp(self.request, self.exp_id)
        self.db_session.close()
        self.connection.close()
        # self.transaction.rollback()
