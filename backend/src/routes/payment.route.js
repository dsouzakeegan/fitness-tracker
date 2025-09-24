const express = require('express');
const { PaymentController } = require('../controllers/controllers.index');
const { AuthMiddleware } = require("../middleware/middleware.index");
const rateLimitMiddleware = require("../middleware/rate-limit.middleware");

const _router = express.Router();
const _paymentController = new PaymentController();
const _authMiddleware = new AuthMiddleware();


/* CREATE PAYMENT INTENT :: (POST) => /api/payments/create-intent */
_router.post('/payments/create-intent', 
    rateLimitMiddleware.paymentLimiter,
    _authMiddleware.verifyAuth, 
    _paymentController.createPaymentIntent
);

/* GET PAYMENT HISTORY :: (GET) => /api/payments/history */
_router.get('/payments/history', 
    _authMiddleware.verifyAuth, 
    _paymentController.getPaymentHistory
);

/* DOWNLOAD INVOICE :: (GET) => /api/payments/{id}/invoice */
_router.get('/payments/:id/invoice', 
    _authMiddleware.verifyAuth, 
    _paymentController.downloadInvoice
);

/* CREATE SUBSCRIPTION :: (POST) => /api/subscriptions/create */
_router.post('/subscriptions/create', 
    rateLimitMiddleware.paymentLimiter,
    _authMiddleware.verifyAuth, 
    _paymentController.createSubscription
);

/* GET CURRENT SUBSCRIPTION :: (GET) => /api/subscriptions/current */
_router.get('/subscriptions/current', 
    _authMiddleware.verifyAuth, 
    _paymentController.getCurrentSubscription
);

/* UPDATE SUBSCRIPTION :: (PUT) => /api/subscriptions/{id} */
_router.put('/subscriptions/:id', 
    rateLimitMiddleware.paymentLimiter,
    _authMiddleware.verifyAuth, 
    _paymentController.updateSubscription
);

module.exports = _router;