describe('Test update with operator option', function () {

    it('update with operator - +', function (done) {
        var price;
        con.select({
            from: "Products",
            where: {
                productId: 1
            }
        }).then(function (results) {
            price = results[0].price;
        }).catch(function (err) {
            done(err);
        });

        con.update({
            in: "Products",
            set: {
                price: {
                    '+': 5
                }
            },
            where: {
                productId: 1
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(1);
        }).catch(function (err) {
            done(err);
        });

        con.select({
            from: "Products",
            where: {
                productId: 1
            }
        }).then(function (results) {
            expect(results[0].price).to.be.an('number').to.equal(price + 5);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('update with operator - "-" ', function (done) {
        var price;
        con.select({
            from: "Products",
            where: {
                productId: 1
            }
        }).then(function (results) {
            price = results[0].price;
        }).catch(function (err) {
            done(err);
        });

        con.update({
            in: "Products",
            set: {
                price: {
                    '-': 5
                }
            },
            where: {
                productId: 1
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(1);
        }).catch(function (err) {
            done(err);
        });

        con.select({
            from: "Products",
            where: {
                productId: 1
            }
        }).then(function (results) {
            expect(results[0].price).to.be.an('number').to.equal(price - 5);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('update with operator - *', function (done) {
        var price;
        con.select({
            from: "Products",
            where: {
                productId: 1
            }
        }).then(function (results) {
            price = results[0].price;
        }).catch(function (err) {
            done(err);
        });
        con.update({
            in: "Products",
            set: {
                price: {
                    '*': 5
                }
            },
            where: {
                productId: 1
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(1);
        }).catch(function (err) {
            done(err);
        });

        con.select({
            from: "Products",
            where: {
                productId: 1
            }
        }).then(function (results) {
            expect(results[0].price).to.be.an('number').to.equal(price * 5);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('update with operator - *', function (done) {
        var price;
        con.select({
            from: "Products",
            where: {
                productId: 1
            }
        }).then(function (results) {
            price = results[0].price;
        }).catch(function (err) {
            done(err);
        });
        con.update({
            in: "Products",
            set: {
                price: {
                    '/': 5
                }
            },
            where: {
                productId: 1
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(1);
        }).catch(function (err) {
            done(err);
        });

        con.select({
            from: "Products",
            where: {
                productId: 1
            }
        }).then(function (results) {
            expect(results[0].price).to.be.an('number').to.equal(price / 5);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('update with operator - + : string concat', function (done) {
        var Name;
        con.select({
            from: "Products",
            where: {
                productId: 1
            }
        }).then(function (results) {
            Name = results[0].productName;
        }).catch(function (err) {
            done(err);
        });
        con.update({
            in: "Products",
            set: {
                productName: {
                    '+': 'temp'
                }
            },
            where: {
                productId: 1
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(1);
        }).catch(function (err) {
            done(err);
        });

        con.select({
            from: "Products",
            where: {
                productId: 1
            }
        }).then(function (results) {
            expect(results[0].productName).to.be.an('string').to.equal(Name + 'temp');
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('update with wrong operator - #', function (done) {
        con.update({
            in: "Products",
            set: {
                productName: {
                    '#': 'temp'
                }
            },
            where: {
                productId: 1
            }
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(1);
        }).catch(function (err) {
            var error = {
                "message": "Supplied value for column 'productName' have wrong data type",
                "type": "wrong_data_type"
            };
            expect(err).to.be.an('object').eql(error);
            done();
        });
    });

    it("load script", function (done) {
        con.importScripts("../cases/update/update_worker.js").then(done).catch(done);
    });

    it('mapSet invalid method', function (done) {
        con.update({
            in: "Products",
            set: {
                price: 0
            },
            where: {
                productId: 7
            },
            mapSet: 'not_existing'
        }).then(done).catch(function (err) {
            const error = {
                "message": "method 'not_existing' does not exist.",
                "type": "method_not_exist"
            };
            expect(err).to.eql(error);
            done();
        });

    })

    it('update with mapSet - modify value', function (done) {
        var price;
        con.select({
            from: "Products",
            where: {
                productId: 7
            }
        }).then(function (results) {
            price = results[0].price;
        }).catch(function (err) {
            done(err);
        });
        con.update({
            in: "Products",
            set: {
                price: 0
            },
            where: {
                productId: 7
            },
            mapSet: 'JsStoreUpdate.mapSetProductId7'
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(1);
        }).catch(function (err) {
            done(err);
        });

        con.select({
            from: "Products",
            where: {
                productId: 7
            }
        }).then(function (results) {
            expect(results[0].price).to.be.an('number').to.equal(price * price);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('update with mapSet - return value', function (done) {
        var price;
        con.select({
            from: "Products",
            where: {
                productId: 8
            }
        }).then(function (results) {
            price = results[0].price;
        }).catch(function (err) {
            done(err);
        });
        con.update({
            in: "Products",
            set: {
                price: 0
            },
            where: {
                productId: 8
            },
            mapSet: 'JsStoreUpdate.mapSetProductId8'
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(1);
        }).catch(function (err) {
            done(err);
        });

        con.select({
            from: "Products",
            where: {
                productId: 8
            }
        }).then(function (results) {
            expect(results[0].price).to.be.an('number').to.equal(price * 2);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('update with mapSet - without web worker', function (done) {
        var connection = new JsStore.Connection();
        connection.openDb("Demo");
        connection.select({
            from: "Products",
            where: {
                productId: 8
            }
        }).then(function (selectResults) {
            return connection.update({
                in: "Products",
                set: {
                    price: 0
                },
                where: {
                    productId: 8
                },
                mapSet: function (setValue, storedValue) {
                    return {
                        price: storedValue.price * 2
                    }
                }
            }).then(function (results) {
                expect(results).to.be.an('number').to.equal(1);
                return selectResults[0].price;
            });
        }).then(function (price) {
            return connection.select({
                from: "Products",
                where: {
                    productId: 8
                }
            }).then(function (results) {
                expect(results[0].price).to.be.an('number').to.equal(price * 2);
            })
        }).then(function () {
            return connection.terminate().then(function () {
                done();
            });
        }).catch(function (err) {
            done(err);
        });
    });
});