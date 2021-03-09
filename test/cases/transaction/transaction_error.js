function wrongTableName(ctx) {
    ctx.select({
        from: 'Customers'
    }).then(function (results) {
        ctx.setResult('customers', results);
    });
    ctx.start();
}

function wrongTableNameInSelectQry(ctx) {
    ctx.select({
        from: 'Customssers'
    }).then(function (results) {
        ctx.setResult('customers', results);
    });
    ctx.start()
}

function selectAndCountOneTableNameWrong(ctx) {
    ctx.select({
        from: 'Customers'
    }).then(function (results) {
        ctx.setResult('customers', results);
    });

    ctx.count({
        from: 'Customerdds'
    }).then(function (length) {
        ctx.setResult('countCustomer', length);
    });

    ctx.select({
        from: 'OrderDetails'
    }).then(function (results) {
        ctx.setResult('orderDetails', results);
    });

    ctx.count({
        from: 'OrderDetails'
    }).then(function (length) {
        ctx.setResult('countOrderDetails', length);
    });
    ctx.start();
}

function insertWithNullValue(ctx) {
    ctx.count({
        from: 'Customers'
    }).then(function (result) {
        ctx.setResult('countOldCustomer', result)
    })
    ctx.insert({
        into: 'Customers',
        values: null
    });
    ctx.count({
        from: 'Customers'
    }).then(function (result) {
        ctx.setResult('countNewCustomer', result)
    })
    ctx.start();
}
function updateThenAbort(ctx) {
    ctx.update({
        in: 'Customers',
        set: ctx.data.updateValue,
        where: {
            customerId: 5
        }
    }).then(function (result) {
        ctx.abort();
    })
    ctx.start()

}