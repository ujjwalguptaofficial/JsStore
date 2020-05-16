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
            const expectedIds = [10256, 10403, 10413, 10417, 10429, 10432, 10434, 10436, 10438, 10441, 10442]
            expect(results).to.be.an('array').length(expectedIds.length);
            expectedIds.forEach(function (id, index) {
                expect(id).to.equal(results[index].orderId);
            })
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
            const expectedIds = [10432, 10434, 10436, 10438, 10441, 10442]
            expect(results).to.be.an('array').length(expectedIds.length);
            expectedIds.forEach(function (id, index) {
                expect(id).to.equal(results[index].orderId);
            })
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
            const expectedIds = [10256, 10403, 10413, 10417, 10429]
            expect(results).to.be.an('array').length(expectedIds.length);
            expectedIds.forEach(function (id, index) {
                expect(id).to.equal(results[index].orderId);
            })
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
            limit: 5,
            skip: 5
        }).then(function (results) {
            const expectedIds = [10432, 10434, 10436, 10438, 10441]
            expect(results).to.be.an('array').length(expectedIds.length);
            expectedIds.forEach(function (id, index) {
                expect(id).to.equal(results[index].orderId);
            })
            done();
        }).catch(done);
    });
})