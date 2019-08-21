# -*- coding: utf-8 -*-
import datetime

import utentes.models.constants as c


def code_for_state(state, separator="/"):
    code = {c.K_UTENTE_FACTO: "UF", c.K_SEM_LICENCIA: "SL"}.get(state, "CL")
    return separator + code


def calculate_new_exp_id(request):
    ara = request.registry.settings.get("ara")
    year = datetime.date.today().year
    sql = """
    SELECT substring(exp_id, 1, 3)
    FROM utentes.exploracaos
    WHERE upper(ara) = '{}' AND substring(exp_id, 10, 14) = '{}'
    ORDER BY 1 DESC LIMIT 1;
    """.format(
        ara, year
    )
    next_number = request.db.execute(sql).first() or [0]
    next_id = "%0*d" % (3, int(next_number[0]) + 1)

    return "{}/{}/{}".format(next_id, ara, year)


def is_valid_exp_id(exp_id):
    import re
    from pyramid.threadlocal import get_current_registry

    settings = get_current_registry().settings
    regexpExpIdFormat = "^\d{3}\/" + settings.get("ara") + "\/\d{4}$"

    return exp_id and re.match(regexpExpIdFormat, exp_id)


def is_not_valid_exp_id(exp_id):
    return not is_valid_exp_id(exp_id)


def calculate_new_lic_nro(exp_id, tipo_agua):
    return "{}/{}".format(exp_id, tipo_agua[0:3])


def is_valid_lic_nro(lic_nro):
    return is_valid_exp_id(lic_nro) and lic_nro[-4:] in ["/Sub", "/Sup"]


def is_not_valid_lic_nro(lic_nro):
    return not is_valid_lic_nro


def next_child_seq(childs, id_name):
    id_sequence = [
        int(getattr(seq, id_name).split("/")[3])
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
