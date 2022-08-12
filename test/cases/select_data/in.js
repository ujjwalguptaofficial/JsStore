describe("select in query with data", function () {

    var customers;
    var products;
    before((done) => {
        $.getJSON("test/static/Customers.json", function (results) {
            customers = results;
            done();
        });
    })

    it('store products', function (done) {
        $.getJSON("test/static/Products.json", function (results) {
            products = results;
            done();
        });
    });

    it("in", function (done) {
        con.select({
            order: {
                by: 'address',
                type: "asc"
            },
            where: {
                country: {
                    in: ['Mexico', 'Brazil']
                }
            },
            store: customers
        }).then(function (results) {
            expect(results).to.be.an('array').length(14);
            done();
        }).catch(done);
    })

    it("in with operator", function (done) {
        con.select({
            where: {
                productId: { in: [1, 2], '>': 1 },
            },
            store: products
        }).then(function (results) {
            expect(results).to.be.an('array').length(1);
            done();
        }).catch(done);
    })

    it("in with limit", function (done) {
        con.select({
            store: customers,
            limit: 5,
            where: {
                customerId: {
                    in: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(5);
            done();
        }).catch(done);
    })

    it("in with skip", function (done) {
        con.select({
            store: customers,
            skip: 5,
            where: {
                customerId: {
                    in: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(5);
            const expectedIds = [6, 7, 8, 9, 10];
            expectedIds.forEach(function (id, index) {
                expect(id).to.equal(results[index].customerId);
            })
            done();
        }).catch(done);
    })

    it("in with limit & skip", function (done) {
        con.select({
            store: customers,
            skip: 5,
            limit: 2,
            where: {
                customerId: {
                    in: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(2);
            const expectedIds = [6, 7];
            expectedIds.forEach(function (id, index) {
                expect(id).to.equal(results[index].customerId);
            })
            done();
        }).catch(done);
    })
})