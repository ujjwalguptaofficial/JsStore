describe('Test transaction', function () {
    it('select and count', function (done) {
        var count;
        var transaction_query = {
            tables: ['Customers'],
            logic: function (data) {

                select({
                    from: 'Customers'
                }).then(function (results) {
                    setResult('customers', results);
                });

                count({
                    from: 'Customers'
                }).then(function (length) {
                    setResult('count', length);
                });
                start()

            }
        }
        con.transaction(transaction_query).then(function (results) {
            expect(results.customers).to.be.an('array').length(results.count);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select and count multiple tables', function (done) {
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
                    from: 'Customers'
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
                start()


            }
        }
        con.transaction(transaction_query).then(function (results) {
            expect(results.customers).to.be.an('array').length(results.countCustomer);
            expect(results.orderDetails).to.be.an('array').length(results.countOrderDetails);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('simple insert', function (done) {
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
            logic: function (ctx) {
                select({
                    from: 'Customers'
                }).then(function (result) {
                    setResult('customers', result);
                })
                insert({
                    into: 'Customers',
                    return: true,
                    values: ctx.data.insertValues
                }).then(function (insertedcustomer) {
                    setResult('insertedcustomer', insertedcustomer);
                })
                count({
                    from: 'Customers'
                }).then(function (result) {
                    setResult('countNewCustomer', result)
                })
                start()

            }
        }
        con.transaction(transaction_query).then(function (results) {
            var insertedcustomer = results.insertedcustomer[0];
            var customers = results.customers;
            expect(results.countNewCustomer).to.be.an('number').equal(customers.length + 1);
            expect(insertedcustomer.customerId).to.be.an('number').greaterThan(customers[customers.length - 1].customerId);
            done();
        }).catch(function (err) {
            done(err);
        })
    })

    it('update', function (done) {
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
            logic: function (ctx) {

                update({
                    in: 'Customers',
                    set: ctx.data.updateValue,
                    where: {
                        customerId: 5
                    }
                }).then(function (result) {
                    setResult('updated', result)
                })
                start()


            }
        }
        con.transaction(transaction_query).then(function (results) {
            expect(results.updated).to.be.an('number').equal(1);
            done();
        }).catch(function (err) {
            done(err);
        })
    })
})