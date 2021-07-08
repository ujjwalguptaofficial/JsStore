describe('Test remove Api', function () {

    it("load script", function (done) {
        con.importScripts("../cases/delete/middleware.js").then(done).catch(done);
    });

    it('add middleware in worker', function (done) {
        con.addMiddleware("RemoveMiddleware.filterCountry", true).then(done).catch(done);
    })

    it('remove with where', function (done) {
        var Count;
        con.select({
            from: 'Customers',
            where: {
                country: 'Mexico'
            }
        }).then(function (results) {
            Count = results.length
        }).catch(function (err) {
            done(err);
        })

        con.remove({
            from: 'Customers',
            where: {
                // country: 'Mexico'
            },
            country: 'Mexico'
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(Count + 1);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('remove with where - invalid column in where', function (done) {

        con.remove({
            from: 'Customers',
            where: {
                Country: 'Mexico'
            }
        }).catch(function (err) {
            var error = {
                message: "Column 'Country' does not exist",
                type: "column_not_exist"
            };
            expect(err).to.be.an('object').eql(error);
            done();
        })
    });

    it('remove without ignore case', function (done) {
        var Count;
        con.select({
            from: 'Customers',
            where: {
                country: 'mexico'
            }
        }).then(function (results) {
            Count = results.length;
        }).catch(function (err) {
            done(err);
        })

        con.remove({
            from: 'Customers',
            where: {
                country: 'mexico'
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(Count);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('remove with where as array', function (done) {

        var Count;
        const query = {
            from: 'Customers',
            where: [{
                country: "Sweden"
            }]
        };
        con.count(query).then(function (results) {
            Count = results;
        }).catch(function (err) {
            done(err);
        })

        con.remove(query).then(function (results) {
            expect(results).to.be.an('number').to.equal(Count);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('remove with or', function (done) {

        var Count;
        con.select({
            from: 'Customers',
            where: {
                country: 'Mexico',
                or: {
                    city: 'Madrid'
                }
            }
        }).then(function (results) {
            Count = results.length;
        }).catch(function (err) {
            done(err);
        })

        con.remove({
            from: 'Customers',
            where: {
                country: 'Mexico',
                or: {
                    city: 'Madrid'
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(Count);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('remove with in', function (done) {

        var Count;
        con.select({
            from: 'Customers',
            where: {
                country: {
                    in: ['Germany', 'France', 'UK']
                }
            }
        }).then(function (results) {
            Count = results.length;
        }).catch(function (err) {
            done(err);
        })

        con.remove({
            from: 'Customers',
            where: {
                country: {
                    in: ['Germany', 'France', 'UK']
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(Count);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('remove with operator - != (for string)', function (done) {
        var count;
        con.count({
            from: 'Customers',
            where: {
                country: {
                    '!=': 'Mexico'
                }
            }
        }).then(function (results) {
            count = results;
        }).catch(function (err) {
            done(err);
        });

        con.remove({
            from: 'Customers',
            where: {
                country: {
                    '!=': 'Mexico'
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(count);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('remove with operator - != (for number)', function (done) {
        var count;
        con.count({
            from: 'Products',
            where: {
                price: {
                    '!=': 20
                }
            }
        }).then(function (results) {
            count = results;
        }).catch(function (err) {
            done(err);
        })

        con.remove({
            from: 'Products',
            where: {
                price: {
                    '!=': 20
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(count);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('remove with operator - >', function (done) {

        var Count;
        con.select({
            from: 'Products',
            where: {
                price: {
                    ">": 20
                }
            }
        }).then(function (results) {
            Count = results.length;
        }).catch(function (results) {
            done(err);
        })

        con.remove({
            from: 'Products',
            where: {
                price: {
                    ">": 20
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(Count);
            done();
        }).catch(function (results) {
            done(err);
        })
    });

    it('remove with operator - >=', function (done) {

        var Count;
        con.select({
            from: 'Products',
            where: {
                price: {
                    ">=": 20
                }
            }
        }).then(function (results) {
            Count = results.length;
        }).catch(function (results) {
            done(err);
        })

        con.remove({
            from: 'Products',
            where: {
                price: {
                    ">=": 20
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(Count);
            done();
        }).catch(function (results) {
            done(err);
        })
    });

    it('remove with operator - <', function (done) {

        var Count;
        con.select({
            from: 'Products',
            where: {
                price: {
                    "<": 20
                }
            }
        }).then(function (results) {
            Count = results.length;
        }).catch(function (results) {
            done(err);
        })

        con.remove({
            from: 'Products',
            where: {
                price: {
                    "<": 20
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(Count);
            done();
        }).catch(function (results) {
            done(err);
        })
    });

    it('remove with operator - <=', function (done) {
        var Count;
        con.select({
            from: 'Products',
            where: {
                price: {
                    "<=": 20
                }
            }
        }).then(function (results) {
            Count = results.length;
        }).catch(function (results) {
            done(err);
        })

        con.remove({
            from: 'Products',
            where: {
                price: {
                    "<=": 20
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(Count);
            done();
        }).catch(function (results) {
            done(err);
        })
    });

    it('remove with operator - between', function (done) {
        var Count;
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
            Count = results.length;
        }).catch(function (results) {
            done(err);
        })

        con.remove({
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
            expect(results).to.be.an('number').to.equal(Count);
            done();
        }).catch(function (results) {
            done(err);
        })
    });

    it('remove with like- "%or%"', function (done) {
        var Count;
        con.select({
            from: 'Customers',
            where: {
                customerName: {
                    like: '%or%'
                }
            }
        }).then(function (results) {
            Count = results.length;
        }).catch(function (results) {
            done(err);
        })

        con.remove({
            from: 'Customers',
            where: {
                customerName: {
                    like: '%or%'
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(Count);
            done();
        }).catch(function (results) {
            done(err);
        })
    });

    it('remove with like- "%or"', function (done) {
        var Count;
        con.select({
            from: 'Customers',
            where: {
                customerName: {
                    like: '%or'
                }
            }
        }).then(function (results) {
            Count = results.length;
            con.remove({
                from: 'Customers',
                where: {
                    customerName: {
                        like: '%or'
                    }
                }
            }).then(function (results) {
                expect(results).to.be.an('number').to.equal(Count);
                done();
            }).catch(function (results) {
                done(err);
            })
        }).catch(function (results) {
            done(err);
        });

    });

    it('remove with like- "or%"', function (done) {
        var Count;
        con.select({
            from: 'Customers',
            where: {
                customerName: {
                    like: 'or%'
                }
            }
        }).then(function (results) {
            Count = results.length;
        }).catch(function (results) {
            done(err);
        })

        con.remove({
            from: 'Customers',
            where: {
                customerName: {
                    like: 'or%'
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(Count);
            done();
        }).catch(function (results) {
            done(err);
        })
    });

    it('remove all - using promise', function (done) {
        var Count;
        con.count({
            from: 'Customers'
        }).then(function (results) {
            Count = results;
        }).catch(function (results) {
            done(err);
        });
        con.remove({
            from: 'Customers'
        }).
            then(function (results) {
                expect(results).to.be.an('number').to.equal(Count);
                done();
            }).
            catch(function (err) {
                done(err);
            });

    });

    it('wrong table test - using promise', function (done) {
        con.remove({
            from: 'Cusdtomers'
        }).
            catch(function (err) {
                var error = {
                    "message": "Table 'Cusdtomers' does not exist",
                    "type": "table_not_exist"
                };
                expect(err).to.be.an('object').eql(error);
                done();
            });
    });
});