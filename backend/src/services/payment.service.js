const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { LoggerUtils } = require('../utils/utils.index');
const User = require('../models/user.model');
const Payment = require('../models/payment.model');
const Subscription = require('../models/subscription.model'); // NEW MODEL NEEDED

const _loggerUtils = new LoggerUtils();

class PaymentService {
    async createPaymentIntent(userId, { amount, currency = 'usd', paymentType, planId }) {
        try {
            // Input validation
            if (!amount || amount < 50) {
                return {
                    status: false,
                    message: 'Invalid amount. Minimum is $0.50'
                };
            }

            if (!userId) {
                return {
                    status: false,
                    message: 'User ID is required'
                };
            }

            // Verify user exists
            const user = await User.findById(userId);
            if (!user) {
                return {
                    status: false,
                    message: 'User not found'
                };
            }

            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount),
                currency: currency.toLowerCase(),
                metadata: {
                    userId: userId.toString(),
                    paymentType: paymentType || 'subscription',
                    planId: planId || 'unknown'
                },
                automatic_payment_methods: {
                    enabled: true,
                }
            });

            // CRITICAL FIX: Remove dead code that was after return statement
            // Store payment intent in database for tracking
            await Payment.create({
                userId,
                stripePaymentId: paymentIntent.id,
                amount,
                currency,
                status: 'pending',
                paymentMethod: {
                    type: 'card'
                },
                metadata: {
                    paymentType: paymentType || 'subscription',
                    planId: planId || 'unknown'
                }
            });

            _loggerUtils.logInfo(
                null, 
                null, 
                `Payment intent created: ${paymentIntent.id}`, 
                "payment.service.js"
            );

            return {
                status: true,
                message: 'Payment intent created successfully',
                data: {
                    clientSecret: paymentIntent.client_secret,
                    paymentIntentId: paymentIntent.id
                }
            };
        } catch (error) {
            _loggerUtils.logError(null, null, error, "payment.service.js");
            return {
                status: false,
                message: error.message
            };
        }
    }

    async getPaymentHistory(userId, stripeCustomerId) {
        try {
            // Input validation
            if (!userId) {
                return {
                    status: false,
                    message: 'User ID is required'
                };
            }

            // Get payments from database first (more reliable)
            const dbPayments = await Payment.find({ userId })
                .sort({ createdAt: -1 })
                .lean();

            // If no stripe customer ID, return database payments only
            if (!stripeCustomerId) {
                const formattedPayments = dbPayments.map(payment => {
                    // Handle different metadata formats
                    const getMetadataValue = (key) => {
                        if (payment.metadata instanceof Map) {
                            return payment.metadata.get(key);
                        }
                        return payment.metadata?.[key];
                    };

                    return {
                    id: payment.stripePaymentId,
                    amount: payment.amount,
                    currency: payment.currency,
                    status: payment.status,
                        description: getMetadataValue('description') || 'Payment',
                    created: payment.createdAt.getTime(),
                    paymentMethod: payment.paymentMethod
                    };
                });

                return {
                    status: true,
                    message: 'Payment history retrieved successfully',
                    data: { payments: formattedPayments }
                };
            }

            // Fetch from Stripe and merge with database
            const [paymentIntents, invoices] = await Promise.all([
                stripe.paymentIntents.list({
                    customer: stripeCustomerId,
                    limit: 100
                }),
                stripe.invoices.list({
                    customer: stripeCustomerId,
                    limit: 100
                })
            ]);

            const payments = [];

            // Process payment intents
            for (const pi of paymentIntents.data) {
                let paymentMethod = { type: 'card' };
                
                if (pi.charges && pi.charges.data.length > 0) {
                    const charge = pi.charges.data[0];
                    if (charge.payment_method_details?.card) {
                        paymentMethod = {
                            type: 'card',
                            brand: charge.payment_method_details.card.brand,
                            last4: charge.payment_method_details.card.last4
                        };
                    }
                }

                payments.push({
                    id: pi.id,
                    amount: pi.amount,
                    currency: pi.currency,
                    status: pi.status,
                    description: pi.description || 'One-time payment',
                    created: pi.created * 1000,
                    paymentMethod
                });

                // Update database record if exists
                await Payment.findOneAndUpdate(
                    { stripePaymentId: pi.id },
                    { 
                        status: pi.status,
                        metadata: {
                            description: pi.description || 'One-time payment'
                        }
                    },
                    { upsert: false }
                );
            }

            // Process invoices
            for (const invoice of invoices.data) {
                if (invoice.status === 'paid' && invoice.payment_intent) {
                    const description = invoice.lines?.data[0]?.description 
                        ? `Subscription - ${invoice.lines.data[0].description}`
                        : 'Subscription Payment';

                    payments.push({
                        id: invoice.payment_intent,
                        amount: invoice.amount_paid,
                        currency: invoice.currency,
                        status: 'succeeded',
                        description,
                        created: invoice.created * 1000,
                        paymentMethod: { type: 'card', brand: 'card', last4: '****' }
                    });
                }
            }

            payments.sort((a, b) => b.created - a.created);

            return {
                status: true,
                message: 'Payment history retrieved successfully',
                data: { payments }
            };
        } catch (error) {
            // Improved error logging
            console.error('Payment History Error:', error);
            _loggerUtils.logError(
                { headers: {} }, 
                { status: () => {} }, 
                error, 
                "payment.service.js"
            );
            return {
                status: false,
                message: error.message || 'Failed to retrieve payment history'
            };
        }
    }

    async createSubscription(userId, { priceId, paymentMethodId }) {
        try {
            // Input validation
            if (!priceId || !userId) {
                return {
                    status: false,
                    message: 'Price ID and User ID are required'
                };
            }

            const user = await User.findById(userId);
            if (!user) {
                return {
                    status: false,
                    message: 'User not found'
                };
            }

            // Check for existing active subscription
            const existingSubscription = await Subscription.findOne({
                userId,
                status: { $in: ['active', 'trialing', 'past_due'] }
            });

            if (existingSubscription) {
                return {
                    status: false,
                    message: 'User already has an active subscription'
                };
            }

            let customer;
            if (!user.stripeCustomerId) {
                customer = await stripe.customers.create({
                    email: user.email,
                    name: user.name,
                    metadata: { userId: userId.toString() }
                });
                
                user.stripeCustomerId = customer.id;
                await user.save();
            } else {
                customer = await stripe.customers.retrieve(user.stripeCustomerId);
            }

            // Attach payment method if provided
            if (paymentMethodId) {
                await stripe.paymentMethods.attach(paymentMethodId, {
                    customer: customer.id,
                });
                
                await stripe.customers.update(customer.id, {
                    invoice_settings: {
                        default_payment_method: paymentMethodId,
                    },
                });
            }

            const subscription = await stripe.subscriptions.create({
                customer: customer.id,
                items: [{ price: priceId }],
                payment_behavior: 'default_incomplete',
                payment_settings: { save_default_payment_method: 'on_subscription' },
                expand: ['latest_invoice.payment_intent'],
                metadata: { userId: userId.toString() }
            });

            // Store subscription in database
            await Subscription.create({
                userId,
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: customer.id,
                priceId,
                status: subscription.status,
                currentPeriodStart: new Date(subscription.current_period_start * 1000),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                cancelAtPeriodEnd: subscription.cancel_at_period_end
            });

            const response = {
                status: true,
                message: 'Subscription created successfully',
                data: {
                    subscriptionId: subscription.id,
                    status: subscription.status
                }
            };

            if (subscription.latest_invoice?.payment_intent) {
                response.data.clientSecret = subscription.latest_invoice.payment_intent.client_secret;
            }

            _loggerUtils.logInfo(null, null, `Subscription created: ${subscription.id}`, "payment.service.js");

            return response;
        } catch (error) {
            _loggerUtils.logError(null, null, error, "payment.service.js");
            return {
                status: false,
                message: error.message
            };
        }
    }

    async getCurrentSubscription(userId) {
        try {
            if (!userId) {
                return {
                    status: false,
                    message: 'User ID is required'
                };
            }

            // First check database
            const dbSubscription = await Subscription.findOne({
                userId,
                status: { $in: ['active', 'canceled', 'past_due', 'trialing'] }
            }).sort({ createdAt: -1 });

            if (!dbSubscription) {
                return {
                    status: false,
                    message: 'No subscription found'
                };
            }

            // Sync with Stripe for latest data
            const stripeSubscription = await stripe.subscriptions.retrieve(dbSubscription.stripeSubscriptionId);
            
            // Update database with latest Stripe data
            await Subscription.findByIdAndUpdate(dbSubscription._id, {
                status: stripeSubscription.status,
                currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
                currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
                cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end
            });

            const price = await stripe.prices.retrieve(stripeSubscription.items.data[0].price.id);
            const product = await stripe.products.retrieve(price.product);

            const planNames = {
                'basic': 'Basic Monthly',
                'premium': 'Premium Monthly', 
                'elite': 'Elite Monthly'
            };

            const planId = product.metadata?.planId || product.name.toLowerCase().split(' ')[0];
            
            return {
                status: true,
                message: 'Current subscription retrieved successfully',
                data: {
                    subscription: {
                        id: stripeSubscription.id,
                        status: stripeSubscription.status,
                        planId: planId,
                        planName: planNames[planId] || product.name,
                        amount: price.unit_amount,
                        currency: price.currency,
                        currentPeriodStart: stripeSubscription.current_period_start * 1000,
                        currentPeriodEnd: stripeSubscription.current_period_end * 1000,
                        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
                        lastFour: '****' // Get from default payment method
                    }
                }
            };
        } catch (error) {
            if (error.code === 'resource_missing') {
                return {
                    status: false,
                    message: 'No subscription found'
                };
            }
            _loggerUtils.logError(null, null, error, "payment.service.js");
            return {
                status: false,
                message: error.message
            };
        }
    }

    async updateSubscription(userId, subscriptionId, action) {
        try {
            if (!userId || !subscriptionId || !action) {
                return {
                    status: false,
                    message: 'User ID, subscription ID, and action are required'
                };
            }

            const user = await User.findById(userId);
            if (!user || !user.stripeCustomerId) {
                return {
                    status: false,
                    message: 'User not found or no subscription associated'
                };
            }

            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            if (subscription.customer !== user.stripeCustomerId) {
                return {
                    status: false,
                    message: 'Unauthorized to update this subscription'
                };
            }

            let updatedSubscription;
            switch (action) {
                case 'cancel':
                    updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
                        cancel_at_period_end: true
                    });
                    break;

                case 'reactivate':
                    updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
                        cancel_at_period_end: false
                    });
                    break;

                default:
                    return {
                        status: false,
                        message: 'Invalid action specified. Use "cancel" or "reactivate"'
                    };
            }

            // Update database
            await Subscription.findOneAndUpdate(
                { stripeSubscriptionId: subscriptionId },
                { 
                    status: updatedSubscription.status,
                    cancelAtPeriodEnd: updatedSubscription.cancel_at_period_end
                }
            );

            _loggerUtils.logInfo(null, null, `Subscription ${action}: ${subscriptionId}`, "payment.service.js");

            return {
                status: true,
                message: 'Subscription updated successfully',
                data: {
                    subscription: {
                        id: updatedSubscription.id,
                        status: updatedSubscription.status,
                        currentPeriodEnd: updatedSubscription.current_period_end * 1000,
                        cancelAtPeriodEnd: updatedSubscription.cancel_at_period_end
                    }
                }
            };
        } catch (error) {
            _loggerUtils.logError(null, null, error, "payment.service.js");
            return {
                status: false,
                message: error.message
            };
        }
    }

    async getInvoice(userId, paymentId) {
        try {
            if (!userId || !paymentId) {
                return {
                    status: false,
                    message: 'User ID and payment ID are required'
                };
            }

            const user = await User.findById(userId);
            if (!user || !user.stripeCustomerId) {
                return {
                    status: false,
                    message: 'User not found'
                };
            }

            const invoices = await stripe.invoices.list({
                customer: user.stripeCustomerId,
                limit: 100
            });

            const invoice = invoices.data.find(inv => 
                inv.payment_intent === paymentId
            );

            if (!invoice) {
                return {
                    status: false,
                    message: 'Invoice not found'
                };
            }

            return {
                status: true,
                message: 'Invoice retrieved successfully',
                data: {
                    invoiceUrl: invoice.invoice_pdf,
                    hostedUrl: invoice.hosted_invoice_url
                }
            };
        } catch (error) {
            _loggerUtils.logError(null, null, error, "payment.service.js");
            return {
                status: false,
                message: error.message
            };
        }
    }
}

module.exports = PaymentService;