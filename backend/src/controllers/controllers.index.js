const AuthController = require("./auth.controller");
const RoleController = require("./role.controller");
const WorkoutController = require("./workout.controller");
const ProgressController = require("./progress.controller");
const PaymentController = require("./payment.controller");
const WebhookController = require("./webhook.controller");

module.exports = {
    AuthController,
    RoleController,
    WorkoutController,
    ProgressController,
    PaymentController,
    WebhookController
}