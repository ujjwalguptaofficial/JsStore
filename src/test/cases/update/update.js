describe('Test update Api', function () {

    it('update with where - using promise', function (done) {
        Con.update({ in: "Customers",
            set: {
                ContactName: 'Ujjwal',
                City: 'Bhubaneswar'
            },
            where: {
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
        Con.update({ in: "Customerss",
            set: {
                ContactName: 'Ujjwal',
                City: 'Bhubaneswar'
            },
            where: {
                CustomerID: 1
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
        Con.update({ in: "Customerss",
            where: {
                CustomerID: 1
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
        Con.update({ in: "Customers",
            where: {
                CustomerID: 1
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
        Con.update({ in: 'Customers',
            where: {
                CustomerName: {
                    like: '%or%'
                }
            },
            set: {
                Country: 'india'
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
        Con.update({ in: 'Customers',
            where: {
                CustomerName: {
                    like: 'o%'
                }
            },
            set: {
                Country: 'india'
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
        Con.update({ in: 'Customers',
            where: {
                CustomerName: {
                    like: '%o'
                }
            },
            set: {
                Country: 'india'
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
        Con.update({ in: 'Customers',
            where: {
                CustomerName: {
                    like: '%or%'
                }
            },
            set: {
                Country: 'india'
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
        Con.update({ in: "Customers",
            set: {
                ContactName: 'Ujjwal',
                City: 'bhubaneswar'
            },
            where: {
                City: 'BhUbaneSwar'
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
        Con.update({ in: "Customers",
            ignoreCase: true,
            set: {
                ContactName: 'Ujjwal',
                City: 'bhubaneswar'
            },
            where: {
                City: 'bHuBaneSwar'
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(3);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it('select with or', function (done) {
        Con.select({
            from: 'Customers',
            where: {
                Country: 'Mexico',
                or: {
                    City: 'Madrid'
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
        Con.update({ in: 'Customers',
            where: {
                Country: 'Mexico',
                or: {
                    City: 'Madrid'
                }
            },
            set: {
                City: 'madrid'
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
        Con.select({
            from: 'Customers',
            where: {
                Country: { in: ['Germany', 'France', 'UK']
                }
            }
        }).then(function (results) {
            Count = results.length;
        }).
        catch(function (err) {
            done(err);
        })
        Con.update({ in: 'Customers',
            where: {
                Country: { in: ['Germany', 'France', 'UK']
                }
            },
            set: {
                ContactName: 'Ujjwal',
                City: 'bhubaneswar'
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
        Con.count({
            from: 'Customers',
            where: {
                Country: {
                    '!=': 'Mexico'
                }
            }
        }).then(function (results) {
            count = results;
        }).
        catch(function (err) {
            done(err);
        });

        Con.update({ in: 'Customers',
            where: {
                Country: {
                    '!=': 'Mexico'
                }
            },
            set: {
                ContactName: 'Ujjwsal',
                City: 'bhubaneswsar'
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(count);
            done();
        }).
        catch(function (err) {
            done(err);
        });
    });

    it('remove with operator - != (for number)', function (done) {
        var count;
        Con.count({
            from: 'Products',
            where: {
                Price: {
                    '!=': 20
                }
            }
        }).then(function (results) {
            count = results;
        }).
        catch(function (err) {
            done(err);
        })

        Con.update({ in: 'Products',
            where: {
                Price: {
                    '!=': 20
                }
            },
            set: {
                ContactName: 'Ujjwal',
                City: 'bhubaneswar'
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
        Con.select({
            from: 'Products',
            where: {
                Price: {
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
        Con.update({ in: 'Products',
            where: {
                Price: {
                    ">": 20
                }
            },
            set: {
                ProductName: 'Cofee'
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
        Con.select({
            from: 'Products',
            where: {
                Price: {
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
        Con.update({ in: 'Products',
            where: {
                Price: {
                    ">=": 20
                }
            },
            set: {
                ProductName: 'Whisky'
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
        Con.select({
            from: 'Products',
            where: {
                Price: {
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
        Con.update({ in: 'Products',
            where: {
                Price: {
                    "<": 20
                }
            },
            set: {
                ProductName: 'Tea'
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
        Con.select({
            from: 'Products',
            where: {
                Price: {
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
        Con.update({ in: 'Products',
            where: {
                Price: {
                    "<=": 20
                }
            },
            set: {
                ProductName: 'Candy'
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
        Con.select({
            from: 'Products',
            where: {
                Price: {
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
        Con.update({ in: 'Products',
            where: {
                Price: {
                    "-": {
                        low: 10,
                        high: 20
                    }
                }
            },
            set: {
                ProductName: 'Chocolate'
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(29);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });
});