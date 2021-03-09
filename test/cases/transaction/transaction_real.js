function buyProducts(ctx) {
    var insertOrder = function (customer) {
        var order = {
            customerId: customer.id,
            orderDate: new Date(),
        }
        ctx.insert({
            into: 'orders',
            values: [order],
            return: true
        }).then(function (orders) {
            if (orders.length > 0) {
                var insertedOrder = orders[0];
                ctx.setResult('order', insertedOrder);
                insertOrderDetail(insertedOrder.orderId);
            } else {
                ctx.abort();
            }
        }).catch(function (err) {
            console.error("err", err);
        })
    };

    var insertOrderDetail = function (orderId) {
        var orderDetails = ctx.data.orderDetails.map(function (value) {
            value.orderId = orderId
            return value;
        });
        ctx.insert({
            into: 'orderDetails',
            values: orderDetails,
        }).then(function (orderDetailsCount) {
            if (orderDetailsCount > 0) {
                ctx.setResult('orderDetailsCount', orderDetailsCount);
                updateProductAndEvaluatePrice();
            } else {
                ctx.abort("No orderDetails inserted");
            }
        }).catch(function (err) {
            console.error("err", err);
        })
    };

    // update the product inventory and evaluate price
    var updateProductAndEvaluatePrice = function () {
        ctx.setResult('totalPrice', 0);
        ctx.data.orderDetails.forEach(function (orderDetail, index) {
            var where = {
                productId: orderDetail.productId
            };
            ctx.update({
                in: 'products',
                where: where,
                set: {
                    unit: {
                        '-': orderDetail.quantity
                    }
                }
            }).then(function (productUpdated) {
                if (productUpdated > 0) {

                } else {
                    abort("No orderDetails inserted");
                }
            }).catch(function (err) {
                console.error("err", err);
            })

            ctx.select({
                from: 'products',
                where: where
            }).then(function (results) {
                if (results.length > 0) {
                    var product = results[0];
                    var price = product.price * orderDetail.quantity
                    ctx.setResult('totalPrice', ctx.getResult('totalPrice') + price);
                } else {
                    abort("no products found");
                }
            }).catch(function (err) {
                ctx.abort(err);
            })
        })

    };

    ctx.insert({
        into: 'customers',
        values: [ctx.data.customer],
        return: true
    }).then(function (customers) {
        if (customers.length > 0) {
            var customer = customers[0];
            insertOrder(customer);
            ctx.setResult('customer', customer);
        } else {
            ctx.abort();
        }
    }).catch(function (err) {
        ctx.abort(err);
    });
    ctx.start();
};

function checkForProductUpdate(ctx) {
    ctx.select({
        from: 'products',
        where: {
            productId: 1
        }
    }).then(function (result) {
        ctx.setResult('productId1', result[0].unit);
    })

    ctx.select({
        from: 'products',
        where: {
            productId: 2
        }
    }).then(function (result) {
        ctx.setResult('productId2', result[0].unit);
    })

    ctx.start();
}