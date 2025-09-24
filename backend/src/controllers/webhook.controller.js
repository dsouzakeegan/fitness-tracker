const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/user.model');
const Subscription = require('../models/subscription.model');
const Payment = require('../models/payment.model');
const { LoggerUtils } = require('../utils/utils.index');

const _loggerUtils = new LoggerUtils();

class WebhookController {
    async handleStripeWebhook(req, res) {
        const sig = req.headers['stripe-signature'];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err) {
            _loggerUtils.logError(req, res, err, "webhook.controller.js");
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        try {
            switch (event.type) {
                case 'customer.subscription.created':
                case 'customer.subscription.updated':
                    await this.handleSubscriptionUpdate(event.data.object);
                    break;

                case 'customer.subscription.deleted':
                    await this.handleSubscriptionDeleted(event.data.object);
                    break;

                case 'invoice.payment_succeeded':
                    await this.handlePaymentSucceeded(event.data.object);
                    break;

                case 'invoice.payment_failed':
                    await this.handlePaymentFailed(event.data.object);
                    break;

                case 'payment_intent.succeeded':
                    await this.handlePaymentIntentSucceeded(event.data.object);
                    break;

                default:
                    _loggerUtils.logInfo(req, res, `Unhandled event type: ${event.type}`, "webhook.controller.js");
            }

            res.json({ received: true });
        } catch (error) {
            _loggerUtils.logError(req, res, error, "webhook.controller.js");
            res.status(500).json({ error: 'Webhook processing failed' });
        }
    }

    async handleSubscriptionUpdate(subscription) {
        await Subscription.findOneAndUpdate(
            { stripeSubscriptionId: subscription.id },
            {
                status: subscription.status,
                currentPeriodStart: new Date(subscription.current_period_start * 1000),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
                canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null
            },
            { upsert: false }
        );
    }

    async handleSubscriptionDeleted(subscription) {
        await Subscription.findOneAndUpdate(
            { stripeSubscriptionId: subscription.id },
            { 
                status: 'canceled',
                canceledAt: new Date()
            }
        );
    }

    async handlePaymentSucceeded(invoice) {
        // Update subscription status if needed
        if (invoice.subscription) {
            await Subscription.findOneAndUpdate(
                { stripeSubscriptionId: invoice.subscription },
                { status: 'active' }
            );
        }
    }

    async handlePaymentFailed(invoice) {
        // Handle failed payment logic
        _loggerUtils.logError(null, null, 
            `Payment failed for invoice: ${invoice.id}`, 
            "webhook.controller.js"
        );
    }

    async handlePaymentIntentSucceeded(paymentIntent) {
        await Payment.findOneAndUpdate(
            { stripePaymentId: paymentIntent.id },
            { status: 'succeeded' }
        );
    }
}

module.exports = WebhookController;