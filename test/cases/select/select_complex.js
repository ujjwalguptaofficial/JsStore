describe('Test select complex case', function () {
    it('select with multiple or', function (done) {
        con.select({
            from: 'Customers',
            where: {
                country: 'Mexico',
                or: {
                    city: 'Madrid',
                    address: {
                        like: '%a%'
                    }
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(73);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with and "&" like', function (done) {
        con.select({
            from: 'Customers',
            where: {
                address: {
                    like: '%a%'
                },
                city: 'London'
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(4);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with and "&" not', function (done) {
        con.select({
            from: 'Customers',
            where: {
                country: {
                    '!=': 'Mexico'
                },
                city: 'London'
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(6);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with multiple and (wrong data)', function (done) {
        con.select({
            from: 'Customers',
            where: {
                address: 'hisrtgb',
                city: 'London'
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(0);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with or (wrong data)', function (done) {
        con.select({
            from: 'Customers',
            where: {
                address: 'hisrtgb',
                or: {
                    city: 'London'
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(6);
            done();
        }).catch(function (err) {
            done(err);
        })
    });


    it("sql qry - select * from customers where city='london' or address like 'a%' ", function (done) {
        con.select({
            from: 'Customers',
            where: {
                city: 'London',
                or: {
                    address: {
                        like: 'a%'
                    }
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(16);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it("sql qry - select * from customers where city='dsfgtbb' or address like 'a%' ", function (done) {
        con.select({
            from: 'Customers',
            where: {
                city: 'dsfgtbb',
                or: {
                    address: {
                        like: 'a%'
                    }
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(10);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it("sql qry - SELECT * FROM Customers WHERE country='Mexico' and (city='London' or address like '%a%')", function (done) {
        con.select({
            from: 'Customers',
            where: [{
                country: 'Mexico'
            },
            {
                city: 'London',
                or: {
                    address: {
                        like: '%a%'
                    }
                }
            }
            ]
        }).then(function (results) {
            if (results.length > 0) {
                var expected_id_list = [2, 3, 13, 58, 80];
                var id_list = [];
                results.forEach(function (element) {
                    id_list.push(element.customerId);
                });
                expect(id_list).to.be.an('array').length(5).deep.equal(expected_id_list);
                done();
            } else {
                done('no results');
            }
        }).catch(function (err) {
            done(err);
        })
    });

    it("sql qry - SELECT * FROM Customers WHERE country='Mexizfdfco' and (city='London' or address like '%a%')", function (done) {
        con.select({
            from: 'Customers',
            where: [{
                country: 'Mexizfdfco'
            },
            {
                city: 'London',
                or: {
                    address: {
                        like: '%a%'
                    }
                }
            }
            ]
        }).then(function (results) {
            expect(results).to.be.an('array').length(0);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it("sql qry - SELECT * FROM Customers WHERE country='Mexico' or (city='London' and address like '%a%')", function (done) {
        con.select({
            from: 'Customers',
            where: [{
                country: 'Mexico'
            },
            {
                or: {
                    city: 'London',
                    address: {
                        like: '%a%'
                    }
                }
            }
            ]
        }).then(function (results) {
            var expected_id_list = [2, 3, 4, 11, 13, 16, 58, 72, 80];
            var id_list = [];
            results.forEach(function (element) {
                id_list.push(element.customerId);
            });
            expect(id_list).to.be.an('array').length(9).deep.equal(expected_id_list);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it("sql qry - SELECT * FROM Customers WHERE country='Mexico' or (city='London' and address like '%adsfvbbbb%')", function (done) {
        con.select({
            from: 'Customers',
            where: [{
                country: 'Mexico'
            },
            {
                or: {
                    city: 'London',
                    address: {
                        like: '%adsfvbbbb%'
                    }
                }
            }
            ]
        }).then(function (results) {
            var expected_id_list = [2, 3, 13, 58, 80];
            var id_list = [];
            results.forEach(function (element) {
                id_list.push(element.customerId);
            });
            expect(id_list).to.be.an('array').length(5).deep.equal(expected_id_list);
            done();
        }).catch(function (err) {
            done(err);
        })
    });


    it("sql qry - SELECT * FROM Customers WHERE country='Mexico' and (city='London' or address like '%a%') and contactName like '%a%'", function (done) {
        con.select({
            from: 'Customers',
            where: [{
                country: 'Mexico'
            },
            {
                city: 'London',
                or: {
                    address: {
                        like: '%a%'
                    }
                }
            },
            {
                contactName: {
                    like: '%a%'
                }
            }
            ]
        }).then(function (results) {
            expect(results).to.be.an('array').length(4);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it("sql qry - SELECT * FROM Customers WHERE country='Mexico' and (city='London' or address like '%a%') or contactName like 'a%'", function (done) {
        con.select({
            from: 'Customers',
            where: [{
                country: 'Mexico'
            },
            {
                city: 'London',
                or: {
                    address: {
                        like: '%a%'
                    }
                }
            },
            {
                or: {
                    contactName: {
                        like: 'a%'
                    }
                }
            }
            ]
        }).then(function (results) {
            expect(results).to.be.an('array').length(13);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it("select * from employees where jobSuspendedFlag=0 && state in('Working', 'Diagnostics', 'FinalTest')", function (done) {
        con.select({
            from: 'Employees',
            where: {
                jobSuspendedFlag: 0,
                state: {
                    in: ['Working', 'Diagnostics', 'FinalTest']
                }
            }
        }).
            then(function (results) {
                expect(results).to.be.an('array').length(15);
                done();
            }).
            catch(function (err) {
                done(err);
            })
    });

    it("select with ignore case true where one column is in query of type number & other column is like", function (done) {
        con.select({
            from: "Categories",
            ignoreCase: true,
            where: {
                categoryId: {
                    in: [5, 6, 7]
                },
                categoryName: {
                    like: '%roduce%'
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(0);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it("select with ignore case true where column is in query of type number", function (done) {
        con.select({
            from: "Categories",
            ignoreCase: true,
            where: {
                categoryId: {
                    in: [5, 6, 7]
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(3);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

});