describe('Test count complex case', function () {
    it('count with multiple or', function (done) {
        Con.count({
            From: 'Customers',
            Where: {
                Country: 'Mexico',
                Or: {
                    City: 'Madrid',
                    Address: {
                        Like: '%a%'
                    }
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(73);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it("sql - SELECT * FROM Customers WHERE Country='Mexico' and (City='London' or Address Like '%a%')", function (done) {
        Con.count({
            From: 'Customers',
            Where: [{
                    Country: 'Mexico'
                },
                {
                    City: 'London',
                    Or: {
                        Address: {
                            Like: '%a%'
                        }
                    }
                }
            ],
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(5);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it("sql - SELECT * FROM Customers WHERE Country='Mexico' or (City='London' and Address Like '%a%')", function (done) {
        Con.count({
            From: 'Customers',
            Where: [{
                    Country: 'Mexico'
                },
                {
                    Or: {
                        City: 'London',
                        Address: {
                            Like: '%a%'
                        }
                    }
                }
            ],
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(9);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });
});