describe('Test transaction', function () {
    it("load script", function (done) {
        con.importScripts("../cases/transaction/transaction_main.js").then(done).catch(done);
    });

    it('select and count', function (done) {
        var transaction_query = {
            tables: ['Customers'],
            method: "selectAndCount"
        }
        con.transaction(transaction_query).then(function (results) {
            expect(results.customers).to.be.an('array').length(results.count);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select and count multiple tables', function (done) {
        var transaction_query = {
            tables: ['Customers', 'OrderDetails', 'Categories'],
            method: "selectAndCountMultipleTables"
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
            method: "simpleInsert"
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
            method: "simpleUpdate"
        }
        con.transaction(transaction_query).then(function (results) {
            expect(results.updated).to.be.an('number').equal(1);
            done();
        }).catch(function (err) {
            done(err);
        })
    })
})