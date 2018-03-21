describe('Test operator', function () {
    it('select with operator - != (for string)', function (done) {
        Con.select({
            From: 'Customers',
            Where: {
                Country: {
                    '!=': 'Mexico'
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(88);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with operator - != (for number)', function (done) {
        Con.select({
            From: 'Products',
            Where: {
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
            From: 'Products',
            Where: {
                Price: {
                    ">": 20
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(37);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with operator - >=', function (done) {
        Con.select({
            From: 'Products',
            Where: {
                Price: {
                    ">=": 20
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(38);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with operator - <', function (done) {
        Con.select({
            From: 'Products',
            Where: {
                Price: {
                    "<": 20
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(39);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with operator - <=', function (done) {
        Con.select({
            From: 'Products',
            Where: {
                Price: {
                    "<=": 20
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(40);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with operator - between', function (done) {
        Con.select({
            From: 'Products',
            Where: {
                Price: {
                    "-": {
                        Low: 10,
                        High: 20
                    }
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(29);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with operator - "<" and ">" ', function (done) {
        Con.select({
            From: 'Products',
            Where: {
                Price: {
                    ">": 10,
                    "<": 20
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(25);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });
});