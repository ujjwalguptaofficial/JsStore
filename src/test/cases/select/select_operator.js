describe('Test operator', function () {
    it('select with operator - != (for string)', function (done) {
        Con.select({
            from: 'Customers',
            where: {
                Country: {
                    '!=': 'Mexico'
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(88);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with operator - != (for number)', function (done) {
        Con.select({
            from: 'Products',
            where: {
                Price: {
                    '!=': 20
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(76);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with operator - >', function (done) {
        Con.select({
            from: 'Products',
            where: {
                Price: {
                    ">": 20
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(37);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with operator - >=', function (done) {
        Con.select({
            from: 'Products',
            where: {
                Price: {
                    ">=": 20
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(38);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with operator - <', function (done) {
        Con.select({
            from: 'Products',
            where: {
                Price: {
                    "<": 20
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(39);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with operator - <=', function (done) {
        Con.select({
            from: 'Products',
            where: {
                Price: {
                    "<=": 20
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(40);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with operator - between', function (done) {
        Con.select({
            from: 'Products',
            where: {
                Price: {
                    "-": {
                        low: 10,
                        high: 20
                    }
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(29);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with operator - "<" and ">" ', function (done) {
        Con.select({
            from: 'Products',
            where: {
                Price: {
                    ">": 10,
                    "<": 20
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(25);
            done();
        }).catch(function (err) {
            done(err);
        })
    });
});