describe('Test Aggregate option', function () {
    it('select with agregate - min', function (done) {
        Con.select({
            From: 'Products',
            Aggregate: {
                Min: "Price"
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(77);
                expect(results[0]).to.have.property('Min(Price)').to.equal(2.5)
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with agregate - max', function (done) {
        Con.select({
            From: 'Products',
            Aggregate: {
                Max: "Price"
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(77);
                expect(results[0]).to.have.property('Max(Price)').to.equal(263.5)
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with agregate - sum', function (done) {
        Con.select({
            From: 'Products',
            Aggregate: {
                Sum: "Price"
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(77);
                expect(results[0]).to.have.property('Sum(Price)').to.equal(2222.71)
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with agregate - count', function (done) {
        Con.select({
            From: 'Products',
            Aggregate: {
                Count: "Price"
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(77);
                expect(results[0]).to.have.property('Count(Price)').to.equal(77)
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with agregate - avg', function (done) {
        Con.select({
            From: 'Products',
            Aggregate: {
                Avg: "Price"
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(77);
                expect(results[0]).to.have.property('Avg(Price)').to.equal(28.866363636363637);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

});