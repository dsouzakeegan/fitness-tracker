const httpStatusCodes = require("http-status-codes");
const expressValidator = require("express-validator");

const validateAddRole = [
    expressValidator.body("title").notEmpty().withMessage("Title required!"),

    (req, res, next) => {
        const errors = expressValidator.validationResult(req);
        if(errors.array().length > 0) {
            return res.status(httpStatusCodes.StatusCodes.NOT_ACCEPTABLE).json({ status: false, error: errors.array()[0].msg });
        }
        next();
    }
];

module.exports = { validateAddRole }