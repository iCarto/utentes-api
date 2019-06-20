# -*- coding: utf-8 -*-

import bcrypt

from sqlalchemy import Column, Integer, Text, DateTime, text, TIMESTAMP
from sqlalchemy import func

from utentes.lib.schema_validator.validator import Validator
from utentes.lib.schema_validator.validation_exception import ValidationException

from user_schema import USER_SCHEMA
from utentes.models.base import Base, PGSQL_SCHEMA_USERS
from users.user_roles import ROL_UNIDAD_DELEGACION


class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": PGSQL_SCHEMA_USERS}
    __mapper_args__ = {"order_by": "username"}

    id = Column(Integer, primary_key=True)
    username = Column(Text, unique=True)
    password = Column(Text)
    # screen_name = Column(Text)
    usergroup = Column(Text)
    unidade = Column(Text)
    last_login = Column(TIMESTAMP(timezone=False))
    new_login = Column(TIMESTAMP(timezone=False), server_default=func.now())
    created_at = Column(DateTime, nullable=False, server_default=text("now()"))

    @staticmethod
    def create_from_json(json):
        msgs = Validator(USER_SCHEMA).validate(json)
        if msgs:
            raise ValidationException({"error": msgs})
        user = User()
        user.update_from_json(json)
        return user

    def update_from_json(self, json):
        self.username = json.get("username")
        # self.screen_name = json.get('screen_name')
        previous_group = self.usergroup
        if json.get("usergroup"):
            self.usergroup = json.get("usergroup")
        if json.get("password"):
            self.set_password(json.get("password"))
        if json.get("unidade"):
            self.unidade = json.get("unidade")
        if (
            previous_group == ROL_UNIDAD_DELEGACION
            and self.usergroup != ROL_UNIDAD_DELEGACION
        ):
            self.unidade = None

    def set_password(self, pw):
        pwhash = bcrypt.hashpw(pw.encode("utf8"), bcrypt.gensalt())
        self.password = pwhash.decode("utf8")

    def check_password(self, pw):
        if self.password is not None:
            expected_hash = self.password.encode("utf8")
            return bcrypt.checkpw(pw.encode("utf8"), expected_hash)
        return False

    def __json__(self, request):
        return {
            "id": self.id,
            "username": self.username,
            "usergroup": self.usergroup,
            "unidade": self.unidade,
        }
