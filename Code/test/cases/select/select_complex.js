describe('Test select complex case', function () {
    it('select with multiple or', function (done) {
        Con.select({
            From: 'Customers',
            Where: {
                Country: 'Mexico',
                Or: {
                    City: 'Madrid',
                    Address: {
                        Like: '%a%'
                    }
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(73);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with and "&" like', function (done) {
        Con.select({
            From: 'Customers',
            Where: {
                Address: {
                    Like: '%a%'
                },
                City: 'London'
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(4);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with and "&" not', function (done) {
        Con.select({
            From: 'Customers',
            Where: {
                Country: {
                    '!=': 'Mexico'
                },
                City: 'London'
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(6);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with multiple and (wrong data)', function (done) {
        Con.select({
            From: 'Customers',
            Where: {
                Address: 'hisrtgb',
                City: 'London'
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(0);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with or (wrong data)', function (done) {
        Con.select({
            From: 'Customers',
            Where: {
                Address: 'hisrtgb',
                Or: {
                    City: 'London'
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(6);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });


    it("sql qry - select * from customers where city='london' or address like 'a%' ", function (done) {
        Con.select({
            From: 'Customers',
            Where: {
                City: 'London',
                Or: {
                    Address: {
                        Like: 'a%'
                    }
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(16);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it("sql qry - select * from customers where city='dsfgtbb' or address like 'a%' ", function (done) {
        Con.select({
            From: 'Customers',
            Where: {
                City: 'dsfgtbb',
                Or: {
                    Address: {
                        Like: 'a%'
                    }
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(10);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it("sql qry - SELECT * FROM Customers WHERE Country='Mexico' and (City='London' or Address Like '%a%')", function (done) {
        Con.select({
            From: 'Customers',
            Where: [{
                    Country: 'Mexico'
                },
                {
                    City: 'London',
                    Or: {
                        Address: {
                            Like: '%a%'
                        }
                    }
                }
            ],
            OnSuccess: function (results) {
                var expected_id_list = [2, 3, 13, 58, 80];
                var id_list = [];
                results.forEach(element => {
                    id_list.push(element.CustomerID);
                });
                expect(id_list).to.be.an('array').length(5).deep.equal(expected_id_list);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        });
    });

    it("sql qry - SELECT * FROM Customers WHERE Country='Mexizfdfco' and (City='London' or Address Like '%a%')", function (done) {
        Con.select({
            From: 'Customers',
            Where: [{
                    Country: 'Mexizfdfco'
                },
                {
                    City: 'London',
                    Or: {
                        Address: {
                            Like: '%a%'
                        }
                    }
                }
            ],
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(0);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        });
    });

    it("sql qry - SELECT * FROM Customers WHERE Country='Mexico' or (City='London' and Address Like '%a%')", function (done) {
        Con.select({
            From: 'Customers',
            Where: [{
                    Country: 'Mexico'
                },
                {
                    Or: {
                        City: 'London',
                        Address: {
                            Like: '%a%'
                        }
                    }
                }
            ],
            OnSuccess: function (results) {
                var expected_id_list = [2, 3, 4, 11, 13, 16, 58, 72, 80];
                var id_list = [];
                results.forEach(element => {
                    id_list.push(element.CustomerID);
                });
                expect(id_list).to.be.an('array').length(9).deep.equal(expected_id_list);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        });
    });

    it("sql qry - SELECT * FROM Customers WHERE Country='Mexico' or (City='London' and Address Like '%adsfvbbbb%')", function (done) {
        Con.select({
            From: 'Customers',
            Where: [{
                    Country: 'Mexico'
                },
                {
                    Or: {
                        City: 'London',
                        Address: {
                            Like: '%adsfvbbbb%'
                        }
                    }
                }
            ],
            OnSuccess: function (results) {
                var expected_id_list = [2, 3, 13, 58, 80];
                var id_list = [];
                results.forEach(element => {
                    id_list.push(element.CustomerID);
                });
                expect(id_list).to.be.an('array').length(5).deep.equal(expected_id_list);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        });
    });


    it("sql qry - SELECT * FROM Customers WHERE Country='Mexico' and (City='London' or Address Like '%a%') and ContactName Like '%a%'", function (done) {
        Con.select({
            From: 'Customers',
            Where: [{
                    Country: 'Mexico'
                },
                {
                    City: 'London',
                    Or: {
                        Address: {
                            Like: '%a%'
                        }
                    }
                },
                {
                    ContactName: {
                        Like: '%a%'
                    }
                }
            ],
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(4);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        });
    });

    it("sql qry - SELECT * FROM Customers WHERE Country='Mexico' and (City='London' or Address Like '%a%') or ContactName Like 'a%'", function (done) {
        Con.select({
            From: 'Customers',
            Where: [{
                    Country: 'Mexico'
                },
                {
                    City: 'London',
                    Or: {
                        Address: {
                            Like: '%a%'
                        }
                    }
                },
                {
                    Or: {
                        ContactName: {
                            Like: 'a%'
                        }
                    }
                }
            ],
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(13);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        });
    });
});