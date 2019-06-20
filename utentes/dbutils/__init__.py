# -*- coding: utf-8 -*-


def includeme(config):
    config.add_route("api_db_dump", "/api/db/dump")
    config.add_route("api_db_restore", "/api/db/restore")
    config.scan()
