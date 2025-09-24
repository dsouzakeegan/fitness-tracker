const stripe = require('stripe');

class StripeConfig {
    constructor() {
        this.validateEnvironment();
        this.stripe = stripe(process.env.STRIPE_SECRET_KEY);
    }

    validateEnvironment() {
        const required = [
            'STRIPE_SECRET_KEY',
            'STRIPE_WEBHOOK_SECRET',
            'STRIPE_PUBLISHABLE_KEY'
        ];

        const missing = required.filter(key => !process.env[key]);
        
        if (missing.length > 0) {
            throw new Error(`Missing required Stripe environment variables: ${missing.join(', ')}`);
        }

        // Validate key formats
        if (!process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
            throw new Error('Invalid STRIPE_SECRET_KEY format');
        }

        if (!process.env.STRIPE_PUBLISHABLE_KEY.startsWith('pk_')) {
            throw new Error('Invalid STRIPE_PUBLISHABLE_KEY format');
        }

        if (!process.env.STRIPE_WEBHOOK_SECRET.startsWith('whsec_')) {
            throw new Error('Invalid STRIPE_WEBHOOK_SECRET format');
        }

        // Warn about test vs live keys in production
        if (process.env.NODE_ENV === 'production') {
            if (process.env.STRIPE_SECRET_KEY.includes('_test_')) {
                console.warn('⚠️  WARNING: Using test Stripe keys in production!');
            }
        }
    }

    getStripeInstance() {
        return this.stripe;
    }

    // Price IDs for different plans
    getPriceIds() {
        return {
            basic: process.env.STRIPE_BASIC_PRICE_ID,
            premium: process.env.STRIPE_PREMIUM_PRICE_ID,
            elite: process.env.STRIPE_ELITE_PRICE_ID
        };
    }
}

module.exports = new StripeConfig();