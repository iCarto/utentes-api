import os
import time
import unittest

from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from utentes.api.weap import build_filename
from utentes.tests.e2e import config
from utentes.tests.e2e.base import BaseE2ETest, login
from utentes.tests.e2e.testing_database import create_renovacao


class TestWeapExport(BaseE2ETest):
    def test_renovacao_no_umbeluzi(self):
        create_renovacao(
            self.testing_database.request,
            state="Pendente Parecer Técnico Renovação (DT)",
            other={
                "loc_provin": "Maputo",
                "loc_distri": "Boane",
                "loc_posto": "Boane",
                "loc_unidad": "UGBU",
                "loc_bacia": "Maputo",
            },
        )
        self._go_to_exp_in("/renovacao.html")
        self.assertRaises(
            NoSuchElementException, self.browser.find_element_by_id, "bt-export-demand"
        )
        self.assertRaises(
            NoSuchElementException,
            self.browser.find_element_by_id,
            "p_tec_disp_hidrica",
        )

    def test_renovacao_umbeluzi(self):
        create_renovacao(
            self.testing_database.request,
            state="Pendente Parecer Técnico Renovação (DT)",
            other={
                "loc_provin": "Maputo",
                "loc_distri": "Boane",
                "loc_posto": "Boane",
                "loc_unidad": "UGBU",
                "loc_bacia": "Umbelúzi",
            },
        )
        self._go_to_exp_in("/renovacao.html")
        self.click_element("p_tec_disp_hidrica")
        self.click_element("bt-export-demand")

        time.sleep(2)
        filename = os.path.join(
            config.TMP_DIRECTORY, build_filename(self.testing_database.exp_id)
        )
        self.assertTrue(os.path.isfile(filename))

    def _go_to_exp_in(self, route_path):
        login(self.browser, {"name": "test_admin", "passwd": "test_admin"})
        self.browser.get(f"{config.HOST_BASE}{route_path}")

        wait = WebDriverWait(self.browser, 60)
        wait.until(
            EC.element_to_be_clickable(
                (By.PARTIAL_LINK_TEXT, self.testing_database.exp_id)
            )
        ).click()
        time.sleep(0.5)


if __name__ == "__main__":
    unittest.main()
