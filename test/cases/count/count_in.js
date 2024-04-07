describe('count with in', function () {
    it('count from orders where employeeId in [5,3]', function (done) {
        Promise.all([
            con.select({
                from: 'Orders',
                where: {
                    employeeId: {
                        in: [5, 3]
                    }
                }
            }),
            con.count({
                from: 'Orders',
                where: {
                    employeeId: {
                        in: [5, 3]
                    }
                }
            })
        ]).then(function (results) {
            expect(results[0].length).to.equal(42).to.equal(results[1]);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('count from orders where employeeId in [5,3] && customerid in [87]', function (done) {
        Promise.all([
            con.select({
                from: 'Orders',
                where: {
                    employeeId: {
                        in: [5, 3]
                    },
                    customerId: {
                        in: [87]
                    },
                }
            }),
            con.count({
                from: 'Orders',
                where: {
                    employeeId: {
                        in: [5, 3]
                    },
                    customerId: {
                        in: [87]
                    },
                }
            })
        ]).then(function (results) {
            expect(results[0].length).to.equal(3).to.equal(results[1]);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('count from orders where employeeId in [5,3] && customerid = 87', function (done) {
        Promise.all([
            con.select({
                from: 'Orders',
                where: {
                    employeeId: {
                        in: [5, 3]
                    },
                    customerId: 87
                }
            }),
            con.count({
                from: 'Orders',
                where: {
                    employeeId: {
                        in: [5, 3]
                    },
                    customerId: 87
                }
            })
        ]).then(function (results) {
            expect(results[0].length).to.equal(3).to.equal(results[1]);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('count from orders where customerId in [1,5,20] && customerid <= 5', function (done) {
        Promise.all([
            con.select({
                from: "Customers",
                where: {
                    customerId: {
                        "in": [1, 5, 20],
                        "<=": 5
                    }
                }
            }),
            con.count({
                from: "Customers",
                where: {
                    customerId: {
                        "in": [1, 5, 20],
                        "<=": 5
                    }
                }
            })
        ]).then(function (results) {
            expect(results[0].length).to.equal(2).to.equal(results[1]);
            done();
        }).catch(function (err) {
            done(err);
        });
    });
});