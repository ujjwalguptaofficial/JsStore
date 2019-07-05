describe('Test join', function () {
    it('inner join', function (done) {
        con.select({
            from: "Orders",
            join: {
                with: "Customers",
                type: "inner",
                on: "Orders.CustomerID=Customers.CustomerID",
                as: {
                    CustomerName: "name",
                    ContactName: "cName",
                    CustomerID: "cId"
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(196);
            const firstValue = results[0];
            console.log(firstValue);
            expect(firstValue).to.be.an('object').to.haveOwnProperty('name');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('cName');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('OrderID');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('CustomerID');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('EmployeeID');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('cId');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('ShipperID');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('Address');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('City');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('PostalCode');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('Country');
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('inner join with reversed table', function (done) {
        con.select({
            from: "Customers",
            join: {
                with: "Orders",
                type: "inner",
                on: "Orders.CustomerID=Customers.CustomerID",
                as: {
                    CustomerName: "name",
                    ContactName: "cName",
                    CustomerID: "cId"
                }
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
            from: "Orders",
            join: {
                with: "Customers",
                type: "left",
                on: "Orders.CustomerID=Customers.CustomerID"
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
            from: "Customers",
            join: {
                with: "Orders",
                type: "left",
                on: "Customers.CustomerID=Orders.CustomerID",
                as: {
                    OrderID: 'oid'
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(215);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('left join reverse', function (done) {
        con.select({
            from: "Customers",
            join: {
                with: "Orders",
                type: "left",
                on: "Orders.CustomerID=Customers.CustomerID"
            }
        }).then(function (results) {
            // console.table(results);
            expect(results).to.be.an('array').length(215);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('three table join', function (done) {
        con.select({
            from: "Orders",
            join: [{
                with: "Customers",
                type: "inner",
                on: "Orders.CustomerID=Customers.CustomerID"
            }, {
                with: "Shippers",
                type: "inner",
                on: "Orders.ShipperID=Shippers.ShipperID"
            }]
        }).then(function (results) {
            expect(results).to.be.an('array').length(196);
            const result = results[0];
            expect(result.CustomerID).to.be.an('number');
            expect(result.OrderID).to.be.an('number');
            expect(result.ShipperID).to.be.an('number');
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('self join ', function (done) {
        con.select({
            from: "Customers",
            join: {
                with: "Customers",
                type: "inner",
                on: "Customers.City=Customers.City",
                as: {
                    CustomerName: "name",
                    ContactName: "cName",
                    CustomerID: "cId",
                    Address: "address",
                    PostalCode: "postalCode",
                    Country: "country",
                    Email: "email"
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
            from: "Customers",
            join: {
                with: "Customers",
                type: "inner",
                on: "Customers.City=Customers.City",
                as: {
                    CustomerName: "name",
                    ContactName: "cName",
                    CustomerID: "cId",
                    Address: "address",
                    PostalCode: "postalCode",
                    Country: "country",
                    Email: "email"
                },
                where: {
                    CustomerID: { '<': 90 }
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(177);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('inner join with invalid first table', function (done) {
        con.select({
            from: "invalid_table",
            join: {
                with: "Orders",
                type: "inner",
                on: "Orders.CustomerID=Customers.CustomerID"
            }
        }).catch(function (err) {
            const error = { "message": "Table 'invalid_table' does not exist", "type": "table_not_exist" };
            expect(err).to.eql(error);
            done();
        })
    });

    it('inner join with invalid join table', function (done) {
        con.select({
            from: "Customers",
            join: {
                with: "invalid_table",
                type: "inner",
                on: "Orders.CustomerID=Customers.CustomerID"
            }
        }).then(function (result) {
            done(result);
        }).catch(function (err) {
            if (isRuningForProd() || isRuningForSauce()) {
                const error = { "message": "Table 'invalid_table' does not exist", "type": "table_not_exist" };
                expect(err).to.eql(error);
            }
            else {
                const error = {
                    "message": "on value should contains value of with", "type": "invalid_join_query"
                }
                expect(err).to.eql(error);
            }
            done();
        })
    });

    it('inner join with invalid column in first table', function (done) {
        con.select({
            from: "Customers",
            join: {
                with: "Orders",
                type: "inner",
                on: "Orders.CustomerId=Customers.CustomerID",
                as: {
                    CustomerID: 'cId'
                }
            }
        }).then(function (result) {
            expect(result).to.be.an('array').length(0);
            done();
        }).catch(function (err) {
            if (isRuningForProd() || isRuningForSauce()) {
                expect(err).to.be.an('object').haveOwnProperty('type').equal('invalid_join_query');
            }
            else {
                const error = { "message": "column CustomerId does not exist in table Orders", "type": "invalid_join_query" };
                expect(err).to.eql(error);
            }
            done();
        })
    });

    it('inner join with invalid column in second table', function (done) {
        con.select({
            from: "Customers",
            join: {
                with: "Orders",
                type: "inner",
                on: "Orders.CustomerID=Customers.CustomerId",
                as: {
                    CustomerID: 'cId'
                }
            }
        }).then(function (result) {
            expect(result).to.be.an('array').length(0);
            done();
        }).catch(function (err) {
            if (isRuningForProd() || isRuningForSauce()) {
                expect(err).to.be.an('object').haveOwnProperty('type').equal('invalid_join_query');
            }
            else {
                const error = { "message": "column CustomerId does not exist in table Customers", "type": "invalid_join_query" };
                expect(err).to.eql(error);
            }
            done();
        })
    });

    it('join with zero records', function (done) {
        con.select({
            from: "Customers",
            where: {
                CustomerID: 500000
            },
            join: {
                with: "Orders",
                type: "left",
                on: "Customers.CustomerID=Orders.CustomerID"
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
            from: "Customers",
            join: [
                { with: "Orders", type: "left", on: "Customers.CustomerID=Orders.CustomerID" },
                { with: "Employees", type: "left", on: "Orders.EmployeeID=Employees.employeeId" }
            ]
        }).then(function (results) {
            expect(results).to.be.an('array').length(215);
            done();
        }).catch(done);
    });
});