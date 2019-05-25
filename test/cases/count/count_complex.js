describe('Test count complex case', function () {
    it('count with multiple or', function (done) {
        con.count({
            from: 'Customers',
            where: {
                Country: 'Mexico',
                or: {
                    City: 'Madrid',
                    Address: {
                        like: '%a%'
                    }
                }
            }
        }).
            then(function (results) {
                expect(results).to.be.an('number').to.equal(73);
                done();
            }).
            catch(function (err) {
                done(err);
            })
    });

    it("sql - SELECT * FROM Customers WHERE Country='Mexico' and (City='London' or Address like '%a%')", function (done) {
        con.count({
            from: 'Customers',
            where: [{
                Country: 'Mexico'
            },
            {
                City: 'London',
                or: {
                    Address: {
                        like: '%a%'
                    }
                }
            }
            ]
        }).
            then(function (results) {
                expect(results).to.be.an('number').to.equal(5);
                done();
            }).
            catch(function (err) {
                done(err);
            })
    });

    it("sql - SELECT * FROM Customers WHERE Country='Mexico' or (City='London' and Address like '%a%')", function (done) {
        con.count({
            from: 'Customers',
            where: [{
                Country: 'Mexico'
            },
            {
                or: {
                    City: 'London',
                    Address: {
                        like: '%a%'
                    }
                }
            }
            ]
        }).
            then(function (results) {
                expect(results).to.be.an('number').to.equal(9);
                done();
            }).
            catch(function (err) {
                done(err);
            })
    });

    it('count with multiple regex', function (done) {
        con.count({
            from: 'Customers',
            where: {
                // Country: { regex: /(mexico|brazil)/i },
                City: { regex: /.ampinas/ }
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(1);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('inner join', function (done) {
        con.count({
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
            expect(results).to.be.an('number').equal(196);
            const firstValue = results[0];
            done();
        }).catch(function (err) {
            done(err);
        })
    });
});