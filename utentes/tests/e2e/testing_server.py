import time

from pyramid.paster import get_app

from utentes.tests.e2e import config
from utentes.tests.e2e.server_thread import ServerThread


def get_wsgi_app():
    return get_app("development.ini")


def start_server():
    app = get_wsgi_app()
    server = ServerThread(app, config.HOST_BASE)
    server.start()
    # Wait randomish time to allows SocketServer to initialize itself
    time.sleep(0.5)
    if not server.srv:
        raise Exception("Failed to start the test web server")
    return server
