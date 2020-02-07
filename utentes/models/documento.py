import logging
import os
import shutil
import sys

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, Text, text

from utentes.models.base import PGSQL_SCHEMA_UTENTES, Base
from utentes.models.filehandler import FileHandler


def delete_exploracao_documentos(request, exploracao_gid):
    # Maybe this should be in a class that handles all exploracao documents
    documentos = (
        request.db.query(Documento).filter(Documento.exploracao == exploracao_gid).all()
    )
    exploracao_folder = None
    for documento in documentos:
        documento.set_path_root(request.registry.settings["media_root"])
        exploracao_folder = documento.get_documento_entity_folder()
        documento.delete_file()
        request.db.delete(documento)
    exploracao_folder and shutil.rmtree(
        exploracao_folder.encode(sys.getfilesystemencoding())
    )


class Documento(Base):

    __tablename__ = "documentos"
    __table_args__ = {"schema": PGSQL_SCHEMA_UTENTES}

    gid = Column(
        Integer,
        primary_key=True,
        server_default=text("nextval('utentes.documentos_gid_seq'::regclass)"),
    )
    exploracao = Column(
        ForeignKey("utentes.exploracaos.gid", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )
    name = Column(Text)
    size = Column(Text)
    departamento = Column(Text)
    unidade = Column(Text)
    saved = Column(Boolean, default=False)
    user = Column(Text, unique=True)
    created_at = Column(DateTime, nullable=False, server_default=text("now()"))

    defaults = {"path_root": ""}

    def set_path_root(self, path_root):
        self.defaults["path_root"] = path_root

    def __json__(self, request):
        url = ""
        if request:
            subpath = [self.exploracao, self.departamento]
            if self.unidade is not None:
                subpath.append(self.unidade)
            subpath.append(self.name)
            url = request.route_url("api_exploracao_file", subpath=subpath)
        return {
            "id": self.name,
            "gid": self.gid,
            "url": url,
            "name": self.name,
            "size": self.size,
            "departamento": self.departamento,
            "unidade": self.unidade,
            "date": self.created_at,
        }

    def get_file_path_upload(self):
        # by default: packagedir/utentes/static/files/uploads/{id}/{name}
        return os.path.join(self.defaults["path_root"], "uploads", self.name)

    def get_documento_entity_folder(self):
        # by default: packagedir/utentes/static/files/attachments/{exploracao_id}
        path = os.path.join(
            self.defaults["path_root"], "documentos", str(self.exploracao)
        )
        return path

    def get_file_path_save(self):
        # by default: packagedir/utentes/static/files/attachments/{exploracao_id}/{departamento}/{name}
        entity_folder = self.get_documento_entity_folder()
        path = os.path.join(entity_folder, self.departamento)
        if self.unidade is not None:
            path = os.path.join(path, self.unidade)
        return os.path.join(path, self.name)

    def get_file_path(self):
        if self.saved:
            return self.get_file_path_save()
        else:
            return self.get_file_path_upload()

    def upload_file(self, content):
        try:
            filename = self.get_file_path_upload()
            filehandler = FileHandler()
            filehandler.save(filename, content)
            self.save_file()
        except Exception:
            logging.exception("Error saving file in uploads folder: " + self.name)
            raise

    def delete_file(self):
        # TODO: connect this method to SQLAlchemy delete process
        filename = self.get_file_path()
        filehandler = FileHandler()
        filehandler.delete(filename)

    def save_file(self):
        if not self.saved:
            src = self.get_file_path_upload()
            dst = self.get_file_path_save()
            try:
                filehandler = FileHandler()
                filehandler.rename(src, dst)
                self.saved = True
            except Exception:
                logging.exception("Error renaming file from " + src + " to " + dst)
                raise
