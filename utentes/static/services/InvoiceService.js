SIRHA.Services.InvoiceService = {
    /*
     * Calculates the string representation of the billing period for an invoice

     Maybe this method should be in the Invoice Model. Check that models/facturacao.py
     has the same implementation and both should be updated. Maybe it should be defined
     as an endpoint or property

     @param {String} billingCycle - Which is the billing cycle (fact_tipo). 'Mensal', 'Trimestral', 'Anual'
     @param {String} month - The month in number format of this invoice
     @param {String} year - The year in number format of this invoice
     @return {String} - Returns the billing period in a format that can be directly used in printed invoices
     */
    billingPeriod: function(billingCycle, month, year) {
        if (billingCycle == "Mensal") {
            if (month == 1) {
                return `12/${year - 1}`;
            }
            return `${String(month - 1).padStart(2, "0")}/${year}`;
        }

        if (billingCycle == "Trimestral") {
            if (month == 4) {
                return `01/${year} - 03/${year}`;
            }
            if (month == 7) {
                return `04/${year} - 06/${year}`;
            }
            if (month == 10) {
                return `07/${year} - 09/${year}`;
            }
            if (month == 1) {
                return `10/${year - 1} - 12/${year - 1}`;
            }
        }
        if (billingCycle == "Anual") {
            return year - 1;
        }
        throw SIRHA.Error.error("Invalid input data to calculate the billing period", {
            billingCycle,
            year,
            month,
        });
    },
};
