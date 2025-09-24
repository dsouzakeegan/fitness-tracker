const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");
const { LoggerUtils } = require("../utils/utils.index");

const _loggerUtils = new LoggerUtils();

class RateLimitMiddleware {
  constructor() {
    const commonConfig = {
      windowMs: 15 * 60 * 1000, // 15 minutes
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: this.getIpKey,
      handler: (req, res) => {
        res.status(429).json({
          status: "error",
          message: "Too many requests, please try again later.",
          retryAfter: Math.ceil(15 * 60 / 1000) // 15 minutes in seconds
        });
      },
    };

    // Configurable rate limits with environment-based overrides
    this.authLimiter = rateLimit({
      ...commonConfig,
      max: process.env.AUTH_RATE_LIMIT || 5,
      message: {
        status: "error",
        message: "Too many login attempts. Please try again after 15 minutes.",
      },
    });

    this.paymentLimiter = rateLimit({
      ...commonConfig,
      max: process.env.PAYMENT_RATE_LIMIT || 10,
      message: {
        status: "error",
        message: "Too many payment requests. Please try again after 15 minutes.",
      },
    });

    this.apiLimiter = rateLimit({
      ...commonConfig,
      max: process.env.API_RATE_LIMIT || 100,
      message: {
        status: "error",
        message: "API rate limit exceeded. Please try again later.",
      },
    });

    this.webhookLimiter = rateLimit({
      ...commonConfig,
      windowMs: 60 * 1000, // 1 minute for webhooks
      max: process.env.WEBHOOK_RATE_LIMIT || 100,
      skip: (req) => !req.headers["stripe-signature"], // only enforce for Stripe calls
      message: {
        status: "error",
        message: "Too many webhook requests. Please try again later.",
      },
    });
  }

  // Centralized IP key generator
  getIpKey(req) {
    if (req.headers["stripe-signature"]) {
      return `stripe:${req.headers["stripe-signature"]}`;
    }
    return ipKeyGenerator(req);
  }
}

module.exports = new RateLimitMiddleware();
