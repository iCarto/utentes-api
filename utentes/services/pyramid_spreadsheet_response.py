from typing import BinaryIO

from pyramid.request import Request
from pyramid.response import FileIter, Response


def spreadsheet_response(request: Request, tmp: BinaryIO, filename: str) -> Response:
    response = request.response
    # https://docs.microsoft.com/es-es/archive/blogs/vsofficedeveloper/office-2007-file-format-mime-types-for-http-content-streaming-2
    response.content_type = (
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response.content_disposition = f"attachment; filename={filename}"
    try:
        response.app_iter = FileIter(tmp)
    except Exception:
        tmp.close()
        raise
    return response
