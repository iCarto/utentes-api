from sqlalchemy import Column, Text

from .base import PGSQL_SCHEMA_UTENTES, DeclarativeBase


class Setting(DeclarativeBase):
    __tablename__ = "settings"
    __table_args__ = {"schema": PGSQL_SCHEMA_UTENTES}

    property = Column(Text, nullable=False, primary_key=True)
    value = Column(Text, nullable=False)

    @staticmethod
    def create_from_json(json, property):
        setting = Setting()
        setting.update_from_json(json, property)
        return setting

    def update_from_json(self, json, property):
        self.property = property
        self.value = json.get(property)

    def __json__(self, request):
        return {"property": self.property, "value": self.value}
