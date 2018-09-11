describe('Test Select with order', function () {
    it('order having type asc with limit ', function (done) {
        Con.select({
            from: 'Products',
            limit: 1,
            where: {
                SupplierID: {
                    '>': 18
                }
            },
            order: {
                by: 'Price',
                type: 'asc'
            }
        }).
        then(function (results) {
            expect(results).to.be.an('array').length(1);
            var product = results[0];
            expect(product.Price).to.be.eql(7)
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it('order having type desc with limit ', function (done) {
        Con.select({
            from: 'Products',
            limit: 1,
            where: {
                SupplierID: {
                    '>': 18
                }
            },
            order: {
                by: 'Price',
                type: 'desc'
            }
        }).
        then(function (results) {
            expect(results).to.be.an('array').length(1);
            var product = results[0];
            expect(product.Price).to.be.eql(55)
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it('invalid order column test', function (done) {
        Con.select({
            from: 'Products',
            limit: 1,
            where: {
                SupplierID: {
                    '>': 18
                }
            },
            order: {
                by: 'invalid column',
                type: 'asc'
            }
        }).
        catch(function (err) {
            var error = {
                "message": "Invalid column name invalid column",
                "type": "invalid_column"
            };
            expect(err).to.be.an('object').eql(error);
            done();
        })
    });
});