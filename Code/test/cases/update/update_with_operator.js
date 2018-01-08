describe('Test update with operator option', function () {

    it('update with operator - +', function (done) {
        var Price;
        Con.select({
            From: "Products",
            Where: {
                ProductID: 1
            },
            OnSuccess: function (results) {
                Price = results[0].Price;
            },
            OnError: function (err) {
                done(err);
            }
        });
        Con.update({
            In: "Products",
            Set: {
                Price: {
                    '+': 5
                }
            },
            Where: {
                ProductID: 1
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(1);
            },
            OnError: function (err) {
                done(err);
            }
        });

        Con.select({
            From: "Products",
            Where: {
                ProductID: 1
            },
            OnSuccess: function (results) {
                expect(results[0].Price).to.be.an('number').to.equal(Price + 5);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        });
    });

    it('update with operator - "-" ', function (done) {
        var Price;
        Con.select({
            From: "Products",
            Where: {
                ProductID: 1
            },
            OnSuccess: function (results) {
                Price = results[0].Price;
            },
            OnError: function (err) {
                done(err);
            }
        });
        Con.update({
            In: "Products",
            Set: {
                Price: {
                    '-': 5
                }
            },
            Where: {
                ProductID: 1
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(1);
            },
            OnError: function (err) {
                done(err);
            }
        });

        Con.select({
            From: "Products",
            Where: {
                ProductID: 1
            },
            OnSuccess: function (results) {
                expect(results[0].Price).to.be.an('number').to.equal(Price - 5);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        });
    });

    it('update with operator - *', function (done) {
        var Price;
        Con.select({
            From: "Products",
            Where: {
                ProductID: 1
            },
            OnSuccess: function (results) {
                Price = results[0].Price;
            },
            OnError: function (err) {
                done(err);
            }
        });
        Con.update({
            In: "Products",
            Set: {
                Price: {
                    '*': 5
                }
            },
            Where: {
                ProductID: 1
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(1);
            },
            OnError: function (err) {
                done(err);
            }
        });

        Con.select({
            From: "Products",
            Where: {
                ProductID: 1
            },
            OnSuccess: function (results) {
                expect(results[0].Price).to.be.an('number').to.equal(Price * 5);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        });
    });

    it('update with operator - *', function (done) {
        var Price;
        Con.select({
            From: "Products",
            Where: {
                ProductID: 1
            },
            OnSuccess: function (results) {
                Price = results[0].Price;
            },
            OnError: function (err) {
                done(err);
            }
        });
        Con.update({
            In: "Products",
            Set: {
                Price: {
                    '/': 5
                }
            },
            Where: {
                ProductID: 1
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(1);
            },
            OnError: function (err) {
                done(err);
            }
        });

        Con.select({
            From: "Products",
            Where: {
                ProductID: 1
            },
            OnSuccess: function (results) {
                expect(results[0].Price).to.be.an('number').to.equal(Price / 5);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        });
    });

    it('update with operator - + : string concat', function (done) {
        var Name;
        Con.select({
            From: "Products",
            Where: {
                ProductID: 1
            },
            OnSuccess: function (results) {
                Name = results[0].ProductName;
            },
            OnError: function (err) {
                done(err);
            }
        });
        Con.update({
            In: "Products",
            Set: {
                ProductName: {
                    '+': 'temp'
                }
            },
            Where: {
                ProductID: 1
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(1);
            },
            OnError: function (err) {
                done(err);
            }
        });

        Con.select({
            From: "Products",
            Where: {
                ProductID: 1
            },
            OnSuccess: function (results) {
                expect(results[0].ProductName).to.be.an('string').to.equal(Name + 'temp');
                done();
            },
            OnError: function (err) {
                done(err);
            }
        });
    });

    it('update with wrong operator - #', function (done) {
        Con.update({
            In: "Products",
            Set: {
                ProductName: {
                    '#': 'temp'
                }
            },
            Where: {
                ProductID: 1
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(1);
            },
            OnError: function (err) {
                var error = {
                    "_message": "Invalid Op Value '#'",
                    "_type": "invalid_operator"
                };
                expect(err).to.be.an('object').eql(error);
                done();
            }
        });
    });
});