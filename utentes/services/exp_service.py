from utentes.models.actividade import ActividadeBase
from utentes.models.exploracao import Exploracao, ExploracaoBase
from utentes.models.licencia import Licencia
from utentes.models.utente import Utente


def get_license_state(request, gid):

    q = request.db.query
    return q(ExploracaoBase.estado_lic).filter_by(gid=gid).scalar()


def create_emtpy():
    exp = Exploracao()
    exp.utente_rel = Utente()
    exp.licencias = [Licencia()]
    exp.fontes = []
    exp.actividade = ActividadeBase()
    return exp
