describe('Test operator', function () {
    it('select with operator - != (for string)', function (done) {
        con.select({
            from: 'Customers',
            where: {
                country: {
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
        con.select({
            from: 'Products',
            where: {
                price: {
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
        con.select({
            from: 'Products',
            where: {
                price: {
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
        con.select({
            from: 'Products',
            where: {
                price: {
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
        con.select({
            from: 'Products',
            where: {
                price: {
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
        con.select({
            from: 'Products',
            where: {
                price: {
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
        con.select({
            from: 'Products',
            where: {
                price: {
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
        con.select({
            from: 'Products',
            where: {
                price: {
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

    it("select with where simple & between", function (done) {
        con.select({
            from: "Products",
            where: {

                productName: "Aniseed Syrup",
                price: {
                    "-": {
                        low: 20,
                        high: 20
                    }
                },
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(0);
            done();
        }).catch(function (err) {
            done(err);
        })
    })

    it("select with between & where simple", function (done) {
        con.select({
            from: "Products",
            where: {
                price: {
                    "-": {
                        low: 20,
                        high: 20
                    }
                },
                productName: "Aniseed Syrup",
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(0);
            done();
        }).catch(function (err) {
            done(err);
        })
    })

    it("select with where having multiple column - check for inclusive", function (done) {
        con.select({
            from: "Products",
            where: {
                price: {

                    "-": {
                        low: 10,
                        high: 20
                    }
                },
                productName: {
                    like: '%a%'
                },
            }
        }).then(results => {
            expect(results).to.be.an('array').length(24);
            return con.select({
                from: "Products",
                where: {
                    productName: {
                        like: '%a%'
                    },
                    price: {

                        "-": {
                            low: 10,
                            high: 20
                        }
                    }
                }
            })
        }).then(function (results) {
            expect(results).to.be.an('array').length(24);
            done();
        }).catch(function (err) {
            done(err);
        })
    })

    it('between with date', function (done) {
        con.select({
            from: 'Orders',
            where: {
                orderDate: {
                    '-': {
                        low: new Date("1996-07-04"),
                        high: new Date("1996-07-10")
                    }
                }
            }
        }).
            then(function (results) {
                expect(results).to.be.an('array').length(6);
                // done(results.map(q => q.orderId));
                done();
            }).
            catch(function (err) {
                done(err);
            })
    });

    it('between with date & some other column', function (done) {
        let resultFromFirstQuery;
        con.select({
            from: 'Orders',
            where: {
                orderId: {
                    in: [10248, 10249, 10250, 10251, 10252, 10253]
                },
                orderDate: {
                    '-': {
                        low: new Date("1996-07-04"),
                        high: new Date("1996-07-10")
                    }
                }
            }
        }).
            then(function (results) {
                resultFromFirstQuery = results;
                expect(results).to.be.an('array').length(6);
                return con.select({
                    from: 'Orders',
                    where: {
                        orderDate: {
                            '-': {
                                low: new Date("1996-07-04"),
                                high: new Date("1996-07-10")
                            }
                        },
                        orderId: {
                            in: [10248, 10249, 10250, 10251, 10252, 10253]
                        },
                    }
                })
            }).
            then(function (results) {
                expect(results).to.be.an('array').length(6);
                results.forEach((item, index) => {
                    expect(item.orderId).equal(resultFromFirstQuery[index].orderId);
                })
                done();
            }).
            catch(function (err) {
                done(err);
            })
    });
});