import os

from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))

requires = [
    'pyramid==1.6.1',
    'pyramid_debugtoolbar',
    'psycopg2==2.6.1',
    'SQLAlchemy==1.0.11',
    'geoalchemy2==0.2.6',
    # 'shapely==1.5.13',
    'python-dateutil==2.5.0',
    'transaction',
    'zope.sqlalchemy',
    'waitress',
    'six',
    'bcrypt==3.1.4'
    'cssutils==1.0.2',
    'closure==20180204',
    'pyramid-jinja2==2.7',
    'pyramid-webassets==0.9',
]

excludes = ["utentes.tests", ]

setup(name='utentes',
      version='20180522,
      description='utentes',
      author='iCarto',
      author_email='info@icarto.es',
      license='AGPL-3.0',
      url='http://icarto.es',
      packages=find_packages(exclude=excludes),
      include_package_data=True,
      zip_safe=False,
      test_suite='utentes.tests',
      install_requires=requires,
      entry_points="""\
      [paste.app_factory]
      main = utentes:main
      [console_scripts]
      initialize_utentes_db = utentes.scripts.initializedb:main
      """,
      )
