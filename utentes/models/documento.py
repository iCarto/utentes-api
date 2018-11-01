# -*- coding: utf-8 -*-
import shutil
import os
import sys

from sqlalchemy import Column, ForeignKey, text
from sqlalchemy import Boolean, Integer, Text, DateTime
from utentes.models.filehandler import FileHandler
from utentes.models.base import (
    PGSQL_SCHEMA_UTENTES,
    Base
)


def delete_exploracao_documentos(request, exploracao_gid):
    # Maybe this should be in a class that handles all exploracao documents
    documentos = request.db.query(Documento).filter(Documento.exploracao == exploracao_gid).all()
    exploracao_folder = None
    for documento in documentos:
        documento.set_path_root(request.registry.settings['media_root'])
        exploracao_folder = documento.get_documento_entity_folder()
        documento.delete_file()
        request.db.delete(documento)
    exploracao_folder and shutil.rmtree(exploracao_folder)


class Documento(Base):

    __tablename__ = 'documentos'
    __table_args__ = {u'schema': PGSQL_SCHEMA_UTENTES}

    gid = Column(Integer, primary_key=True, server_default=text("nextval('utentes.documentos_gid_seq'::regclass)"))
    exploracao = Column(
        ForeignKey(
            u'utentes.exploracaos.gid',
            ondelete=u'CASCADE',
            onupdate=u'CASCADE'),
        nullable=False)
    name = Column(Text)
    size = Column(Text)
    departamento = Column(Text)
    saved = Column(Boolean, default=False)
    user = Column(Text, unique=True)
    created_at = Column(DateTime, nullable=False, server_default=text('now()'))

    defaults = {
        'path_root': ''
    }

    def set_path_root(self, path_root):
        self.defaults['path_root'] = path_root

    def __json__(self, request):
        url = ''
        if request:
            url = request.route_url('api_exploracao_documentos_departamento_file', id=self.exploracao, departamento=self.departamento, name=self.name)
        return {
            'id': self.name,
            'gid': self.gid,
            'url': url,
            'name': self.name,
            'size': self.size,
            'departamento': self.departamento,
            'date': self.created_at
        }

    def get_file_path_upload(self):
        # by default: packagedir/utentes/static/files/uploads/{id}/{name}
        return os.path.join(self.defaults['path_root'],
                            'uploads',
                            str(self.gid),
                            self.name).encode(sys.getfilesystemencoding())

    def get_file_path_save(self):
        # by default: packagedir/utentes/static/files/attachments/{exploracao_id}/{departamento}/{name}
        return os.path.join(self.defaults['path_root'],
                            'documentos',
                            str(self.exploracao),
                            self.departamento,
                            self.name).encode(sys.getfilesystemencoding())

    def get_file_path(self):
        if self.saved:
            return self.get_file_path_save()
        else:
            return self.get_file_path_upload()

    def upload_file(self, content):
        filename = self.get_file_path_upload()
        filehandler = FileHandler()
        filehandler.save(filename, content)
        self.save_file()

    def delete_file(self):
        # TODO: connect this method to SQLAlchemy delete process
        filename = self.get_file_path()
        filehandler = FileHandler()
        filehandler.delete(filename)

    def save_file(self):
        if not self.saved:
            try:
                src = self.get_file_path_upload()
                dst = self.get_file_path_save()
                filehandler = FileHandler()
                filehandler.rename(src, dst)
                self.saved = True
                return True
            except Exception:
                return False
        return False
