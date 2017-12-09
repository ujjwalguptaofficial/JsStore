describe('Test count Api', function () {
    it('count all - using promise', function (done) {
        Con.count({
            From: 'Customers'
        }).
        then(function (results) {
            expect(results).to.be.an('number').to.equal(93);
            done();
        }).
        catch(function (err) {
            done(err);
        })

    });

    it('count with where', function (done) {
        Con.count({
            From: 'Customers',
            Where: {
                Country: 'Mexico'
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(5);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('count without ignore case', function (done) {
        Con.count({
            From: 'Customers',
            Where: {
                Country: 'mexico'
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(0);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('count with ignore case', function (done) {
        Con.count({
            From: 'Customers',
            IgnoreCase: true,
            Where: {
                Country: 'meXico'
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(5);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('count with or', function (done) {
        Con.count({
            From: 'Customers',
            Where: {
                Country: 'Mexico',
                Or: {
                    City: 'Madrid'
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(8);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('count with in', function (done) {
        Con.count({
            From: 'Customers',
            Where: {
                Country: {
                    In: ['Germany', 'France', 'UK']
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(29);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('count with operator - >', function (done) {
        Con.count({
            From: 'Products',
            Where: {
                Price: {
                    ">": 20
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(37);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('count with operator - >=', function (done) {
        Con.count({
            From: 'Products',
            Where: {
                Price: {
                    ">=": 20
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(38);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('count with operator - <', function (done) {
        Con.count({
            From: 'Products',
            Where: {
                Price: {
                    "<": 20
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(39);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('count with operator - <=', function (done) {
        Con.count({
            From: 'Products',
            Where: {
                Price: {
                    "<=": 20
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(40);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('count with operator - between', function (done) {
        Con.count({
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
                expect(results).to.be.an('number').to.equal(29);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('count with like', function (done) {
        Con.count({
            From: 'Customers',
            Where: {
                CustomerName: {
                    Like: '%or%'
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(11);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });
});