describe('Test update Api', function () {

    it('update with where - using promise', function (done) {
        con.update({
            in: "Customers",
            set: {
                contactName: 'Ujjwal',
                city: 'Bhubaneswar'
            },
            where: {
                customerId: 1
            }
        }).
            then(function (results) {
                expect(results).to.be.an('number').to.equal(1);
                done();
            }).
            catch(function (err) {
                done(err);
            })
    });

    it('update with where - invalid column in where', function (done) {
        con.update({
            in: "Customers",
            set: {
                contactName: 'Ujjwal',
                city: 'Bhubaneswar'
            },
            where: {
                CustomerId: 1
            }
        }).catch(function (err) {
            var error = {
                message: "Column 'CustomerId' does not exist",
                type: "column_not_exist"
            };
            expect(err).to.be.an('object').eql(error);
            done();
        })
    });

    it('wrong table test', function (done) {
        con.update({
            in: "Customerss",
            set: {
                contactName: 'Ujjwal',
                city: 'Bhubaneswar'
            },
            where: {
                customerId: 1
            }
        }).
            then(function (results) {
                done(results);
            }).catch(function (err) {
                var error = {
                    "message": "Table 'Customerss' does not exist",
                    "type": "table_not_exist"
                };
                expect(err).to.be.an('object').eql(error);
                done();
            })
    });

    it('update without set option', function (done) {
        con.update({
            in: "Customerss",
            where: {
                customerId: 1
            }
        }).
            catch(function (err) {
                var error = {
                    "message": "supplied value is not object",
                    "type": "not_object"
                };
                expect(err).to.be.an('object').eql(error);
                done();
            })
    });

    it('update with invalid set data', function (done) {
        con.update({
            in: "Customers",
            where: {
                customerId: 1
            },
            set: 'sss'
        }).
            catch(function (err) {
                var error = {
                    "message": "supplied value is not object",
                    "type": "not_object"
                };
                expect(err).to.be.an('object').eql(error);
                done();
            })
    });

    it('update with like -"%or%', function (done) {
        con.update({
            in: 'Customers',
            where: {
                customerName: {
                    like: '%or%'
                }
            },
            set: {
                country: 'india'
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(11);
            done();
        }).
            catch(function (err) {
                done(err);
            })
    });

    it('update with like -"o%', function (done) {
        con.update({
            in: 'Customers',
            where: {
                customerName: {
                    like: 'o%'
                }
            },
            set: {
                country: 'india'
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(3);
            done();
        }).
            catch(function (err) {
                done(err);
            })
    });

    it('update with like -"%o', function (done) {
        con.update({
            in: 'Customers',
            where: {
                customerName: {
                    like: '%o'
                }
            },
            set: {
                country: 'india'
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(6);
            done();
        }).
            catch(function (err) {
                done(err);
            })
    });

    it('update with like', function (done) {
        con.update({
            in: 'Customers',
            where: {
                customerName: {
                    like: '%or%'
                }
            },
            set: {
                country: 'india'
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(11);
            done();
        }).
            catch(function (err) {
                done(err);
            })
    });

    it('update without ignore case', function (done) {
        con.update({
            in: "Customers",
            set: {
                contactName: 'Ujjwal',
                city: 'bhubaneswar'
            },
            where: {
                city: 'BhUbaneSwar'
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(0);
            done();
        }).
            catch(function (err) {
                done(err);
            })
    });

    it('update with ignore case', function (done) {
        var count;
        con.count({
            from: 'Customers',
            ignoreCase: true,
            set: {
                contactName: 'Ujjwal',
                city: 'bhubaneswar'
            },
            where: {
                city: 'bHuBaneSwar'
            }
        }).then(function (results) {
            count = results;
        }).
            catch(function (err) {
                done(err);
            });

        con.update({
            in: "Customers",
            ignoreCase: true,
            set: {
                contactName: 'Ujjwal',
                city: 'bhubaneswar'
            },
            where: {
                city: 'bHuBaneSwar'
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(count);
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
        }).then(function (results) {
            expect(results).to.be.an('array').length(6);
            done();
        }).
            catch(function (err) {
                done(err);
            })
    });

    it('update with or', function (done) {
        con.update({
            in: 'Customers',
            where: {
                country: 'Mexico',
                or: {
                    city: 'Madrid'
                }
            },
            set: {
                city: 'madrid'
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(6);
            done();
        }).
            catch(function (err) {
                done(err);
            })
    });

    it('update with in', function (done) {
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
        }).
            catch(function (err) {
                done(err);
            })
        con.update({
            in: 'Customers',
            where: {
                country: {
                    in: ['Germany', 'France', 'UK']
                }
            },
            set: {
                contactName: 'Ujjwal',
                city: 'bhubaneswar'
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(Count);
            done();
        }).
            catch(function (err) {
                done(err);
            })
    });

    it('update with operator - != (for string)', function (done) {
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
        }).
            catch(function (err) {
                done(err);
            });

        con.update({
            in: 'Customers',
            where: {
                country: {
                    '!=': 'Mexico'
                }
            },
            set: {
                contactName: 'Ujjwsal',
                city: 'bhubaneswsar'
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(count);
            done();
        }).
            catch(function (err) {
                done(err);
            });
    });

    it('update with operator - != (for number)', function (done) {
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
        }).
            catch(function (err) {
                done(err);
            })

        con.update({
            in: 'Products',
            where: {
                price: {
                    '!=': 20
                }
            },
            set: {
                contactName: 'Ujjwal',
                city: 'bhubaneswar'
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(count);
            done();
        }).
            catch(function (err) {
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
        }).
            catch(function (err) {
                done(err);
            })
    });

    it('update with operator - >', function (done) {
        con.update({
            in: 'Products',
            where: {
                price: {
                    ">": 20
                }
            },
            set: {
                productName: 'Cofee'
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(37);
            done();
        }).
            catch(function (err) {
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
        }).
            catch(function (err) {
                done(err);
            })
    });

    it('update with operator - >=', function (done) {
        con.update({
            in: 'Products',
            where: {
                price: {
                    ">=": 20
                }
            },
            set: {
                productName: 'Whisky'
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(38);
            done();
        }).
            catch(function (err) {
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
        }).
            catch(function (err) {
                done(err);
            })
    });

    it('update with operator - <', function (done) {
        con.update({
            in: 'Products',
            where: {
                price: {
                    "<": 20
                }
            },
            set: {
                productName: 'Tea'
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(39);
            done();
        }).
            catch(function (err) {
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
        }).
            catch(function (err) {
                done(err);
            })
    });

    it('update with operator - <=', function (done) {
        con.update({
            in: 'Products',
            where: {
                price: {
                    "<=": 20
                }
            },
            set: {
                productName: 'Candy'
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(40);
            done();
        }).
            catch(function (err) {
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
        }).
            catch(function (err) {
                done(err);
            })
    });

    it('update with operator - between', function (done) {
        con.update({
            in: 'Products',
            where: {
                price: {
                    "-": {
                        low: 10,
                        high: 20
                    }
                }
            },
            set: {
                productName: 'Chocolate'
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(29);
            done();
        }).
            catch(function (err) {
                done(err);
            })
    });

    it('update with where & key null in where', function (done) {
        con.update({
            in: "Customers",
            set: {
                contactName: 'Ujjwal',
                city: 'Bhubaneswar'
            },
            where: {
                customerId: null
            }
        }).

            catch(function (err) {
                var error = {
                    "message": "Null/undefined is not allowed in where. Column 'customerId' has null",
                    "type": "null_value_in_where"
                };
                expect(err).to.be.an('object').eql(error);
                done();
            })
    });

    it('update primary key column value', function (done) {
        con.update({
            in: "Customers",
            set: {
                contactName: 'Ujjwal',
                city: 'Bhubaneswar',
                customerId: 1
            }
        }).
            catch(function (err) {
                expect(err.type).to.equal('DataError');
                expect(err.message).to.be.an('string');
                done();
            })
    });

    it('update primary key column value with where', function (done) {
        con.update({
            in: "Customers",
            set: {
                contactName: 'Ujjwal',
                city: 'Bhubaneswar',
                customerId: 1
            },
            where: {
                customerId: 5
            }
        }).then(function (res) {
            done(res);
        }).catch(function (err) {
            expect(err.type).to.equal('DataError');
            expect(err.message).to.be.an('string');
            done();
        });
    });

    it('update primary key column value with where and regex', function (done) {
        con.update({
            in: 'Customers',
            where: {
                country: {
                    regex: /mexico|brazil/i
                }
            },
            set: {
                contactName: 'Ujjwal',
                city: 'Bhubaneswar',
                customerId: 1
            }
        }).catch(function (err) {
            expect(err.type).to.equal('DataError');
            expect(err.message).to.be.an('string');
            done();
        })
    });
});