import time
import unittest

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from utentes.tests.e2e import config
from utentes.tests.e2e.base import BaseE2ETest, login
from utentes.tests.e2e.testing_database import validate_exp


class TestRenovacaoHappyPath(BaseE2ETest):
    def test_renovacao_happy_path(self):
        login(self.browser, {"name": "test_admin", "passwd": "test_admin"})
        self.browser.get(f"{config.HOST_BASE}/renovacao.html")

        wait = WebDriverWait(self.browser, 60)
        # it will wait for 250 seconds an element to come into view,
        # you can change the #value
        wait.until(
            EC.element_to_be_clickable(
                (By.PARTIAL_LINK_TEXT, self.testing_database.exp_id)
            )
        ).click()

        self.fill_date_input_text("d_soli", -5)
        self.click_enabled_checkboxes_within_table()
        self.click_ok_and_accept_modals_in_process()

        self.click_ok_and_accept_modals_in_process()

        self.click_enabled_checkboxes_within_table()
        self.click_ok_and_accept_modals_in_process()

        self.click_enabled_checkboxes_within_table()
        self.click_ok_and_accept_modals_in_process()

        self.click_enabled_checkboxes_within_table()
        self.click_ok_and_accept_modals_in_process()

        self.fill_date_input_text("d_emissao_sup")
        self.fill_date_input_text("d_validade_sup", 365 * 3)
        self.fill_input_text("c_licencia_sup", "1000")
        self.click_element("bt-imprimir-licencia")
        time.sleep(2)
        self.click_ok_and_accept_modals_in_process()

        self.click_ok_and_accept_modals_in_process()
        time.sleep(1)
        validate_exp(self)
        time.sleep(3)


if __name__ == "__main__":
    unittest.main()
