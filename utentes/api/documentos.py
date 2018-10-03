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

from utentes.user_utils import PERM_GET, PERM_CREATE_DOCUMENTO, PERM_DELETE_DOCUMENTO, ROL_ADMIN

import json

@view_config(
    route_name='api_exploracao_documentos',
    request_method='GET',
    permission=PERM_GET,
    renderer='json',
)
def exploracao_get_folders(request):
    exploracao_id = None
    if request.matchdict:
        exploracao_id = request.matchdict.get('id', None)

    if exploracao_id:
        res = request.db.query(
                Documento.departamento,
                label('last_created_at', func.max(Documento.created_at)),
                label('num_files', func.count(Documento.gid))
            ).filter(Documento.exploracao == exploracao_id).group_by(Documento.departamento).order_by(Documento.departamento).all()
        # TODO: There is another way?
        json_result = []
        for row in res:
            json_result.append({
                'gid': exploracao_id,
                'url': '',
                'type': 'folder',
                'name': row[0],
                'size': row[2],
                'departamento': row[0],
                'created_at': row[1],
                'url': '/api/exploracaos/' + exploracao_id + '/documentos/' + row[0]
            })
        return json_result


@view_config(
    route_name='api_exploracao_documentos_departamento',
    request_method='GET',
    permission=PERM_GET,
    renderer='json',
)
def departamento_read(request):
    exploracao_id = None
    departamento = None
    name = None
    if request.matchdict:
        exploracao_id = request.matchdict.get('id', None)
        departamento = request.matchdict.get('departamento', None)
        name = request.matchdict.get('name', None)

    if exploracao_id and departamento:
        return request.db.query(Documento).filter(Documento.exploracao == exploracao_id, Documento.departamento == departamento).order_by(Documento.name).all()


@view_config(
    route_name='api_exploracao_documentos_departamento_file',
    request_method='GET',
    permission=PERM_GET,
    renderer='json',
)
def documento_read(request):
    exploracao_id = None
    departamento = None
    name = None
    if request.matchdict:
        exploracao_id = request.matchdict.get('id', None)
        departamento = request.matchdict.get('departamento', None)
        name = request.matchdict.get('name', None)

    if exploracao_id and departamento and name:
        try:
            documento = request.db.query(Documento).filter(Documento.exploracao == exploracao_id, Documento.departamento == departamento, Documento.name == name).one()
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
    if request.matchdict:
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
    documento.upload_file(input_file.file)
    return documento


@view_config(
    route_name='api_exploracao_documentos_departamento_file',
    request_method='DELETE',
    permission=PERM_DELETE_DOCUMENTO,
    renderer='json',
)
def documento_delete(request):
    exploracao_id = None
    departamento = None
    name = None
    if request.matchdict:
        exploracao_id = request.matchdict.get('id', None)
        departamento = request.matchdict.get('departamento', None)
        name = request.matchdict.get('name', None)

    if exploracao_id and departamento and name:
        if request.user.usergroup != ROL_ADMIN and request.user.usergroup != departamento:
            raise badrequest_exception({
                'error': error_msgs['no_permission'],
                'name': name
            })

        try:
            documento = request.db.query(Documento).filter(Documento.exploracao == exploracao_id, Documento.departamento == departamento, Documento.name == name).one()
            documento.delete_file()
            request.db.delete(documento)
            request.db.commit()
        except(MultipleResultsFound, NoResultFound):
            raise badrequest_exception({
                'error': error_msgs['no_document'],
                'name': name
            })

@view_config(
    route_name='api_exploracao_documentos_zip',
    request_method='GET',
    permission=PERM_GET,
    renderer='json',
)
@view_config(
    route_name='api_exploracao_documentos_departamento_zip',
    request_method='GET',
    permission=PERM_GET,
    renderer='json',
)
def exploracao_documentos_zip(request):
    import tempfile
    tmp_file = tempfile.NamedTemporaryFile()

    exploracao_id = None
    if request.matchdict:
        exploracao_id = request.matchdict.get('id', None)
        query = request.db.query(Documento).filter(Documento.exploracao == exploracao_id)
        filename = 'documentos_' + exploracao_id

        departamento = request.matchdict.get('departamento', None)
        if departamento:
            query.filter(Documento.departamento == departamento)
            filename += '_' + departamento

        documentos = query.all()

        response = FileResponse(create_zip_file(tmp_file.name, documentos), request)
        response.content_type = 'application/zip'
        response.content_disposition = 'attachment; filename="' + filename + '.zip"'
        return response

def create_zip_file(zip_filename, documentos):
    import os
    import zipfile
    zip = zipfile.ZipFile(zip_filename, 'w', compression=zipfile.ZIP_DEFLATED)

    for documento in documentos:
        path_in_disk = documento.get_file_path()
        if os.path.isfile(path_in_disk):
            name = documento.name
            path_in_zip = os.path.join(documento.departamento, name)
            zip.write(path_in_disk, path_in_zip)

    zip.close()
    return zip_filename
