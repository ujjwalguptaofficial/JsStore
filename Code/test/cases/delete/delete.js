describe('Test delete Api', function () {
    it('delete with where', function (done) {
        var Count;
        Con.select({
            From: 'Customers',
            Where: {
                Country: 'Mexico'
            },
            OnSuccess: function (results) {
                Count = results.length
            },
            OnError: function (err) {
                done(err);
            }
        })

        Con.delete({
            From: 'Customers',
            Where: {
                Country: 'Mexico'
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

    it('delete without ignore case', function (done) {

        var Count;
        Con.select({
            From: 'Customers',
            Where: {
                Country: 'mexico'
            },
            OnSuccess: function (results) {
                Count = results.length;
            },
            OnError: function (err) {
                done(err);
            }
        })

        Con.delete({
            From: 'Customers',
            Where: {
                Country: 'mexico'
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

    it('delete with ignore case', function (done) {

        var Count;
        Con.select({
            From: 'Customers',
            Where: {
                Country: 'meXico'
            },
            OnSuccess: function (results) {
                Count = results.length;
            },
            OnError: function (err) {
                done(err);
            }
        })

        Con.delete({
            From: 'Customers',
            IgnoreCase: true,
            Where: {
                Country: 'meXico'
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

    it('delete with or', function (done) {

        var Count;
        Con.select({
            From: 'Customers',
            Where: {
                Country: 'Mexico',
                Or: {
                    City: 'Madrid'
                }
            },
            OnSuccess: function (results) {
                Count = results.length;
            },
            OnError: function (err) {
                done(err);
            }
        })

        Con.delete({
            From: 'Customers',
            Where: {
                Country: 'Mexico',
                Or: {
                    City: 'Madrid'
                }
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

    it('delete with in', function (done) {

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

        Con.delete({
            From: 'Customers',
            Where: {
                Country: {
                    In: ['Germany', 'France', 'UK']
                }
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

    it('delete with operator - >', function (done) {

        var Count;
        Con.select({
            From: 'Products',
            Where: {
                Price: {
                    ">": 20
                }
            },
            OnSuccess: function (results) {
                Count = results.length;
            },
            OnError: function (err) {
                done(err);
            }
        })

        Con.delete({
            From: 'Products',
            Where: {
                Price: {
                    ">": 20
                }
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

    it('delete with operator - >=', function (done) {

        var Count;
        Con.select({
            From: 'Products',
            Where: {
                Price: {
                    ">=": 20
                }
            },
            OnSuccess: function (results) {
                Count = results.length;
            },
            OnError: function (err) {
                done(err);
            }
        })

        Con.delete({
            From: 'Products',
            Where: {
                Price: {
                    ">=": 20
                }
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

    it('delete with operator - <', function (done) {

        var Count;
        Con.select({
            From: 'Products',
            Where: {
                Price: {
                    "<": 20
                }
            },
            OnSuccess: function (results) {
                Count = results.length;
            },
            OnError: function (err) {
                done(err);
            }
        })

        Con.delete({
            From: 'Products',
            Where: {
                Price: {
                    "<": 20
                }
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

    it('delete with operator - <=', function (done) {
        var Count;
        Con.select({
            From: 'Products',
            Where: {
                Price: {
                    "<=": 20
                }
            },
            OnSuccess: function (results) {
                Count = results.length;
            },
            OnError: function (err) {
                done(err);
            }
        })

        Con.delete({
            From: 'Products',
            Where: {
                Price: {
                    "<=": 20
                }
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

    it('delete with operator - between', function (done) {
        var Count;
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
                Count = results.length;
            },
            OnError: function (err) {
                done(err);
            }
        })

        Con.delete({
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
                expect(results).to.be.an('number').to.equal(Count);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('delete with like- "%or%"', function (done) {
        var Count;
        Con.select({
                From: 'Customers',
                Where: {
                    CustomerName: {
                        Like: '%or%'
                    }
                },
                OnSuccess: function (results) {
                    Count = results.length;
                },
                OnError: function (err) {
                    done(err);
                }
            })
            .delete({
                From: 'Customers',
                Where: {
                    CustomerName: {
                        Like: '%or%'
                    }
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

    it('delete with like- "%or"', function (done) {
        var Count;
        Con.select({
                From: 'Customers',
                Where: {
                    CustomerName: {
                        Like: '%or'
                    }
                },
                OnSuccess: function (results) {
                    Count = results.length;
                },
                OnError: function (err) {
                    done(err);
                }
            })
            .delete({
                From: 'Customers',
                Where: {
                    CustomerName: {
                        Like: '%or'
                    }
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

    it('delete with like- "or%"', function (done) {
        var Count;
        Con.select({
                From: 'Customers',
                Where: {
                    CustomerName: {
                        Like: 'or%'
                    }
                },
                OnSuccess: function (results) {
                    Count = results.length;
                },
                OnError: function (err) {
                    done(err);
                }
            })
            .delete({
                From: 'Customers',
                Where: {
                    CustomerName: {
                        Like: 'or%'
                    }
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

    it('delete all - using promise', function (done) {
        var Count;
        Con.count({
            From: 'Customers',
            OnSuccess: function (results) {
                Count = results;
            },
            OnError: function (err) {
                done(err);
            }
        });
        Con.delete({
            From: 'Customers'
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
        Con.delete({
            From: 'Cusdtomers'
        }).
        catch(function (err) {
            var error = {
                "_message": "Table 'Cusdtomers' does not exist",
                "_type": "table_not_exist"
            };
            expect(err).to.be.an('object').eql(error);
            done();
        });
    });
});