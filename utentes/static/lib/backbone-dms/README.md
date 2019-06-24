# Backbone DMS Plugin

## Descripción

El plugin Backbone DMS nos permite navegar por una estructura de directorios con la posibilidad de subir archivos a esos directorios, descargarlos o eliminarlos.

### Instalación

Lo primero sería copiar el directorio del plugin completamente en la estructura de directorios de nuestro proyecto. Por ejemplo, en `proyecto\static\js\lib`.

De momento no se ha generado una librería, por lo que para utilizarlo debemos incluir todos los archivos JS que lo conforman (incluyendo su CSS).

```
  'js/lib/backbone-dms/css/backbone-dms.css',
  ...
  "js/lib/backbone-dms/Config.js",
  "js/lib/backbone-dms/util/Util.js",
  "js/lib/backbone-dms/models/File.js",
  "js/lib/backbone-dms/models/FileCollection.js",
  "js/lib/backbone-dms/models/Folder.js",
  "js/lib/backbone-dms/models/FolderCollection.js",
  "js/lib/backbone-dms/models/FileUpload.js",
  "js/lib/backbone-dms/views/FileSummaryView.js",
  "js/lib/backbone-dms/views/FolderSummaryView.js",
  "js/lib/backbone-dms/views/FolderView.js",
  "js/lib/backbone-dms/views/FileModalView.js",
  "js/lib/backbone-dms/views/FileUploadView.js",
  "js/lib/backbone-dms/views/FileCollectionView.js",
  "js/lib/backbone-dms/views/FolderZipDownloadView.js",
  "js/lib/backbone-dms/views/PathFolderView.js",
  "js/lib/backbone-dms/views/BreadcrumbView.js",
```

### Configuración

Para utilizar el plugin debemos añadir en alguna de las vistas del proyecto una nueva vista que generará el diálogo.

```
this.fileModalView = new Backbone.DMS.FileModalView({
    openElementId: '#file_modal',
    title: 'Documentación',
    urlBase: 'http://localhost:6543/folder',
    id: 1,
    permissions: [PERMISSION_UPLOAD, PERMISSION_DOWNLOAD, PERMISSION_DELETE]
});
```

Como parámetros, de momento, debemos pasarle:

-   _openElementId_: Identificador del elemento del DOM en el que haciendo click abriremos el diálogo.
-   _title_: Título del diálogo.
-   _urlBase_: URL del backend para acceder a la estructura de directorios.
-   _id_: Identificador del directorio inicial en el que se deberá abrir el diálogo.
-   _permissions_: Permisos por defecto sobre las acciones que permite el plugin (se pueden cambiar para cada directorio o archivo a través de la respuesta de la API).

### API de backend

La idea del plugin es trabajar con una API REST en el backend que nos restrinja al dominio de Folders y Files que se ha definido para su utilización.

Por tanto, deberemos partir de una url base (que se define en la configuración inicial) a partir de la cual cargaremos nuestro modelo de Folder. La url del modelo se formará a partir de la _urlBase_ y el _id_ del modelo.

Por ejemplo http://localhost:6543/folder/8 nos debería devolver algo como lo siguiente:

```
{
   "id": "8",
   "type": "folder",
   "name": "Directorio Raíz",
   "size": 3
   "url": "http://localhost:6543/folder/8",
   "zip_url": "http://localhost:6543/folder/8/zip",
   "path": "http://localhost:6543/folder/8/path",
   "files": "http://localhost:6543/folder/8/files",
}
```

Es importante el valor de _url_ ya que se utiliza para determinar a qué url se envían los archivos cuando se suban en este directorio. También tenemos el valor de _zip_url_, que nos debe devolver el endpoint donde se pueden descargar todo el contenido del directorio en un zip.

Y también son importantes las url's que devuelve en los campos _path_ y _files_, puesto que se utilizarán para cargar el breadcrumb y el listado de archivos que se mostrarán dentro de una carpeta.

Por ejemplo http://localhost:6543/folder/8/path nos debería devolver algo como esto:

```
[
   {
      "id": 1,
      "type": "folder",
      "name": "Directorio Raíz",
      "size": 5,
      "url": "http://localhost:6543/folder/1",
      "zip_url": "http://localhost:6543/folder/1/zip",
      "path": "http://localhost:6543/folder/1/path",
      "files": "http://localhost:6543/folder/1/files",
   },
   {
      "id": 3,
      "type": "folder",
      "name": "Directorio Nivel 1",
      "size": 1,
      "url": "http://localhost:6543/folder/3",
      "zip_url": "http://localhost:6543/folder/3/zip",
      "files": "http://localhost:6543/folder/3/files",
      "path": "http://localhost:6543/folder/3/path",
   }
]
```

Y http://localhost:6543/folder/8/files algo como lo siguiente:

```
[
   {
      "id": 18
      "name": "test.txt",
      "type": "plain/txt",
      "date": "2018-10-18T11:38:53.083447",
      "size": 1234
   },
   {
      "id": 19
      "name": "test_image.jpg",
      "type": "image/jpg",
      "date": "2018-10-18T11:38:53.083447",
      "size": 4354
   },
   {
      "id": 20
      "name": "test2.txt",
      "type": "plain/txt",
      "date": "2018-10-18T11:38:53.083447",
      "size": 90
   }
]
```

En este caso, los archivos no tienen url, por lo que se formará concatenando su identificador con la url de los archivos del directorio. Por ejemplo, http://localhost:6543/folder/8/files/18.

Manteniendo esta definición en la API, el plugin podrá realizar todas las acciones automáticamente sin necesidad de ningún implementación extra.

### Puntos a finalizar

-   Eliminar dependencia de FontAwesome
-   Configuración de textos o multidioma
-   Revisar funcionalidad de subida asíncrona (refactorizar, utilizar parámetros de configuración más acordes, visualización, etc)
-   Empaquetarlo como plugin en un único archivo
