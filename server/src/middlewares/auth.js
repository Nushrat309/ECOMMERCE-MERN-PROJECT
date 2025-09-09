const createError = require("http-errors");
const jwt = require('jsonwebtoken');
const { jwtAccessKey } = require("../secret");

const isLoggedIn = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if(!accessToken){
            throw createError(401,'Access token not found.Please log in');
        }
        const decode = jwt.verify(accessToken, jwtAccessKey);
        if(!decode){
            throw createError(401,'Invalid access token.Please login again');
        }
        req.body.userId = decoded._id;
        next();
    } catch (error) {
        return next(error);
    }
};

const isLoggedOut = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if(accessToken){
            try {
                const decode = jwt.verify(accessToken,jwtAccessKey);
                if(decode){
                    throw createError(400,'User ia already logged in');
                }
            } catch (error) {
            throw error;
        }
        } 
        next();
    } catch (error) {
        return next(error);
    }
};

module.exports = { isLoggedIn, isLoggedOut };