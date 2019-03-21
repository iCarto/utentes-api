# -*- coding: utf-8 -*-

import os


class FileHandler():

    def save(self, filename, content):
        if filename is None:
            raise Exception("No filename was provided in save method")

        if not os.path.exists(os.path.dirname(filename)):
            os.makedirs(os.path.dirname(filename))

        output = open(filename, 'wb')
        content.seek(0)
        while True:
            data = content.read(2 << 16)
            if not data:
                break
            output.write(data)
        output.close()
        return True

    def delete(self, filename):
        if filename is None:
            raise Exception("No filename was provided in delete method")

        os.remove(filename)
        return True

    def rename(self, src, dst):
        os.renames(src, dst)
