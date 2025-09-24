// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const { LoggerUtils } = require('../utils/utils.index');
// const User = require('../models/user.model');

// const _loggerUtils = new LoggerUtils();

// class SubscriptionService {
//     async createSubscription(userId, { priceId, paymentMethodId }) {
//         try {
//             // Get or create Stripe customer
//             let user = await User.findById(userId);
//             if (!user) {
//                 return {
//                     status: false,
//                     message: 'User not found'
//                 };
//             }

//             if (!user.stripeCustomerId) {
//                 const customer = await stripe.customers.create({
//                     email: user.email,
//                     payment_method: paymentMethodId,
//                     invoice_settings: {
//                         default_payment_method: paymentMethodId,
//                     },
//                 });
//                 user.stripeCustomerId = customer.id;
//                 await user.save();
//             }

//             // Create the subscription
//             const subscription = await stripe.subscriptions.create({
//                 customer: user.stripeCustomerId,
//                 items: [{ price: priceId }],
//                 payment_behavior: 'default_incomplete',
//                 expand: ['latest_invoice.payment_intent'],
//             });

//             return {
//                 status: true,
//                 message: 'Subscription created successfully',
//                 data: {
//                     subscriptionId: subscription.id,
//                     clientSecret: subscription.latest_invoice.payment_intent.client_secret,
//                 }
//             };
//         } catch (error) {
//             _loggerUtils.logError(null, null, error, "subscription.service.js");
//             return {
//                 status: false,
//                 message: error.message
//             };
//         }
//     }

//     async getCurrentSubscription(userId) {
//         try {
//             const user = await User.findById(userId);
//             if (!user || !user.stripeCustomerId) {
//                 return {
//                     status: false,
//                     message: 'No subscription found'
//                 };
//             }

//             const subscriptions = await stripe.subscriptions.list({
//                 customer: user.stripeCustomerId,
//                 status: 'active',
//                 limit: 1
//             });

//             if (subscriptions.data.length === 0) {
//                 return {
//                     status: false,
//                     message: 'No active subscription found'
//                 };
//             }

//             const subscription = subscriptions.data[0];
//             const price = await stripe.prices.retrieve(subscription.items.data[0].price.id);
//             const product = await stripe.products.retrieve(price.product);

//             return {
//                 status: true,
//                 message: 'Subscription retrieved successfully',
//                 data: {
//                     subscription: {
//                         id: subscription.id,
//                         status: subscription.status,
//                         currentPeriodEnd: new Date(subscription.current_period_end * 1000),
//                         cancelAtPeriodEnd: subscription.cancel_at_period_end,
//                         plan: {
//                             id: product.id,
//                             name: product.name,
//                             price: price.unit_amount / 100,
//                             currency: price.currency,
//                             interval: price.recurring.interval
//                         }
//                     }
//                 }
//             };
//         } catch (error) {
//             _loggerUtils.logError(null, null, error, "subscription.service.js");
//             return {
//                 status: false,
//                 message: error.message
//             };
//         }
//     }

//     async updateSubscription(userId, subscriptionId, action) {
//         try {
//             const user = await User.findById(userId);
//             if (!user || !user.stripeCustomerId) {
//                 return {
//                     status: false,
//                     message: 'User not found or no subscription associated'
//                 };
//             }

//             const subscription = await stripe.subscriptions.retrieve(subscriptionId);
//             if (subscription.customer !== user.stripeCustomerId) {
//                 return {
//                     status: false,
//                     message: 'Unauthorized to update this subscription'
//                 };
//             }

//             if (!['cancel', 'reactivate'].includes(action)) {
//                 return {
//                     status: false,
//                     message: 'Invalid action specified'
//                 };
//             }

//             const updateData = {
//                 cancel_at_period_end: action === 'cancel'
//             };

//             const updatedSubscription = await stripe.subscriptions.update(subscriptionId, updateData);

//             return {
//                 status: true,
//                 message: 'Subscription updated successfully',
//                 data: {
//                     subscription: {
//                         id: updatedSubscription.id,
//                         status: updatedSubscription.status,
//                         currentPeriodEnd: new Date(updatedSubscription.current_period_end * 1000),
//                         cancelAtPeriodEnd: updatedSubscription.cancel_at_period_end
//                     }
//                 }
//             };
//         } catch (error) {
//             _loggerUtils.logError(null, null, error, "subscription.service.js");
//             return {
//                 status: false,
//                 message: error.message
//             };
//         }
//     }
// }

// module.exports = SubscriptionService;
