module.exports = {
    getOptimalChannel: (customer) => {
        // Fallback
        if (customer.app_login_frequency > 10) return "App Notification";
        return "Email";
    }
};
