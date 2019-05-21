describe('real time transaction', function () {
    it('create shop db', function (done) {
        con.createDb(getShopDbSchema()).then(function () {
            done();
        }).catch(done);
    })

    it('insert products items', function (done) {
        var values = [{
            productName: 'black jeans',
            unit: 200,
            price: 1200
        }, {
            productName: 'blue jeans',
            unit: 2000,
            price: 1500
        }, {
            productName: 'orange jeans',
            unit: 200,
            price: 1205
        }, {
            productName: 'green jeans',
            unit: 100,
            price: 1500
        }]
        con.insert({
            into: "products",
            values: values
        }).then(function (rowsInserted) {
            expect(rowsInserted).to.be.an('number').equal(4);
            done();
        }).catch(done);
    })

    it('buying products', function (done) {
        var txQuery = {
            tables: ['customers', 'orders', 'products', 'orderDetails'],
            logic: function (data) {
                const insertOrder = function (customer) {
                    const order = {
                        customerId: customer.id,
                        orderDate: new Date(),
                    }
                    insert({
                        into: 'orders',
                        values: [order],
                        return: true
                    }).then(function (orders) {
                        if (orders.length > 0) {
                            var insertedOrder = orders[0];
                            setResult('order', insertedOrder);
                            insertOrderDetail(insertedOrder.orderId);
                        } else {
                            abort();
                        }
                    }).catch(function (err) {
                        console.error("err", err);
                    })
                };

                const insertOrderDetail = function (orderId) {
                    const orderDetails = data.orderDetails.map(function (value) {
                        value.orderId = orderId
                        return value;
                    });
                    insert({
                        into: 'orderDetails',
                        values: orderDetails,
                    }).then(function (orderDetailsCount) {
                        if (orderDetailsCount > 0) {
                            setResult('orderDetailsCount', orderDetailsCount);
                            updateProductAndEvaluatePrice();
                        } else {
                            abort("No orderDetails inserted");
                        }
                    }).catch(function (err) {
                        console.error("err", err);
                    })
                };

                // update the product inventory and evaluate price
                const updateProductAndEvaluatePrice = function () {
                    setResult('totalPrice', 0);
                    data.orderDetails.forEach(function (orderDetail, index) {
                        const where = {
                            productId: orderDetail.productId
                        };
                        update({
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

                        select({
                            from: 'products',
                            where: where
                        }).then(function (results) {
                            if (results.length > 0) {
                                const product = results[0];
                                const price = product.price * orderDetail.quantity
                                setResult('totalPrice', getResult('totalPrice') + price);
                            } else {
                                abort("no products found");
                            }
                        }).catch(function (err) {
                            console.err('err', err);
                        })
                    })

                };

                insert({
                    into: 'customers',
                    values: [data.customer],
                    return: true
                }).then(function (customers) {
                    if (customers.length > 0) {
                        var customer = customers[0];
                        insertOrder(customer);
                        setResult('customer', customer);
                    } else {
                        abort();
                    }
                }).catch(function (err) {
                    console.error("err", err);
                });
                start();
            },
            data: {
                customer: {
                    customerName: 'ujjwal gupta',
                    address: 'bhubaneswar odisha',
                    city: 'bhubaneswar',
                    postalCode: 'asdf',
                    country: 'india',
                    email: 'sdfg@m.com'
                },
                orderDetails: [{
                    productId: 1,
                    quantity: 2
                }, {
                    productId: 2,
                    quantity: 4
                }]
            }
        }
        con.transaction(txQuery).then(function (result) {
            // console.log("result", result);
            expect(result.totalPrice).to.be.an('number').equal(1200 * 2 + 1500 * 4);
            expect(result.customer.id).to.be.an('number').equal(1);
            done();
        }).catch(done);
    });

    it('insert new customer and check for valid next customerid', function (done) {
        con.insert({
            into: 'customers',
            values: [{
                customerName: 'ujjwal gupta',
                address: 'bhubaneswar odisha',
                city: 'bhubaneswar',
                postalCode: 'asdf',
                country: 'india',
                email: 'sdfg@m.com'
            }],
            return: true
        }).then(function (result) {
            expect(result[0].id).to.be.an('number').equal(2);
            done();
        }).catch(done);
    });

    it('check for products updates', function (done) {
        var txQuery = {
            tables: ['products'],
            logic: function (data) {
                select({
                    from: 'products',
                    where: {
                        productId: 1
                    }
                }).then(function (result) {
                    setResult('productId1', result[0].unit);
                })

                select({
                    from: 'products',
                    where: {
                        productId: 2
                    }
                }).then(function (result) {
                    setResult('productId2', result[0].unit);
                })

                start();
            }
        }

        con.transaction(txQuery).then(function (result) {
            expect(result.productId1).to.be.an('number').equal(200 - 2);
            expect(result.productId2).to.be.an('number').equal(2000 - 4);
            done();
        }).catch(done);
    });

    it('open db demo', function (done) {
        con.openDb("Demo").then(function () {
            done();
        }).catch(done);
    })
});

function getShopDbSchema() {

    var DATA_TYPE = JsStore.DATA_TYPE;
    var customerTable = {
        name: 'customers',
        columns: {
            id: {
                primaryKey: true,
                autoIncrement: true,
            },
            customerName: {
                notNull: true,
                dataType: 'string'
            }, address: {
                notNull: true,
                dataType: 'string',
            },
            city: {
                notNull: true,
                dataType: 'string'
            }, postalCode: {
                dataType: 'string'
            }, country: {
                notNull: true,
                dataType: 'string'
            },
            email: {
                dataType: 'string',
                enableSearch: false
            }
        }
    };

    var orderDetails = {
        name: 'orderDetails',
        columns: {
            orderDetailId: {
                primaryKey: true,
                autoIncrement: true
            }, orderId: {
                notNull: true,
                dataType: DATA_TYPE.Number
            }, productId: {
                notNull: true,
                dataType: DATA_TYPE.Number
            }, quantity: {
                notNull: true,
                dataType: 'number'
            }
        }
    }

    var orders = {
        name: 'orders',
        columns: {
            orderId: {
                primaryKey: true,
                autoIncrement: true,
            },
            customerId: {
                notNull: true,
                dataType: 'number'
            },
            orderDate: {
                notNull: true,
                dataType: 'date_time'
            }
        }
    }

    var products = {
        name: 'products',
        columns: {
            productId: {
                primaryKey: true,
                autoIncrement: true
            },
            productName: {
                notNull: true,
                dataType: 'string'
            },
            unit: {
                notNull: true,
                dataType: 'number'
            },
            price: {
                notNull: true,
                dataType: 'number'
            }
        }
    }

    var db = {
        name: 'shop',
        tables: [customerTable, orderDetails, orders, products]
    }

    return db;
}