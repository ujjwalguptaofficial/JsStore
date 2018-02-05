describe('Test Select Api', function () {
    it('select all', function (done) {
        Con.select({
            From: 'Customers'
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
        Con.select({
            From: 'Customer'
        }).
        catch(function (err) {
            console.log(err);
            var error = {
                _type: "table_not_exist",
                _message: "Table 'Customer' does not exist"
            };
            expect(err).to.be.an('object').eql(error);
            done();
        })
    });

    it('select with skip', function (done) {
        Con.select({
            From: 'Customers',
            Skip: 10,
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(83);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('EnableSearch column test', function (done) {
        Con.select({
            From: 'Customers',
            Where: {
                Email: 'uk@gmail.com'
            }
        }).
        catch(function (err) {
            console.log(err);
            var error = {
                "_message": "Search is turned off for the Column 'Email'",
                "_type": "enable_search_off"
            };
            expect(err).to.be.an('object').eql(error);
            done();
        })
    });



    it('select with where', function (done) {
        Con.select({
            From: 'Customers',
            Where: {
                Country: 'Mexico'
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(5);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select without ignore case', function (done) {
        Con.select({
            From: 'Customers',
            Where: {
                Country: 'mexico'
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

    it('select with ignore case', function (done) {
        Con.select({
            From: 'Customers',
            IgnoreCase: true,
            Where: {
                Country: 'meXico'
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(5);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with distinct', function (done) {
        Con.select({
            From: 'Customers',
            Distinct: true,
            IgnoreCase: true,
            Where: {
                City: 'bhubaneswar'
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(1);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with or', function (done) {
        Con.select({
            From: 'Customers',
            Where: {
                Country: 'Mexico',
                Or: {
                    City: 'Madrid'
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(8);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with in', function (done) {
        Con.select({
            From: 'Customers',
            Where: {
                Country: {
                    In: ['Germany', 'France', 'UK']
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(29);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with operator - >', function (done) {
        Con.select({
            From: 'Products',
            Where: {
                Price: {
                    ">": 20
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(37);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with operator - >=', function (done) {
        Con.select({
            From: 'Products',
            Where: {
                Price: {
                    ">=": 20
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(38);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with operator - <', function (done) {
        Con.select({
            From: 'Products',
            Where: {
                Price: {
                    "<": 20
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(39);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with operator - <=', function (done) {
        Con.select({
            From: 'Products',
            Where: {
                Price: {
                    "<=": 20
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(40);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with operator - between', function (done) {
        Con.select({
            From: 'Products',
            Where: {
                Price: {
                    "-": {
                        Low: 10,
                        High: 20
                    }
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(29);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with like -"%or%"', function (done) {
        Con.select({
            From: 'Customers',
            Where: {
                CustomerName: {
                    Like: '%or%'
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(11);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with like - "o%"', function (done) {
        Con.select({
            From: 'Customers',
            Where: {
                CustomerName: {
                    Like: 'o%'
                }
            },
            OnSuccess: function (results) {
                var expected_id_list = [54, 55, 56];
                var id_list = [];
                results.forEach(element => {
                    id_list.push(element.CustomerID);
                });
                expect(id_list).to.be.an('array').length(3).deep.equal(expected_id_list);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with like - "%o"', function (done) {
        Con.select({
            From: 'Customers',
            Where: {
                CustomerName: {
                    Like: '%o'
                }
            },
            OnSuccess: function (results) {
                var expected_id_list = [15, 21, 29, 46, 69, 73];
                var id_list = [];
                results.forEach(element => {
                    id_list.push(element.CustomerID);
                });
                expect(id_list).to.be.an('array').length(6).deep.equal(expected_id_list);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with GroupBy', function (done) {
        Con.select({
            From: 'Customers',
            GroupBy: "Country",
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(22);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with order by', function (done) {
        Con.select({
            From: 'Customers',
            Order: {
                By: 'Country',
                Type: "desc"
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(93)
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('select with order by,limit 5, deep eql', function (done) {
        Con.select({
            From: 'Customers',
            Order: {
                By: 'Country',
                Type: "desc"
            },
            Limit: 5,
            OnSuccess: function (results) {
                var datas = [{
                    "CustomerID": 47,
                    "CustomerName": "LINO-Delicateses",
                    "ContactName": "Felipe Izquierdo",
                    "Address": "Ave. 5 de Mayo Porlamar",
                    "City": "I. de Margarita",
                    "PostalCode": "4980",
                    "Country": "Venezuela"
                }, {
                    "CustomerID": 46,
                    "CustomerName": "LILA-Supermercado",
                    "ContactName": "Carlos González",
                    "Address": "Carrera 52 con Ave. Bolívar #65-98 Llano Largo",
                    "City": "Barquisimeto",
                    "PostalCode": "3508",
                    "Country": "Venezuela"
                }, {
                    "CustomerID": 35,
                    "CustomerName": "HILARIÓN-Abastos",
                    "ContactName": "Carlos Hernández",
                    "Address": "Carrera 22 con Ave. Carlos Soublette #8-35",
                    "City": "San Cristóbal",
                    "PostalCode": "5022",
                    "Country": "Venezuela"
                }, {
                    "CustomerID": 33,
                    "CustomerName": "GROSELLA-Restaurante",
                    "ContactName": "Manuel Pereira",
                    "Address": "5ª Ave. Los Palos Grandes",
                    "City": "Caracas",
                    "PostalCode": "1081",
                    "Country": "Venezuela"
                }, {
                    "CustomerID": 89,
                    "CustomerName": "White Clover Markets",
                    "ContactName": "Karl Jablonski",
                    "Address": "305 - 14th Ave. S. Suite 3B",
                    "City": "Seattle",
                    "PostalCode": "98128",
                    "Country": "USA"
                }];
                expect(results).to.be.an('array').length(5).deep.equal(datas);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });
});