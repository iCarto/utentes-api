
def get_license_state(request, gid):
    from utentes.models.exploracao import ExploracaoBase

    q = request.db.query
    return q(ExploracaoBase.estado_lic).filter_by(gid=gid).scalar()
