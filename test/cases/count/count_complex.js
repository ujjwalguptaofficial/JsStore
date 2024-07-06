describe('Test count complex case', function () {
    it('count with multiple or', function (done) {
        con.count({
            from: 'Customers',
            where: {
                country: 'Mexico',
                or: {
                    city: 'Madrid',
                    or: {
                        address: {
                            like: '%a%'
                        }
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

    it("sql - SELECT * FROM Customers WHERE country='Mexico' and (city='London' or address like '%a%')", function (done) {
        con.count({
            from: 'Customers',
            where: [{
                country: 'Mexico'
            },
            {
                city: 'London',
                or: {
                    address: {
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

    it("sql - SELECT * FROM Customers WHERE country='Mexico' or (city='London' and address like '%a%')", function (done) {
        con.count({
            from: 'Customers',
            where: [{
                country: 'Mexico'
            },
            {
                or: {
                    city: 'London',
                    address: {
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
                // country: { regex: /(mexico|brazil)/i },
                city: { regex: /.ampinas/ }
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
                on: "Orders.customerId=Customers.customerId",
                as: {
                    customerName: "name",
                    contactName: "cName",
                    customerId: "cId"
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('number').equal(196);
            var firstValue = results[0];
            done();
        }).catch(function (err) {
            done(err);
        })
    });
});
