from users.user_roles import (
    GROUPS_TO_ROLES,
    ROL_ADMINISTRATIVO,
    ROL_DIRECCION,
    ROL_JURIDICO,
)


def group_to_roles(ara):
    base_group_to_roles = dict(GROUPS_TO_ROLES)
    if ara == "ARAS":
        base_group_to_roles[ROL_JURIDICO] = [ROL_JURIDICO, ROL_DIRECCION]
    if ara in {"ARAZ", "ARAC", "ARACN", "ARAN"}:
        base_group_to_roles[ROL_JURIDICO] = [
            ROL_JURIDICO,
            ROL_DIRECCION,
            ROL_ADMINISTRATIVO,
        ]
    return base_group_to_roles


# This must be improved
# https://stackoverflow.com/questions/29587224 read this
# https://stackoverflow.com/questions/30784341
# https://stackoverflow.com/questions/29258175
# https://stackoverflow.com/questions/27492574
# https://stackoverflow.com/questions/58775524
def adjust_settings(settings):
    """
    Mofifies dict settings in place to set values that can be derived from
    the .ini files
    """
    settings["ara_app_name"] = {
        "ARAN": "SIRHAN: Utentes",
        "ARAS": "SIRHAS: Utentes",
        "ARAZ": "SIRHAZ: Utentes",
        "ARAC": "SIRHAC: Utentes",
        "ARACN": "SIRHACN: Utentes",
        "DPMAIP": "DPMAIP",
    }[settings["ara"]]
