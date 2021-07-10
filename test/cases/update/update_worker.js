var JsStoreUpdate = {
    mapSetProductId7(setValue, storedValue) {
        setValue.price = storedValue.price * storedValue.price;
    },
    mapSetProductId8(setValue, storedValue) {
        return {
            price: storedValue.price * 2
        }
    },
    middleware(request, context) {
        // debugger;
        if (request.name == "update") {
            const productId = request.query.whereProductId;
            if (productId) {
                request.beforeExecute(_ => {
                    return new Promise(res => {
                        request.query.where.productId = productId
                        res();
                    })
                })
                request.onResult(results => {
                    return results + 1;
                })
            }
        }
    }
}