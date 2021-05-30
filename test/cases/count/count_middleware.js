var JsStoreOptions = {
    countMiddleware: function (request, next) {
        if (request.name == "count" && request.query['add5']) {
            request.result().then(result => {
                return result += 5;
            })
            request.result().then(result => {
                return result += 10;
            })
        }
        next();
    }
}