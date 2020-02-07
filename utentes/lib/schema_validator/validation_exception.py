
class ValidationException(Exception):
    def __init__(self, msgs):
        self.msgs = msgs

    def __str__(self):
        return repr(self.msgs)
