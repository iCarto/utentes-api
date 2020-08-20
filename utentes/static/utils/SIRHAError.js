SIRHA.Error.error = function(msg, data, ...params) {
    class CustomError extends Error {
        constructor(msg, data, ...params) {
            // Pass remaining arguments (including vendor specific ones) to parent constructor
            super(msg + ": " + JSON.stringify(data), ...params);

            // Maintains proper stack trace for where our error was thrown (only available on V8)
            if (Error.captureStackTrace) {
                Error.captureStackTrace(this, CustomError);
            }

            this.name = "CustomError";
            // Custom debugging information
            this.data = data;
        }
    }

    return new CustomError(msg, data, params);
};
