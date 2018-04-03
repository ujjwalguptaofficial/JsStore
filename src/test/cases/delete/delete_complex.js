describe('Test remove complex case', function () {
    it('remove with multiple or', function (done) {
        var where_query = {
                Country: 'Mexico',
                Or: {
                    City: 'Madrid',
                    Address: {
                        like: '%a%'
                    }
                }
            },
            count;
        Con.select({
            from: 'Customers',
            where: where_query
        }).then(function (results) {
            count = results.length;
        }).catch(function (err) {
            done(err);
        })

        Con.remove({
            from: 'Customers',
            where: where_query
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(count);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it("sql - SELECT * FROM Customers WHERE Country='Mexico' and (City='London' or Address like '%a%')", function (done) {
        var where_query = [{
                    Country: 'Mexico'
                },
                {
                    City: 'London',
                    Or: {
                        Address: {
                            like: '%a%'
                        }
                    }
                }
            ],
            count;
        Con.select({
            from: 'Customers',
            where: where_query
        }).then(function (results) {
            count = results.length;
        }).catch(function (err) {
            done(err);
        })

        Con.remove({
            from: 'Customers',
            where: where_query
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(count);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it("sql - SELECT * FROM Customers WHERE Country='Mexico' or (City='London' and Address like '%a%')", function (done) {
        var where_query = [{
                    Country: 'Mexico'
                },
                {
                    Or: {
                        City: 'London',
                        Address: {
                            like: '%a%'
                        }
                    }
                }
            ],
            count;
        Con.select({
            from: 'Customers',
            where: where_query
        }).then(function (results) {
            count = results.length;
        }).catch(function (err) {
            done(err);
        })

        Con.remove({
            from: 'Customers',
            where: where_query
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(count);
            done();
        }).catch(function (err) {
            done(err);
        })
    });
});