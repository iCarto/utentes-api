# -*- coding: utf-8 -*-

import os
from find_pg_executable import find_psql_path, find_createdb_path, find_dropdb_path


class DBUtilsException(Exception):
    pass


def home_directory(user=""):
    """
    Returns the home directory of the current user if called without paremeters
    or the user passed as parameter
    """
    from os.path import expanduser

    return expanduser("~" + user)


def connection_parameters(session):
    url = session.get_bind().url
    return {
        "username": url.username,
        "password": url.password,
        "host": url.host,
        "port": url.port,
        "database": url.database,
    }


def get_custom_enviroment_with_password(password):
    env = None
    if password:
        env = os.environ.copy()
        env["PGPASSWORD"] = password
    return env


def ensure_connection_is_available(params, env):
    # TODO. Usar https://www.postgresql.org/docs/9.3/static/app-pg-isready.html
    exitcode, err = execute_query_quitely("SELECT 1", params, env)
    if exitcode != 0:
        raise DBUtilsException(
            "Não é possível estabelecer uma conexão com o banco de dados", err
        )


def terminate_database_connections(session):
    params = connection_parameters(session)
    env = get_custom_enviroment_with_password(params["password"])
    kill_db_query = """
    select pg_terminate_backend(pid) from pg_stat_activity where datname='{}'
    """.format(
        params["database"]
    )
    params["database"] = "postgres"

    exitcode, err = execute_query_quitely(kill_db_query, params, env)
    return exitcode, err


def clone_database(session, dbname, drop_if_exists=False):
    if drop_if_exists:
        drop_database(session, dbname)

    params = connection_parameters(session)
    env = get_custom_enviroment_with_password(params["password"])
    createdb = find_createdb_path()
    args = [createdb]
    args_str = "-U {username} -h {host} -p {port} -T {database} {dbname} ".format(
        dbname=dbname, **params
    )
    args.extend(args_str.split())
    exitcode, err = execute_quitely(args, env)
    return exitcode, err


def drop_database(session, dbname):
    params = connection_parameters(session)
    env = get_custom_enviroment_with_password(params["password"])
    dropdb = find_dropdb_path()
    args = [dropdb]
    args_str = "-U {username} -h {host} -p {port} {dbname} ".format(
        dbname=dbname, **params
    )
    args.extend(args_str.split())
    exitcode = execute_quitely(args, env)
    return exitcode


def execute_query_quitely(query, params, env=None):
    psql = find_psql_path()
    args_str = "-U {username} -h {host} -w -p {port} -d {database} -t -q -X".format(
        **params
    )
    args = [psql]
    args.extend(args_str.split())
    args.append("-c")
    args.append(query)
    exitcode, err = execute_quitely(args, env)
    return exitcode, err


def execute_quitely(args, env=None):
    """
    Executes the command via subprocess.Popen without accepting input (stdin) or
    outputing anything (stdout, stderr)
    Returns the original exit status of the command used
    """
    # https://stackoverflow.com/questions/11269575/
    from subprocess import Popen, PIPE, STDOUT

    try:
        from subprocess import DEVNULL  # py3k
    except ImportError:
        import os

        DEVNULL = open(os.devnull, "r+b")

    p = Popen(args, env=env, stdin=DEVNULL, stdout=DEVNULL, stderr=PIPE)
    err = p.communicate()
    return p.returncode, err


def _get_session(dbname="arasul"):
    # Utilitiy method
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker

    engine = create_engine(
        "postgresql://postgres:postgres@localhost:9001/{}".format(dbname)
    )
    Session = sessionmaker(bind=engine)
    session = Session()
    return session
