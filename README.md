Part of utentes project

Descargar los repos en `~/development/sixhiara` (o el directorio que se quiera).

-   https://gitlab.com/icarto/sixhiara. Aplicación de escritorio basada en gvSIG para Inventario de Recursos Hídricos
-   https://gitlab.com/icarto/utentes-api. Aplicación de Utentes
-   https://gitlab.com/icarto/utentes-bd. Base de datos (sqitch), scripts adicionales, ... para Inventario y Utentes.
-   https://gitlab.com/icarto/utentes-deploy. Utilidades para empaquetar Utentes como una aplicación de Electron.

**Repositorios que ya no están en uso**

Los siguientes repositorios formaron parte en algún momento del proyecto pero ya no lo hacen:

-   utentes-ui. Backend y Frontend estaban en repositorios distintos, se han unido bajo utentes-api para hacer uso de templates y otras funcionalidades de backend.
-   leaflet-table. Se unió en su momento en utentes-ui y a posteriori en utentes-api para simplificar los despliegues

# First Install

Se puede configurar un entorno similar al de producción mediante Vagrant. En la raíz del repo `utentes-bd` hay un Vagranfile que permite levantar y provisionar una vm

```bash
vagrant up
vagrant halt
vagrant up
```

## Para probar la aplicación en modo producción:

```bash
vagrant ssh
workon utentes
git status # Cuidado, este es el directorio compartido del host
emacs -nw production.ini # ajustar bd, media_root y ara
python setup.py install
sudo systemctl restart apache2
```

# Configuración inicial

```bash
cd ~/development/sixhiara
git clone git@gitlab.com:icarto/utentes-api.git
mkvirtualenv -p /usr/bin/python3.6 -a utentes-api utentes

python setup.py develop

echo "" >> ~/.pgpass
echo "localhost:*:*:postgres:postgres" >> ~/.pgpass # por comodidad si no se ha hecho previamente
createdb -h localhost -p 9001 -U postgres BD_NAME
pg_restore -h localhost -p 9001 -U postgres -d BD_NAME --disable-triggers BD_NAME.dump
createdb -h localhost -p 9001 -U postgres -T BD_NAME test_BD_NAME
sqitch deploy
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
