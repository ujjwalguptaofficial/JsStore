describe('Test update complex case', function () {
    it('update with multiple or', function (done) {
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
            From: 'Products',
            Where: where_query,
            OnSuccess: function (results) {
                count = results.length;
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })

        Con.update({
            In: 'Products',
            Where: where_query,
            Set: {
                ProductName: 'Cofee'
            },
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
            From: 'Products',
            Where: where_query,
            OnSuccess: function (results) {
                count = results.length;
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })

        Con.update({
            In: 'Products',
            Where: where_query,
            Set: {
                ProductName: 'Cofee'
            },
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
            From: 'Products',
            Where: where_query,
            OnSuccess: function (results) {
                count = results.length;
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })

        Con.update({
            In: 'Products',
            Where: where_query,
            Set: {
                ProductName: 'Cofee'
            },
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