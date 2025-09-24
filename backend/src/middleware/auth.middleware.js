const { NextFunction, Request, Response } = require("express");
const httpStatusCodes = require("http-status-codes");
const jwt = require('jsonwebtoken');

const { User,} = require("../models/models.index");

class AuthMiddleware {

    async verifyAuth(req, res, next) {
        try {

            if(!req.headers["authorization"]?.startsWith("Bearer")) {
                return res.status(httpStatusCodes.StatusCodes.UNAUTHORIZED).json({
                    status: false, message: "Access denied. No token provided."
                });
            }

            const token = req.headers["authorization"].split(" ")[1];
            if(!token) {
                return res.status(httpStatusCodes.StatusCodes.UNAUTHORIZED).json({
                    status: false, message: "Access denied. Invalid token format."
                });
            }

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            if (!decoded?.UserInfo?._id) {
            return res.status(httpStatusCodes.StatusCodes.UNAUTHORIZED).json({
                status: false,
                message: "Invalid token payload",
            });
            }            

            // Store decoded user info in request
            // const { _id, email, roles } = decoded.UserInfo;
            req.user = decoded.UserInfo;
            //console.log(req.user);

            next();
        }
        catch(error) {
            handleError(req, res, error);
        }
    }

    async findUser(req, res, next) {
        try {
            const { _id } = req["user"]

            const user = await User.findById(_id)
            //.populate({ path: "role", select: "title" })

            if(!user) {
                return res.status(httpStatusCodes.StatusCodes.UNAUTHORIZED).json({
                    status: false, mesasge: httpStatusCodes.getReasonPhrase(httpStatusCodes.StatusCodes.UNAUTHORIZED)
                });
            }

            // req["user"] = user;

            req.user = {
                id: user._id,
                _id: user._id,
                email: user.email,
                stripeCustomerId: user.stripeCustomerId
            };

            next();
        }
        catch(error) {
            handleError(req, res, error);
        }
    }

    verifyRole( roles = [] ) {
        return ( req, res, next ) => {
            try {
            const { user } = req

            if( !roles.includes( user.role.title ) ){
                return res.status(httpStatusCodes.StatusCodes.UNAUTHORIZED).json({
                    status: false, message: "User Not Authorized."
                });
            } 
            next();
            } catch (error) {
            handleError(req, res, error);
            }
        }
    }
}

module.exports = AuthMiddleware;

// HELPER FUNCIONS

const handleError = function(req, res, error) {
    
    return res.status(httpStatusCodes.StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false, message: error.message
    });
}