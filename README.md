API for utentes project

Descargar los repos en `~/development/sixhiara` (o el directorio que se quiera)

* https://gitlab.com/icarto/sixhiara
* https://gitlab.com/icarto/utentes-api
* https://gitlab.com/icarto/utentes-bd
* https://gitlab.com/icarto/utentes-deploy

# First Install

Se puede configurar un entorno similar al de producción mediante Vagrant. En la raíz del repo `utentes-bd` hay un Vagranfile que permite levantar y provisionar una vm

```bash
vagrant up
```



# Configuración inicial

    $ git clone ... utentes-api
    $ mkvirtualenv -a utentes-api utentes

    $ python setup.py develop


    $ psql -h localhost -U postgres -c "CREATE ROLE utentes LOGIN PASSWORD 'XXXX'"
    $ echo "" >> ~/.pgpass
    $ echo "*:*:*:utentes:XXXX" >> ~/.pgpass
    $ createdb -h localhost -U postgres -T template0 --owner utentes aranorte
    $ sqitch deploy




# Launch server

    $ workon utentes
    $ pserve development.ini --reload


# Nomenclatura de virtualenvwrapper

Estas son las principales variables de entorno y terminología que se usa en virtualenv

*$WORKON_HOME* es el path al directorio donde estarán los distintos virtualenv que estemos usando. Es la localización donde se guardaran las librerías python que cada proyecto tenga como requisitos. El directorio debe existir, si no debemos crearlo.

*$PROJECT_HOME* es el path al directorio en el que tengamos habitualmente el código fuente de nuestros proyectos. Esta variable no es necesario fijarla. De hecho puede ser positivo no setearla para evitar "magia". Generamente será algo así como ~/projects o ~/devel.

*virtualenv* es el directorio donde estará el entorno virtual. Es decir donde estará el binario de python que estemos usando, las librerías que hayamos descargado, y también donde se _instalará_ nuestro proyecto, cuando hagamos un python setup.py develop. Cuando hayamos activado un virtualenv el path a este directorio estará recogido en la variable $VIRTUAL_ENV

*project directory* Es el directorio donde estará el código fuente del proyecto en el que estemos trabajando. Generalmente estará en una ruta del tipo. Si hemos vinculado un virtualenv a un project directory (muy recomendable) habrá un fichero .project dentro de $VIRTUAL_ENV con el path absoluto al project directory


## Instalación de virtualenv y virtualenvwrapper

    $ sudo pip install virtualenvwrapper

Añadir a .bashrc

    export WORKON_HOME=$HOME/.virtualenvs
    export PROJECT_HOME= PATH_AL_DIRECTORIO_DE_PROYECTOS # No es imprescindible
    source /usr/local/bin/virtualenvwrapper.sh


Tras añadir las líneas a .bashrc hacer un:

    $ source ~/.bashrc

virtualenvwrapper permite añadir hooks tras la activación del entorno. Si, como mostramos a continuación ligamos un entorno virtual a un directorio de proyecto (donde tendremos el código fuente), podemos hacer que al activar el entorno hagamos cd automáticamente al proyecto:

    $ echo 'cdproject' >>  $WORKON_HOME/postactivate
    

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
