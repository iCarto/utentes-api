import logging
import threading
from urllib.parse import urlparse
from wsgiref.simple_server import make_server


class ServerThread(threading.Thread):
    """ Run WSGI server on a background thread.
    Pass in WSGI app object and serve pages from it for Selenium browser.
    """

    def __init__(self, app, host_base):
        threading.Thread.__init__(self)
        self.app = app
        self.srv = None
        self.host_base = host_base

    def run(self):
        """
        Open WSGI server to listen to HOST_BASE address
        """
        parts = urlparse(self.host_base)
        domain, port = parts.netloc.split(":")
        self.srv = make_server(domain, int(port), self.app)
        try:
            self.srv.serve_forever()
        except BaseException:
            logging.exception("Error en Server Thread")
            self.srv = None

    def quit(self):
        if self.srv:
            self.srv.shutdown()
            self.srv.server_close()
