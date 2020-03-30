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
