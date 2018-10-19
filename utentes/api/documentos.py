# -*- coding: utf-8 -*-

from pyramid.view import view_config
from pyramid.response import FileResponse

from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound
from sqlalchemy import func
from sqlalchemy.sql import label

from utentes.models.base import badrequest_exception
from utentes.models.exploracao import Exploracao
from utentes.models.documento import Documento
from utentes.api.error_msgs import error_msgs

from utentes.user_utils import PERM_GET, PERM_CREATE_DOCUMENTO, PERM_DELETE_DOCUMENTO, ROL_ADMIN, ROL_ADMINISTRATIVO, ROL_FINANCIERO, ROL_JURIDICO, ROL_TECNICO

import json

@view_config(
    route_name='api_exploracao_documentos_departamento',
    request_method='GET',
    permission=PERM_GET,
    renderer='json',
)
def departamento_read(request):
    exploracao_id = request.matchdict.get('id', None)
    departamento = request.matchdict.get('departamento', None)
    return {
        'id': departamento,
        'name': departamento,
        'type': 'folder',
        'files': request.route_url('api_exploracao_documentos_departamento_files', id=exploracao_id, departamento=departamento),
        'path': request.route_url('api_exploracao_documentos_departamento_path', id=exploracao_id, departamento=departamento),
        'permissions': get_folder_permissions(request, departamento)
    }


@view_config(
    route_name='api_exploracao_documentos_departamento_path',
    request_method='GET',
    permission=PERM_GET,
    renderer='json',
)
def departamento_read_path(request):
    exploracao_id = request.matchdict.get('id', None)
    departamento = request.matchdict.get('departamento', None)
    path = [get_departamento_path_folder(request, exploracao_id, departamento)]
    if departamento != 'root':
        path.insert(0, get_departamento_path_folder(request, exploracao_id, 'root'))
    return path

def get_departamento_path_folder(request, exploracao_id, departamento):
    if departamento == 'root':
        departamento_name = request.db.query(Exploracao.exp_id).filter(Exploracao.gid == exploracao_id).one()
    else:
        departamento_name = departamento
    return {
        'id': departamento,
        'name': departamento_name,
        'type': 'folder',
        'files': request.route_url('api_exploracao_documentos_departamento_files', id=exploracao_id, departamento=exploracao_id),
        'path': request.route_url('api_exploracao_documentos_departamento_path', id=exploracao_id, departamento=exploracao_id)
    }


@view_config(
    route_name='api_exploracao_documentos_departamento_files',
    request_method='GET',
    permission=PERM_GET,
    renderer='json',
)
def departamento_read_files(request):
    exploracao_id = request.matchdict.get('id', None)
    departamento = request.matchdict.get('departamento', None)
    if(departamento == 'root'):
        return exploracao_get_root_folders(request)
    else:
        return exploracao_get_departamento_folders(request, exploracao_id, departamento)

def exploracao_get_root_folders(request):
    exploracao_id = request.matchdict.get('id', None)

    departamentos_json_array = init_departamentos_json_array(request, exploracao_id)
    res = request.db.query(
            Documento.departamento,
            label('num_files', func.count(Documento.gid)),
            label('last_created_at', func.max(Documento.created_at))
        ).filter(Documento.exploracao == exploracao_id).group_by(Documento.departamento).order_by(Documento.departamento)
    for row in res:
        departamento = next((departamento_json for departamento_json in departamentos_json_array if departamento_json['name'] == row[0]), None)
        if departamento:
            departamento['size'] = row[1]
            departamento['date'] = row[2]
    return departamentos_json_array

def init_departamentos_json_array(request, exploracao_id):
    departamentos = [ROL_ADMINISTRATIVO, ROL_FINANCIERO, ROL_JURIDICO, ROL_TECNICO]
    departamentos_json_array = []
    for departamento in departamentos:
        departamentos_json_array.append({
            'id': departamento,
            'type': 'folder',
            'name': departamento,
            'path': request.route_url('api_exploracao_documentos_departamento_path', id=exploracao_id, departamento=departamento),
            'files': request.route_url('api_exploracao_documentos_departamento_files', id=exploracao_id, departamento=departamento)
        })
    return departamentos_json_array

def exploracao_get_departamento_folders(request, exploracao_id, departamento):
    files = request.db.query(Documento).filter(Documento.exploracao == exploracao_id, Documento.departamento == departamento).order_by(Documento.name).all()
    jsonFiles = []
    for file in files:
        jsonFile = file.__json__(request)
        jsonFile['permissions'] = get_file_permissions(request, departamento)
        jsonFiles.append(jsonFile)
    return jsonFiles


