const errorHandler = (app) => {
    app.use((req, res, next) => {
        const err = new Error('Not Found')
        err.status = 404;
        next(err)
    });

    app.use((err, req, res, next) => {
        const statusCode = err.status ? err.status : 404
        res.status(statusCode).send({
            error: {
                message: err.message,
                status: err.status
            }
        })
    });
};

export default errorHandler;



