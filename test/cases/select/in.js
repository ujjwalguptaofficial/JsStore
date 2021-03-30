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
})