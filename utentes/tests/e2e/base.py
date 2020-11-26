# https://gist.github.com/miohtama/2888855
# https://selenium-python.readthedocs.io/
# https://peter.sh/experiments/chromium-command-line-switches/
# https://blog.miguelgrinberg.com/post/using-headless-chrome-with-selenium

# El acceso a la bd, generación de datos mock, ... debería hacerse siempre a través de TestingDatabase. TODO "validate_exp"

import time
import traceback
import unittest

from pyramid import testing

import config
from server_thread import ServerThread
from testing_database import TestingDatabase


def get_browser():
    from chrome_browser import get_browser as get_browser_chrome

    return get_browser_chrome()


def get_wsgi_app():
    from pyramid.paster import get_app

    return get_app("development.ini")


class BaseE2ETest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # las operaciones que hacemos en setUp de configurar el browser
        # la base de datos, y lanzar el servidor, podrían ir en este nivel
        # no hace falta configurarlo para cada test.
        pass

    @classmethod
    def tearDownClass(cls):
        pass

    def setUp(self):
        try:
            self.browser = get_browser()
        except Exception:
            traceback.print_exc()
            self.browser = None

        if not self.browser:
            self.skipTest("Web browser not available")

        self.config = testing.setUp()

        self.start_server()

        self.testing_database = TestingDatabase()
        self.testing_database.start()

    def start_server(self):
        app = get_wsgi_app()
        self.server = ServerThread(app, config.HOST_BASE)
        self.server.start()
        # Wait randomish time to allows SocketServer to initialize itself
        time.sleep(0.5)
        self.assertNotEqual(
            self.server.srv, None, "Failed to start the test web server"
        )

    def tearDown(self):
        self.testing_database.stop()

        self.server.quit()
        # self.browser.close()  # cierra la pestaña
        self.browser.quit()  # cierra el navegador
        testing.tearDown()
