var JsStoreOptions = {
    countMiddleware: function (request) {
        if (request.name == "count" && request.query['add5']) {
            request.onResult(result => {
                result = result + 5;
                return Promise.resolve(result);
            })
            request.onResult(result => {
                return result + 5;
            })
        }
    }
}