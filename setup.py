import os

from setuptools import find_packages, setup


here = os.path.abspath(os.path.dirname(__file__))

requires = [
    "pyramid==1.10.4",
    "psycopg2==2.8.5",  # Cambiar a psycopg2-binary en dev en caso de problemas
    "SQLAlchemy==1.3.17",
    "geoalchemy2==0.2.6",
    # 'shapely==1.5.13',
    "python-dateutil==2.8.1",
    "transaction==3.0.0",
    "zope.sqlalchemy==1.3",
    "waitress==1.4.3",  # Esto sólo debería hacer falta en desarrollo.
    "bcrypt==3.1.7",
    "Jinja2==2.11.2",
    "pyramid-jinja2==2.8",
    "cssutils==1.0.2",
    "webassets==2.0",
    "pyramid-webassets==0.10",
]

excludes = ["utentes.tests"]

setup(
    name="utentes",
    version="191107.1",
    description="utentes",
    author="iCarto",
    author_email="info@icarto.es",
    license="AGPL-3.0",
    url="http://icarto.es",
    packages=find_packages(exclude=excludes),
    include_package_data=True,
    zip_safe=False,
    test_suite="utentes.tests",
    install_requires=requires,
    entry_points="""\
      [paste.app_factory]
      main = utentes:main
      [console_scripts]
      initialize_utentes_db = utentes.scripts.initializedb:main
      """,
)
