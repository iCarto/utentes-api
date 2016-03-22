# -*- coding: utf-8 -*-


import unittest
from pyramid.httpexceptions import HTTPBadRequest

from utentes.tests.api import DBIntegrationTest
from utentes.models.exploracao import Exploracao
from utentes.models.utente import Utente
from utentes.models.actividade import Actividade
from utentes.models.fonte import Fonte
from utentes.models.licencia import Licencia
from utentes.api.exploracaos import exploracaos_update


def build_json(request, exploracao):
    e = exploracao
    expected_json = e.__json__(request)
    expected_json.update(expected_json.pop('properties'))
    expected_json['fontes'] = [f.__json__(request) for f in expected_json['fontes']]
    expected_json['licencias'] = [f.__json__(request) for f in expected_json['licencias']]
    expected_json['actividade'] = expected_json['actividade'].__json__(request)
    if expected_json['actividade'].get('cultivos'):
        expected_json['actividade']['cultivos'] = [f.__json__(request) for f in expected_json['actividade']['cultivos']]
    if expected_json['actividade'].get('reses'):
        expected_json['actividade']['reses'] = [f.__json__(request) for f in expected_json['actividade']['reses']]
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


class ExploracaoUpdateTests(DBIntegrationTest):

    def test_update_exploracao(self):
        pass

    def test_update_exploracao_validation_fails(self):
        pass


class ExploracaoUpdateFonteTests(DBIntegrationTest):

    def test_update_exploracao_create_fonte(self):
        expected = self.request.db.query(Exploracao).filter(Exploracao.exp_id == '2010-002').first()
        gid = expected.gid
        self.request.matchdict.update(dict(id=gid))
        expected_json = build_json(self.request, expected)
        expected_json['fontes'].append({
            'tipo_agua': 'Subterrânea',
            'tipo_fonte': 'Outros',
            'lat_lon': '23,23 42,21',
            'd_dado': '2001-01-01',
            'c_soli': 23.42,
            'c_max': 42.23,
            'c_real': 4.3,
            'contador': False,
            'metodo_est': 'manual',
            'observacio': 'nao'
        })
        self.request.json_body = expected_json
        exploracaos_update(self.request)
        actual = self.request.db.query(Exploracao).filter(Exploracao.gid == gid).first()
        self.assertEquals(2, len(actual.fontes))

    def test_update_exploracao_create_fonte_validation_fails(self):
        expected = self.request.db.query(Exploracao).filter(Exploracao.exp_id == '2010-002').first()
        gid = expected.gid
        self.request.matchdict.update(dict(id=gid))
        expected_json = build_json(self.request, expected)
        expected_json['fontes'].append({
            'tipo_fonte': 'Outros',
        })
        self.request.json_body = expected_json
        self.assertRaises(HTTPBadRequest, exploracaos_update, self.request)
        s = create_new_session()
        actual = s.query(Exploracao).filter(Exploracao.gid == gid).first()
        self.assertEquals(1, len(actual.fontes))

    def test_update_exploracao_update_fonte_values(self):
        expected = self.request.db.query(Exploracao).filter(Exploracao.exp_id == '2010-002').first()
        gid = expected.gid
        gid_fonte = expected.fontes[0].gid
        self.request.matchdict.update(dict(id=gid))
        expected_json = build_json(self.request, expected)
        expected_json['fontes'][0]['tipo_fonte'] = 'Outros'
        expected_json['fontes'][0]['lat_lon'] = '23,23 42,21'
        expected_json['fontes'][0]['d_dado'] = '2001-01-01'
        expected_json['fontes'][0]['c_soli'] = 23.42
        expected_json['fontes'][0]['c_max'] = 42.23
        expected_json['fontes'][0]['c_real'] = 4.3
        expected_json['fontes'][0]['contador'] = False
        expected_json['fontes'][0]['metodo_est'] = 'manual'
        expected_json['fontes'][0]['observacio'] = 'nao'
        self.request.json_body = expected_json
        exploracaos_update(self.request)
        actual = self.request.db.query(Fonte).filter(Fonte.gid == gid_fonte).first()
        self.assertEquals('Outros', actual.tipo_fonte)
        self.assertEquals('23,23 42,21', actual.lat_lon)
        self.assertEquals('2001-01-01', actual.d_dado.isoformat())
        self.assertEquals(23.42, float(actual.c_soli))
        self.assertEquals(42.23, float(actual.c_max))
        self.assertEquals(4.3, float(actual.c_real))
        self.assertEquals(False, actual.contador)
        self.assertEquals('manual', actual.metodo_est)
        self.assertEquals('nao', actual.observacio)
        self.assertEquals(gid, actual.exploracao)

    def test_update_exploracao_update_fonte_validation_fails(self):
        expected = self.request.db.query(Exploracao).filter(Exploracao.exp_id == '2010-002').first()
        gid = expected.gid
        gid_fonte = expected.fontes[0].gid
        self.request.matchdict.update(dict(id=gid))
        expected_json = build_json(self.request, expected)
        tipo_agua = expected_json['fontes'][0]['tipo_agua']
        expected_json['fontes'][0]['tipo_agua'] = None
        self.request.json_body = expected_json
        self.assertRaises(HTTPBadRequest, exploracaos_update, self.request)
        s = create_new_session()
        actual = s.query(Exploracao).filter(Exploracao.gid == gid).first()
        self.assertEquals(tipo_agua, actual.fontes[0].tipo_agua)

    def test_update_exploracao_delete_fonte(self):
        expected = self.request.db.query(Exploracao).filter(Exploracao.exp_id == '2010-002').first()
        gid = expected.gid
        self.request.matchdict.update(dict(id=gid))
        expected_json = build_json(self.request, expected)
        expected_json['fontes'] = []
        self.request.json_body = expected_json
        exploracaos_update(self.request)
        actual = self.request.db.query(Exploracao).filter(Exploracao.gid == gid).first()
        self.assertEquals(0, len(actual.fontes))


