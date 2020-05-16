describe("Intersect", function () {
    it(`SELECT * FROM Orders
    WHERE(shipperId = 3 AND employeeId = 4)
    OR (shipperId = 2 AND employeeId = 3)
    INTERSECT
    SELECT * FROM Orders
    WHERE (orderId < 10300 AND customerId = 88) 
    OR orderID > 10400;`, function (done) {
        var query1 = {
            from: 'Orders',
            where: [{
                shipperId: 3,
                employeeId: 4
            }, {
                or: {
                    shipperId: 2,
                    employeeId: 3
                }
            }]
        };

        var query2 = {
            from: 'Orders',
            where: [{
                orderId: {
                    '<': 10300
                },
                customerId: 88
            },
            {
                or: {
                    orderId: {
                        '>': 10400
                    }
                }
            }
            ]
        };

        con.intersect({
            queries: [query1, query2]
        }).then(function (results) {
            // console.log(results);
            expect(results).to.be.an('array').length(11);
            done();
        }).catch(done);
    });

    it(`with skip SELECT * FROM Orders
    WHERE(shipperId = 3 AND employeeId = 4)
    OR (shipperId = 2 AND employeeId = 3)
    INTERSECT
    SELECT * FROM Orders
    WHERE (orderId < 10300 AND customerId = 88) 
    OR orderID > 10400;`, function (done) {
        var query1 = {
            from: 'Orders',
            where: [{
                shipperId: 3,
                employeeId: 4
            }, {
                or: {
                    shipperId: 2,
                    employeeId: 3
                }
            }]
        };

        var query2 = {
            from: 'Orders',
            where: [{
                orderId: {
                    '<': 10300
                },
                customerId: 88
            },
            {
                or: {
                    orderId: {
                        '>': 10400
                    }
                }
            }
            ]
        };

        con.intersect({
            queries: [query1, query2],
            skip: 5
        }).then(function (results) {
            // console.log(results);
            expect(results).to.be.an('array').length(6);
            done();
        }).catch(done);
    });

    it(`with limit & SELECT * FROM Orders
    WHERE(shipperId = 3 AND employeeId = 4)
    OR (shipperId = 2 AND employeeId = 3)
    INTERSECT
    SELECT * FROM Orders
    WHERE (orderId < 10300 AND customerId = 88) 
    OR orderID > 10400;`, function (done) {
        var query1 = {
            from: 'Orders',
            where: [{
                shipperId: 3,
                employeeId: 4
            }, {
                or: {
                    shipperId: 2,
                    employeeId: 3
                }
            }]
        };

        var query2 = {
            from: 'Orders',
            where: [{
                orderId: {
                    '<': 10300
                },
                customerId: 88
            },
            {
                or: {
                    orderId: {
                        '>': 10400
                    }
                }
            }
            ]
        };

        con.intersect({
            queries: [query1, query2],
            limit: 5
        }).then(function (results) {
            // console.log(results);
            expect(results).to.be.an('array').length(5);
            done();
        }).catch(done);
    });

    it(`with skip,limit & SELECT * FROM Orders
    WHERE(shipperId = 3 AND employeeId = 4)
    OR (shipperId = 2 AND employeeId = 3)
    INTERSECT
    SELECT * FROM Orders
    WHERE (orderId < 10300 AND customerId = 88) 
    OR orderID > 10400;`, function (done) {
        var query1 = {
            from: 'Orders',
            where: [{
                shipperId: 3,
                employeeId: 4
            }, {
                or: {
                    shipperId: 2,
                    employeeId: 3
                }
            }]
        };

        var query2 = {
            from: 'Orders',
            where: [{
                orderId: {
                    '<': 10300
                },
                customerId: 88
            },
            {
                or: {
                    orderId: {
                        '>': 10400
                    }
                }
            }
            ]
        };

        con.intersect({
            queries: [query1, query2],
            limit: 6,
            skip: 5
        }).then(function (results) {
            // console.log(results);
            expect(results).to.be.an('array').length(6);
            done();
        }).catch(done);
    });
})