@view_config(
    route_name='api_exploracao_documentos_departamento_file',
    request_method='GET',
    permission=PERM_GET,
    renderer='json',
)
def documento_read(request):
    exploracao_id = request.matchdict.get('id', None)
    departamento = request.matchdict.get('departamento', None)
    name = request.matchdict.get('name', None)

    try:
        documento = request.db.query(Documento).filter(Documento.exploracao == exploracao_id, Documento.departamento == departamento, Documento.name == name).one()
        documento.set_path_root(request.registry.settings['media_root'])
        return FileResponse(documento.get_file_path())
    except(MultipleResultsFound, NoResultFound):
        raise badrequest_exception({
            'error': error_msgs['no_document'],
            'name': name
        })


@view_config(
    route_name='api_exploracao_documentos_departamento',
    request_method='POST',
    permission=PERM_CREATE_DOCUMENTO,
    renderer='json',
)
def documento_create(request):
    exploracao_id = request.matchdict['id']
    departamento = request.matchdict['departamento']
    return documento_upload(request, exploracao_id, departamento)

def documento_upload(request, exploracao_id, departamento):
    input_file = request.POST['file']
    documento = Documento()
    documento.name = input_file.filename
    documento.size = len(input_file.value)
    documento.exploracao = exploracao_id
    documento.departamento = departamento
    documento.user = request.user.username

    documento.set_path_root(request.registry.settings['media_root'])
    documento.upload_file(input_file.file)

    if request.user.usergroup != ROL_ADMIN and request.user.usergroup != departamento:
        raise badrequest_exception({
            'error': error_msgs['no_permission'],
            'name': documento.name
        })

    previous_documento = request.db.query(Documento).filter(Documento.exploracao == documento.exploracao, Documento.departamento == documento.departamento, Documento.name == documento.name)
    if previous_documento.count() > 0:
        raise badrequest_exception({
                'error': error_msgs['exist_document'],
                'name': documento.name
            })

    request.db.add(documento)
    request.db.commit()
    return documento


@view_config(
    route_name='api_exploracao_documentos_departamento_file',
    request_method='DELETE',
    permission=PERM_DELETE_DOCUMENTO,
    renderer='json',
)
def documento_delete(request):
    exploracao_id = request.matchdict.get('id', None)
    departamento = request.matchdict.get('departamento', None)
    name = request.matchdict.get('name', None)

    if request.user.usergroup != ROL_ADMIN and request.user.usergroup != departamento:
        raise badrequest_exception({
            'error': error_msgs['no_permission'],
            'name': name
        })

    try:
        documento = request.db.query(Documento).filter(Documento.exploracao == exploracao_id, Documento.departamento == departamento, Documento.name == name).one()
        documento.set_path_root(request.registry.settings['media_root'])
        documento.delete_file()
        request.db.delete(documento)
        request.db.commit()
    except(MultipleResultsFound, NoResultFound):
        raise badrequest_exception({
            'error': error_msgs['no_document'],
            'name': name
        })

@view_config(
    route_name='api_exploracao_documentos_departamento_zip',
    request_method='GET',
    permission=PERM_GET,
    renderer='json',
)
def exploracao_documentos_zip(request):
    import tempfile
    tmp_file = tempfile.NamedTemporaryFile()

    exploracao_id = request.matchdict.get('id', None)
    filename = 'documentos_' + exploracao_id

    departamento = request.matchdict.get('departamento', None)
    if departamento != 'root':
        query = request.db.query(Documento).filter(Documento.exploracao == exploracao_id, Documento.departamento == departamento)
    else:
        query = request.db.query(Documento).filter(Documento.exploracao == exploracao_id)

    documentos = query.all()

    response = FileResponse(create_zip_file(request, tmp_file.name, documentos, departamento), request)
    response.content_type = 'application/zip'
    response.content_disposition = 'attachment; filename="' + filename + '.zip"'
    return response

def create_zip_file(request, zip_filename, documentos, departamento):
    import os
    import zipfile
    zip = zipfile.ZipFile(zip_filename, 'w', compression=zipfile.ZIP_DEFLATED)

    for documento in documentos:
        documento.set_path_root(request.registry.settings['media_root'])
        path_in_disk = documento.get_file_path()
        if os.path.isfile(path_in_disk):
            name = documento.name
            if departamento != 'root':
                path_in_zip = os.path.join(name)
            else:
                path_in_zip = os.path.join(documento.departamento, name)
            zip.write(path_in_disk, path_in_zip)

    zip.close()
    return zip_filename


def get_folder_permissions(request, departamento):
    if departamento == 'root':
        return ['perm_download']
    if request.user.usergroup == ROL_ADMIN or request.user.usergroup == departamento:
        return ['perm_upload', 'perm_download', 'perm_delete']
    return ['perm_download']

def get_file_permissions(request, departamento):
    if request.user.usergroup == ROL_ADMIN or request.user.usergroup == departamento:
        return ['perm_download', 'perm_delete']
    return ['perm_download']