class ExploracaoUpdateLicenciaTests(DBIntegrationTest):

    def test_update_exploracao_create_licencia(self):
        expected = self.request.db.query(Exploracao).filter(Exploracao.exp_id == '2010-002').first()
        gid = expected.gid
        self.request.matchdict.update(dict(id=gid))
        expected_json = build_json(self.request, expected)
        lic_nro_first = expected.licencias[0].lic_nro
        lic_nro_second = expected.exp_id + '-{:03d}'.format(len(expected.licencias) + 1)
        expected_json['licencias'].append({
            'lic_nro':    None,
            'lic_tipo':   'Subterrânea',
            'cadastro':   'cadastro',
            'estado':     'Irregular',
            'd_emissao':  '2020-2-2',
            'd_validade': '2010-10-10',
            'c_soli_tot': 4.3,
            'c_soli_int': 2.1,
            'c_soli_fon': 2.2,
            'c_licencia': 10,
            'c_real_tot': 4.3,
            'c_real_int': 0,
            'c_real_fon': 4.3,
        })
        self.request.json_body = expected_json
        exploracaos_update(self.request)
        actual = self.request.db.query(Exploracao).filter(Exploracao.gid == gid).first()
        self.assertEquals(2, len(actual.licencias))
        for lic in actual.licencias:
            self.assertIn(lic.lic_nro, [lic_nro_first, lic_nro_second])

    def test_update_exploracao_create_licencia_validation_fails(self):
        expected = self.request.db.query(Exploracao).filter(Exploracao.exp_id == '2010-002').first()
        gid = expected.gid
        self.request.matchdict.update(dict(id=gid))
        expected_json = build_json(self.request, expected)
        expected_json['licencias'].append({
            'lic_tipo':   None,
        })
        self.request.json_body = expected_json
        self.assertRaises(HTTPBadRequest, exploracaos_update, self.request)
        s = create_new_session()
        actual = s.query(Exploracao).filter(Exploracao.gid == gid).first()
        self.assertEquals(1, len(actual.licencias))

    def test_update_exploracao_create_licencia_update_lic_nro(self):
        expected = self.request.db.query(Exploracao).filter(Exploracao.exp_id == '2010-002').first()
        gid = expected.gid
        self.request.matchdict.update(dict(id=gid))
        expected_json = build_json(self.request, expected)
        # in test data, lic_nro_first is 'expid-001'
        lic_nro_first = expected.licencias[0].lic_nro
        lic_nro_second = expected.exp_id + '-002'
        lic_nro_third = expected.exp_id + '-003'
        expected_json['licencias'].append({
            'lic_nro':    None,
            'lic_tipo':   'Subterrânea',
            'cadastro':   'cadastro',
            'estado':     'Irregular',
            'c_soli_tot': 4.3,
            'c_soli_int': 2.1,
            'c_soli_fon': 2.2,
            'c_licencia': 10,
            'c_real_tot': 4.3,
            'c_real_int': 0,
            'c_real_fon': 4.3,
        })
        self.request.json_body = expected_json
        exploracaos_update(self.request)
        actual = self.request.db.query(Exploracao).filter(Exploracao.gid == gid).first()
        self.assertEquals(2, len(actual.licencias))
        for lic in actual.licencias:
            self.assertIn(lic.lic_nro, [lic_nro_first, lic_nro_second])

        # delete first license, with lic_nro expid-001
        expected_json = build_json(self.request, actual)
        for lic in expected_json['licencias']:
            if lic['lic_nro'] == lic_nro_first:
                expected_json['licencias'].remove(lic)
                break
        self.request.json_body = expected_json
        exploracaos_update(self.request)
        # add new one
        expected_json['licencias'].append({
            'lic_nro':    None,
            'lic_tipo':   'Superficial',
            'estado':     'Irregular',
        })
        self.request.json_body = expected_json
        exploracaos_update(self.request)
        exploracao = self.request.db.query(Exploracao).filter(Exploracao.gid == gid).first()
        self.assertEquals(2, len(exploracao.licencias))
        for lic in exploracao.licencias:
            self.assertIn(lic.lic_nro, [lic_nro_second, lic_nro_third])

    def test_update_exploracao_update_licencia(self):
        expected = self.request.db.query(Exploracao).filter(Exploracao.exp_id == '2010-002').first()
        gid = expected.gid
        lic_gid = expected.licencias[0].gid
        lic_nro = expected.licencias[0].lic_nro
        self.request.matchdict.update(dict(id=gid))
        expected_json = build_json(self.request, expected)
        expected_json['licencias'][0]['cadastro']   = 'cadastro'
        expected_json['licencias'][0]['estado']     = 'Denegada'
        expected_json['licencias'][0]['d_emissao']  = '1999-9-9'
        expected_json['licencias'][0]['d_validade'] = '1999-8-7'
        expected_json['licencias'][0]['c_soli_tot'] = 23.45
        expected_json['licencias'][0]['c_soli_int'] = 0.45
        expected_json['licencias'][0]['c_soli_fon'] = 23
        expected_json['licencias'][0]['c_licencia'] = 999
        expected_json['licencias'][0]['c_real_tot'] = 23.45
        expected_json['licencias'][0]['c_real_int'] = 0.45
        expected_json['licencias'][0]['c_real_fon'] = 23
        self.request.json_body = expected_json
        exploracaos_update(self.request)
        actual = self.request.db.query(Exploracao).filter(Exploracao.gid == gid).first()
        self.assertEquals(1, len(actual.licencias))
        self.assertEquals(lic_gid, actual.licencias[0].gid)
        self.assertEquals(lic_nro, actual.licencias[0].lic_nro)
        self.assertEquals('cadastro', actual.licencias[0].cadastro)
        self.assertEquals('Denegada', actual.licencias[0].estado)
        self.assertEquals('1999-09-09', actual.licencias[0].d_emissao.isoformat())
        self.assertEquals('1999-08-07', actual.licencias[0].d_validade.isoformat())
        self.assertEquals(23.45, float(actual.licencias[0].c_soli_tot))
        self.assertEquals(0.45, float(actual.licencias[0].c_soli_int))
        self.assertEquals(23, float(actual.licencias[0].c_soli_fon))
        self.assertEquals(999, float(actual.licencias[0].c_licencia))
        self.assertEquals(23.45, float(actual.licencias[0].c_real_tot))
        self.assertEquals(0.45, float(actual.licencias[0].c_real_int))
        self.assertEquals(23, float(actual.licencias[0].c_real_fon))

    def test_update_exploracao_update_licencia_validation_fails(self):
        expected = self.request.db.query(Exploracao).filter(Exploracao.exp_id == '2010-002').first()
        gid = expected.gid
        lic_gid = expected.licencias[0].gid
        lic_tipo = expected.licencias[0].lic_tipo
        self.request.matchdict.update(dict(id=gid))
        expected_json = build_json(self.request, expected)
        expected_json['licencias'][0]['lic_tipo'] = None
        self.request.json_body = expected_json
        self.assertRaises(HTTPBadRequest, exploracaos_update, self.request)
        s = create_new_session()
        actual = s.query(Exploracao).filter(Exploracao.gid == gid).first()
        self.assertEquals(1, len(actual.licencias))
        self.assertEquals(lic_gid, actual.licencias[0].gid)
        self.assertEquals(lic_tipo, actual.licencias[0].lic_tipo)

    def test_update_exploracao_delete_licencia(self):
        expected = self.request.db.query(Exploracao).filter(Exploracao.exp_id == '2010-002').first()
        gid = expected.gid
        lic_gid = expected.licencias[0].gid
        self.request.matchdict.update(dict(id=gid))
        expected_json = build_json(self.request, expected)
        expected_json['licencias'] = []
        self.request.json_body = expected_json
        exploracaos_update(self.request)
        actual = self.request.db.query(Exploracao).filter(Exploracao.gid == gid).first()
        lic_count = self.request.db.query(Licencia).filter(Licencia.gid == lic_gid).count()
        self.assertEquals(0, len(actual.licencias))
        self.assertEquals(0, lic_count)


