describe('Test aggregate option with groupby', function () {
    it('select with agregate - min', function (done) {
        Con.select({
            from: 'Products',
            groupBy: 'CategoryID',
            aggregate: {
                Min: "Price"
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(8);
            var ExpectedResult = [4.5, 10, 9.2, 2.5, 7, 7.45, 10, 6];
            for (var i = 0; i < 8; i++) {
                expect(results[i]).to.have.property('Min(Price)').to.equal(ExpectedResult[i]);
            }
            done();
        }).
        catch(function (err) {
            done(err);
        })
    })

    it('select with agregate - max', function (done) {
        Con.select({
            from: 'Products',
            groupBy: 'CategoryID',
            aggregate: {
                Max: "Price"
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(8);
            var ExpectedResult = [263.5, 43.9, 81, 55, 38, 123.79, 53, 62.5];
            for (var i = 0; i < 8; i++) {
                expect(results[i]).to.have.property('Max(Price)').to.equal(ExpectedResult[i]);
            }
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it('select with agregate - sum', function (done) {
        Con.select({
            from: 'Products',
            groupBy: 'CategoryID',
            aggregate: {
                Sum: "Price"
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(8);
            var ExpectedResult = [455.75, 276.75, 327.08, 287.3, 141.75, 324.04, 161.85, 248.19];
            for (var i = 0; i < 8; i++) {
                expect(results[i]).to.have.property('Sum(Price)').to.equal(ExpectedResult[i]);
            }
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it('select with agregate - count', function (done) {
        Con.select({
            from: 'Products',
            aggregate: {
                Count: "Price"
            },
            groupBy: 'CategoryID'
        }).then(function (results) {
            expect(results).to.be.an('array').length(8);
            var ExpectedResult = [12, 12, 13, 10, 7, 6, 5, 12];
            for (var i = 0; i < 8; i++) {
                expect(results[i]).to.have.property('Count(Price)').to.equal(ExpectedResult[i]);
            }
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with agregate - avg', function (done) {
        Con.select({
            from: 'Products',
            groupBy: 'CategoryID',
            aggregate: {
                avg: "Price"
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(8);
            var ExpectedResult = [37.979166666666664, 23.0625, 25.16, 28.73, 20.25, 54.00666666666667, 32.37, 20.6825];
            for (var i = 0; i < 8; i++) {
                expect(results[i]).to.have.property('avg(Price)').to.equal(ExpectedResult[i]);
            }
            done();
        }).catch(function (err) {
            done(err);
        })
    });
})