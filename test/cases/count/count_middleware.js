var JsStoreOptions = {
    countMiddleware: function (request, context) {
        // debugger;
        // do not delete data
        const name = context.database.name;
        if (request.name == "count" && request.query['add5']) {
            request.onResult(result => {
                result = result + 5;
                return Promise.resolve(result);
            })
            request.beforeExecute(_ => {
                request.onResult(result => {
                    return result + 5;
                })
            })
        }
        else if (request.name == "count" && request.query['db']) {
            request.onResult(result => {
                return context.database
            })
        }
    }
}