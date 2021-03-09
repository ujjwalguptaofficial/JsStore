describe('real time transaction', function () {
    it("load script", function (done) {
        con.importScripts("../cases/transaction/transaction_real.js").then(done).catch(done);
    });

    it('create shop db', function (done) {
        con.initDb(getShopDbSchema()).then(function () {
            done();
        }).catch(done);
    })

    it('insert products items', function (done) {
        var values = [{
            productName: 'black jeans',
            unit: 200,
            price: 1200
        }, {
            productName: 'blue jeans',
            unit: 2000,
            price: 1500
        }, {
            productName: 'orange jeans',
            unit: 200,
            price: 1205
        }, {
            productName: 'green jeans',
            unit: 100,
            price: 1500
        }]
        con.insert({
            into: "products",
            values: values
        }).then(function (rowsInserted) {
            expect(rowsInserted).to.be.an('number').equal(4);
            done();
        }).catch(done);
    })

    it('buying products', function (done) {
        var txQuery = {
            tables: ['customers', 'orders', 'products', 'orderDetails'],
            method: "buyProducts",
            data: {
                customer: {
                    customerName: 'ujjwal gupta',
                    address: 'bhubaneswar odisha',
                    city: 'bhubaneswar',
                    postalCode: 'asdf',
                    country: 'india',
                    email: 'sdfg@m.com'
                },
                orderDetails: [{
                    productId: 1,
                    quantity: 2
                }, {
                    productId: 2,
                    quantity: 4
                }]
            }
        }
        con.transaction(txQuery).then(function (result) {
            // console.log("result", result);
            expect(result.totalPrice).to.be.an('number').equal(1200 * 2 + 1500 * 4);
            expect(result.customer.id).to.be.an('number').equal(1);
            done();
        }).catch(done);
    });

    it('insert new customer and check for valid next customerid', function (done) {
        con.insert({
            into: 'customers',
            values: [{
                customerName: 'ujjwal gupta',
                address: 'bhubaneswar odisha',
                city: 'bhubaneswar',
                postalCode: 'asdf',
                country: 'india',
                email: 'sdfg@m.com'
            }],
            return: true
        }).then(function (result) {
            expect(result[0].id).to.be.an('number').equal(2);
            done();
        }).catch(done);
    });

    it('check for products updates', function (done) {
        var txQuery = {
            tables: ['products'],
            method: "checkForProductUpdate"
        }

        con.transaction(txQuery).then(function (result) {
            expect(result.productId1).to.be.an('number').equal(200 - 2);
            expect(result.productId2).to.be.an('number').equal(2000 - 4);
            done();
        }).catch(done);
    });

    it('open db demo', function (done) {
        con.initDb(getDemoDbSchema()).then(function (isDbCreated) {
            expect(isDbCreated).to.be.an('boolean').equal(false);
            done();
        }).catch(done);
    })
});
