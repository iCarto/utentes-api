from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager

from utentes.tests.e2e import config


def get_browser():
    options = get_options()
    browser = webdriver.Chrome(ChromeDriverManager().install(), options=options)
    enable_download_headless(browser)
    # Por defecto es 0. Si es > 0 hara poll cada 0.5s hasta que encuentre el
    # elemento hasta un máximo del tiempo indicado. Si no lo encuentra en ese
    # tiempo salta una excepción. Se puede combinar con las expected_conditions
    browser.implicitly_wait(5)
    return browser


def get_options():
    # from selenium.webdriver.chrome.options import Options
    # options = Options()

    # instantiate a chrome options object so you can set the size and headless
    # preference some of these chrome options might be uncessary but I just used a
    # boilerplate
    options = webdriver.ChromeOptions()
    if config.HEADLESS:
        options.add_argument("--headless")
    options.add_argument("--start-maximized")
    # options.add_argument("--window-size=1920x1080")
    options.add_argument("--disable-notifications")
    options.add_argument("--verbose")
    options.add_argument("--no-sandbox")
    options.add_argument("--incognito")
    options.add_experimental_option(
        "prefs",
        {
            "download.default_directory": config.TMP_DIRECTORY,
            "download.prompt_for_download": False,
            "download.directory_upgrade": True,
            "safebrowsing_for_trusted_sources_enabled": False,
            "safebrowsing.enabled": False,
        },
    )

    options.add_argument("--disable-gpu")
    options.add_argument("--disable-software-rasterizer")
    return options


def enable_download_headless(browser, download_path=config.TMP_DIRECTORY):
    """
    Habilita las descargas en Chrome en modo headless.

    Permite descargar automáticamente ficheros al directorio indicado por
    `download_path` cuando Chrome está en modo headless
    """
    browser.command_executor._commands["send_command"] = (
        "POST",
        "/session/$sessionId/chromium/send_command",
    )
    params = {
        "cmd": "Page.setDownloadBehavior",
        "params": {"behavior": "allow", "downloadPath": download_path},
    }
    browser.execute("send_command", params)
