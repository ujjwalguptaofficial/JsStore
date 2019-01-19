describe('Test update complex case', function () {
    it('update with multiple or', function (done) {
        var where_query = {
                Price: {
                    '<': 10
                },
                or: {
                    SupplierID: 1,
                    CategoryID: 3
                }
            },
            count;
        con.select({
            from: 'Products',
            where: where_query
        }).then(function (results) {
            count = results.length;
            done();
        }).
        catch(function (err) {
            done(err);
        })

        con.update({ in: 'Products',
            where: where_query,
            set: {
                ProductName: 'Cofee'
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(count);
            done();
        }).
        catch(function (err) {
            done(err);
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
                    or: {
                        SupplierID: 1
                    }
                }
            ],
            count;
        con.select({
            from: 'Products',
            where: where_query
        }).then(function (results) {
            count = results.length;
            done();
        }).
        catch(function (err) {
            done(err);
        })

        con.update({ in: 'Products',
            where: where_query,
            set: {
                ProductName: 'Tea'
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(count);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it("sql - Update Products set ProductName='Cofee_Tea' WHERE ProductName='Cofee' or (SupplierID=1 and CategoryID = 1)", function (done) {
        var where_query = [{
                    ProductName: 'Tea'
                },
                {
                    or: {
                        SupplierID: 1,
                        CategoryID: 3
                    }
                }
            ],
            count;
        con.select({
            from: 'Products',
            where: where_query
        }).then(function (results) {
            count = results.length;
            done();
        }).
        catch(function (err) {
            done(err);
        })

        con.update({ in: 'Products',
            where: where_query,
            set: {
                ProductName: 'Cofee_Tea'
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(count);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it('update with ignore case', function (done) {
        var count;
        con.count({
            from: 'Customers',
            ignoreCase: true,
            where: [{
                City: 'bHuBaneSwar'
            }]
        }).then(function (results) {
            count = results;
        }).
        catch(function (err) {
            done(err);
        });

        con.update({ in: "Customers",
            ignoreCase: true,
            set: {
                ContactName: 'Ujjwal',
                City: 'bhubaneswar'
            },
            where: [{
                City: 'bHuBaneSwar'
            }]
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(count);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });
});