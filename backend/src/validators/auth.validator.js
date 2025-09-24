const httpStatusCodes = require("http-status-codes");
const expressValidator = require("express-validator");

const validateSignup = [
    expressValidator.body("email").notEmpty().withMessage("Email required!").isEmail().withMessage("Email format is invalid"),
    expressValidator.body("password").notEmpty().withMessage("Password required!"),
    expressValidator.body("role").notEmpty().withMessage("Role required!").isMongoId().withMessage("Role is a valid Mongo id"),

    (req, res, next) => {
        const errors = expressValidator.validationResult(req);
        if(errors.array().length > 0) {
            return res.status(httpStatusCodes.StatusCodes.NOT_ACCEPTABLE).json({ status: false, error: errors.array()[0].msg });
        }
        next();
    }
];

const validateLogin = [
    expressValidator.body("email").notEmpty().withMessage("Email required!").isEmail().withMessage("Email format is invalid"),
    expressValidator.body("password").notEmpty().withMessage("Password required!"),

    (req, res, next) => {
        const errors = expressValidator.validationResult(req);
        if(errors.array().length > 0) {
            return res.status(httpStatusCodes.StatusCodes.NOT_ACCEPTABLE).json({ status: false, error: errors.array()[0].msg });
        }
        next();
    }
];

module.exports = { validateSignup, validateLogin, }