# https://gist.github.com/miohtama/2888855
# https://selenium-python.readthedocs.io/

import datetime
import time
import unittest

from pyramid import testing
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound

import config as c
from server_thread import ServerThread


def chrome_options():
    from selenium.webdriver.chrome.options import Options

    # instantiate a chrome options object so you can set the size and headless preference
    # some of these chrome options might be uncessary but I just used a boilerplate

    # options = webdriver.ChromeOptions()
    chrome_options = Options()
    # chrome_options.add_argument("--headless")
    chrome_options.add_argument("--start-maximized")
    # chrome_options.add_argument("--window-size=1920x1080")
    chrome_options.add_argument("--disable-notifications")
    chrome_options.add_argument("--verbose")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--incognito")
    chrome_options.add_experimental_option(
        "prefs",
        {
            "download.default_directory": "/tmp",
            "download.prompt_for_download": False,
            "download.directory_upgrade": True,
            "safebrowsing_for_trusted_sources_enabled": False,
            "safebrowsing.enabled": False,
        },
    )

    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--disable-software-rasterizer")
    return chrome_options


# function to take care of downloading file
# function to handle setting up headless download
def enable_download_headless(browser, download_path="/tmp"):
    browser.command_executor._commands["send_command"] = (
        "POST",
        "/session/$sessionId/chromium/send_command",
    )
    params = {
        "cmd": "Page.setDownloadBehavior",
        "params": {"behavior": "allow", "downloadPath": download_path},
    }
    browser.execute("send_command", params)


def get_browser():
    options = chrome_options()
    # add this option if chromedriver is not in the path executable_path=CHROMEDRIVER
    # CHROMEDRIVER = pathlib.Path(__file__).parent.absolute() / "chromedriver"
    browser = webdriver.Chrome(options=options)
    enable_download_headless(browser)
    # Por defecto es 0. Si es > 0 hara poll cada 0.5s hasta que encuentre el
    # elemento hasta un máximo del tiempo indicado. Si no lo encuentra en ese
    # tiempo salta una excepción. Se puede combinar con las expected_conditions
    browser.implicitly_wait(5)
    return browser


def login(browser, user):
    browser.get(c.HOST_BASE + "/logout")

    browser.get(c.HOST_BASE + "/login")
    userbox = browser.find_element_by_name("user")
    userbox.send_keys(user["name"])
    passbox = browser.find_element_by_name("passwd")
    passbox.send_keys(user["passwd"])
    browser.find_element_by_name("submit").click()


def create_exp(request):
    from utentes.models.exploracao import Exploracao

    try:
        e = (
            request.db.query(Exploracao)
            .filter(Exploracao.exp_id == EXP["exp_id"])
            .one()
        )
        request.db.delete(e)
        request.db.flush()
    except (MultipleResultsFound, NoResultFound):
        print("no existía")
    Exploracao._which_exp_id_should_be_used = lambda self, request, body: EXP.get(
        "exp_id"
    )
    e2 = Exploracao.create_from_json(request, EXP)
    e2.utente = 588
    request.db.add(e2)
    request.db.commit()


def delete_exp(request):
    from utentes.models.exploracao import Exploracao

    try:
        e = (
            request.db.query(Exploracao)
            .filter(Exploracao.exp_id == EXP["exp_id"])
            .one()
        )
        request.db.delete(e)
    except (MultipleResultsFound, NoResultFound):
        print("no existía")
    request.db.commit()


