#!/bin/bash

grep --color=auto --exclude='*~' --exclude='*.pyc' --exclude='package*.json' --exclude-dir=dist --exclude-dir=node_modules --exclude-dir=.webassets-cache -ri "$1" *

# for i in $(grep -l --exclude=package*.json --exclude-dir=dist --exclude-dir=node_modules --exclude-dir=.webassets-cache -ri "$1" *) ; do sed -i 's/egistro/egisto/' $i ; done
