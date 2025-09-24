// const httpStatusCodes = require("http-status-codes");
// const { PaymentService } = require("../services/services.index"); // Use PaymentService instead
// const { LoggerUtils } = require('../utils/utils.index');

// const _paymentService = new PaymentService(); // Use the same service
// const _loggerUtils = new LoggerUtils();

// class SubscriptionController {
//     async createSubscription(req, res) {
//         try {
//             const userId = req.user.id || req.user._id;
//             const subscriptionData = req.body;
            
//             const response = await _paymentService.createSubscription(userId, subscriptionData);
            
//             if (response.status) {
//                 return res.status(httpStatusCodes.StatusCodes.OK).json({
//                     subscriptionId: response.data.subscriptionId,
//                     clientSecret: response.data.clientSecret,
//                     status: response.data.status
//                 });
//             } else {
//                 return res.status(httpStatusCodes.StatusCodes.BAD_REQUEST).json({
//                     error: response.message
//                 });
//             }
//         } catch (err) {
//             handleError(req, res, err);
//         }
//     }

//     async getCurrentSubscription(req, res) {
//         try {
//             const userId = req.user.id || req.user._id;
            
//             const response = await _paymentService.getCurrentSubscription(userId);
            
//             if (response.status) {
//                 return res.status(httpStatusCodes.StatusCodes.OK).json({
//                     subscription: response.data.subscription
//                 });
//             } else {
//                 return res.status(httpStatusCodes.StatusCodes.NOT_FOUND).json({
//                     error: response.message
//                 });
//             }
//         } catch (err) {
//             handleError(req, res, err);
//         }
//     }

//     async updateSubscription(req, res) {
//         try {
//             const userId = req.user.id || req.user._id;
//             const { id } = req.params;
//             const { action } = req.body;
            
//             const response = await _paymentService.updateSubscription(userId, id, action);
            
//             if (response.status) {
//                 return res.status(httpStatusCodes.StatusCodes.OK).json({
//                     subscription: response.data.subscription
//                 });
//             } else if (response.message.includes('Unauthorized')) {
//                 return res.status(httpStatusCodes.StatusCodes.FORBIDDEN).json({
//                     error: response.message
//                 });
//             } else {
//                 return res.status(httpStatusCodes.StatusCodes.BAD_REQUEST).json({
//                     error: response.message
//                 });
//             }
//         } catch (err) {
//             handleError(req, res, err);
//         }
//     }
// }

// module.exports = SubscriptionController;

// const handleError = function(req, res, error) {
//     console.error(error);
//     _loggerUtils.logError(req, res, error, "subscription.controller.js")
//     return res.status(httpStatusCodes.StatusCodes.INTERNAL_SERVER_ERROR)
//         .json({ error: "Internal server error: " + error.message });
// };