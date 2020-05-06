class Response {
    static customResponse(res, status, message = null, data = null) {
        return res.status(status).json({
            status,
            message,
            data
        });
    }
    static validationError(res, message) {
        return res.status(422).json({
            status: 422,
            message,
            error: 'Validation Error'
        })
    }
    static authenticationError(res, message) {
        return res.status(401).json({
            status: 401,
            message,
            error: 'Authentication Error'
        })
    }
    static notFoundError(res, message) {
        return res.status(404).json({
            status: 404,
            message,
            error: 'Not Found'
        })
    }
    static conflictError(res, message) {
        return res.status(409).json({
            status: 409,
            message,
            error: 'Conflict Error'
        })
    }
    static serverError(res, message) {
        return res.status(500).json({
            status: 500,
            message,
            error: 'Internal Server Error'
        })
    }
}

export default Response