class ExploracaoUpdateUtenteTests(DBIntegrationTest):

    def get_test_exploracao(self):
        EXP_ID = '2010-002'
        try:
            return self.request.db.query(Exploracao).filter(Exploracao.exp_id == EXP_ID).one()
        except (MultipleResultsFound, NoResultFound):
            return None

    def get_test_utente(self):
        UTENTE_NAME = 'Águas de Mueda'
        try:
            return self.request.db.query(Utente).filter(Utente.nome == UTENTE_NAME).one()
        except (MultipleResultsFound, NoResultFound):
            return None

    def test_update_exploracao_update_utente_values(self):
        exp = self.get_test_exploracao()
        gid = exp.gid
        self.request.matchdict.update(dict(id=gid))
        expected = self.request.db.query(Exploracao).filter(Exploracao.gid == gid).first()
        expected_json = build_json(self.request, expected)
        expected_json['utente']['nuit'] = 'new nuit'
        expected_json['utente']['entidade'] = 'new entidade'
        expected_json['utente']['reg_comerc'] = 'new reg_comerc'
        expected_json['utente']['reg_zona'] = 'new reg_zona'
        expected_json['utente']['loc_provin'] = 'Niassa'
        expected_json['utente']['loc_distri'] = 'Lago'
        expected_json['utente']['loc_posto'] = 'Cobue'
        expected_json['utente']['loc_nucleo'] = 'new loc_nucleo'
        expected_json['utente']['observacio'] = 'new observacio'
        self.request.json_body = expected_json
        exploracaos_update(self.request)
        actual = self.request.db.query(Exploracao).filter(Exploracao.gid == gid).first()
        self.assertEquals('new nuit', actual.utente_rel.nuit)
        self.assertEquals('new entidade', actual.utente_rel.entidade)
        self.assertEquals('new reg_comerc', actual.utente_rel.reg_comerc)
        self.assertEquals('new reg_zona', actual.utente_rel.reg_zona)
        self.assertEquals('Niassa', actual.utente_rel.loc_provin)
        self.assertEquals('Lago', actual.utente_rel.loc_distri)
        self.assertEquals('Cobue', actual.utente_rel.loc_posto)
        self.assertEquals('new loc_nucleo', actual.utente_rel.loc_nucleo)
        self.assertEquals('new observacio', actual.utente_rel.observacio)

    def test_update_exploracao_update_utente_validation_fails(self):
        exp = self.get_test_exploracao()
        gid = exp.gid
        self.request.matchdict.update(dict(id=gid))
        expected = self.request.db.query(Exploracao).filter(Exploracao.gid == gid).first()
        expected_json = build_json(self.request, expected)
        expected_json['utente']['nome'] = None
        self.request.json_body = expected_json
        self.assertRaises(HTTPBadRequest, exploracaos_update, self.request)
        s = create_new_session()
        actual = s.query(Exploracao).filter(Exploracao.gid == gid).first()
        self.assertEquals(expected.utente_rel.nome, actual.utente_rel.nome)

    def test_update_exploracao_rename_utente(self):
        '''
        Tests that the related utente can be renamed from the exploracao,
        and a new utente is not created
        '''
        exp = self.get_test_exploracao()
        gid = exp.gid
        self.request.matchdict.update(dict(id=gid))
        expected = self.request.db.query(Exploracao).filter(Exploracao.gid == gid).first()
        expected_utente_gid = expected.utente
        expected_json = build_json(self.request, expected)
        expected_json['utente']['nome'] = 'foo - bar'
        self.request.json_body = expected_json
        exploracaos_update(self.request)
        actual = self.request.db.query(Exploracao).filter(Exploracao.gid == gid).first()
        self.assertEquals(expected_utente_gid, actual.utente)
        self.assertEquals('foo - bar', actual.utente_rel.nome)
        u = self.request.db.query(Utente).filter(Utente.gid == expected_utente_gid).first()
        self.assertEquals('foo - bar', u.nome)

    def test_update_exploracao_rename_utente_validation_fails(self):
        exp = self.get_test_exploracao()
        gid = exp.gid
        self.request.matchdict.update(dict(id=gid))
        expected = self.request.db.query(Exploracao).filter(Exploracao.gid == gid).first()
        expected_utente_gid = expected.utente
        expected_json = build_json(self.request, expected)
        expected_json['utente']['nome'] = 'foo - bar'
        expected_json['c_soli'] = 'text'
        self.request.json_body = expected_json
        self.assertRaises(HTTPBadRequest, exploracaos_update, self.request)

    def test_update_exploracao_change_utente(self):
        exp = self.get_test_exploracao()
        gid = exp.gid
        utente = self.get_test_utente()

        self.request.matchdict.update(dict(id=gid))
        expected = self.request.db.query(Exploracao).filter(Exploracao.gid == gid).first()
        expected_json = build_json(self.request, expected)
        expected_json['utente']['id'] = utente.gid
        expected_json['utente']['nome'] = utente.nome
        expected_json['utente']['nuit'] = utente.nuit
        expected_json['utente']['entidade'] = utente.entidade
        expected_json['utente']['reg_comerc'] = utente.reg_comerc
        expected_json['utente']['reg_zona'] = utente.reg_zona
        expected_json['utente']['loc_provin'] = utente.loc_provin
        expected_json['utente']['loc_distri'] = utente.loc_distri
        expected_json['utente']['loc_posto'] = utente.loc_posto
        expected_json['utente']['loc_nucleo'] = utente.loc_nucleo
        expected_json['utente']['observacio'] = utente.observacio
        self.request.json_body = expected_json
        exploracaos_update(self.request)
        actual = self.request.db.query(Exploracao).filter(Exploracao.gid == gid).first()
        self.assertEquals(utente.nome, actual.utente_rel.nome)

    def test_update_exploracao_new_utente(self):
        exp = self.get_test_exploracao()
        gid = exp.gid

        self.request.matchdict.update(dict(id=gid))
        expected = self.request.db.query(Exploracao).filter(Exploracao.gid == gid).first()
        expected_json = build_json(self.request, expected)
        expected_json['utente']['id'] = None
        expected_json['utente']['nome'] = 'test nome'
        self.request.json_body = expected_json
        exploracaos_update(self.request)
        actual = self.request.db.query(Exploracao).filter(Exploracao.gid == gid).first()
        self.assertEquals('test nome', actual.utente_rel.nome)


