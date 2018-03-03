describe('Test remove Api', function () {
    it('remove with where', function (done) {
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

        Con.remove({
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

    it('remove without ignore case', function (done) {

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

        Con.remove({
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

    it('remove with ignore case', function (done) {

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

        Con.remove({
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

    it('remove with or', function (done) {

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

        Con.remove({
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

    it('remove with in', function (done) {

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

        Con.remove({
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

    it('remove with operator - != (for string)', function (done) {
        var count;
        Con.count({
            From: 'Customers',
            Where: {
                Country: {
                    '!=': 'Mexico'
                }
            },
            OnSuccess: function (results) {
                count = results;
            },
            OnError: function (err) {
                done(err);
            }
        });

        Con.remove({
            From: 'Customers',
            Where: {
                Country: {
                    '!=': 'Mexico'
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(count);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        });
    });

    it('remove with operator - != (for number)', function (done) {
        var count;
        Con.count({
            From: 'Products',
            Where: {
                Price: {
                    '!=': 20
                }
            },
            OnSuccess: function (results) {
                count = results;
            },
            OnError: function (err) {
                done(err);
            }
        })

        Con.remove({
            From: 'Products',
            Where: {
                Price: {
                    '!=': 20
                }
            },
            OnSuccess: function (results) {
                expect(results).to.be.an('number').to.equal(count);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('remove with operator - >', function (done) {

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

        Con.remove({
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

    it('remove with operator - >=', function (done) {

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

        Con.remove({
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

    it('remove with operator - <', function (done) {

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

        Con.remove({
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

    it('remove with operator - <=', function (done) {
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

        Con.remove({
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

    it('remove with operator - between', function (done) {
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

        Con.remove({
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

    it('remove with like- "%or%"', function (done) {
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
            .remove({
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

    it('remove with like- "%or"', function (done) {
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
            .remove({
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

    it('remove with like- "or%"', function (done) {
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
            .remove({
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

    it('remove all - using promise', function (done) {
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
        Con.remove({
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
        Con.remove({
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