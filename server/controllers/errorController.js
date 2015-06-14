module.exports = (function () {
    'use strict';

    function notFound(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    }

    function error(err, req, res, next) {
        var errorMap = {
            message: err.message,
            error: {}
        };

        if (req.app.get('env') === 'development') {
            errorMap.error = err;
        }

        res.status(err.status || 500);
        res.render('error', errorMap);
    }

    return {
        notFound: notFound,
        error: error
    };
})();