class ExploracaoUpdateActividadeTests(DBIntegrationTest):

    def test_update_exploracao_update_actividade_values(self):
        # SELECT a.tipo, e.exp_id FROM actividades AS a INNER JOIN exploracaos AS e ON (a.exploracao = e.gid) ORDER BY exp_id;
        # 2010-002 industria
        expected = self.request.db.query(Exploracao).filter(Exploracao.exp_id == '2010-002').first()
        gid = expected.gid
        self.request.matchdict.update(dict(id=gid))
        expected_json = build_json(self.request, expected)
        expected_json['actividade']['c_estimado'] = 101.11
        self.request.json_body = expected_json
        exploracaos_update(self.request)
        actual = self.request.db.query(Exploracao).filter(Exploracao.gid == gid).first()
        self.assertEquals(101.11, float(actual.actividade.c_estimado))

    def test_update_exploracao_update_actividade_validation_fails(self):
        expected = self.request.db.query(Exploracao).filter(Exploracao.exp_id == '2010-002').first()
        gid = expected.gid
        self.request.matchdict.update(dict(id=gid))
        expected_json = build_json(self.request, expected)
        expected_json['utente']['observacio'] = ' foo - bar '
        expected_json['observacio'] = ' foo - bar '
        expected_json['actividade']['c_estimado'] = 'TEXT'
        self.request.json_body = expected_json
        from pyramid.httpexceptions import HTTPBadRequest
        self.assertRaises(HTTPBadRequest, exploracaos_update, self.request)
        s = create_new_session()
        actual = s.query(Exploracao).filter(Exploracao.gid == gid).first()
        self.assertEquals(expected.utente_rel.observacio, actual.utente_rel.observacio)
        self.assertNotEquals(' foo - bar ', actual.utente_rel.observacio)
        self.assertEquals(expected.observacio, actual.observacio)
        self.assertNotEquals(' foo - bar ', actual.observacio)

    def test_update_exploracao_change_actividade(self):
        expected = self.request.db.query(Exploracao).filter(Exploracao.exp_id == '2010-002').first()
        gid = expected.gid
        gid_actividade = expected.actividade.gid
        self.request.matchdict.update(dict(id=gid))
        expected_json = build_json(self.request, expected)
        # change from industria to saneamento
        expected_json['actividade'] = {
            'id': None,
            'tipo': u'Saneamento',
            'c_estimado': 23,
            'habitantes': 42
        }
        self.request.json_body = expected_json
        exploracaos_update(self.request)
        actual = self.request.db.query(Exploracao).filter(Exploracao.gid == gid).first()
        count_actividade = self.request.db.query(Actividade).filter(Actividade.gid == gid_actividade).count()
        self.assertEquals(0, count_actividade)  # was deleted
        self.assertEquals('Saneamento', actual.actividade.tipo)
        self.assertEquals(23, actual.actividade.c_estimado)
        self.assertEquals(42, actual.actividade.habitantes)

    def test_update_exploracao_update_actividade_pecuaria_delete_res(self):
        expected = self.request.db.query(Exploracao).filter(Exploracao.exp_id == '2010-029').first()
        self.request.matchdict.update(dict(id=expected.gid))
        expected_json = build_json(self.request, expected)
        expected_json['actividade']['reses'] = [res for res in expected_json['actividade']['reses'] if res['id'] != 2]
        self.request.json_body = expected_json
        exploracaos_update(self.request)
        actual = self.request.db.query(Exploracao).filter(Exploracao.exp_id == '2010-029').first()
        reses = actual.actividade.reses
        self.assertEquals(2, len(reses))
        self.assertEquals(reses[0].gid, 1)
        self.assertEquals(reses[1].gid, 3)

    def test_update_exploracao_update_actividade_pecuaria_update_res(self):
        expected = self.request.db.query(Exploracao).filter(Exploracao.exp_id == '2010-029').first()
        self.request.matchdict.update( dict(id= expected.gid) )
        expected_json = build_json(self.request, expected)
        for res in expected_json['actividade']['reses']:
            if res['id'] == 1:
                res['c_estimado'] = 9999.88
        self.request.json_body = expected_json
        exploracaos_update(self.request)
        actual = self.request.db.query(Exploracao).filter(Exploracao.exp_id == '2010-029').first()
        reses = actual.actividade.reses
        self.assertEquals(3, len(reses))
        self.assertEquals(float(reses[0].c_estimado), 9999.88)
        self.assertEquals(reses[0].gid, 1)
        self.assertEquals(reses[1].gid, 2)
        self.assertEquals(reses[2].gid, 3)

    def test_update_exploracao_update_actividade_pecuaria_create_res(self):
        expected = self.request.db.query(Exploracao).filter(Exploracao.exp_id == '2010-029').first()
        self.request.matchdict.update( dict(id= expected.gid) )
        expected_json = build_json(self.request, expected)
        expected_json['actividade']['reses'].append({
            'c_estimado': 40,
            'reses_tipo': 'Vacuno (Vacas)',
            'reses_nro': 400,
            'c_res': 4000,
        })
        self.request.json_body = expected_json
        exploracaos_update(self.request)
        actual = self.request.db.query(Exploracao).filter(Exploracao.exp_id == '2010-029').first()
        reses = actual.actividade.reses
        self.assertEquals(4, len(reses))
        self.assertEquals(reses[3].c_estimado, 40)
        self.assertEquals(reses[3].c_res, 4000)
        self.assertEquals(reses[0].gid, 1)
        self.assertEquals(reses[1].gid, 2)
        self.assertEquals(reses[2].gid, 3)

    def test_update_exploracao_update_actividade_pecuaria_create_update_delete_res(self):
        expected = self.request.db.query(Exploracao).filter(Exploracao.exp_id == '2010-029').first()
        self.request.matchdict.update(dict(id=expected.gid))
        expected_json = build_json(self.request, expected)
        expected_json['actividade']['reses'] = [res for res in expected_json['actividade']['reses'] if res['id'] != 3]
        expected_json['actividade']['reses'].append({
            'c_estimado': 50,
            'reses_tipo': 'Vacuno (Vacas)',
            'reses_nro': 500,
            'c_res': 5000,
        })
        for res in expected_json['actividade']['reses']:
            if res.get('id') == 2:
                res['c_estimado'] = 9999.77
        self.request.json_body = expected_json
        exploracaos_update(self.request)
        actual = self.request.db.query(Exploracao).filter(Exploracao.exp_id == '2010-029').first()
        reses = actual.actividade.reses
        self.assertEquals(3, len(reses))
        self.assertEquals(float(reses[1].c_estimado), 9999.77)
        self.assertEquals(reses[0].gid, 1)
        self.assertEquals(reses[1].gid, 2)
        self.assertEquals(reses[2].c_estimado, 50)
        self.assertEquals(reses[2].c_res, 5000)


if __name__ == '__main__':
    unittest.main()
