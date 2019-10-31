describe('Test remove complex case', function () {
    it('remove with multiple or', function (done) {
        var where_query = {
            country: 'Mexico',
            or: {
                city: 'Madrid',
                address: {
                    like: '%a%'
                }
            }
        },
            count;
        con.select({
            from: 'Customers',
            where: where_query
        }).then(function (results) {
            count = results.length;
        }).catch(function (err) {
            done(err);
        })

        con.remove({
            from: 'Customers',
            where: where_query
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(count);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it("sql - SELECT * FROM Customers WHERE country='Mexico' and (city='London' or address like '%a%')", function (done) {
        var where_query = [{
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
        ],
            count;
        con.select({
            from: 'Customers',
            where: where_query
        }).then(function (results) {
            count = results.length;
        }).catch(function (err) {
            done(err);
        })

        con.remove({
            from: 'Customers',
            where: where_query
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(count);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it("sql - SELECT * FROM Customers WHERE country='Mexico' or (city='London' and address like '%a%')", function (done) {
        var where_query = [{
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
        ],
            count;
        con.select({
            from: 'Customers',
            where: where_query
        }).then(function (results) {
            count = results.length;
        }).catch(function (err) {
            done(err);
        })

        con.remove({
            from: 'Customers',
            where: where_query
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(count);
            done();
        }).catch(function (err) {
            done(err);
        })
    });


    it("sql - DELETE FROM Customers WHERE country regex /Mexico|Brazil/", function (done) {
        var from = 'Customers'
            , where = { country: { regex: /Mexico|Brazil/ } }
            , count;

        con.select({ from: from, where: where }).then(function (results) {
            count = results.length;
            con.remove({ from: from, where: where }).then(function (results) {
                expect(results).to.be.an('number').to.equal(count);
                done();
            }).catch(function (err) {
                done(err);
            })
        }).catch(function (err) {
            done(err);
        })
    });
});