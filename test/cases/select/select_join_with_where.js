describe('Test join', function () {

    it('inner join with where table', function (done) {
        con.select({
            from: "Customers",
            join: {
                with: "Orders",
                type: "inner",
                on: "Orders.customerId=Customers.customerId"
            },
            where: {
                customerId: { '<': 90 }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(194);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('inner join with where table', function (done) {
        con.select({
            from: "Customers",
            join: {
                with: "Orders",
                type: "inner",
                on: "Orders.customerId=Customers.customerId",
                where:{
                    customerId: { '<': 80 }
                }
            },
            where: {
                customerId: { '<': 90 }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(167);
            done();
        }).catch(function (err) {
            done(err);
        })
    });
});