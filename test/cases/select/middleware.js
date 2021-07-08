function selectMiddleware(request, context) {
    // debugger;

    if (request.name == "select") {

        if (request.query.returnCustomerId) {

            request.onResult(results => {
                var id_list = [];
                results.forEach(function (element) {
                    id_list.push(element.customerId);
                });
                return id_list;
            })
        }

        if (request.query.sortManually) {
            request.beforeExecute(_ => {
                request.query.order.idbSorting = false;
            })
        }

    }
}