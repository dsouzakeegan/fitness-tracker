const httpStatusCodes = require("http-status-codes");
const { PaymentService } = require("../services/services.index");
const { LoggerUtils } = require('../utils/utils.index');
const { validatePaymentIntent, validateSubscriptionData } = require('../utils/validation');

const _paymentService = new PaymentService();
const _loggerUtils = new LoggerUtils();

class PaymentController {
    async createPaymentIntent(req, res) {
        try {
            const userId = req.user.id || req.user._id;
            const paymentData = req.body;
            
            // Validate input
            const validationError = validatePaymentIntent(paymentData);
            if (validationError) {
                return res.status(httpStatusCodes.StatusCodes.BAD_REQUEST).json({
                    error: validationError
                });
            }
            
            const response = await _paymentService.createPaymentIntent(userId, paymentData);
            
            if (response.status) {
                return res.status(httpStatusCodes.StatusCodes.OK).json({
                    clientSecret: response.data.clientSecret,
                    paymentIntentId: response.data.paymentIntentId
                });
            } else {
                return res.status(httpStatusCodes.StatusCodes.BAD_REQUEST).json({
                    error: response.message
                });
            }
        } catch (err) {
            return handleError(req, res, err);
        }
    }

    async getPaymentHistory(req, res) {
        try {
            const userId = req.user.id || req.user._id;
            const stripeCustomerId = req.user.stripeCustomerId;
            
            const response = await _paymentService.getPaymentHistory(userId, stripeCustomerId);
            
            if (response.status) {
                return res.status(httpStatusCodes.StatusCodes.OK).json({
                    payments: response.data.payments
                });
            } else {
                return res.status(httpStatusCodes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    error: response.message
                });
            }
        } catch (err) {
            return handleError(req, res, err);
        }
    }

    async createSubscription(req, res) {
        try {
            const userId = req.user.id || req.user._id;
            const subscriptionData = req.body;
            
            // Validate input
            const validationError = validateSubscriptionData(subscriptionData);
            if (validationError) {
                return res.status(httpStatusCodes.StatusCodes.BAD_REQUEST).json({
                    error: validationError
                });
            }
            
            const response = await _paymentService.createSubscription(userId, subscriptionData);
            
            if (response.status) {
                return res.status(httpStatusCodes.StatusCodes.OK).json({
                    subscriptionId: response.data.subscriptionId,
                    clientSecret: response.data.clientSecret,
                    status: response.data.status
                });
            } else {
                return res.status(httpStatusCodes.StatusCodes.BAD_REQUEST).json({
                    error: response.message
                });
            }
        } catch (err) {
            return handleError(req, res, err);
        }
    }

    async getCurrentSubscription(req, res) {
        try {
            const userId = req.user.id || req.user._id;
            
            const response = await _paymentService.getCurrentSubscription(userId);
            
            if (response.status) {
                return res.status(httpStatusCodes.StatusCodes.OK).json({
                    subscription: response.data.subscription
                });
            } else {
                return res.status(httpStatusCodes.StatusCodes.NOT_FOUND).json({
                    error: response.message
                });
            }
        } catch (err) {
            return handleError(req, res, err);
        }
    }

    async updateSubscription(req, res) {
        try {
            const userId = req.user.id || req.user._id;
            const { id } = req.params;
            const { action } = req.body;
            
            // Validate action
            if (!['cancel', 'reactivate'].includes(action)) {
                return res.status(httpStatusCodes.StatusCodes.BAD_REQUEST).json({
                    error: 'Invalid action. Use "cancel" or "reactivate"'
                });
            }
            
            const response = await _paymentService.updateSubscription(userId, id, action);
            
            if (response.status) {
                return res.status(httpStatusCodes.StatusCodes.OK).json({
                    subscription: response.data.subscription
                });
            } else if (response.message.includes('Unauthorized')) {
                return res.status(httpStatusCodes.StatusCodes.FORBIDDEN).json({
                    error: response.message
                });
            } else {
                return res.status(httpStatusCodes.StatusCodes.BAD_REQUEST).json({
                    error: response.message
                });
            }
        } catch (err) {
            return handleError(req, res, err);
        }
    }

    async downloadInvoice(req, res) {
        try {
            const userId = req.user.id || req.user._id;
            const { id } = req.params;
            
            const response = await _paymentService.getInvoice(userId, id);
            
            if (response.status && response.data.invoiceUrl) {
                return res.redirect(response.data.invoiceUrl);
            } else {
                return res.status(httpStatusCodes.StatusCodes.NOT_FOUND).json({
                    error: 'Invoice not found'
                });
            }
        } catch (err) {
            return handleError(req, res, err);
        }
    }
}

const handleError = function(req, res, error) {
    _loggerUtils.logError(req, res, error, "payment.controller.js");
    
    // Don't expose internal errors in production
    const isProduction = process.env.NODE_ENV === 'production';
    const errorMessage = isProduction ? 'Internal server error occurred' : error.message;
    
    return res.status(httpStatusCodes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ 
            error: errorMessage,
            requestId: req.headers['x-request-id'] || 'unknown'
        });
};

module.exports = PaymentController;