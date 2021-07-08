var RemoveMiddleware = {
    filterCountry(request, context) {
        // debugger;
        if (request.name == "remove") {
            const country = request.query.country;
            if (country) {
                request.beforeExecute(_ => {
                    request.query.where.country = country
                })
                request.onResult(results => {
                    return results + 1;
                })
            }
        }
    }
}
