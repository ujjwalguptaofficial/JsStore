describe('Test join', function () {

    it('inner join with where table', function (done) {
        con.select({
            from: "Customers",
            join: {
                with: "Orders",
                type: "inner",
                on: "Orders.CustomerID=Customers.CustomerID"
            },
            where: {
                CustomerID: { '<': 90 }
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
                on: "Orders.CustomerID=Customers.CustomerID",
                where:{
                    CustomerID: { '<': 80 }
                }
            },
            where: {
                CustomerID: { '<': 90 }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(167);
            done();
        }).catch(function (err) {
            done(err);
        })
    });
});