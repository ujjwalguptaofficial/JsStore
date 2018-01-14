describe('Test update Api', function () {

    it('update with where - using promise', function (done) {
        Con.update({
            In: "Customers",
            Set: {
                ContactName: 'Ujjwal',
                City: 'Bhubaneswar'
            },
            Where: {
                CustomerID: 1
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

    it('wrong table test', function (done) {
        Con.update({
            In: "Customerss",
            Set: {
                ContactName: 'Ujjwal',
                City: 'Bhubaneswar'
            },
            Where: {
                CustomerID: 1
            }
        }).
        catch(function (err) {
            var error = {
                "_message": "Table 'Customerss' does not exist",
                "_type": "table_not_exist"
            };
            expect(err).to.be.an('object').eql(error);
            done();
        })
    });

    it('update without Set option', function (done) {
        Con.update({
            In: "Customerss",
            Where: {
                CustomerID: 1
            }
        }).
        catch(function (err) {
            var error = {
                "_message": "supplied value is not object",
                "_type": "not_object"
            };
            expect(err).to.be.an('object').eql(error);
            done();
        })
    });

    it('update with invalid Set data', function (done) {
        Con.update({
            In: "Customers",
            Where: {
                CustomerID: 1
            },
            Set: 'sss'
        }).
        catch(function (err) {
            var error = {
                "_message": "supplied value is not object",
                "_type": "not_object"
            };
            expect(err).to.be.an('object').eql(error);
            done();
        })
    });

    it('update with like -"%or%', function (done) {
        Con.update({
            In: 'Customers',
            Where: {
                CustomerName: {
                    Like: '%or%'
                }
            },
            Set: {
                Country: 'india'
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(11);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('update with like -"o%', function (done) {
        Con.update({
            In: 'Customers',
            Where: {
                CustomerName: {
                    Like: 'o%'
                }
            },
            Set: {
                Country: 'india'
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(3);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('update with like -"%o', function (done) {
        Con.update({
            In: 'Customers',
            Where: {
                CustomerName: {
                    Like: '%o'
                }
            },
            Set: {
                Country: 'india'
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(6);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('update with like', function (done) {
        Con.update({
            In: 'Customers',
            Where: {
                CustomerName: {
                    Like: '%or%'
                }
            },
            Set: {
                Country: 'india'
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(11);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('update without ignore case', function (done) {
        Con.update({
            In: "Customers",
            Set: {
                ContactName: 'Ujjwal',
                City: 'bhubaneswar'
            },
            Where: {
                City: 'BhUbaneSwar'
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(0);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('update with ignore case', function (done) {
        Con.update({
            In: "Customers",
            IgnoreCase: true,
            Set: {
                ContactName: 'Ujjwal',
                City: 'bhubaneswar'
            },
            Where: {
                City: 'bHuBaneSwar'
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(3);
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
                expect(results).to.be.an('array').length(6);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('update with or', function (done) {
        Con.update({
            In: 'Customers',
            Where: {
                Country: 'Mexico',
                Or: {
                    City: 'Madrid'
                }
            },
            Set: {
                City: 'madrid'
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(6);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('update with in', function (done) {
        var Count;
        Con.select({
            From: 'Customers',
            Where: {
                Country: {
                    In: ['Germany', 'France', 'UK']
                }
            },
            OnSuccess: function (results) {
                Count = results.length;
            },
            OnError: function (err) {
                done(err);
            }
        })
        Con.update({
            In: 'Customers',
            Where: {
                Country: {
                    In: ['Germany', 'France', 'UK']
                }
            },
            Set: {
                ContactName: 'Ujjwal',
                City: 'bhubaneswar'
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(Count);
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

    it('update with operator - >', function (done) {
        Con.update({
            In: 'Products',
            Where: {
                Price: {
                    ">": 20
                }
            },
            Set: {
                ProductName: 'Cofee'
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(37);
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

    it('update with operator - >=', function (done) {
        Con.update({
            In: 'Products',
            Where: {
                Price: {
                    ">=": 20
                }
            },
            Set: {
                ProductName: 'Whisky'
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(38);
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

    it('update with operator - <', function (done) {
        Con.update({
            In: 'Products',
            Where: {
                Price: {
                    "<": 20
                }
            },
            Set: {
                ProductName: 'Tea'
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(39);
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

    it('update with operator - <=', function (done) {
        Con.update({
            In: 'Products',
            Where: {
                Price: {
                    "<=": 20
                }
            },
            Set: {
                ProductName: 'Candy'
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(40);
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

    it('update with operator - between', function (done) {
        Con.update({
            In: 'Products',
            Where: {
                Price: {
                    "-": {
                        Low: 10,
                        High: 20
                    }
                }
            },
            Set: {
                ProductName: 'Chocolate'
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(29);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });


});