describe('Test Aggregate option', function () {
    it('select with agregate - min', function (done) {
        con.select({
            from: 'Products',
            aggregate: {
                min: "price"
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(1);
            expect(results[0]).to.have.property('min(price)').to.equal(2.5)
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with agregate - max', function (done) {
        con.select({
            from: 'Products',
            aggregate: {
                max: "price"
            },
        }).then(function (results) {
            expect(results).to.be.an('array').length(1);
            expect(results[0]).to.have.property('max(price)').to.equal(263.5)
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with agregate - sum', function (done) {
        con.select({
            from: 'Products',
            aggregate: {
                sum: "price"
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(1);
            expect(results[0]).to.have.property('sum(price)').to.equal(2222.71)
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with agregate - count', function (done) {
        con.select({
            from: 'Products',
            aggregate: {
                count: "price"
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(1);
            expect(results[0]).to.have.property('count(price)').to.equal(77)
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with agregate - avg', function (done) {
        con.select({
            from: 'Products',
            aggregate: {
                avg: "price"
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(1);
            expect(results[0]).to.have.property('avg(price)').to.equal(28.866363636363637);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with agregate - min,max', function (done) {
        con.select({
            from: 'Products',
            aggregate: {
                min: "price",
                max: "price"
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(1);
            expect(results[0]).to.have.property('min(price)').to.equal(2.5)
            expect(results[0]).to.have.property('max(price)').to.equal(263.5)
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with agregate - min,max,avg', function (done) {
        con.select({
            from: 'Products',
            aggregate: {
                min: "price",
                max: "price",
                avg: "price"
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(1);
            expect(results[0]).to.have.property('min(price)').to.equal(2.5)
            expect(results[0]).to.have.property('max(price)').to.equal(263.5)
            expect(results[0]).to.have.property('avg(price)').to.equal(28.866363636363637)
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with agregate - min,max,avg,count', function (done) {
        con.select({
            from: 'Products',
            aggregate: {
                min: "price",
                max: "price",
                avg: "price",
                count: ["price","productName"]
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(1);
            expect(results[0]).to.have.property('min(price)').to.equal(2.5)
            expect(results[0]).to.have.property('max(price)').to.equal(263.5)
            expect(results[0]).to.have.property('avg(price)').to.equal(28.866363636363637)
            expect(results[0]).to.have.property('count(price)').to.equal(77)
            expect(results[0]).to.have.property('count(productName)').to.equal(77)
            done();
        }).catch(function (err) {
            done(err);
        })
    });

});