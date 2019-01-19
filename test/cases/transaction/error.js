describe('Transaction - error test', function () {
    it('supplying wrong table name in tables', function (done) {
        var transaction_query = {
            tables: ['Customsers'],
            logic: function (data) {
                select({
                    from: 'Customers'
                }).then(function (results) {
                    setResult('customers', results);
                });
            }
        }
        con.transaction(transaction_query).then(function (results) {
            expect(results.customers).to.be.an('array').length(results.count);
            done();
        }).catch(function (err) {
            var error = {
                "message": "Table 'Customsers' does not exist",
                "type": "table_not_exist"
            };
            expect(err).to.be.an('object').eql(error);
            done();
        })
    });

    it('supplying wrong table name in select query', function (done) {
        var transaction_query = {
            tables: ['Customers'],
            logic: function (data) {
                select({
                    from: 'Customssers'
                }).then(function (results) {
                    setResult('customers', results);
                });
            }
        }
        con.transaction(transaction_query).then(function (results) {
            expect(results.customers).to.be.an('array').length(results.count);
            done();
        }).catch(function (err) {
            var error = {
                message: "Table 'Customssers' does not exist",
                type: "table_not_exist"
            };
            expect(err).to.be.an('object').eql(error);
            done();
        })
    });

    it('select and count multiple tables- one table name wrong', function (done) {
        var count;
        var transaction_query = {
            tables: ['Customers', 'OrderDetails', 'Categories'],
            logic: function (data) {
                select({
                    from: 'Customers'
                }).then(function (results) {
                    setResult('customers', results);
                });

                count({
                    from: 'Customerdds'
                }).then(function (length) {
                    setResult('countCustomer', length);
                });

                select({
                    from: 'OrderDetails'
                }).then(function (results) {
                    setResult('orderDetails', results);
                });

                count({
                    from: 'OrderDetails'
                }).then(function (length) {
                    setResult('countOrderDetails', length);
                });

            }
        }
        con.transaction(transaction_query).then(function (results) {
            expect(results.customers).to.be.an('array').length(results.countCustomer);
            expect(results.orderDetails).to.be.an('array').length(results.countOrderDetails);
            done();
        }).catch(function (err) {
            var error = {
                "message": "Table 'Customerdds' does not exist",
                "type": "table_not_exist"
            };
            expect(err).to.be.an('object').eql(error);
            done();
        })
    });

    it('simple insert -null value supplying', function (done) {
        var transaction_query = {
            tables: ['Customers'],
            data: {
                insertValues: [{
                    CustomerName: 'ujjwalfev gupta',
                    ContactName: 'ujjwadcvl',
                    Address: 'bhubaneswdfar odisha',
                    City: 'bhubaneswar',
                    PostalCode: '12345',
                    Country: 'BangKok'
                }]
            },
            logic: function (data) {
                count({
                    from: 'Customers'
                }).then(function (result) {
                    setResult('countOldCustomer', result)
                })
                insert({
                    into: 'Customers',
                    values: null
                });
                count({
                    from: 'Customers'
                }).then(function (result) {
                    setResult('countNewCustomer', result)
                })
            }
        }
        con.transaction(transaction_query).then(function (results) {
            console.log(results)
            expect(results.countNewCustomer).to.be.an('number').equal(results.countOldCustomer + 1);
            done();
        }).catch(function (err) {
            var error = {
                "message": "No value is supplied",
                "type": "no_value_supplied"
            };
            expect(err).to.be.an('object').eql(error);
            done();
        })
    })

    it('update then abort', function (done) {
        var transaction_query = {
            tables: ['Customers'],
            data: {
                updateValue: {
                    CustomerName: 'ujjwalfev gupta',
                    ContactName: 'ujjwadcvl',
                    Address: 'bhubaneswdfar odisha',
                    City: 'bhubaneswar',
                    PostalCode: '12345',
                    Country: 'BangKok'
                }
            },
            logic: function (data) {
                update({ in: 'Customers',
                    set: data.updateValue,
                    where: {
                        CustomerID: 5
                    }
                }).then(function (result) {
                    abort();
                })
            }
        }
        var customer;
        con.select({
            from: 'Customers',
            where: {
                CustomerID: 5
            }
        }).then(function (results) {
            customer = results[0];
        }).catch(function (err) {
            done(err);
        })
        con.transaction(transaction_query).then(function (results) {}).catch(function (err) {
            done(err);
        })
        con.select({
            from: 'Customers',
            where: {
                CustomerID: 5
            }
        }).then(function (results) {
            expect(results).to.be.an('array');
            expect(results[0]).to.be.an('object').eql(customer);
            done();
        }).catch(function (err) {
            done(err);
        })
    })
})