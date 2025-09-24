const express = require('express');
const { WebhookController } = require('../controllers/controllers.index');

const _router = express.Router();
const _webhookController = new WebhookController();

// Raw body parser middleware for Stripe webhooks
_router.use('/stripe', express.raw({ type: 'application/json' }));

/* STRIPE WEBHOOK :: (POST) => /api/webhooks/stripe */
_router.post('/stripe', _webhookController.handleStripeWebhook);

module.exports = _router;