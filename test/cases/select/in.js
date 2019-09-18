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
})