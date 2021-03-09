function selectAndCount(ctx) {

    ctx.select({
        from: 'Customers'
    }).then(function (results) {
        ctx.setResult('customers', results);
    });

    ctx.count({
        from: 'Customers'
    }).then(function (length) {
        ctx.setResult('count', length);
    });
    ctx.start()

}

function selectAndCountMultipleTables(ctx) {

    ctx.select({
        from: 'Customers'
    }).then(function (results) {
        ctx.setResult('customers', results);
    });

    ctx.count({
        from: 'Customers'
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

function simpleInsert(ctx) {
    ctx.select({
        from: 'Customers'
    }).then(function (result) {
        ctx.setResult('customers', result);
    })
    ctx.insert({
        into: 'Customers',
        return: true,
        values: ctx.data.insertValues
    }).then(function (insertedcustomer) {
        ctx.setResult('insertedcustomer', insertedcustomer);
    })
    ctx.count({
        from: 'Customers'
    }).then(function (result) {
        ctx.setResult('countNewCustomer', result)
    })
    ctx.start()
}

function simpleUpdate(ctx) {

    ctx.update({
        in: 'Customers',
        set: ctx.data.updateValue,
        where: {
            customerId: 5
        }
    }).then(function (result) {
        ctx.setResult('updated', result)
    })
    ctx.start();

}