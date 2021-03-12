import datetime
import logging
import unittest

from sqlalchemy.orm import Session

from utentes.erp.model import ExploracaosERP, FacturacaoERP
from utentes.models.constants import K_IRREGULAR, K_SUBTERRANEA, K_SUPERFICIAL
from utentes.models.exploracao import Exploracao
from utentes.tests.api import DBIntegrationTest
from utentes.tests.api.create_test_data_for_erp import (
    create_test_exploracao,
    create_test_exploracao_erp,
    create_test_invoice,
    create_test_licencia,
)


logging.basicConfig()
logger = logging.getLogger("sqlalchemy")
logger.setLevel(logging.WARN)


def get_from_actual(actual, lookfor):
    exp_id = lookfor.exp_id
    link_id = ExploracaosERP().update_link_id(lookfor)
    for e in actual:
        if e["Nro_Exploracao"] == exp_id or e["IDuCli"] == link_id:
            return e


def get_from_actual_invoices(actual, lookfor):
    link_id = FacturacaoERP().update_link_id(lookfor)
    for e in actual:
        if e["IDuFac"] == link_id:
            return e


class ERPIntegrationTests(DBIntegrationTest):
    def data_for_clients(self):
        db = self.request.db
        db.query(Exploracao).delete()
        db.query(ExploracaosERP).delete()
        db.query(FacturacaoERP).delete()
        db.flush()
        self.not_invoizable_not_exportable = create_test_exploracao(
            estado_lic=K_IRREGULAR
        )
        db.add(self.not_invoizable_not_exportable)
        self.invoizable_not_exportable = create_test_exploracao(
            created_at=datetime.datetime(2020, 12, 1)
        )
        db.add(self.invoizable_not_exportable)
        self.anulada_by_state_change = create_test_exploracao()
        db.add(self.anulada_by_state_change)
        self.anulada_by_deletion = create_test_exploracao()
        db.add(self.anulada_by_deletion)
        self.exp_sub_exists = create_test_exploracao()
        self.exp_sub_sup_new = create_test_exploracao()
        self.exp_sub_sup_new.licencias.append(
            create_test_licencia(self.exp_sub_sup_new.exp_id, tipo_agua=K_SUPERFICIAL)
        )

        db.add(self.exp_sub_exists)
        db.add(self.exp_sub_sup_new)

        db.flush()
        erp_exp_sub_exists = create_test_exploracao_erp(self.exp_sub_exists)
        db.add(erp_exp_sub_exists)
        erp_anulada_by_state_change = create_test_exploracao_erp(
            self.anulada_by_state_change
        )
        db.add(erp_anulada_by_state_change)
        self.anulada_by_state_change.estado_lic = K_IRREGULAR
        erp_anulada_by_deletion = create_test_exploracao_erp(self.anulada_by_deletion)
        db.add(erp_anulada_by_deletion)
        db.flush()
        db.delete(self.anulada_by_deletion)
        db.flush()

        self.not_exportable_invoice_for_not_exportable_exp = create_test_invoice(
            self.invoizable_not_exportable, 2021, 2
        )
        db.add(self.not_exportable_invoice_for_not_exportable_exp)

        self.not_exportable_invoice_for_old_date = create_test_invoice(
            self.exp_sub_exists, 2021, 2
        )
        db.add(self.not_exportable_invoice_for_old_date)

        self.invoice_for_exp_sub_exists = create_test_invoice(
            self.exp_sub_exists, 2021, 4, pago_mes=5
        )
        db.add(self.invoice_for_exp_sub_exists)

        self.not_exportable_invoice_after_manual_sync_for_not_exportable_exp = (
            create_test_invoice(self.invoizable_not_exportable, 2021, 4)
        )
        db.add(self.not_exportable_invoice_after_manual_sync_for_not_exportable_exp)

    def test_clients(self):
        from utentes.erp.clients import get_and_update_bd

        self.data_for_clients()

        self.request.db.expire_all()
        actual = get_and_update_bd(self.request.db)

        exp_sub_exists = get_from_actual(actual, self.exp_sub_exists)
        exp_sub_sup_new = get_from_actual(actual, self.exp_sub_sup_new)

        self.assertEqual(K_SUBTERRANEA, exp_sub_exists["Tipo_Agua"])
        self.assertEqual("Ambas", exp_sub_sup_new["Tipo_Agua"])
        self.assertEqual("Existente", exp_sub_exists["estado"])
        self.assertEqual("Novo", exp_sub_sup_new["estado"])
        self.assertEqual(self.exp_sub_exists.exp_name, exp_sub_exists["Nome"])
        self.assertEqual(
            self.exp_sub_exists.utente_rel.nome, exp_sub_exists["Nome_Comercial"]
        )

        anulada_by_state_change = get_from_actual(actual, self.anulada_by_state_change)
        self.assertEqual("Anulado", anulada_by_state_change["estado"])
        anulada_by_deletion = get_from_actual(actual, self.anulada_by_deletion)
        self.assertEqual("Anulado", anulada_by_deletion["estado"])

        self.assertIsNone(get_from_actual(actual, self.not_invoizable_not_exportable))
        self.assertIsNone(get_from_actual(actual, self.invoizable_not_exportable))

        self.request.db.expire_all()
        actual = get_and_update_bd(self.request.db)

        exp_sub_exists = get_from_actual(actual, self.exp_sub_exists)
        exp_sub_sup_new = get_from_actual(actual, self.exp_sub_sup_new)

        self.assertEqual(K_SUBTERRANEA, exp_sub_exists["Tipo_Agua"])
        self.assertEqual("Ambas", exp_sub_sup_new["Tipo_Agua"])
        self.assertEqual("Existente", exp_sub_exists["estado"])
        self.assertEqual("Existente", exp_sub_sup_new["estado"])  # This changes

        anulada_by_state_change = get_from_actual(actual, self.anulada_by_state_change)
        self.assertIsNone(anulada_by_state_change)  # This changes

        anulada_by_deletion = get_from_actual(actual, self.anulada_by_deletion)
        self.assertIsNone(anulada_by_deletion)  # This changes

        self.assertIsNone(get_from_actual(actual, self.not_invoizable_not_exportable))
        self.assertIsNone(get_from_actual(actual, self.invoizable_not_exportable))

    def test_invoices(self):
        from utentes.erp.invoices import get_and_update_bd

        self.data_for_clients()
        actual = get_and_update_bd(self.request.db)
        self.assertIsNone(
            get_from_actual_invoices(
                actual, self.not_exportable_invoice_for_not_exportable_exp
            )
        )
        self.assertIsNone(
            get_from_actual_invoices(actual, self.not_exportable_invoice_for_old_date)
        )

        self.assertIsNone(
            get_from_actual_invoices(
                actual,
                self.not_exportable_invoice_after_manual_sync_for_not_exportable_exp,
            )
        )

        invoice_for_exp_sub_exists = get_from_actual_invoices(
            actual, self.invoice_for_exp_sub_exists
        )
        self.assertEqual(invoice_for_exp_sub_exists["Estado"], "Novo")
        self.assertEqual(invoice_for_exp_sub_exists["Valor"], 5)
        self.assertEqual(invoice_for_exp_sub_exists["TaxaFixa_Sub"], 2)
        self.assertEqual(invoice_for_exp_sub_exists["Subterranea"], "Subterrânea")
        self.assertEqual(invoice_for_exp_sub_exists["TaxaFixa_Sup"], 0)
        self.assertEqual(invoice_for_exp_sub_exists["Superficial"], "Superficial")

    def test_export_invoice_without_export_client(self):
        from pyramid.httpexceptions import HTTPBadRequest

        from utentes.erp.invoices import get_and_update_bd

        self.data_for_clients()

        self.request.db.add(
            create_test_invoice(self.exp_sub_sup_new, 2021, 4, pago_mes=10)
        )
        self.assertRaises(HTTPBadRequest, get_and_update_bd, self.request.db)


if __name__ == "__main__":
    unittest.main()
