Descargar los repos en `~/development/sixhiara` (o el directorio que se quiera).

-   https://gitlab.com/icarto/sixhiara. Aplicación de escritorio basada en gvSIG para Inventario de Recursos Hídricos
-   https://gitlab.com/icarto/utentes-api. Aplicación de Utentes
-   https://gitlab.com/icarto/utentes-bd. Base de datos (sqitch), scripts adicionales, ... para Inventario y Utentes.
-   https://gitlab.com/icarto/utentes-deploy. Utilidades para empaquetar Utentes como una aplicación de Electron.

# First Install

Se puede configurar un entorno similar al de producción mediante Vagrant. En la raíz del repo `utentes-bd` hay un Vagranfile que permite levantar y provisionar una vm.

Se puede seguir el script `utentes-bd/server/bootstrap.sh` para configurar un entorno local adecuado.

A continuación un resumen del proceso. Se asume que en local ya están instaladas las herramientas básicas, si no fijarse en el script de `bootstrap.sh`.

Para ejecutar los tests e2e debe descargarse [chromedriver](https://sites.google.com/a/chromium.org/chromedriver/downloads) en \$PATH

La mayoría de pasos que aquí se describen, "destruir" el entorno y volver a construirlo se recomienda realizarlo en cada nuevo ciclo de trabajo.

```bash

cd ~/development/sixhiara
git clone git@gitlab.com:icarto/utentes-api.git
git clone git@gitlab.com:icarto/utentes-bd.git

rmvirtualenv utentes
rmvirtualenv utentes-bd

mkvirtualenv -p /usr/bin/python3.6 -a utentes-api utentes
pip install -r requirements-dev.txt
pre-commit install --install-hooks
python setup.py install
python setup.py develop

mkvirtualenv -p /usr/bin/python3.6 -a utentes-bd utentes-bd
pip install -r requirements-dev.txt
pre-commit install --install-hooks

vagrant destroy
vagrant up
vagrant halt
vagrant up

# Descargar directorio con las bases de datos de test
# en `utentes-bd`
cd scripts
source db_utils.sh
DB_BACKUP_DIR=... # Ajustar. Mejor usar ruta absoluta

for dump_file in "${DB_BACKUP_DIR}"/*.dump ; do
    db=$(basename "${dump_file%.dump}")
    echo "Procesando: ${db}"
    create_last_db ${db} ${dump_file}
    test_db="test_${db%%_*}"
    create_db_from_template ${db} ${test_db}
done

workon utentes
python -Wd setup.py test -q
```

_Nota_: La máquina virtual asume una estructura de directorios similar a la siguiente. Todo debería funcionar igual, pero se puede perder alguna "funcionalidad".

| Proyecto
| |- utentes-api
| |- utentes-bd

_Nota_: Dentro del entorno vagrant están "todas" las herramientas de desarrollo necesarias en las versiones usadas en el proyecto. `sqitch`, `pg_tap`, `git`, `python`, ... En caso de problemas con el entorno local se puede abrir el IDE en las carpetas de `utentes-api` y/o `utentes-bd`. Ambas están compartidas dentro de la máquina virtual. Y ejecutar el servidor local, scripts, ... dentro de sessiones SSH en la máquina virtual.

## Para probar la aplicación en modo producción:

```bash
vagrant ssh
workon utentes
git status # Cuidado, este es el directorio compartido del host
emacs -nw production.ini # ajustar bd, media_root y ara
python setup.py install
sudo systemctl restart apache2
```

# Ramas

-   La rama `master` se usa como producción
-   Los desarrollos y pull request deben realizarse sobre la rama `development`

# Launch development server

    $ workon utentes
    $ pserve development.ini --reload

## Tests de pyramid

```bash
# Todos los tests
python setup.py test -q -s utentes.tests

# Sólo los tests de la API
python setup.py test -q -s utentes.tests.api

# Un test concreto
python setup.py test -q -s utentes.tests.api.test_cultivos_get.CultivosGET_IntegrationTests.test_cultivo_get_length
```

## Tests base de datos (pgTap)

Es recomendable ejecutarlos desde dentro de la vm para evitar problemas de versiones

```bash
vagrant ssh
cd PATH_TO_SQITCH_FOLDER
```

```bash
pg_prove -Q tests/
```

Se asume que el fichero .proverc está en la carpeta sqitch y los tests se lanzan desde allí.
El anterior comando lanza los tests en modo 'quiet'. Si alguno falla para obtener información más concreta relanzaremos el comando sin -Q

```
pg_prove tests/
```
