const AuthMiddleware = require("./auth.middleware");
const RateLimitMiddleware = require("./rate-limit.middleware");

module.exports = {
    AuthMiddleware,
    RateLimitMiddleware
}