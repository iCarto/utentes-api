# https://gist.github.com/miohtama/2888855
# https://selenium-python.readthedocs.io/
# https://peter.sh/experiments/chromium-command-line-switches/
# https://blog.miguelgrinberg.com/post/using-headless-chrome-with-selenium

# El acceso a la bd, generación de datos mock, ... debería hacerse siempre a través de
# TestingDatabase. TODO "validate_exp"

import datetime
import time
import traceback
import unittest

from pyramid import testing

from utentes.tests.e2e import config
from utentes.tests.e2e.chrome_browser import get_browser as get_browser_chrome
from utentes.tests.e2e.testing_database import TestingDatabase
from utentes.tests.e2e.testing_server import start_server


def login(browser, user):
    browser.get(f"{config.HOST_BASE}/logout")
    browser.get(f"{config.HOST_BASE}/login")
    userbox = browser.find_element_by_name("user")
    userbox.send_keys(user["name"])
    passbox = browser.find_element_by_name("passwd")
    passbox.send_keys(user["passwd"])
    browser.find_element_by_name("submit").click()


def get_browser():
    return get_browser_chrome()


class BaseE2ETest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """
        Las operaciones que hacemos en setUp de configurar el browser la base de datos,
        y lanzar el servidor, seguramente podrían ir en este nivel y configurarlo para
        cada test.
        """

    @classmethod
    def tearDownClass(cls):
        """Idem que setUpClass"""

    def setUp(self):
        try:
            self.browser = get_browser()
        except Exception:
            traceback.print_exc()
            self.browser = None

        if not self.browser:
            self.skipTest("Web browser not available")

        self.config = testing.setUp()

        self.server = start_server()

        self.testing_database = TestingDatabase()
        self.testing_database.start()

    def tearDown(self):
        self.testing_database.stop()

        self.server.quit()
        # self.browser.close()  # cierra la pestaña
        self.browser.quit()  # cierra el navegador
        testing.tearDown()

    def fill_input_text(self, input_id, text, clear=True, seconds_to_wait=0.5):
        # Esperamos un tiempo concreto para simular los tiempos que tarda de
        # verdad un usuario en poder hacer click. Y poder ver como evoluciona la
        # pantalla
        time.sleep(seconds_to_wait)
        element = self.browser.find_element_by_id(input_id)
        if clear:
            element.clear()
        element.send_keys(text)

    def fill_date_input_text(self, input_id, days=0):
        # By default puts "today". If days is present set the date as
        # today +/- the days
        text = (datetime.date.today() + datetime.timedelta(days=days)).strftime(
            "%d/%m/%Y"
        )
        self.fill_input_text(input_id, text)

    def click_enabled_checkboxes_within_table(self):
        enabled_checkboxes_within_table = self.browser.find_elements_by_css_selector(
            'table input[type="checkbox"]:enabled'
        )
        for check in enabled_checkboxes_within_table:
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
