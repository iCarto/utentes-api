import datetime
import time
import unittest

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

import config
from base import BaseE2ETest
from testing_database import validate_exp


def login(browser, user):
    browser.get(config.HOST_BASE + "/logout")

    browser.get(config.HOST_BASE + "/login")
    userbox = browser.find_element_by_name("user")
    userbox.send_keys(user["name"])
    passbox = browser.find_element_by_name("passwd")
    passbox.send_keys(user["passwd"])
    browser.find_element_by_name("submit").click()


class TestRenovacaoHappyPath(BaseE2ETest):
    def test_renovacao_happy_path(self):
        login(self.browser, {"name": "test_admin", "passwd": "test_admin"})
        self.browser.get(config.HOST_BASE + "/renovacao.html")

        wait = WebDriverWait(self.browser, 60)
        # it will wait for 250 seconds an element to come into view, you can change the #value
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

    def fill_input_text(self, input_id, text):
        # Esperamos un tiempo concreto para simular los tiempos que tarda de
        # verdad un usuario en poder hacer click. Y poder ver como evoluciona la
        # pantalla
        time.sleep(0.5)
        element = self.browser.find_element_by_id(input_id)
        element.send_keys(text)

    def fill_date_input_text(self, input_id, days=0):
        # By default puts "today". If days is present set the date as
        # today +/- the days
        text = (datetime.date.today() + datetime.timedelta(days=days)).strftime(
            "%d/%m/%Y"
        )
        self.fill_input_text(input_id, text)

    def click_enabled_checkboxes_within_table(self):
        for check in self.browser.find_elements_by_css_selector(
            'table input[type="checkbox"]:enabled'
        ):
            time.sleep(0.5)
            check.click()

    def click_ok_and_accept_modals_in_process(self):
        self.click_element("bt-ok", 1)

        time.sleep(0.5)
        self.browser.find_element_by_css_selector(
            ".bootbox.modal button.bootbox-accept"
        ).click()

        time.sleep(0.5)
        self.browser.find_element_by_css_selector(
            ".bootbox.modal button.bootbox-accept"
        ).click()

    def click_element(self, input_id, seconds_to_wait=0.5):
        time.sleep(seconds_to_wait)
        self.browser.find_element_by_id(input_id).click()


if __name__ == "__main__":
    unittest.main()
