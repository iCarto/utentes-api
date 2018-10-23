# -*- coding: utf-8 -*-

from pyramid.view import view_config

from utentes.models.base import badrequest_exception
from utentes.user_utils import PERM_ADMIN

from utentes.dbutils.scripts.utils import DBUtilsException
from utentes.dbutils.scripts.dump import dump
from utentes.dbutils.scripts.restore import restore


# import error_msgs
import logging
import json
logger = logging.getLogger(__name__)


@view_config(route_name='api_db_dump', permission=PERM_ADMIN, request_method='GET', renderer='json')
def api_db_dump(request):
    session = request.db
    try:
        filepath = dump(session)
    except DBUtilsException as e:
        logger.error(e, exc_info=True)
        raise badrequest_exception({'error': json.dumps(e.args).decode('utf-8').encode('utf-8')})

    return {
        'dump': 'ok',
        'file': filepath,
    }


@view_config(route_name='api_db_restore', permission=PERM_ADMIN, request_method='GET', renderer='json')
def api_db_restore(request):
    session = request.db
    try:
        filepath = request.GET['file']
        restore(session, filepath)
    except DBUtilsException as e:
        logger.error(e, exc_info=True)
        raise badrequest_exception({'error': json.dumps(e.args)})
    finally:
        # Avoid commit/rollkback after disconnect
        session.invalidate()

    return {'restore': 'ok'}
