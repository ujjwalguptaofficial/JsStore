describe('Test Select Api', function () {
    it('select all', function (done) {
        con.select({
            from: 'Customers'
        }).
            then(function (results) {
                expect(results).to.be.an('array').length(93);
                done();
            }).
            catch(function (err) {
                done(err);
            })
    });

    it('wrong table test', function (done) {
        con.select({
            from: 'Customer'
        }).
            catch(function (err) {
                console.log(err);
                var error = {
                    type: "table_not_exist",
                    message: "Table 'Customer' does not exist"
                };
                expect(err).to.be.an('object').eql(error);
                done();
            })
    });

    it('select with skip', function (done) {
        con.select({
            from: 'Customers',
            skip: 10
        }).
            then(function (results) {
                expect(results).to.be.an('array').length(83);
                done();
            }).
            catch(function (err) {
                done(err);
            })
    });

    it('undefined column test', function (done) {
        con.select({
            from: 'Customers',
            where: {
                emailId: 'uk@gmail.com'
            }
        }).catch(function (err) {
            var error = {
                message: "Column 'emailId' does not exist",
                type: "column_not_exist"
            };
            expect(err).to.be.an('object').eql(error);
            done();
        })
    });

    it('enable search column test', function (done) {
        con.select({
            from: 'Categories',
            where: {
                invalidColumn: 'invalidColumn'
            }
        }).catch(function (err) {
            var error = {
                message: "Search is turned off for the Column 'invalidColumn'",
                type: "enable_search_off"
            };
            expect(err).to.be.an('object').eql(error);
            done();
        })
    });

    it('select with where', function (done) {
        con.select({
            from: 'Customers',
            where: {
                country: 'Mexico'
            }
        }).
            then(function (results) {
                expect(results).to.be.an('array').length(5);
                done();
            }).
            catch(function (err) {
                done(err);
            })
    });

    it('select without ignore case', function (done) {
        con.select({
            from: 'Customers',
            where: {
                country: 'mexico'
            }
        }).
            then(function (results) {
                expect(results).to.be.an('array').length(0);
                done();
            }).
            catch(function (err) {
                done(err);
            })
    });

    it('select with ignore case', function (done) {
        con.select({
            from: 'Customers',
            ignoreCase: true,
            where: {
                country: 'meXico'
            }
        }).
            then(function (results) {
                expect(results).to.be.an('array').length(5);
                done();
            }).
            catch(function (err) {
                done(err);
            })
    });

    it('select with ignore case with a number type', function (done) {
        con.select({
            from: 'Customers',
            ignoreCase: true,
            where: {
                country: 'meXico',
                customerId: 3
            }
        }).
            then(function (results) {
                expect(results).to.be.an('array').length(1);
                done();
            }).
            catch(function (err) {
                done(err);
            })
    });

    it('select with ignore case with a number type and object value', function (done) {
        con.select({
            from: 'Customers',
            ignoreCase: true,
            where: {
                country: 'meXico',
                customerId: {
                    '!=': 3
                }
            }
        }).
            then(function (results) {
                expect(results).to.be.an('array').length(4);
                done();
            }).
            catch(function (err) {
                done(err);
            })
    });

    it('select with distinct', function (done) {
        con.select({
            from: 'Customers',
            distinct: true,
            ignoreCase: true,
            where: {
                city: 'bhubaneswar'
            }
        }).
            then(function (results) {
                // console.log(results);
                expect(results).to.be.an('array').length(1);
                done();
            }).
            catch(function (err) {
                done(err);
            })
    });

    it('select with or', function (done) {
        con.select({
            from: 'Customers',
            where: {
                country: 'Mexico',
                or: {
                    city: 'Madrid'
                }
            }
        }).
            then(function (results) {
                expect(results).to.be.an('array').length(8);
                done();
            }).
            catch(function (err) {
                done(err);
            })
    });

    it('select with in', function (done) {
        con.select({
            from: 'Customers',
            where: {
                country: {
                    in: ['Germany', 'France', 'UK']
                }
            }
        }).
            then(function (results) {
                expect(results).to.be.an('array').length(29);
                done();
            }).
            catch(function (err) {
                done(err);
            })
    });

    it('select with like -"%or%"', function (done) {
        con.select({
            from: 'Customers',
            where: {
                customerName: {
                    like: '%or%'
                }
            }
        }).
            then(function (results) {
                expect(results).to.be.an('array').length(11);
                done();
            }).
            catch(function (err) {
                done(err);
            })
    });

    it('select with like - "o%"', function (done) {
        con.select({
            from: 'Customers',
            where: {
                customerName: {
                    like: 'o%'
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(3)
            var expected_id_list = [54, 55, 56];
            var id_list = [];
            results.forEach(function (element) {
                id_list.push(element.customerId);
            });
            expect(id_list).to.be.an('array').length(3).deep.equal(expected_id_list);
            done();

        }).catch(function (err) {
            done(err);
        });
    });

    it('select with like - "%o"', function (done) {
        con.select({
            from: 'Customers',
            where: {
                customerName: {
                    like: '%o'
                }
            }
        }).then(function (results) {
            var expected_id_list = [15, 21, 29, 46, 69, 73];
            var id_list = [];
            results.forEach(function (element) {
                id_list.push(element.customerId);
            });
            expect(id_list).to.be.an('array').length(6).deep.equal(expected_id_list);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('select with GroupBy', function (done) {
        con.select({
            from: 'Customers',
            groupBy: "country"
        }).then(function (results) {
            expect(results).to.be.an('array').length(22);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with order by', function (done) {
        con.select({
            from: 'Customers',
            order: {
                by: 'country',
                type: "desc"
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(93);
            expect(results[0].country).equal("Venezuela");
            expect(results[results.length - 1].country).equal("Argentina");
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with order by,limit 5, deep eql', function (done) {
        con.select({
            from: 'Customers',
            order: {
                by: 'country',
                type: "desc"
            },
            limit: 5
        }).
            then(function (results) {
                var datas = [{
                    "customerId": 47,
                    "customerName": "LINO-Delicateses",
                    "contactName": "Felipe Izquierdo",
                    "address": "Ave. 5 de Mayo Porlamar",
                    "city": "I. de Margarita",
                    "postalCode": "4980",
                    "country": "Venezuela"
                }, {
                    "customerId": 46,
                    "customerName": "LILA-Supermercado",
                    "contactName": "Carlos González",
                    "address": "Carrera 52 con Ave. Bolívar #65-98 Llano Largo",
                    "city": "Barquisimeto",
                    "postalCode": "3508",
                    "country": "Venezuela"
                }, {
                    "customerId": 35,
                    "customerName": "HILARIÓN-Abastos",
                    "contactName": "Carlos Hernández",
                    "address": "Carrera 22 con Ave. Carlos Soublette #8-35",
                    "city": "San Cristóbal",
                    "postalCode": "5022",
                    "country": "Venezuela"
                }, {
                    "customerId": 33,
                    "customerName": "GROSELLA-Restaurante",
                    "contactName": "Manuel Pereira",
                    "address": "5ª Ave. Los Palos Grandes",
                    "city": "Caracas",
                    "postalCode": "1081",
                    "country": "Venezuela"
                }, {
                    "customerId": 89,
                    "customerName": "White Clover Markets",
                    "contactName": "Karl Jablonski",
                    "address": "305 - 14th Ave. S. Suite 3B",
                    "city": "Seattle",
                    "postalCode": "98128",
                    "country": "USA"
                }];
                expect(results).to.be.an('array').length(5).deep.equal(datas);
                done();
            }).
            catch(function (err) {
                done(err);
            })
    });

    it('select * from suppliers where postalCode like - "43951%"', function (done) {
        con.select({
            from: 'Suppliers',
            where: {
                postalCode: {
                    like: '43951%'
                }
            }
        }).
            then(function (results) {
                if (results.length > 0) {
                    expect(results).to.be.an('array').length(3);
                    done();
                } else {
                    done('no results');
                }
            }).
            catch(function (err) {
                done(err);
            });
    });

    it('select with where & key null', function (done) {
        con.select({
            from: 'Customers',
            where: {
                country: null
            }
        }).
            catch(function (err) {
                var error = {
                    "message": "Null/undefined is not allowed in where. Column 'country' has null",
                    "type": "null_value_in_where"
                };
                expect(err).to.be.an('object').eql(error);
                done();
            })
    });

    it('select with where & limit', function (done) {
        con.select({
            from: 'Customers',
            where: {
                country: 'Germany',
                city: {
                    like: '%n%'
                }
            },
            limit: 10
        }).then(function (results) {
            expect(results).to.be.an('array').length(9);
            done();
        }).catch(done);
    });
});