EXP = {
    "exp_id": "001/ARAS/2008/CL",
    "estado_lic": "Licenciada",
    "observacio": "adf",
    "loc_provin": "Gaza",
    "loc_distri": "Guij\u00e1",
    "loc_posto": "Mubangoene",
    "loc_nucleo": "Chinhacanine",
    "loc_endere": "Localiza\u00e7\u00e3o na Albufeira de Macarretane (Jusante) e  na montante da estac\u00e3o E-607",
    "loc_unidad": "UGBL",
    "loc_bacia": "Limpopo",
    "loc_subaci": None,
    "loc_rio": "Limpopo",
    "cadastro_uni": "L047",
    "c_soli": 3456.0,
    "c_licencia": 5375.0,
    "c_real": 1791.67,
    "c_estimado": 1280.75,
    "actividade": {
        "tipo": "Agricultura de Regadio",
        "c_estimado": 1280.75,
        "n_cul_tot": 1,
        "area_pot": 3.0,
        "area_irri": 1.0,
        "area_medi": 2.0,
        "cultivos": [
            {
                "cult_id": "001/ARAS/2008/CL/001",
                "c_estimado": 1280.75,
                "cultivo": "Frut\u00edcola",
                "rega": "Gota a gota",
                "eficiencia": 0.85,
                "area": 2.0,
                "observacio": None,
            }
        ],
    },
    "area": 0.2522,
    "fontes": [
        {
            "tipo_agua": "Superficial",
            "tipo_fonte": "Rio",
            "cadastro": None,
            "disp_a": None,
            "lat_lon": "-24,371944 / 32,864444",
            "d_dado": "2007-05-09",
            "c_soli": None,
            "c_max": None,
            "c_real": 1791.67,
            "sist_med": "Volum\u00e9trica",
            "metodo_est": None,
            "observacio": None,
        }
    ],
    "licencias": [
        {
            "lic_nro": "001/ARAS/2008/CL/Sup",
            "tipo_agua": "Superficial",
            "tipo_lic": "Licen\u00e7a",
            "n_licen_a": "001/ARAS/2008",
            "estado": "Licenciada",
            "d_emissao": "2008-01-10",
            "d_validade": "2013-01-10",
            "c_soli_tot": 3456.0,
            "c_soli_int": 3456.0,
            "c_soli_fon": 0.0,
            "c_licencia": 5375.0,
            "c_real_tot": 1791.67,
            "c_real_int": None,
            "c_real_fon": 1791.67,
            "taxa_fixa": 0.0,
            "taxa_uso": 0.0,
            "pago_mes": 0.0,
            "iva": 12.75,
            "pago_iva": 0.0,
            "consumo_tipo": "Fixo",
            "consumo_fact": 0.0,
        }
    ],
    "exp_name": "Ant\u00f3nio Chiboma Ubisse",
    "d_soli": "2018-05-25",
    "d_ultima_entrega_doc": "2018-05-25",
    "fact_estado": "Pagada",
    "fact_tipo": "Mensal",
    "pago_lic": False,
    "geometry_edited": True,
    "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
            [
                [
                    [32.8641980350837, -24.3721701497034],
                    [32.8641980350836, -24.3717187379572],
                    [32.8646908537666, -24.3717187379575],
                    [32.8646908537666, -24.3721701497036],
                    [32.8641980350837, -24.3721701497034],
                ]
            ]
        ],
    },
}


class BaseE2ETest(unittest.TestCase):
    def start_server(self):
        from pyramid.paster import get_app

        app = get_app("development.ini")
        self.server = ServerThread(app, c.HOST_BASE)
        self.server.start()
        # Wait randomish time to allows SocketServer to initialize itself
        time.sleep(0.3)
        self.assertNotEqual(
            self.server.srv, None, "Failed to start the test web server"
        )

    def setUp(self):

        self.config = testing.setUp()
        self.start_server()
        self.browser = get_browser()

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
        create_exp(self.request)

    def tearDown(self):
        delete_exp(self.request)
        self.server.quit()
        self.browser.quit()  # close ciera pestaña. quit todo el navegador
        testing.tearDown()
        self.db_session.close()
        self.connection.close()
        # self.transaction.rollback()

    def validate_exp(self):
        from utentes.models.exploracao import Exploracao

        e = (
            self.request.db.query(Exploracao)
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
            e.actividade.cultivos[0].cult_id,
            EXP["actividade"]["cultivos"][0]["cult_id"],
        )
        self.assertEqual(
            e.actividade.cultivos[0].c_estimado,
            EXP["actividade"]["cultivos"][0]["c_estimado"],
        )
        self.assertEqual(
            e.actividade.cultivos[0].cultivo,
            EXP["actividade"]["cultivos"][0]["cultivo"],
        )
        self.assertEqual(len(e.fontes), 1)
        self.assertEqual(e.fontes[0].tipo_agua, EXP["fontes"][0]["tipo_agua"])


class TestRenovacaoHappyPath(BaseE2ETest):
    def test_renovacao_happy_path(self):
        login(self.browser, {"name": "admin", "passwd": "admin"})
        self.browser.get(c.HOST_BASE + "/renovacao.html")

        wait = WebDriverWait(self.browser, 60)
        # it will wait for 250 seconds an element to come into view, you can change the #value
        wait.until(
            EC.element_to_be_clickable((By.PARTIAL_LINK_TEXT, EXP["exp_id"]))
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
        self.validate_exp()
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
