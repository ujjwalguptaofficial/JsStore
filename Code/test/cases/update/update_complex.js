describe('Test update complex case', function () {
    it('update with multiple or', function (done) {
        var where_query = {
                Price: {
                    '<': 10
                },
                Or: {
                    SupplierID: 1,
                    CategoryID: 3
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

    it("sql - Update Products set ProductName='Tea' WHERE ProductName='Cofee' and (Price < 10 or SupplierID =1)", function (done) {
        var where_query = [{
                    ProductName: 'Cofee'
                },
                {
                    Price: {
                        '<': 10
                    },
                    Or: {
                        SupplierID: 1
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
                ProductName: 'Tea'
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

    it("sql - Update Products Set ProductName='Cofee_Tea' WHERE ProductName='Cofee' or (SupplierID=1 and CategoryID = 1)", function (done) {
        var where_query = [{
                    ProductName: 'Tea'
                },
                {
                    Or: {
                        SupplierID: 1,
                        CategoryID: 3
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
                ProductName: 'Cofee_Tea'
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