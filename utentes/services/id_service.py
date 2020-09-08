import datetime

import utentes.models.constants as c


def code_for_state(state, separator="/"):
    code = {c.K_DE_FACTO: "UF", c.K_USOS_COMUNS: "SL"}.get(state, "CL")
    return separator + code


def calculate_new_exp_id(request, state=c.K_LICENSED):
    if not state:
        state = c.K_LICENSED
    code = code_for_state(state)

    ara = request.registry.settings.get("ara")
    year = datetime.date.today().year
    aux1 = 6 + len(ara)
    aux2 = 10 + len(ara)
    sql = """
    SELECT substring(exp_id, 1, 3)
    FROM utentes.exploracaos
    WHERE
        upper(ara) = '{}'
        AND substring(exp_id, '{}', 4) = '{}'
        AND substring(exp_id, '{}', 3) = '{}'
    ORDER BY 1 DESC
    LIMIT 1;
    """.format(
        ara, aux1, year, aux2, code
    )
    next_number = request.db.execute(sql).first() or [0]
    next_id = "%0*d" % (3, int(next_number[0]) + 1)

    return "{}/{}/{}{}".format(next_id, ara, year, code)


def is_valid_exp_id(exp_id):
    import re
    from pyramid.threadlocal import get_current_registry

    settings = get_current_registry().settings
    regexpExpIdFormat = "^\d{3}\/" + settings.get("ara") + "\/\d{4}/(UF|SL|CL)$"

    return exp_id and re.match(regexpExpIdFormat, exp_id)


def is_not_valid_exp_id(exp_id):
    return not is_valid_exp_id(exp_id)


def replace_exp_id_in_code(code, new_exp_id):
    from pyramid.threadlocal import get_current_registry

    settings = get_current_registry().settings
    ara = settings.get("ara")
    i = 12 + len(ara)
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
    else:
        return max(id_sequence) + 1


def calculate_new_child_id(childs, id_name, exp_id):
    next_seq = next_child_seq(childs, id_name)
    return "{}/{:03d}".format(exp_id, next_seq)
