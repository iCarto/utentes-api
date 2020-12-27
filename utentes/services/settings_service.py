def get_ara(request=None):
    if request:
        settings = request.registry.settings
    else:
        from pyramid.threadlocal import get_current_registry

        settings = get_current_registry().settings

    return settings.get("ara")
