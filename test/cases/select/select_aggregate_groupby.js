describe('Test aggregate option with groupby', function () {
    it('select with agregate - min', function (done) {
        con.select({
            from: 'Products',
            groupBy: 'categoryId',
            aggregate: {
                min: "price"
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(8);
            var ExpectedResult = [4.5, 10, 10, 7.45, 6, 2.5, 9.2, 7];
            for (var i = 0; i < 8; i++) {
                expect(results[i]).to.have.property('min(price)').to.equal(ExpectedResult[i]);
            }
            done();
        }).
            catch(function (err) {
                done(err);
            })
    })

    it('select with agregate - max', function (done) {
        con.select({
            from: 'Products',
            groupBy: 'categoryId',
            aggregate: {
                max: "price"
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(8);
            var ExpectedResult = [263.5, 43.9, 53, 123.79, 62.5, 55, 81, 38,];
            for (var i = 0; i < 8; i++) {
                expect(results[i]).to.have.property('max(price)').to.equal(ExpectedResult[i]);
            }
            done();
        }).
            catch(function (err) {
                done(err);
            })
    });

    it('select with agregate - sum', function (done) {
        con.select({
            from: 'Products',
            groupBy: 'categoryId',
            aggregate: {
                sum: "price"
            }
        }).then(function (results) {

            expect(results).to.be.an('array').length(8);
            var ExpectedResult = [455.75, 276.75, 161.85, 324.04, 248.19, 287.3, 327.08, 141.75,];
            for (var i = 0; i < 8; i++) {
                expect(results[i]).to.have.property('sum(price)').to.equal(ExpectedResult[i]);
            }
            done();
        }).
            catch(function (err) {
                done(err);
            })
    });

    it('select with agregate - count', function (done) {
        con.select({
            from: 'Products',
            aggregate: {
                count: "price"
            },
            groupBy: 'categoryId'
        }).then(function (results) {

            expect(results).to.be.an('array').length(8);
            var ExpectedResult = [12, 12, 5, 6, 12, 10, 13, 7];
            for (var i = 0; i < 8; i++) {
                expect(results[i]).to.have.property('count(price)').to.equal(ExpectedResult[i]);
            }
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with agregate - avg', function (done) {
        con.select({
            from: 'Products',
            groupBy: 'categoryId',
            aggregate: {
                avg: "price"
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(8);
            var ExpectedResult = [37.979166666666664, 23.0625, 32.37, 54.00666666666667, 20.6825, 28.73, 25.16, 20.25,];
            for (var i = 0; i < 8; i++) {
                expect(results[i]).to.have.property('avg(price)').to.equal(ExpectedResult[i]);
            }
            done();
        }).catch(function (err) {
            done(err);
        })
    });
})