describe('Test update complex case', function () {
    it('update with multiple or', function (done) {
        var where_query = {
                price: {
                    '<': 10
                },
                or: {
                    supplierId: 1,
                    categoryId: 3
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
                productName: 'Cofee'
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(count);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it("sql - Update Products set productName='Tea' WHERE productName='Cofee' and (price < 10 or supplierId =1)", function (done) {
        var where_query = [{
                    productName: 'Cofee'
                },
                {
                    price: {
                        '<': 10
                    },
                    or: {
                        supplierId: 1
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
                productName: 'Tea'
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(count);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it("sql - Update Products set productName='Cofee_Tea' WHERE productName='Cofee' or (supplierId=1 and categoryId = 1)", function (done) {
        var where_query = [{
                    productName: 'Tea'
                },
                {
                    or: {
                        supplierId: 1,
                        categoryId: 3
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
                productName: 'Cofee_Tea'
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
                city: 'bHuBaneSwar'
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
                contactName: 'Ujjwal',
                city: 'bhubaneswar'
            },
            where: [{
                city: 'bHuBaneSwar'
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