import datetime
import json
import os

from pyramid import testing
from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound


class TestingDatabaseExample:
    def start(self):
        # create the database and populate with some fake data
        db.create_all()
        Role.insert_roles()
        User.generate_fake(10)
        Post.generate_fake(10)

    def stop(self):
        # destroy database
        db.drop_all()
        db.session.remove()


def create_test_admin(request):
    from utentes.models.user import User

    request.db.query(User).filter(User.username == "test_admin").delete()
    user = User(username="test_admin", usergroup="Administrador")
    user.set_password("test_admin")
    request.db.add(user)
    request.db.commit()


def delete_test_admin(request):
    from utentes.models.user import User

    user = request.db.query(User).filter(User.username == "test_admin").delete()
    request.db.commit()


def create_exp(request, data):
    from utentes.models.exploracao import Exploracao

    try:
        to_remove = (
            request.db.query(Exploracao)
            .filter(Exploracao.exp_id == data["exp_id"])
            .one()
        )
        request.db.delete(to_remove)
        request.db.commit()
    except (MultipleResultsFound, NoResultFound):
        print("no existía")
    Exploracao._which_exp_id_should_be_used = lambda self, request, body: data.get(
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


def create_exp_piscicola(request):
    data = get_data()
    file_data = get_data_file("piscicultura.json")
    with open(file_data) as f:
        data["actividade"] = json.load(f)
    return create_exp(request, data)


def delete_exp(request, exp_id):
    from utentes.models.exploracao import Exploracao

    try:
        e = request.db.query(Exploracao).filter(Exploracao.exp_id == exp_id).one()
        request.db.delete(e)
    except (MultipleResultsFound, NoResultFound):
        print("no existía")
    request.db.commit()


def validate_exp(self):
    from utentes.models.exploracao import Exploracao

    EXP = get_data()
    e = (
        self.testing_database.request.db.query(Exploracao)
        .filter(Exploracao.exp_id == EXP["exp_id"])
        .one()
    )
    self.assertEqual(e.estado_lic, EXP["estado_lic"])
    self.assertEqual(e.c_licencia, 1000)
    self.assertEqual(len(e.licencias), 1)
    self.assertEqual(e.licencias[0].c_licencia, 1000)
    self.assertEqual(e.licencias[0].d_emissao, datetime.date.today())
    self.assertEqual(e.actividade.tipo, EXP["actividade"]["tipo"])
    self.assertEqual(e.actividade.c_estimado, EXP["actividade"]["c_estimado"])
    self.assertEqual(e.actividade.n_cul_tot, EXP["actividade"]["n_cul_tot"])
    self.assertEqual(e.actividade.area_medi, EXP["actividade"]["area_medi"])
    self.assertEqual(len(e.actividade.cultivos), 1)
    self.assertEqual(
        e.actividade.cultivos[0].cult_id, EXP["actividade"]["cultivos"][0]["cult_id"]
    )
    self.assertEqual(
        e.actividade.cultivos[0].c_estimado,
        EXP["actividade"]["cultivos"][0]["c_estimado"],
    )
    self.assertEqual(
        e.actividade.cultivos[0].cultivo, EXP["actividade"]["cultivos"][0]["cultivo"]
    )
    self.assertEqual(len(e.fontes), 1)
    self.assertEqual(e.fontes[0].tipo_agua, EXP["fontes"][0]["tipo_agua"])


class TestingDatabase:
    def start(self):
        from pyramid.paster import get_appsettings
        from sqlalchemy import engine_from_config
        from sqlalchemy.orm import sessionmaker
        from webob.multidict import MultiDict

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
