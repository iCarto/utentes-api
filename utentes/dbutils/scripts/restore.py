# -*- coding: utf-8 -*-

import datetime
import os

from find_pg_executable import find_pg_restore_path
from utils import (
    DBUtilsException,
    clone_database,
    connection_parameters,
    ensure_connection_is_available,
    execute_query_quitely,
    execute_quitely,
    get_custom_enviroment_with_password,
    terminate_database_connections,
)


def restore(session, dumpfile):
    params = connection_parameters(session)
    ensure_correct_filename(dumpfile, params)
    env = get_custom_enviroment_with_password(params["password"])

    ensure_connection_is_available(params, env)

    if not is_same_version(session, dumpfile):
        raise DBUtilsException(
            "A versão da cópia é diferente da do banco de dados e não é possível restaurar"
        )
    exitcode, err = terminate_database_connections(session)
    if exitcode != 0:
        raise DBUtilsException(
            "Não foi possível ler fechar a conexão com o banco de dados para fazer um backup",
            err,
        )

    # TODO:
    # Cachear, memoization de los paths

    exitcode, err = clone_database(
        session, version() + "_auto_tmp_" + params["database"], drop_if_exists=True
    )
    if exitcode != 0:
        raise DBUtilsException(
            "Não foi possível salvar o banco de dados atual com êxito", err
        )

    # Como comprobamos que la versión fuera la misma, --clean debería funcionar bien.
    # Si no hacemos una comprobación exhaustiva de la versión es necesario cambiar de estrategia
    # ie: `DROP SCHEMA utentes CASCADE;`
    pg_restore = find_pg_restore_path()
    args = [pg_restore]
    args_str = "-U {username} -h {host} -p {port} -d {database} --clean --disable-triggers --single-transaction --exit-on-error --schema=utentes".format(
        **params
    )
    args.extend(args_str.split())
    args.append(dumpfile)
    exitcode, err = execute_quitely(args, env)
    if exitcode != 0:
        raise DBUtilsException("Não foi possível restaurar o banco de dados", err)
    return exitcode


def ensure_correct_filename(dumpfile, params):
    import re

    if not os.path.exists(dumpfile):
        raise DBUtilsException("O arquivo indicado não existe")

    name = os.path.basename(dumpfile)
    regex = r"^(\d{6})_BDD_(\w*)_schema_utentes_pro\.dump$"
    match_obj = re.match(regex, name)
    if not match_obj:
        raise DBUtilsException(
            "O nome do arquivo de entrada não tem o formato esperado"
        )
    date = match_obj.group(1)
    if date_of_dumpfile(date) > datetime.date.today():
        raise DBUtilsException(
            "Não é possível restaurar arquivos cujo nome tenha uma data após o atual"
        )
    db = match_obj.group(2)
    if params["database"] != db:
        raise DBUtilsException(
            "Não é possível restaurar arquivos cujo nome não corresponda ao banco de dados que está sendo usado"
        )


def version():
    return datetime.date.today().strftime("%y%m%d")


def date_of_dumpfile(name):
    """ Accepts yymmdd and yymmdd_BDD_bdname_schema_utentes_pro.dump"""
    return datetime.datetime.strptime(name[0:6], "%y%m%d").date()


def is_same_version(session, dumpfile):
    return get_last_version_from_db(session) == get_last_version_from_dump(dumpfile)


def get_last_version_from_db(session):
    sql = "SELECT version FROM utentes.version ORDER BY version DESC LIMIT 1;"
    r = session.execute(sql)
    return r.fetchall()[0][0]


def get_last_version_from_dump(dumpfile):
    return get_all_versions_from_dump(dumpfile)[-1]


def get_all_versions_from_dump(dumpfile):
    import subprocess

    pg_restore = find_pg_restore_path()
    args_str = "--schema=utentes --table=version -a"
    args = [pg_restore]
    args.extend(args_str.split())
    args.append(dumpfile)

    proc = subprocess.Popen(args, stdout=subprocess.PIPE)
    full_dump_text, err = proc.communicate()
    if proc.returncode != 0:
        raise DBUtilsException("Não foi possível ler a versão do arquivo de entrada")
    dump_filtered = []
    for l in full_dump_text.splitlines():
        if not l.strip():
            continue
        if l.startswith("--"):
            continue
        if l.startswith("SET"):
            continue
        if l.startswith("SELECT"):
            continue
        dump_filtered.append(l)
    all_versions = dump_filtered[1:-1]
    return all_versions


if __name__ == "__main__":
    from utils import _get_session

    _session = _get_session("arasul")
    dumpfile = "/tmp/m.backup"
    dumpfile = "/tmp/180920_BDD_arasul_schema_utentes_pro.dump"
    restore(_session, dumpfile)
