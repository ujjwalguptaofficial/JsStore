describe('Select with order', function () {
    it('order by without any column', function (done) {
        con.select({
            from: 'Customers',
            limit: 10,
            order: {

            }
        }).then(function (results) {
            done(results);
        }).catch(function (err) {
            var error = { "message": "Column 'undefined' in order query does not exist", "type": "column_not_exist" };
            expect(err).to.be.an('object').eql(error);
            done();
        })
    })

    it('order by country ', function (done) {
        con.select({
            from: 'Customers',
            limit: 10,
            order: {
                by: 'country'
            }
        }).then(function (results) {
            var countries = ["Argentina", "Argentina", "Argentina", "Austria", "Austria",
                "Belgium", "Belgium", "Brazil", "Brazil", "Brazil"];
            expect(results).to.be.an('array').length(10);
            results.forEach(function (result, i) {
                expect(result.country).to.be.equal(countries[i]);
            });
            done();
        }).catch(function (err) {
            done(err);
        })
    })

    it('order having type asc with limit ', function (done) {
        con.select({
            from: 'Products',
            limit: 1,
            where: {
                supplierId: {
                    '>': 18
                }
            },
            order: {
                by: 'price',
                type: 'asc'
            }
        }).
            then(function (results) {
                expect(results).to.be.an('array').length(1);
                var product = results[0];
                expect(product.price).to.be.eql(7)
                done();
            }).
            catch(function (err) {
                done(err);
            })
    });

    it('order having type desc with limit ', function (done) {
        con.select({
            from: 'Products',
            limit: 1,
            where: {
                supplierId: {
                    '>': 18
                }
            },
            order: {
                by: 'price',
                type: 'desc'
            }
        }).
            then(function (results) {
                expect(results).to.be.an('array').length(1);
                var product = results[0];
                expect(product.price).to.be.eql(55)
                done();
            }).
            catch(function (err) {
                done(err);
            })
    });

    it('invalid order column test', function (done) {
        con.select({
            from: 'Products',
            limit: 1,
            order: {
                by: 'invalid column',
                type: 'asc'
            }
        }).
            then(function (err) {
                done(err);
            }).
            catch(function (err) {
                var error = {
                    "message": "Column 'invalid column' in order query does not exist",
                    "type": "column_not_exist"
                };
                expect(err).to.be.an('object').eql(error);
                done();
            })
    });

    it('invalid order column test with where query', function (done) {
        con.select({
            from: 'Products',
            limit: 1,
            where: {
                supplierId: {
                    '>': 18
                }
            },
            order: {
                by: 'invalid column',
                type: 'asc'
            }
        }).
            then(function (err) {
                done(err);
            }).
            catch(function (err) {
                var error = {
                    "message": "Column 'invalid column' in order query does not exist",
                    "type": "column_not_exist"
                };
                expect(err).to.be.an('object').eql(error);
                done();
            })
    });

    it('things table test', function (done) {
        con.select({
            from: 'things',
            order: {
                by: 'value',
                type: 'asc',
                // idbSorting: false
            },
            sortManually: true
        }).
            then(function (results) {
                results = results.map(function (val) {
                    return val.value;
                });
                expect(results).to.be.an('array').length(10);
                var expecteResult = ['Bayou', 'bite', 'caYman', 'crocodilian', 'Eggs',
                    'gator', 'Grip', 'grips', 'Jaw', 'nest'
                ];
                expect(results).to.deep.equal(expecteResult);
                // var product = results[0];
                // expect(product.price).to.be.eql(7)
                done();
            }).
            catch(done)
    });

    it('order by asc for date', function (done) {
        con.select({
            from: 'Employees',
            order: {
                by: 'birthDate',
                type: 'asc',
                idbSorting: false
            }
        }).
            then(function (results) {
                expect(results).to.be.an('array').length(34);
                var isSorted = true;
                results.every(function (value, index) {
                    var nextVal = results[index + 1];
                    if (nextVal != null && value.birthDate.getTime() > nextVal.birthDate.getTime()) {
                        isSorted = false;
                    }
                    return isSorted;
                })
                if (isSorted === true) {
                    done();
                } else {
                    done("birth date is not sorted");
                }

            }).
            catch(function (err) {
                done(err);
            })
    });

    it('order by desc for date', function (done) {
        con.select({
            from: 'Employees',
            order: {
                by: 'birthDate',
                type: 'desc',
                idbSorting: false
            }
        }).
            then(function (results) {
                expect(results).to.be.an('array').length(34);
                var isSorted = true;
                results.every(function (value, index) {
                    var nextVal = results[index + 1];
                    // check for wrong condition
                    if (nextVal != null && value.birthDate.getTime() < nextVal.birthDate.getTime()) {
                        isSorted = false;
                    }
                    return isSorted;
                })
                if (isSorted === true) {
                    done();
                } else {
                    done("birth date is not sorted");
                }

            }).
            catch(function (err) {
                done(err);
            })
    });

    it('order with skip', function (done) {
        con.select({
            from: "Customers",
            order: {
                by: 'address',
                type: "asc"
            },
        }).then(function (results1) {
            con.select({
                from: "Customers",
                skip: 20,
                order: {
                    by: 'address',
                    type: "asc"
                },
            }).then(function (results2) {
                expect(results2.length).to.equal(results1.length - 20);
                results1.splice(0, 20)
                expect(results1).to.eql(results2);
                done();
            }).catch(done);
        }).catch(done);
    });

    it('order with skip & where', function (done) {
        con.select({
            from: "Customers",
            order: {
                by: 'address',
                type: "asc"
            },
            where: {
                customerId: {
                    '>': 10
                }
            },
        }).then(function (results1) {
            con.select({
                from: "Customers",
                skip: 20,
                where: {
                    customerId: {
                        '>': 10
                    }
                },
                order: {
                    by: 'address',
                    type: "asc"
                },
            }).then(function (results2) {
                expect(results2.length).to.equal(results1.length - 20);
                results1.splice(0, 20)
                expect(results1).to.eql(results2);
                done();
            }).catch(done);
        }).catch(done);
    });

    it('order with skip & where & limit', function (done) {
        con.select({
            from: "Customers",
            limit: 10,
            order: {
                by: 'address',
                type: "asc"
            },
            where: {
                customerId: {
                    '>': 10
                }
            },
        }).then(function (results1) {
            con.select({
                from: "Customers",
                skip: 20,
                limit: 10,
                where: {
                    customerId: {
                        '>': 10
                    }
                },
                order: {
                    by: 'address',
                    type: "asc"
                },
            }).then(function (results2) {
                expect(results1.length).to.eql(results2.length);
                done();
            }).catch(done);
        }).catch(done);
    });

    it('order with skip & where & regex', function (done) {
        con.select({
            from: "Customers",
            order: {
                by: 'address',
                type: "asc"
            },
            where: {
                country: {
                    regex: /mexico|brazil/i
                }
            },
        }).then(function (results1) {
            con.select({
                from: "Customers",
                skip: 5,
                where: {
                    country: {
                        regex: /mexico|brazil/i
                    }
                },
                order: {
                    by: 'address',
                    type: "asc"
                },
            }).then(function (results2) {
                expect(results2.length).to.equal(results1.length - 5);
                results1.splice(0, 5)
                expect(results1).to.eql(results2);
                done();
            }).catch(done);
        }).catch(done);
    });

    it('order with skip & where & in', function (done) {
        con.select({
            from: "Customers",
            order: {
                by: 'address',
                type: "asc"
            },
            where: {
                country: {
                    in: ['Mexico', 'Brazil']
                }
            },
        }).then(function (results1) {
            con.select({
                from: "Customers",
                skip: 5,
                where: {
                    country: {
                        in: ['Mexico', 'Brazil']
                    }
                },
                order: {
                    by: 'address',
                    type: "asc"
                },
            }).then(function (results2) {
                expect(results2.length).to.equal(results1.length - 5);
                results1.splice(0, 5)
                expect(results1).to.eql(results2);
                done();
            }).catch(done);
        }).catch(done);
    });

    it('order by with a column which doesnt have any type', function (done) {
        con.select({
            from: 'Suppliers',
            order: {
                by: "supplierName"
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(32);
            done();
        }).catch(function (err) {
            // var error = { "message": "Column 'undefined' in order query does not exist", "type": "column_not_exist" };
            // expect(err).to.be.an('object').eql(error);
            done(err);
        })
    })

    it('order by on aggregate column', function (done) {
        con.select({
            from: "Products",
            aggregate: {
                count: "price"
            },
            groupBy: 'price',
            limit: 10,
            order: {
                by: 'count(price)',
                idbSorting: false
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(10);
            const expectedCountPrice = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            results.forEach((item, index) => {
                expect(item['count(price)']).to.eql(expectedCountPrice[index]);
            })
            done();
        }).catch(done);
    })

    it('order by on aggregate column with sort type desc', function (done) {
        con.select({
            from: "Products",
            aggregate: {
                count: "price"
            },
            groupBy: 'price',
            limit: 10,
            order: {
                by: 'count(price)',
                idbSorting: false,
                type: 'desc'
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(10);
            const expectedCountPrice = [4, 4, 3, 2, 2, 2, 2, 2, 2, 2];
            results.forEach((item, index) => {
                expect(item['count(price)']).to.eql(expectedCountPrice[index]);
            })
            done();
        }).catch(done);
    })
});