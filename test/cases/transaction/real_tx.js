describe('real time transaction', () => {
    it('create shop db', (done) => {
        con.createDb(getShopDbSchema()).then(() => {
            done();
        }).catch(done);
    })

    it('insert products items', (done) => {
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
        }).then((rowsInserted) => {
            expect(rowsInserted).to.be.an('number').equal(4);
            done();
        }).catch(done);
    })

    it('buying products', (done) => {
        var txQuery = {
            tables: ['customers', 'orders', 'products', 'orderDetails'],
            logic: (data) => {
                const insertOrder = (customer) => {
                    const order = {
                        customerId: customer.id,
                        orderDate: new Date(),
                    }
                    insert({
                        into: 'orders',
                        values: [order],
                        return: true
                    }).then(orders => {
                        if (orders.length > 0) {
                            var insertedOrder = orders[0];
                            setResult('order', insertedOrder);
                            insertOrderDetail(insertedOrder.orderId);
                        } else {
                            abort();
                        }
                    }).catch(err => {
                        console.error("err", err);
                    })
                };

                const insertOrderDetail = (orderId) => {
                    const orderDetails = data.orderDetails.map((value) => {
                        value.orderId = orderId
                        return value;
                    });
                    insert({
                        into: 'orderDetails',
                        values: orderDetails,
                    }).then(orderDetailsCount => {
                        if (orderDetailsCount > 0) {
                            setResult('orderDetailsCount', orderDetailsCount);
                            updateProduct();
                        } else {
                            abort("No orderDetails inserted");
                        }
                    }).catch(err => {
                        console.error("err", err);
                    })
                };

                const updateProduct = () => {
                    data.orderDetails.forEach((orderDetail, index) => {
                        // update the product inventory
                        update({ in: 'products',
                            where: {
                                productId: orderDetail.productId
                            },
                            set: {
                                unit: {
                                    '-': orderDetail.quantity
                                }
                            }
                        }).then(productUpdated => {
                            if (productUpdated > 0) {

                            } else {
                                abort("No orderDetails inserted");
                            }
                        }).catch(err => {
                            console.error("err", err);
                        })
                    })

                };

                insert({
                    into: 'customers',
                    values: [data.customer],
                    return: true
                }).then(customers => {
                    if (customers.length > 0) {
                        var customer = customers[0];
                        insertOrder(customer);
                        setResult('customer', customer);
                    } else {
                        abort();
                    }
                }).catch(err => {
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
        con.transaction(txQuery).then((result) => {
            console.log("result", result);
            done();
        }).catch(done);
    });



    it('open db demo', (done) => {
        con.openDb("Demo").then(() => {
            done();
        }).catch(done);
    })
});

function getShopDbSchema() {
    var Column = JsStore.Column;
    var COL_OPTION = JsStore.COL_OPTION;
    var DATA_TYPE = JsStore.DATA_TYPE;
    var customerTable = {
        name: 'customers',
        columns: [{
                name: 'id',
                primaryKey: true,
                autoIncrement: true,
            }, {
                name: 'customerName',
                notNull: true,
                dataType: 'string'
            }, {
                name: "address",
                notNull: true,
                dataType: 'string',
                advTextSearch: true
            },
            {
                name: "city",
                notNull: true,
                dataType: 'string'
            },
            {
                name: "postalCode",
                dataType: 'string'
            },
            {
                name: "country",
                notNull: true,
                dataType: 'string'
            },
            {
                name: "email",
                dataType: 'string',
                enableSearch: false
            }
        ]
    };

    var orderDetails = {
        name: 'orderDetails',
        columns: [{
                name: "orderDetailId",
                primaryKey: true,
                autoIncrement: true
            },
            {
                name: "orderId",
                notNull: true,
                dataType: DATA_TYPE.Number
            },
            {
                name: "productId",
                notNull: true,
                dataType: DATA_TYPE.Number
            },
            {
                name: "quantity",
                notNull: true,
                dataType: 'number'
            }
        ]
    }

    var orders = {
        name: 'orders',
        columns: [{
                name: "orderId",
                primaryKey: true,
                autoIncrement: true,
            },
            {
                name: "customerId",
                notNull: true,
                dataType: 'number'
            },
            {
                name: "orderDate",
                notNull: true,
                dataType: 'date_time'
            }
        ]
    }

    var products = {
        name: 'products',
        columns: [{
                name: "productId",
                primaryKey: true,
                autoIncrement: true
            },
            {
                name: "productName",
                notNull: true,
                dataType: 'string'
            },
            {
                name: "unit",
                notNull: true,
                dataType: 'number'
            },
            {
                name: "price",
                notNull: true,
                dataType: 'number'
            }
        ]
    }

    var db = {
        name: 'shop',
        tables: [customerTable, orderDetails, orders, products]
    }

    return db;
}