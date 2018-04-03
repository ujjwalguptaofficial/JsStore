describe('Test update with operator option', function () {

    it('update with operator - +', function (done) {
        var Price;
        Con.select({
            from: "Products",
            where: {
                ProductID: 1
            }
        }).then(function (results) {
            Price = results[0].Price;
        }).catch(function (err) {
            done(err);
        });

        Con.update({ in: "Products",
            set: {
                Price: {
                    '+': 5
                }
            },
            where: {
                ProductID: 1
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(1);
        }).catch(function (err) {
            done(err);
        });

        Con.select({
            from: "Products",
            where: {
                ProductID: 1
            }
        }).then(function (results) {
            expect(results[0].Price).to.be.an('number').to.equal(Price + 5);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('update with operator - "-" ', function (done) {
        var Price;
        Con.select({
            from: "Products",
            where: {
                ProductID: 1
            }
        }).then(function (results) {
            Price = results[0].Price;
        }).catch(function (err) {
            done(err);
        });

        Con.update({ in: "Products",
            set: {
                Price: {
                    '-': 5
                }
            },
            where: {
                ProductID: 1
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(1);
        }).catch(function (err) {
            done(err);
        });

        Con.select({
            from: "Products",
            where: {
                ProductID: 1
            }
        }).then(function (results) {
            expect(results[0].Price).to.be.an('number').to.equal(Price - 5);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('update with operator - *', function (done) {
        var Price;
        Con.select({
            from: "Products",
            where: {
                ProductID: 1
            }
        }).then(function (results) {
            Price = results[0].Price;
        }).catch(function (err) {
            done(err);
        });
        Con.update({ in: "Products",
            set: {
                Price: {
                    '*': 5
                }
            },
            where: {
                ProductID: 1
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(1);
        }).catch(function (err) {
            done(err);
        });

        Con.select({
            from: "Products",
            where: {
                ProductID: 1
            }
        }).then(function (results) {
            expect(results[0].Price).to.be.an('number').to.equal(Price * 5);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('update with operator - *', function (done) {
        var Price;
        Con.select({
            from: "Products",
            where: {
                ProductID: 1
            }
        }).then(function (results) {
            Price = results[0].Price;
        }).catch(function (err) {
            done(err);
        });
        Con.update({ in: "Products",
            set: {
                Price: {
                    '/': 5
                }
            },
            where: {
                ProductID: 1
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(1);
        }).catch(function (err) {
            done(err);
        });

        Con.select({
            from: "Products",
            where: {
                ProductID: 1
            }
        }).then(function (results) {
            expect(results[0].Price).to.be.an('number').to.equal(Price / 5);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('update with operator - + : string concat', function (done) {
        var Name;
        Con.select({
            from: "Products",
            where: {
                ProductID: 1
            }
        }).then(function (results) {
            Name = results[0].ProductName;
        }).catch(function (err) {
            done(err);
        });
        Con.update({ in: "Products",
            set: {
                ProductName: {
                    '+': 'temp'
                }
            },
            where: {
                ProductID: 1
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(1);
        }).catch(function (err) {
            done(err);
        });

        Con.select({
            from: "Products",
            where: {
                ProductID: 1
            }
        }).then(function (results) {
            expect(results[0].ProductName).to.be.an('string').to.equal(Name + 'temp');
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('update with wrong operator - #', function (done) {
        Con.update({ in: "Products",
            set: {
                ProductName: {
                    '#': 'temp'
                }
            },
            where: {
                ProductID: 1
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(1);
        }).catch(function (err) {
            var error = {
                "_message": "Supplied value for column 'ProductName' does not have valid type",
                "_type": "bad_data_type"
            };
            expect(err).to.be.an('object').eql(error);
            done();
        });
    });
});