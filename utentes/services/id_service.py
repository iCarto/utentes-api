import datetime
import re

import utentes.models.constants as c
from utentes.services import settings_service


def code_for_state(state, separator="/"):
    code = {c.K_DE_FACTO: "UF", c.K_USOS_COMUNS: "SL"}.get(state, "CL")
    return separator + code


def calculate_new_exp_id(request, state=c.K_LICENSED):
    if not state:
        state = c.K_LICENSED

    exp_id_tokens = {
        "seq_id": None,
        "ara": settings_service.get_ara(request),
        "year": str(datetime.date.today().year),
        "code": code_for_state(state),
    }

    sql = r"""
    SELECT substring(exp_id, 1, 3)::int + 1
    FROM utentes.exploracaos
    WHERE
        upper(ara) = :ara
        AND substring(exp_id from '\d{3}/.*/(\d{4})') = :year
        AND right(exp_id, 3) = :code
    ORDER BY 1 DESC
    LIMIT 1;
    """
    exp_id_tokens["seq_id"] = (request.db.execute(sql, exp_id_tokens).first() or [1])[0]

    return "{seq_id:03d}/{ara}/{year}{code}".format(**exp_id_tokens)


def is_valid_exp_id(exp_id):
    return _is_valid_exp_id(exp_id, settings_service.get_ara())


def _is_valid_exp_id(exp_id, ara):
    exp_id_format_regexp = r"^\d{3}/" + ara + r"/\d{4}/(UF|SL|CL)$"
    return exp_id and re.match(exp_id_format_regexp, exp_id)


def is_not_valid_exp_id(exp_id):
    return not is_valid_exp_id(exp_id)


def replace_exp_id_in_code(code, new_exp_id):
    i = 12 + len(settings_service.get_ara())
    new_exp_id = new_exp_id[:i]
    return new_exp_id + code[i:]


def calculate_lic_nro(exp_id: str, tipo_agua: str) -> str:
    """
    Return the correct license number.

    Given a valid `exp_id, ` and `tipo_agua` in any acceptable form like
    'Superficial', 'SUP', 'suP', ... returns the correct license number.

    It is safe to call it even to replace the already valid `lic_nro`.
    """
    return f"{exp_id}/{tipo_agua[0:3].capitalize()}"


def is_valid_lic_nro(lic_nro):
    return is_valid_exp_id(lic_nro[0:-4]) and lic_nro[-4:] in ["/Sub", "/Sup"]


def is_not_valid_lic_nro(lic_nro):
    return not is_valid_lic_nro


def next_child_seq(childs, id_name):
    id_sequence = [
        int(getattr(seq, id_name).split("/")[4])
        for seq in childs
        if getattr(seq, id_name)
    ]
    if len(id_sequence) == 0:
        return 1

    return max(id_sequence) + 1


def calculate_new_child_id(childs, id_name, exp_id):
    next_seq = next_child_seq(childs, id_name)
    return "{0}/{1:03d}".format(exp_id, next_seq)
