import jwt from 'jsonwebtoken';
import { userService } from '../database'
import Response from '../utilities/response'


const getAuthToken = (req) => {
    let { headers: { authorization } } = req;
    if (typeof authorization === "undefined") {
        authorization = ""
    }
    if (authorization && authorization.split(' ')[ 0 ] === "Bearer" || authorization.split(' ')[ 0 ] === "Token") {
        return authorization.split(' ')[ 1 ]
    };
    return null
};

const auth = {
    required: (req, res, next) => {
        try {
            const user = jwt.verify(getAuthToken(req), process.env.JWTSECRET);
            const query = userService.findById(user.id)
            query
                .then(user => {
                    if (!user) {
                        return Response.authenticationError(res, 'Authentication Error')
                    };
                    req.user = user
                    next();
                })

        } catch (error) {
            next(error)
        }

    },
    optional: (req, res, next) => {
        req.user = jwt.decode(getAuthToken(req))
        next();
    }
}

module.exports = auth;
