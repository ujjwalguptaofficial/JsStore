describe("select in query", function () {
    it("in & ignorecase", function (done) {
        con.select({
            from: "Customers",
            order: {
                by: 'address',
                type: "asc"
            },
            ignoreCase: true,
            where: {
                country: {
                    in: ['Mexico', 'Brazil']
                }
            },
        }).then(function (results) {
            expect(results).to.be.an('array').length(14);
            done();
        }).catch(done);
    })

    it("in with operator", function (done) {
        con.select({
            from: "Products",
            where: {
                productId: { in: [1, 2], '>': 1 },
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(1);
            done();
        }).catch(done);
    })

    it("in with limit", function (done) {
        con.select({
            from: "Customers",
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
            from: "Customers",
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
            from: "Customers",
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