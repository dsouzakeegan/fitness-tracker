const multer = require('multer');
const httpStatusCodes = require("http-status-codes");

class MulterErrorMiddleware {
    async multerError(error, req, res, next) {
        try {

            if (error instanceof multer.MulterError) {
                return res.status(httpStatusCodes.StatusCodes.PRECONDITION_FAILED).json({
                    status: false, message: error.message
                });
            } else if (error) {
                return res.status(httpStatusCodes.StatusCodes.PRECONDITION_FAILED).json({
                    status: false, message: error.message
                });
            }
            next();
        }
        catch(error) {
            handleError(req, res, error);
        }
    }
}

module.exports = MulterErrorMiddleware;

// HELPER FUNCIONS

const handleError = function(req, res, error) {
    
    return res.status(httpStatusCodes.StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false, message: error.message
    });
}