function formatter() {
    // TODO: make formats configurable

    function isNumber(field) {
        // http://stackoverflow.com/a/1830844/854308
        return !isNaN(parseFloat(field)) && isFinite(field);
    }

    function formatNumber(value, number_format) {
        if (!isNumber(value)) return null;

        var NUMBER_FORMAT = number_format || "0[,]000[.]00";
        // load a language
        numeral.language("pt-mz", {
            delimiters: {
                thousands: " ",
                decimal: ",",
            },
            abbreviations: {
                thousand: "k",
                million: "m",
                billion: "b",
                trillion: "t",
            },
            ordinal: function(number) {
                return number === 1 ? "er" : "ème";
            },
            currency: {
                symbol: "MT",
            },
        });
        numeral.language("pt-mz");
        return numeral(value).format(NUMBER_FORMAT);
    }

    function formatEditionNumber(value, number_format) {
        if (!isNumber(value)) return null;

        var NUMBER_FORMAT = number_format || "0[,]000[.]00";
        // load a language
        numeral.language("pt-mz", {
            delimiters: {
                thousands: "",
                decimal: ",",
            },
            abbreviations: {
                thousand: "k",
                million: "m",
                billion: "b",
                trillion: "t",
            },
            ordinal: function(number) {
                return number === 1 ? "er" : "ème";
            },
            currency: {
                symbol: "MT",
            },
        });
        numeral.language("pt-mz");
        return numeral(value).format(NUMBER_FORMAT);
    }

    function unformatNumber(value) {
        // TODO: review
        if (value && value.indexOf(".") !== -1) return null;
        var val = $.trim(value.replace(",", "."));
        if (isNumber(val)) {
            return +val;
        }
        return null;
    }

    function formatBoolean(value) {
        // TODO let user inject their own formatter
        // to cover use cases like this
        if (value) return "Existe";
        else if (value === false) return "Não existe";
        return "";
    }

    /*
    We use `Date` in the function name for dates that take into account year, month and day. Also `today`.
    We use `DateTime` in the function name for datetimes that take into account year, month, day, hours, minutes and seconds. Also `now`.
    We use TimeStamp when the resolution is minor that seconds (miliseconds or nanoseconds). Also `now`.
    We use `Time` for hour, minute, seconds comparisons.

    f = formatter()
    d_str = '12/02/2019'
    d = f.unformatDate(d_str)
    d_org = f.unformatDate(d_str)
    console.assert(f.isToday(d) === true)
    console.assert(f.isPast(d) === false)
    console.assert(f.isFuture(d) === false)
    console.assert(d.getTime() == d_org.getTime())

    d_str = '13/02/2019'
    d = f.unformatDate(d_str)
    d_org = f.unformatDate(d_str)
    console.assert(f.isToday(d) === false)
    console.assert(f.isPast(d) === false)
    console.assert(f.isFuture(d) === true)
    console.assert(d.getTime() == d_org.getTime())

    d_str = '11/02/2019'
    d = f.unformatDate(d_str)
    d_org = f.unformatDate(d_str)
    console.assert(f.isToday(d) === false)
    console.assert(f.isPast(d) === true)
    console.assert(f.isFuture(d) === false)
    console.assert(d.getTime() == d_org.getTime())

    */

    function today() {
        var today = new Date(Date.now());
        today.setHours(0, 0, 0, 0);
        return today;
    }

    function now() {
        return new Date(Date.now());
    }

    function isSameDate(_first, _second) {
        /* input values must be a Date like object */
        var first = this.trimTime(_first);
        var second = this.trimTime(_second);
        return first.getTime() === second.getTime();
    }

    function isFirstDateAfterSecondDate(_first, _second) {
        /* input values must be a Date like object */
        var first = this.trimTime(_first);
        var second = this.trimTime(_second);
        return first > second;
    }

    function isFirstDateBeforeSecondDate(_first, _second) {
        /* input values must be a Date like object */
        var first = this.trimTime(_first);
        var second = this.trimTime(_second);
        return first < second;
    }

    function isToday(d) {
        /* input value must be a Date like object */
        return this.isSameDate(d, this.today());
    }

    function isFuture(d) {
        /* input value must be a Date like object */
        return this.isFirstDateAfterSecondDate(d, this.today());
    }

    function isPast(d) {
        /* input value must be a Date like object */
        return this.isFirstDateBeforeSecondDate(d, this.today());
    }

    function trimTime(d) {
        /* input value must be a Date like object
           returns a new Date object
        */
        var c = this.cloneDate(d);
        c.setHours(0, 0, 0, 0);
        return c;
    }

    function cloneDate(d) {
        /* input value must be a Date like object */
        return new Date(d.getTime());
    }

    function formatDate(value) {
        var FORMAT_DATE = "DD/MM/YYYY";
        // moment(undefined) returns current day, ouch!
        if (moment(value).isValid() && value != undefined) {
            return moment(value).format(FORMAT_DATE);
        }
        return null;
    }

    function parseValidDate(value) {
        var tokens = value.trim().split("/");
        return new Date(Date.UTC(tokens[2], tokens[1] - 1, tokens[0]));
    }

    function validDateFormat(value) {
        /*
        Mismas reglas que unformatDate pero devuelve True/False, con la
        excepción de que devuelve true con null, undefined , '', o cadenas de
        texto con sólo espacios
        */

        // Si ya es un Date lo devolvemos
        if (value instanceof Date) {
            return true;
        }

        // Devuelve true con null, undefined , '', o cadenas de texto con sólo espacios
        if (
            _.isUndefined(value) ||
            _.isNull(value) ||
            (_.isString(value) && _.isEmpty(value.trim()))
        ) {
            return true;
        }

        // Si no es un String
        if (!_.isString(value)) {
            return false;
        }

        value = value.trim();

        // Usa '/' como separador, los tokens son numéricos, y de forma gruesa
        // tienen los rangos adecuados
        var validDate = /^(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[012])[/](19|20|21)\d\d$/.test(
            value
        );
        if (!validDate) {
            return false;
        }
        var tokens = value.split("/");
        var d = new Date(Date.UTC(tokens[2], tokens[1] - 1, tokens[0]));

        // Chequemos que las fechas están en rango. No usamos !== para poder comparar strings y enteros
        if (
            d.getFullYear() != tokens[2] ||
            (d.getMonth != tokens[1] - 1 && d.getDate() != tokens[0])
        ) {
            return false;
        }
        return true;
    }

    function unformatDate(value) {
        /*
        Admite un `value` en formato 'DD/MM/YYYY' y devuelve un `Date`
        En caso de que `value` no sea un `String` con formato válido devuelve `null`
        El año debe ser 19xx, 20xx, 21xx para considerarlo válido
        En caso de recibir un Date devuelve el propio Date
        */
        if (!this.validDateFormat(value)) {
            return null;
        }

        // Si ya es un Date lo devolvemos
        if (value instanceof Date) {
            return value;
        }

        if (
            _.isUndefined(value) ||
            _.isNull(value) ||
            (_.isString(value) && _.isEmpty(value.trim()))
        ) {
            return null;
        }
        return this.parseValidDate(value);
    }

    function inRange(x, firstBound, secondBound, options) {
        var defaultOptions = {
            firstBoundBeforeSecondBound: false, // if 'error', throws an error if firstBound > secondBound. With true, the function always returns false
            inclusive: undefined, // Equivalent to set inclusiveStart and inclusiveEnd
            inclusiveFirstBound: true, // if true firstBound limit is included in the comparison
            inclusiveSecondBound: true, // if true secondBound limit is included in the comparison
        };
        options = Object.assign({}, defaultOptions, options);
        if (typeof options.inclusive !== "undefined") {
            options.inclusiveFirstBound = options.inclusive;
            options.inclusiveSecondBound = options.inclusive;
        }
        if (options.firstBoundBeforeSecondBound && firstBound > secondBound) {
            if (options.firstBoundBeforeSecondBound === "error") {
                throw "start should be lesser than end";
            }
        }
        if (options.inclusiveFirstBound && x === firstBound) {
            return true;
        }

        if (options.inclusiveSecondBound && x === secondBound) {
            return true;
        }

        return (x - firstBound) * (x - secondBound) < 0;
    }

    var formatterObj = new Object();
    formatterObj.formatNumber = formatNumber;
    formatterObj.unformatNumber = unformatNumber;

    formatterObj.now = now;
    formatterObj.today = today;
    formatterObj.isSameDate = isSameDate;
    formatterObj.isFirstDateAfterSecondDate = isFirstDateAfterSecondDate;
    formatterObj.isFirstDateBeforeSecondDate = isFirstDateBeforeSecondDate;
    formatterObj.isToday = isToday;
    formatterObj.isFuture = isFuture;
    formatterObj.isPast = isPast;
    formatterObj.trimTime = trimTime;
    formatterObj.cloneDate = cloneDate;
    formatterObj.formatDate = formatDate;
    formatterObj.parseValidDate = parseValidDate;
    formatterObj.validDateFormat = validDateFormat;
    formatterObj.unformatDate = unformatDate;
    formatterObj.formatBoolean = formatBoolean;

    formatterObj.inRange = inRange;

    return formatterObj;
}
