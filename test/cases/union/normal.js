describe("Union", function () {
    it('union between two same query', function (done) {
        var query = {
            from: 'Products',
            where: {
                supplierId: {
                    '>': 18
                }
            }
        };
        con.count(query).then(function (count) {
            con.union([query, query]).then(function (results) {
                // console.log(results);
                expect(results).to.be.an('array').length(count);
                done();
            });
        }).catch(done);

    });
})