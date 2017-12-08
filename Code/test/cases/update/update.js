describe('Test update Api', function () {

    it('update with where', function (done) {
        Con.update({
            In: "Customers",
            Set: {
                ContactName: 'Ujjwal',
                City: 'Bhubaneswar'
            },
            Where: {
                CustomerID: 1
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(1);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('update with like', function (done) {
        Con.update({
            In: 'Customers',
            Where: {
                CustomerName: {
                    Like: '%or%'
                }
            },
            Set: {
                Country: 'india'
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

    it('update without ignore case', function (done) {
        Con.update({
            In: "Customers",
            Set: {
                ContactName: 'Ujjwal',
                City: 'bhubaneswar'
            },
            Where: {
                City: 'BhUbaneSwar'
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

    it('update with ignore case', function (done) {
        Con.update({
            In: "Customers",
            IgnoreCase: true,
            Set: {
                ContactName: 'Ujjwal',
                City: 'bhubaneswar'
            },
            Where: {
                City: 'bHuBaneSwar'
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(3);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with or', function (done) {
        Con.select({
            From: 'Customers',
            Where: {
                Country: 'Mexico',
                Or: {
                    City: 'Madrid'
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(6);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('update with or', function (done) {
        Con.update({
            In: 'Customers',
            Where: {
                Country: 'Mexico',
                Or: {
                    City: 'Madrid'
                }
            },
            Set: {
                City: 'madrid'
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(6);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with in', function (done) {
        Con.select({
            From: 'Customers',
            Where: {
                Country: {
                    In: ['Germany', 'France', 'UK']
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(24);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('update with in', function (done) {
        Con.update({
            In: 'Customers',
            Where: {
                Country: {
                    In: ['Germany', 'France', 'UK']
                }
            },
            Set: {
                ContactName: 'Ujjwal',
                City: 'bhubaneswar'
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(24);
                done();
            },
            OnError: function (err) {
                done(err);
            }
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

    it('update with operator - >', function (done) {
        Con.update({
            In: 'Products',
            Where: {
                Price: {
                    ">": 20
                }
            },
            Set: {
                ProductName: 'Cofee'
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

    it('update with operator - >=', function (done) {
        Con.update({
            In: 'Products',
            Where: {
                Price: {
                    ">=": 20
                }
            },
            Set: {
                ProductName: 'Whisky'
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

    it('update with operator - <', function (done) {
        Con.update({
            In: 'Products',
            Where: {
                Price: {
                    "<": 20
                }
            },
            Set: {
                ProductName: 'Tea'
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

    it('update with operator - <=', function (done) {
        Con.update({
            In: 'Products',
            Where: {
                Price: {
                    "<=": 20
                }
            },
            Set: {
                ProductName: 'Candy'
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

    it('update with operator - between', function (done) {
        Con.update({
            In: 'Products',
            Where: {
                Price: {
                    "-": {
                        Low: 10,
                        High: 20
                    }
                }
            },
            Set: {
                ProductName: 'Chocolate'
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


});