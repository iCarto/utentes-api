def is_dict(d):
    return isinstance(d, dict)


def merge_nested_dict(d1, d2):
    # https://stackoverflow.com/a/29847323/930271
    for k in d2:  # noqa: WPS528
        if k in d1 and is_dict(d1[k]) and is_dict(d2[k]):  # noqa: WPS221
            merge_nested_dict(d1[k], d2[k])
        else:
            d1[k] = d2[k]
    return d1
