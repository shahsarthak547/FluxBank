module.exports = {
    getPersona: (customer) => {
        // Fallback or additional logic if ML doesn't provide it
        // Simulating some logic
        if (customer.investment_transactions > 5) return "Investor";
        if (customer.savings > 20000) return "Saver";
        return "General";
    }
};
