describe('Test remove Api', function () {
    it('remove with where', function (done) {
        var Count;
        con.select({
            from: 'Customers',
            where: {
                Country: 'Mexico'
            }
        }).then(function (results) {
            Count = results.length
        }).catch(function (err) {
            done(err);
        })

        con.remove({
            from: 'Customers',
            where: {
                Country: 'Mexico'
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(Count);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('remove without ignore case', function (done) {
        var Count;
        con.select({
            from: 'Customers',
            where: {
                Country: 'mexico'
            }
        }).then(function (results) {
            Count = results.length;
        }).catch(function (err) {
            done(err);
        })

        con.remove({
            from: 'Customers',
            where: {
                Country: 'mexico'
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(Count);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('remove with ignore case', function (done) {

        var Count;
        con.select({
            from: 'Customers',
            where: {
                Country: 'meXico'
            }
        }).then(function (results) {
            Count = results.length;
        }).catch(function (err) {
            done(err);
        })

        con.remove({
            from: 'Customers',
            ignoreCase: true,
            where: {
                Country: 'meXico'
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(Count);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('remove with or', function (done) {

        var Count;
        con.select({
            from: 'Customers',
            where: {
                Country: 'Mexico',
                or: {
                    City: 'Madrid'
                }
            }
        }).then(function (results) {
            Count = results.length;
        }).catch(function (err) {
            done(err);
        })

        con.remove({
            from: 'Customers',
            where: {
                Country: 'Mexico',
                or: {
                    City: 'Madrid'
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(Count);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('remove with in', function (done) {

        var Count;
        con.select({
            from: 'Customers',
            where: {
                Country: { in: ['Germany', 'France', 'UK']
                }
            }
        }).then(function (results) {
            Count = results.length;
        }).catch(function (err) {
            done(err);
        })

        con.remove({
            from: 'Customers',
            where: {
                Country: { in: ['Germany', 'France', 'UK']
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(Count);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('remove with operator - != (for string)', function (done) {
        var count;
        con.count({
            from: 'Customers',
            where: {
                Country: {
                    '!=': 'Mexico'
                }
            }
        }).then(function (results) {
            count = results;
        }).catch(function (err) {
            done(err);
        });

        con.remove({
            from: 'Customers',
            where: {
                Country: {
                    '!=': 'Mexico'
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(count);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('remove with operator - != (for number)', function (done) {
        var count;
        con.count({
            from: 'Products',
            where: {
                Price: {
                    '!=': 20
                }
            }
        }).then(function (results) {
            count = results;
        }).catch(function (err) {
            done(err);
        })

        con.remove({
            from: 'Products',
            where: {
                Price: {
                    '!=': 20
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(count);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('remove with operator - >', function (done) {

        var Count;
        con.select({
            from: 'Products',
            where: {
                Price: {
                    ">": 20
                }
            }
        }).then(function (results) {
            Count = results.length;
        }).catch(function (results) {
            done(err);
        })

        con.remove({
            from: 'Products',
            where: {
                Price: {
                    ">": 20
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(Count);
            done();
        }).catch(function (results) {
            done(err);
        })
    });

    it('remove with operator - >=', function (done) {

        var Count;
        con.select({
            from: 'Products',
            where: {
                Price: {
                    ">=": 20
                }
            }
        }).then(function (results) {
            Count = results.length;
        }).catch(function (results) {
            done(err);
        })

        con.remove({
            from: 'Products',
            where: {
                Price: {
                    ">=": 20
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(Count);
            done();
        }).catch(function (results) {
            done(err);
        })
    });

    it('remove with operator - <', function (done) {

        var Count;
        con.select({
            from: 'Products',
            where: {
                Price: {
                    "<": 20
                }
            }
        }).then(function (results) {
            Count = results.length;
        }).catch(function (results) {
            done(err);
        })

        con.remove({
            from: 'Products',
            where: {
                Price: {
                    "<": 20
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(Count);
            done();
        }).catch(function (results) {
            done(err);
        })
    });

    it('remove with operator - <=', function (done) {
        var Count;
        con.select({
            from: 'Products',
            where: {
                Price: {
                    "<=": 20
                }
            }
        }).then(function (results) {
            Count = results.length;
        }).catch(function (results) {
            done(err);
        })

        con.remove({
            from: 'Products',
            where: {
                Price: {
                    "<=": 20
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(Count);
            done();
        }).catch(function (results) {
            done(err);
        })
    });

    it('remove with operator - between', function (done) {
        var Count;
        con.select({
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
            Count = results.length;
        }).catch(function (results) {
            done(err);
        })

        con.remove({
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
            expect(results).to.be.an('number').to.equal(Count);
            done();
        }).catch(function (results) {
            done(err);
        })
    });

    it('remove with like- "%or%"', function (done) {
        var Count;
        con.select({
            from: 'Customers',
            where: {
                CustomerName: {
                    like: '%or%'
                }
            }
        }).then(function (results) {
            Count = results.length;
        }).catch(function (results) {
            done(err);
        })

        con.remove({
            from: 'Customers',
            where: {
                CustomerName: {
                    like: '%or%'
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(Count);
            done();
        }).catch(function (results) {
            done(err);
        })
    });

    it('remove with like- "%or"', function (done) {
        var Count;
        con.select({
            from: 'Customers',
            where: {
                CustomerName: {
                    like: '%or'
                }
            }
        }).then(function (results) {
            Count = results.length;
            con.remove({
                from: 'Customers',
                where: {
                    CustomerName: {
                        like: '%or'
                    }
                }
            }).then(function (results) {
                expect(results).to.be.an('number').to.equal(Count);
                done();
            }).catch(function (results) {
                done(err);
            })
        }).catch(function (results) {
            done(err);
        });

    });

    it('remove with like- "or%"', function (done) {
        var Count;
        con.select({
            from: 'Customers',
            where: {
                CustomerName: {
                    like: 'or%'
                }
            }
        }).then(function (results) {
            Count = results.length;
        }).catch(function (results) {
            done(err);
        })

        con.remove({
            from: 'Customers',
            where: {
                CustomerName: {
                    like: 'or%'
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(Count);
            done();
        }).catch(function (results) {
            done(err);
        })
    });

    it('remove all - using promise', function (done) {
        var Count;
        con.count({
            from: 'Customers'
        }).then(function (results) {
            Count = results;
        }).catch(function (results) {
            done(err);
        });
        con.remove({
            from: 'Customers'
        }).
        then(function (results) {
            expect(results).to.be.an('number').to.equal(Count);
            done();
        }).
        catch(function (err) {
            done(err);
        });

    });

    it('wrong table test - using promise', function (done) {
        con.remove({
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
});