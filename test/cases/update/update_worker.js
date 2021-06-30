var JsStoreUpdate = {
    mapSetProductId7(setValue, storedValue) {
        setValue.price = storedValue.price * storedValue.price;
    },
    mapSetProductId8(setValue, storedValue) {
        return {
            price: storedValue.price * 2
        }
    }
}