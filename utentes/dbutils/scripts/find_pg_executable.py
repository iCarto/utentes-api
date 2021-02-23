import os


def find_pg_executable_path_by_harcoded(name):
    # comillas
    # las / \
    # y como se ejecuta
    p = f"C:\\Program Files\\PostgreSQL\\10\\bin\\{name}.exe"
    if os.path.exists(p):
        return p
    return None


def find_pg_executable_path_by_settings(name):
    # This should be improved
    # Approach 1: Write the path in production.ini after installation
    # Approach 2: INSERT into utentes.settings and give the user the option
    #             to set it like document folder
    return None


def find_pg_executable_path_by_env_var(name):
    from .which import which

    return which(name)


def find_pg_executable_path_by_queries(name, session):
    """
    Windows examples of the queries:
    ```
    SHOW data_directory; -> C:/Program Files/PostgreSQL/10/data
    SHOW hba_file; -> C:/Program Files/PostgreSQL/10/data/pg_hba.conf
    ```
    Some installers like enterprisedb puts everythin under the same tree, so
    this approach can be used. Others like Ubuntu apt-get does not.
    """
    r = session.execute("SHOW data_directory;")
    data_directory = r.fetchall()[0][0]
    r = session.execute("SHOW hba_file;")
    hba_file_directory = parent_folder(r.fetchall()[0][0])
    if not is_same_path(data_directory, hba_file_directory):
        return None

    pg_executable = os.path.join(data_directory, f"../bin/{name}.exe")
    if os.path.exists(pg_executable):
        return os.path.abspath(pg_executable)

    return None


def parent_folder(file):
    """
    os.path.dirname has some caveats
    This method works as expected.
    C:/Program Files/PostgreSQL/10/data -> C:/Program Files/PostgreSQL/10
    C:/Program Files/PostgreSQL/10/data/ -> C:/Program Files/PostgreSQL/10
    C:/Program Files/PostgreSQL/10/data/pg_hba.conf -> C:/Program Files/PostgreSQL/10/data
    """
    return os.path.abspath(os.path.join(file, os.pardir))


def is_same_path(p1, p2):
    """
    Returns true if both arguments refer to the same path
    """
    return normalize_path(p1) == normalize_path(p2)


def normalize_path(p):
    """
    Not sure, what is the best cross-platforma approach. So all posible
    os.path functions are used
    """
    from os.path import normcase, normpath, realpath

    return normcase(normpath(realpath(p)))


def find_pg_executable_path(name, session=None):
    """
    name is like pg_dump, pg_restore, ...
    """

    # A couple of more approaches here:
    # https://grokbase.com/t/postgresql/pgsql-general/09csjmeznf/finding-the-bin-path
    pg_executable = find_pg_executable_path_by_settings(name)
    if pg_executable:
        return pg_executable

    pg_executable = find_pg_executable_path_by_harcoded(name)
    if pg_executable:
        return pg_executable

    pg_executable = find_pg_executable_path_by_env_var(name)
    if pg_executable:
        return pg_executable

    if session:
        pg_executable = find_pg_executable_path_by_queries(name, session)
        if pg_executable:
            return pg_executable

    return None


PSQL = None


def find_psql_path():
    global PSQL
    if not PSQL:
        PSQL = find_pg_executable_path("psql")
    return PSQL


DUMP = None


def find_pg_dump_path():
    global DUMP
    if not DUMP:
        DUMP = find_pg_executable_path("pg_dump")
    return DUMP


RESTORE = None


def find_pg_restore_path():
    global RESTORE
    if not RESTORE:
        RESTORE = find_pg_executable_path("pg_restore")
    return RESTORE


CREATEDB = None


def find_createdb_path():
    global CREATEDB
    if not CREATEDB:
        CREATEDB = find_pg_executable_path("createdb")
    return CREATEDB


DROPDB = None


def find_dropdb_path():
    global DROPDB
    if not DROPDB:
        DROPDB = find_pg_executable_path("dropdb")
    return DROPDB
