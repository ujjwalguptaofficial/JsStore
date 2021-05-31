describe('Test count Api', function () {
    it('count all', function (done) {
        con.count({
            from: 'Customers'
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(93);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('count with where', function (done) {
        con.count({
            from: 'Customers',
            where: {
                country: 'Mexico'
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(5);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('count with where - invalid column', function (done) {
        con.count({
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

    it('count with where - multiple column and ', function (done) {
        con.count({
            from: 'Customers',
            where: {
                country: "Germany",
                city: "Berlin"
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(1);
            done();
        }).catch(function (err) {
            done(err);
        })
    });


    it('count without ignore case', function (done) {
        con.count({
            from: 'Customers',
            where: {
                country: 'mexico'
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

    // it('count with ignore case', function (done) {
    //     con.count({
    //         from: 'Customers',
    //         ignoreCase: true,
    //         where: {
    //             country: 'meXico'
    //         }
    //     }).
    //         then(function (results) {
    //             expect(results).to.be.an('number').to.equal(5);
    //             done();
    //         }).
    //         catch(function (err) {
    //             done(err);
    //         })
    // });

    it('count with or', function (done) {
        con.count({
            from: 'Customers',
            where: {
                country: 'Mexico',
                or: {
                    city: 'Madrid'
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
        con.count({
            from: 'Customers',
            where: {
                country: {
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
        con.count({
            from: 'Products',
            where: {
                price: {
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
        con.count({
            from: 'Products',
            where: {
                price: {
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
        con.count({
            from: 'Products',
            where: {
                price: {
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
        con.count({
            from: 'Products',
            where: {
                price: {
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
        con.count({
            from: 'Customers',
            where: {
                country: {
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
        con.count({
            from: 'Products',
            where: {
                price: {
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
        con.count({
            from: 'Products',
            where: {
                price: {
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
        con.count({
            from: 'Customers',
            where: {
                customerName: {
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
        con.count({
            from: 'Customers',
            where: {
                customerName: {
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

    it('count with like - "%o"', function (done) {
        con.count({
            from: 'Customers',
            where: {
                customerName: {
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
        con.count({
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

    it("load script", function (done) {
        con.importScripts("../cases/count/count_middleware.js").then(done).catch(done);
    });

    it('add middleware in worker', function (done) {
        con.addMiddleware("JsStoreOptions.countMiddleware", true).then(done).catch(done);
    })

    it('add invalid middleware in worker', function (done) {
        con.addMiddleware("d.countMiddleware", true).then(done).catch((err) => {
            const error = {
                "message": "No function d.countMiddleware is found.",
                "type": "invalid_middleware"
            };
            expect(err).to.be.an('object').eql(error);
            done();
        });
    })

    it('middleware test in worker', function (done) {
        con.count({
            from: 'Customers',
            where: {
                customerName: {
                    like: '%o'
                }
            },
            'add5': true
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(16);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('middleware test in worker - get db', function (done) {
        con.count({
            from: 'Customers',
            where: {
                customerName: {
                    like: '%o'
                }
            },
            'db': true
        }).then(function (results) {
            expect(results.name).to.equal("Demo");
            expect(results.tables).to.be.an('array').length(11);
            const categories = results.tables.find(q => q.name === "Categories");
            expect(categories.columns).to.be.an('object');
            expect(Object.keys(categories.columns).length).to.equal(3)
            expect(categories.columns.categoryId.primaryKey).to.equal(true)
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('add middleware', function (done) {
        con.addMiddleware(function (request) {
            if (request.name == "count" && request.query['add10']) {
                request.onResult(result => {
                    result = result + 10;
                    return Promise.resolve(result);
                })
                request.onResult(result => {
                    return result + 10;
                })
            }
        }).then(done).catch(done);
    })

    it('middleware test', function (done) {
        con.count({
            from: 'Customers',
            where: {
                customerName: {
                    like: '%o'
                }
            },
            'add10': true
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(26);
            done();
        }).catch(function (err) {
            done(err);
        })
    });
});