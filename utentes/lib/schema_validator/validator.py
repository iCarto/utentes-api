# -*- coding: utf-8 -*-

import dateutil.parser
import math


class IsNotNull():

    def fails(self, value):
        if value is None:
            return True
        return False


class IsDate():
    '''
    The received value is a valid datetime.date object or can be parsed with
    dateutil.parser. This allows strings in ISO8601 or RFC3329 or others
    '''

    def fails(self, value):
        if not value:
            return False
        try:
            dateutil.parser.parse(value)
        except BaseException:
            return True

        return False


class IsNumeric():
    '''
    The received value is the representation of a number.
    So '5' is considered valid
    '''

    def fails(self, value):
        if not value:
            return False
        try:
            float(value)
        except BaseException:
            return True
        return False


class IntLessThan8():
    '''
    The int part of the received number has less that
    8 digits
    '''

    def fails(self, value):
        if not value:
            return False
        intLength = len(str(math.trunc(value)))
        return intLength > 8


class IsBoolean():
    '''
    Value is a proper boolean.
    '''

    def fails(self, value):
        return value not in [True, False, None]


class IsArrayNotVoid():
    def fails(self, value):
        if isinstance(value, list) and (len(value) > 0):
            return False
        return True


class Validator():

    def __init__(self, schemaValidateFrom):
        self.messages = []
        self.schema = schemaValidateFrom
        self.rules = {
            'NOT_NULL': IsNotNull(),
            'IS_DATE': IsDate(),
            'IS_NUMERIC': IsNumeric(),
            'IS_BOOLEAN': IsBoolean(),
            'ARRAY_NOT_VOID': IsArrayNotVoid(),
            'INT_LESS_THAN_8': IntLessThan8()
        }

    def appendSchema(self, schema):
        self.schema.extend(schema)

    def validate(self, model):
        self.messages = []

        for definition in self.schema:
            for rulename in definition['rules']:
                rule = self.get_rule(rulename)
                if isinstance(rule, dict):
                    if rule['fails'](model.get(definition['fieldname'])):
                        self.messages.append(definition['message'])
                else:
                    if rule.fails(model.get(definition['fieldname'])):
                        self.messages.append(definition['message'])

        return self.messages

    def get_rule(self, rulename):
        return self.rules[rulename]

    def add_rule(self, rulename, rule_def):
        self.rules[rulename] = rule_def
