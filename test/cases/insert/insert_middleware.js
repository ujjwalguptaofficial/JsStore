function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

var InsertMiddleware = {
    insertEmployees: function (request, context) {
        // debugger;

        if (request.name == "insert" && request.query.into === "Employees") {
            var startDate = new Date(1994, 0, 1);
            var endDate = new Date();
            request.query.values.forEach(function (value) {
                value.birthDate = randomDate(startDate, endDate);
            });
            request.onResult(result => {
                result = `Total inserted record is ${result.length}`;
                return Promise.resolve(result);
            })
            request.beforeExecute(_ => {
                request.query.return = true;
                // request.query.values.forEach(function (value) {
                //     value.temp = "ujjwal gupta"
                // });
            })
        }
    }
}