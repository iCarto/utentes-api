# -*- coding: utf-8 -*-

import unittest

from utentes.api.exploracaos import exploracaos_delete
from utentes.models.actividade import Actividade
from utentes.models.exploracao import Exploracao
from utentes.models.fonte import Fonte
from utentes.models.licencia import Licencia
from utentes.models.utente import Utente
from utentes.tests.api import DBIntegrationTest


class ExploracaosDeleteTests(DBIntegrationTest):
    def test_delete_get_exploracaos_id(self):
        exp = self.get_test_exploracao()
        gid = exp.gid
        gid_utente = exp.utente_rel.gid
        self.request.matchdict.update(dict(id=gid))
        exploracaos_delete(self.request)
        nro_exps = (
            self.request.db.query(Exploracao).filter(Exploracao.gid == gid).count()
        )
        nro_lics = (
            self.request.db.query(Licencia).filter(Licencia.exploracao == gid).count()
        )
        nro_fons = (
            self.request.db.query(Licencia).filter(Fonte.exploracao == gid).count()
        )
        nro_acts = (
            self.request.db.query(Licencia).filter(Actividade.exploracao == gid).count()
        )
        nro_utentes = (
            self.request.db.query(Utente).filter(Utente.gid == gid_utente).count()
        )
        self.assertEquals(0, nro_exps)
        self.assertEquals(0, nro_lics)
        self.assertEquals(0, nro_fons)
        self.assertEquals(0, nro_acts)
        self.assertEquals(1, nro_utentes)


if __name__ == "__main__":
    unittest.main()
