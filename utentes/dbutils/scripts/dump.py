# -*- coding: utf-8 -*-

import os
import datetime

from find_pg_executable import find_pg_dump_path
from utils import (
    DBUtilsException,
    execute_quitely,
    connection_parameters,
    ensure_connection_is_available,
    get_custom_enviroment_with_password,
    home_directory,
)


def dump_filename(bdname=""):
    """
    The name of the dump like:
        * 170915_BDD_dpmaip_schema_utentes_pro.dump
        * yymmdd_BDD_bdname_schema_utentes_pro.dump
    pro = production db. To diferenciate it from the dumps generated by us
    schema_utentes. To make it clear that only that schema is dumped
    """
    today = datetime.date.today().strftime("%y%m%d")
    filename = "{}_BDD_{}_schema_utentes_pro.dump".format(today, bdname)
    return filename


def dump_filepath(bdname=""):
    return os.path.join(home_directory(), dump_filename(bdname))


def dump(session):
    # More work needed
    # catch exceptions
    # wait or not to finish, ...
    # run as a new process. Identify platform, ...

    pg_dump = find_pg_dump_path()
    params = connection_parameters(session)
    filename = dump_filepath(params["database"])
    args_str = "-U {username} -h {host} -w -p {port} -d {database} -Z9 -Fc -O -x -E UTF-8 --schema=utentes -f".format(
        **params
    )
    args = [pg_dump]
    args.extend(args_str.split())
    args.append(filename)

    env = get_custom_enviroment_with_password(params["password"])

    ensure_connection_is_available(params, env)

    exitcode, err = execute_quitely(args, env)
    if exitcode != 0:
        raise DBUtilsException("Não foi possível exportar o banco de dados", err)
    return filename


if __name__ == "__main__":
    from utils import _get_session

    _session = _get_session("arasul")
    dump(_session)
