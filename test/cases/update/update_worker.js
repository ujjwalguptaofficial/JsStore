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
                    request.query.where.productId = productId
                })
                request.onResult(results => {
                    return results + 1;
                })
            }
        }
    }
}