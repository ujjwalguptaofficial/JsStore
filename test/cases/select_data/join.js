describe('Test join', function () {

    var customers;
    var products;
    var orders;
    var shippers;
    var employees;

    before((done) => {
        $.getJSON("test/static/Customers.json", function (results) {
            customers = results;
            done();
        });
    })

    it('store products', function (done) {
        $.getJSON("test/static/Products.json", function (results) {
            products = results;
            done();
        });
    });

    it('store orders', function (done) {
        $.getJSON("test/static/Orders.json", function (results) {
            orders = results;
            done();
        });
    });

    it('store shippers', function (done) {
        $.getJSON("test/static/Shippers.json", function (results) {
            shippers = results;
            done();
        });
    });

    it('store employee', function (done) {
        $.getJSON("test/static/Employees.json", function (results) {
            employees = results;
            done();
        });
    });

    it('inner join with join table from database', function (done) {
        con.select({
            store: orders,
            meta: {
                primaryKey: 'orderId'
            },
            join: {
                with: "Customers",
                type: "inner",
                on: "Orders.customerId=Customers.customerId",
                as: {
                    customerName: "name",
                    contactName: "cName",
                    customerId: "cId"
                },
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(196);
            var firstValue = results[0];
            // console.log(firstValue);
            expect(firstValue).to.be.an('object').to.haveOwnProperty('name');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('cName');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('orderId');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('customerId');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('employeeId');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('cId');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('shipperId');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('address');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('city');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('postalCode');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('country');
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('inner join with table from database', function (done) {
        con.select({
            from: 'Orders',
            join: {
                with: "Customers",
                type: "inner",
                on: "Orders.customerId=Customers.customerId",
                as: {
                    customerName: "name",
                    contactName: "cName",
                    customerId: "cId"
                },
                store: customers,
                meta: {
                    primaryKey: 'customerId'
                },
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(196);
            var firstValue = results[0];
            // console.log(firstValue);
            expect(firstValue).to.be.an('object').to.haveOwnProperty('name');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('cName');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('orderId');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('customerId');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('employeeId');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('cId');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('shipperId');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('address');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('city');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('postalCode');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('country');
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('inner join with both table from store', function (done) {
        con.select({
            store: orders,
            meta: {
                primaryKey: 'orderId'
            },
            join: {
                type: "inner",
                on: "Orders.customerId=Customers.customerId",
                as: {
                    customerName: "name",
                    contactName: "cName",
                    customerId: "cId"
                },
                store: customers,
                meta: {
                    primaryKey: 'customerId'
                },
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(196);
            var firstValue = results[0];
            // console.log(firstValue);
            expect(firstValue).to.be.an('object').to.haveOwnProperty('name');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('cName');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('orderId');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('customerId');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('employeeId');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('cId');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('shipperId');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('address');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('city');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('postalCode');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('country');
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('inner join with both table from store and on tablename not from database', function (done) {
        con.select({
            store: orders,
            meta: {
                primaryKey: 'orderId'
            },
            join: {
                type: "inner",
                on: "A.customerId=B.customerId",
                as: {
                    customerName: "name",
                    contactName: "cName",
                    customerId: "cId"
                },
                store: customers,
                meta: {
                    primaryKey: 'customerId'
                },
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(196);
            var firstValue = results[0];
            // console.log(firstValue);
            expect(firstValue).to.be.an('object').to.haveOwnProperty('name');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('cName');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('orderId');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('customerId');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('employeeId');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('cId');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('shipperId');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('address');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('city');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('postalCode');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('country');
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('inner join with reversed table', function (done) {
        con.select({
            store: customers,
            meta: {
                primaryKey: 'customerId'
            },
            join: {
                type: "inner",
                on: "A.customerId=B.customerId",
                as: {
                    customerName: "name",
                    contactName: "cName",
                    customerId: "cId"
                },
                store: orders,
                meta: {
                    primaryKey: 'orderId'
                },
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(196);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('left join', function (done) {
        con.select({
            store: orders,
            meta: {
                primaryKey: 'orderId'
            },
            join: {
                with: "Customers",
                type: "left",
                on: "A.customerId=B.customerId",
                store: customers,
                meta: {
                    primaryKey: 'customerId'
                },
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(196);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('left join with alias', function (done) {
        con.select({
            store: customers,
            meta: {
                primaryKey: 'customerId'
            },
            join: {
                store: orders,
                meta: {
                    primaryKey: 'orderId'
                },
                type: "left",
                on: "A.customerId=B.customerId",
                as: {
                    orderId: 'oid'
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(215);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('three table join', function (done) {
        con.select({
            store: orders,
            meta: {
                primaryKey: 'orderId'
            },
            join: [{
                store: customers,
                meta: {
                    primaryKey: 'customerId'
                },
                type: "inner",
                on: "A.customerId=B.customerId"
            }, {
                store: shippers,
                meta: {
                    primaryKey: 'shipperId'
                },
                type: "inner",
                on: "A.shipperId=C.shipperId"
            }]
        }).then(function (results) {
            expect(results).to.be.an('array').length(196);
            var result = results[0];
            expect(result.customerId).to.be.an('number');
            expect(result.orderId).to.be.an('number');
            expect(result.shipperId).to.be.an('number');
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('self join ', function (done) {
        con.select({
            store: customers,
            meta: {
                primaryKey: 'customerId'
            },
            join: {
                store: customers,
                meta: {
                    primaryKey: 'customerId'
                },
                type: "inner",
                on: "A.city=B.city",
                as: {
                    customerName: "name",
                    contactName: "cName",
                    customerId: "cId",
                    address: "address",
                    postalCode: "postalCode",
                    country: "country",
                    email: "email"
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(183);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('self join with where', function (done) {
        con.select({
            store: customers,
            meta: {
                primaryKey: 'customerId'
            },
            join: {
                store: customers,
                meta: {
                    primaryKey: 'customerId'
                },
                type: "inner",
                on: "A.city=A.city",
                as: {
                    customerName: "name",
                    contactName: "cName",
                    customerId: "cId",
                    address: "address",
                    postalCode: "postalCode",
                    country: "country",
                    email: "email"
                },
                where: {
                    customerId: { '<': 90 }
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(177);
            done();
        }).catch(function (err) {
            done(err);
        })
    });


    it('join with zero records', function (done) {
        con.select({
            store: customers,
            meta: {
                primaryKey: 'customerId'
            },
            where: {
                customerId: 500000
            },
            join: {
                store: orders,
                meta: {
                    primaryKey: 'orderId'
                },
                type: "left",
                on: "A.customerId=B.customerId"
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(0);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('multiple left join', function (done) {
        con.select({
            store: customers,
            meta: {
                primaryKey: 'customerId'
            },
            join: [
                {
                    store: orders,
                    meta: {
                        primaryKey: 'orderId'
                    },
                    type: "left", on: "Customers.customerId=Orders.customerId"
                },
                {
                    store: employees,
                    meta: {
                        primaryKey: 'employeeId'
                    },
                    type: "left", on: "Orders.employeeId=Employees.employeeId"
                }
            ]
        }).then(function (results) {
            expect(results).to.be.an('array').length(215);
            done();
        }).catch(done);
    });

    it('join data check for undefined issue when using as', function (done) {
        con.select({
            store: orders,
            meta: {
                primaryKey: 'orderId'
            },
            join: {
                store: shippers,
                meta: {
                    primaryKey: 'shipperId'
                },
                on: "A.shipperId = B.shipperId",
                as: {
                    shipperId: "shipperId",
                    shipperName: "shipperName"
                }
            },
            limit: 5
        }).then(function (results) {
            expect(results).to.be.an('array').length(5);
            var fourthValue = results[3];
            expect(fourthValue).to.be.an('object').to.haveOwnProperty('shipperId').equal(1);
            expect(fourthValue).to.be.an('object').to.haveOwnProperty('shipperName').equal("Speedy Express");
            done();
        }).catch(function (err) {
            done(err);
        })
    });
});