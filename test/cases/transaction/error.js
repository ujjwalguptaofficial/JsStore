describe('Transaction - error test', function () {
    it("load invalid script", function (done) {
        con.importScripts("../cases/transaction/invalid_file.js").
            then(done).catch(function (err) {
                // var error = {
                //     "message": "Table 'Customsers' does not exist",
                //     "type": "import_scripts_failed"
                // };
                expect(err.type).to.eql("import_scripts_failed");
                done();
            });
    });

    it("load script", function (done) {
        con.importScripts("../cases/transaction/transaction_error.js").then(done).catch(done);
    });

    it('calling invalid method in transation', function (done) {
        var transaction_query = {
            tables: ['Customers'],
            method: "invalidMethod"
        }
        con.transaction(transaction_query).then(done).catch(function (err) {
            var error = {
                "message": "method invalidMethod does not exist.",
                "type": "method_not_exist"
            };
            expect(err).to.be.an('object').eql(error);
            done();
        })
    });

    it('supplying wrong table name in tables', function (done) {
        var transaction_query = {
            tables: ['Customsers', 'Customers', 'Suppliers'],
            method: "wrongTableName"
        }
        con.transaction(transaction_query).catch(function (err) {
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
            method: "wrongTableNameInSelectQry"
        };
        con.transaction(transaction_query).catch(function (err) {
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
            method: "selectAndCountOneTableNameWrong"
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

    it('simple insert - null value supplying', function (done) {
        var transaction_query = {
            tables: ['Customers'],
            data: {
                insertValues: [{
                    customerName: 'ujjwalfev gupta',
                    contactName: 'ujjwadcvl',
                    address: 'bhubaneswdfar odisha',
                    city: 'bhubaneswar',
                    postalCode: '12345',
                    country: 'BangKok'
                }]
            },
            method: "insertWithNullValue"
        }
        con.transaction(transaction_query).then(function (results) {

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
                    customerName: 'ujjwalfev gupta',
                    contactName: 'ujjwadcvl',
                    address: 'bhubaneswdfar odisha',
                    city: 'bhubaneswar',
                    postalCode: '12345',
                    country: 'BangKok'
                }
            },
            method: "updateThenAbort"
        }
        var customer;
        con.select({
            from: 'Customers',
            where: {
                customerId: 5
            }
        }).then(function (results) {
            customer = results[0];
        }).catch(function (err) {
            done(err);
        })
        con.transaction(transaction_query).then(function (results) { }).catch(function (err) {
            done(err);
        })
        con.select({
            from: 'Customers',
            where: {
                customerId: 5
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