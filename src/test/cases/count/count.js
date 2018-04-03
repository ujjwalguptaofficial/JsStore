describe('Test count Api', function () {
    it('count all - using promise', function (done) {
        Con.count({
            from: 'Customers'
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
            from: 'Customers',
            where: {
                Country: 'Mexico'
            }
        }).
        then(function (results) {
            expect(results).to.be.an('number').to.equal(5);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it('count without ignore case', function (done) {
        Con.count({
            from: 'Customers',
            where: {
                Country: 'mexico'
            }
        }).
        then(function (results) {
            expect(results).to.be.an('number').to.equal(0);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it('count with ignore case', function (done) {
        Con.count({
            from: 'Customers',
            ignoreCase: true,
            where: {
                Country: 'meXico'
            }
        }).
        then(function (results) {
            expect(results).to.be.an('number').to.equal(5);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it('count with or', function (done) {
        Con.count({
            from: 'Customers',
            where: {
                Country: 'Mexico',
                Or: {
                    City: 'Madrid'
                }
            }
        }).
        then(function (results) {
            expect(results).to.be.an('number').to.equal(8);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it('count with in', function (done) {
        Con.count({
            from: 'Customers',
            where: {
                Country: {
                    in: ['Germany', 'France', 'UK']
                }
            }
        }).
        then(function (results) {
            expect(results).to.be.an('number').to.equal(29);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it('count with operator - >', function (done) {
        Con.count({
            from: 'Products',
            where: {
                Price: {
                    ">": 20
                }
            }
        }).
        then(function (results) {
            expect(results).to.be.an('number').to.equal(37);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it('count with operator - >=', function (done) {
        Con.count({
            from: 'Products',
            where: {
                Price: {
                    ">=": 20
                }
            }
        }).
        then(function (results) {
            expect(results).to.be.an('number').to.equal(38);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it('count with operator - <', function (done) {
        Con.count({
            from: 'Products',
            where: {
                Price: {
                    "<": 20
                }
            }
        }).
        then(function (results) {
            expect(results).to.be.an('number').to.equal(39);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it('count with operator - <=', function (done) {
        Con.count({
            from: 'Products',
            where: {
                Price: {
                    "<=": 20
                }
            }
        }).
        then(function (results) {
            expect(results).to.be.an('number').to.equal(40);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it('select with operator - != (for string)', function (done) {
        Con.count({
            from: 'Customers',
            where: {
                Country: {
                    '!=': 'Mexico'
                }
            }
        }).
        then(function (results) {
            expect(results).to.be.an('number').to.equal(88);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it('select with operator - != (for number)', function (done) {
        Con.count({
            from: 'Products',
            where: {
                Price: {
                    '!=': 20
                }
            }
        }).
        then(function (results) {
            expect(results).to.be.an('number').to.equal(76);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it('count with operator - between', function (done) {
        Con.count({
            from: 'Products',
            where: {
                Price: {
                    "-": {
                        low: 10,
                        high: 20
                    }
                }
            }
        }).
        then(function (results) {
            expect(results).to.be.an('number').to.equal(29);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it('count with like', function (done) {
        Con.count({
            from: 'Customers',
            where: {
                CustomerName: {
                    like: '%or%'
                }
            }
        }).
        then(function (results) {
            expect(results).to.be.an('number').to.equal(11);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it('select with like - "o%"', function (done) {
        Con.count({
            from: 'Customers',
            where: {
                CustomerName: {
                    like: 'o%'
                }
            }
        }).
        then(function (results) {
            expect(results).to.be.an('number').to.equal(3);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it('select with like - "%o"', function (done) {
        Con.count({
            from: 'Customers',
            where: {
                CustomerName: {
                    like: '%o'
                }
            }
        }).
        then(function (results) {
            expect(results).to.be.an('number').to.equal(6);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it('wrong table test', function (done) {
        Con.count({
            from: 'Cusdtomers'
        }).
        catch(function (err) {
            var error = {
                "_message": "Table 'Cusdtomers' does not exist",
                "_type": "table_not_exist"
            };
            expect(err).to.be.an('object').eql(error);
            done();
        });
    });
});