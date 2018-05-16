describe('Test select complex case', function () {
    it('select with multiple or', function (done) {
        Con.select({
            from: 'Customers',
            where: {
                Country: 'Mexico',
                or: {
                    City: 'Madrid',
                    Address: {
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
        Con.select({
            from: 'Customers',
            where: {
                Address: {
                    like: '%a%'
                },
                City: 'London'
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(4);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with and "&" not', function (done) {
        Con.select({
            from: 'Customers',
            where: {
                Country: {
                    '!=': 'Mexico'
                },
                City: 'London'
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(6);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with multiple and (wrong data)', function (done) {
        Con.select({
            from: 'Customers',
            where: {
                Address: 'hisrtgb',
                City: 'London'
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(0);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with or (wrong data)', function (done) {
        Con.select({
            from: 'Customers',
            where: {
                Address: 'hisrtgb',
                or: {
                    City: 'London'
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
        Con.select({
            from: 'Customers',
            where: {
                City: 'London',
                or: {
                    Address: {
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
        Con.select({
            from: 'Customers',
            where: {
                City: 'dsfgtbb',
                or: {
                    Address: {
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

    it("sql qry - SELECT * FROM Customers WHERE Country='Mexico' and (City='London' or Address like '%a%')", function (done) {
        Con.select({
            from: 'Customers',
            where: [{
                    Country: 'Mexico'
                },
                {
                    City: 'London',
                    or: {
                        Address: {
                            like: '%a%'
                        }
                    }
                }
            ]
        }).then(function (results) {
            var expected_id_list = [2, 3, 13, 58, 80];
            var id_list = [];
            results.forEach(element => {
                id_list.push(element.CustomerID);
            });
            expect(id_list).to.be.an('array').length(5).deep.equal(expected_id_list);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it("sql qry - SELECT * FROM Customers WHERE Country='Mexizfdfco' and (City='London' or Address like '%a%')", function (done) {
        Con.select({
            from: 'Customers',
            where: [{
                    Country: 'Mexizfdfco'
                },
                {
                    City: 'London',
                    or: {
                        Address: {
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

    it("sql qry - SELECT * FROM Customers WHERE Country='Mexico' or (City='London' and Address like '%a%')", function (done) {
        Con.select({
            from: 'Customers',
            where: [{
                    Country: 'Mexico'
                },
                {
                    or: {
                        City: 'London',
                        Address: {
                            like: '%a%'
                        }
                    }
                }
            ]
        }).then(function (results) {
            var expected_id_list = [2, 3, 4, 11, 13, 16, 58, 72, 80];
            var id_list = [];
            results.forEach(element => {
                id_list.push(element.CustomerID);
            });
            expect(id_list).to.be.an('array').length(9).deep.equal(expected_id_list);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it("sql qry - SELECT * FROM Customers WHERE Country='Mexico' or (City='London' and Address like '%adsfvbbbb%')", function (done) {
        Con.select({
            from: 'Customers',
            where: [{
                    Country: 'Mexico'
                },
                {
                    or: {
                        City: 'London',
                        Address: {
                            like: '%adsfvbbbb%'
                        }
                    }
                }
            ]
        }).then(function (results) {
            var expected_id_list = [2, 3, 13, 58, 80];
            var id_list = [];
            results.forEach(element => {
                id_list.push(element.CustomerID);
            });
            expect(id_list).to.be.an('array').length(5).deep.equal(expected_id_list);
            done();
        }).catch(function (err) {
            done(err);
        })
    });


    it("sql qry - SELECT * FROM Customers WHERE Country='Mexico' and (City='London' or Address like '%a%') and ContactName like '%a%'", function (done) {
        Con.select({
            from: 'Customers',
            where: [{
                    Country: 'Mexico'
                },
                {
                    City: 'London',
                    or: {
                        Address: {
                            like: '%a%'
                        }
                    }
                },
                {
                    ContactName: {
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

    it("sql qry - SELECT * FROM Customers WHERE Country='Mexico' and (City='London' or Address like '%a%') or ContactName like 'a%'", function (done) {
        Con.select({
            from: 'Customers',
            where: [{
                    Country: 'Mexico'
                },
                {
                    City: 'London',
                    or: {
                        Address: {
                            like: '%a%'
                        }
                    }
                },
                {
                    or: {
                        ContactName: {
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
        Con.select({
            from: 'Employees',
            where: {
                jobSuspendedFlag: 0,
                state: { in: ['Working', 'Diagnostics', 'FinalTest']
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
});