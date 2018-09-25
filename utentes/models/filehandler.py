# -*- coding: utf-8 -*-

import os


class FileHandler():

    def save(self, filename, content):
        if filename is None:
            return False

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
            return False

        os.remove(filename)
        return True

    def rename(self, src, dst):
        os.renames(src, dst)
