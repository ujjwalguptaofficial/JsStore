describe('Test delete complex case', function () {
    it('delete with multiple or', function (done) {
        var where_query = {
                Country: 'Mexico',
                Or: {
                    City: 'Madrid',
                    Address: {
                        Like: '%a%'
                    }
                }
            },
            count;
        Con.select({
            From: 'Customers',
            Where: where_query,
            OnSuccess: function (results) {
                count = results.length;
            },
            OnError: function (err) {
                done(err);
            }
        })

        Con.delete({
            From: 'Customers',
            Where: where_query,
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(count);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it("sql - SELECT * FROM Customers WHERE Country='Mexico' and (City='London' or Address Like '%a%')", function (done) {
        var where_query = [{
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
            count;
        Con.select({
            From: 'Customers',
            Where: where_query,
            OnSuccess: function (results) {
                count = results.length;
            },
            OnError: function (err) {
                done(err);
            }
        })

        Con.delete({
            From: 'Customers',
            Where: where_query,
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(count);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it("sql - SELECT * FROM Customers WHERE Country='Mexico' or (City='London' and Address Like '%a%')", function (done) {
        var where_query = [{
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
            count;
        Con.select({
            From: 'Customers',
            Where: where_query,
            OnSuccess: function (results) {
                count = results.length;
            },
            OnError: function (err) {
                done(err);
            }
        })

        Con.delete({
            From: 'Customers',
            Where: where_query,
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(count);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });
});