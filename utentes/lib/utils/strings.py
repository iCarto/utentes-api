def stringify(*args, maxlen=50, sep=" / "):
    """
    Returns the provided `*args` as a string separated by `sep` and replacing None with
    and empty string ''
    """
    sanitized_args = ("" if v is None else str(v) for v in args)
    sanitized_args = [v.strip() for v in sanitized_args]
    # https://www.geeksforgeeks.org/python-remove-trailing-empty-elements-from-given-list
    # https://stackoverflow.com/questions/10034917/removing-trailing-empty-elements-in-a-list
    while sanitized_args and sanitized_args[-1] == "":
        sanitized_args.pop()

    result = sep.join(sanitized_args)
    return result[:maxlen]
