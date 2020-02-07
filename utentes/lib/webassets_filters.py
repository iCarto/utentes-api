from webassets.filter import Filter


class StrictMode(Filter):
    name = "strict_mode"

    def output(self, _in, out, **kwargs):
        out.write('"use strict";\n' + _in.read())
