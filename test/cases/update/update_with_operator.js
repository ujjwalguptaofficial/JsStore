describe('Test update with operator option', function () {

    it('update with operator - +', function (done) {
        var Price;
        con.select({
            from: "Products",
            where: {
                ProductID: 1
            }
        }).then(function (results) {
            Price = results[0].Price;
        }).catch(function (err) {
            done(err);
        });

        con.update({ in: "Products",
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

        con.select({
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
        con.select({
            from: "Products",
            where: {
                ProductID: 1
            }
        }).then(function (results) {
            Price = results[0].Price;
        }).catch(function (err) {
            done(err);
        });

        con.update({ in: "Products",
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

        con.select({
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
        con.select({
            from: "Products",
            where: {
                ProductID: 1
            }
        }).then(function (results) {
            Price = results[0].Price;
        }).catch(function (err) {
            done(err);
        });
        con.update({ in: "Products",
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

        con.select({
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
        con.select({
            from: "Products",
            where: {
                ProductID: 1
            }
        }).then(function (results) {
            Price = results[0].Price;
        }).catch(function (err) {
            done(err);
        });
        con.update({ in: "Products",
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

        con.select({
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
        con.select({
            from: "Products",
            where: {
                ProductID: 1
            }
        }).then(function (results) {
            Name = results[0].ProductName;
        }).catch(function (err) {
            done(err);
        });
        con.update({ in: "Products",
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

        con.select({
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
        con.update({ in: "Products",
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
                "message": "Supplied value for column 'ProductName' have wrong data type",
                "type": "wrong_data_type"
            };
            expect(err).to.be.an('object').eql(error);
            done();
        });
    });
});