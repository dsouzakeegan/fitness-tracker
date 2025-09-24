function validatePaymentIntent(data) {
    // Ensure data is an object
    if (!data || typeof data !== 'object') {
        return 'Invalid payment data. Must be an object.';
    }

    const { amount, currency, paymentType, planId } = data;
    
    if (!amount || typeof amount !== 'number' || amount < 50) {
        return 'Amount must be a number and at least $0.50';
    }
    
    if (currency && !['usd', 'eur', 'gbp'].includes(currency.toLowerCase())) {
        return 'Invalid currency. Supported: USD, EUR, GBP';
    }
    
    if (paymentType && !['subscription', 'one-time'].includes(paymentType)) {
        return 'Invalid payment type. Use "subscription" or "one-time"';
    }
    
    // Optional additional validation for planId if needed
    if (planId && typeof planId !== 'string') {
        return 'Plan ID must be a string if provided';
    }
    
    return null; // No errors
}

function validateSubscriptionData(data) {
    // Ensure data is an object
    if (!data || typeof data !== 'object') {
        return 'Invalid subscription data. Must be an object.';
    }

    const { priceId, paymentMethodId } = data;
    
    if (!priceId || typeof priceId !== 'string') {
        return 'Price ID is required and must be a string';
    }
    
    // Validate price ID format (basic Stripe price ID pattern)
    if (!/^price_[a-zA-Z0-9]+$/.test(priceId)) {
        return 'Invalid Price ID format';
    }
    
    if (paymentMethodId && typeof paymentMethodId !== 'string') {
        return 'Payment method ID must be a string';
    }
    
    // Optional: Validate payment method ID format if provided
    // if (paymentMethodId && !/^pm_[a-zA-Z0-9]+$/.test(paymentMethodId)) {
    //     return 'Invalid Payment Method ID format';
    // }
    
    return null; // No errors
}

module.exports = {
    validatePaymentIntent,
    validateSubscriptionData
};