describe('Test join', function () {
    it('inner join', function (done) {
        con.select({
            from: "Orders",
            join: {
                with: "Customers",
                type: "inner",
                on: "Orders.CustomerID=Customers.CustomerID"
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(196);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('left join', function (done) {

        con.select({
            from: "Orders",
            join: {
                with: "Customers",
                type: "left",
                on: "Orders.CustomerID=Customers.CustomerID"
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(196);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('left join reverse', function (done) {
        con.select({
            from: "Customers",
            join: {
                with: "Orders",
                type: "left",
                on: "Orders.CustomerID=Customers.CustomerID"
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(93);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('three table join', function (done) {
        con.select({
            from: "Orders",
            join: [{
                with: "Customers",
                type: "inner",
                on: "Orders.CustomerID=Customers.CustomerID"
            }, {
                with: "Shippers",
                type: "inner",
                on: "Orders.ShipperID=Shippers.ShipperID"
            }]
        }).then(function (results) {
            expect(results).to.be.an('array').length(196);
            const result = results[0];
            expect(result.CustomerID).to.be.an('number');
            expect(result.OrderID).to.be.an('number');
            expect(result.ShipperID).to.be.an('number');
            done();
        }).catch(function (err) {
            done(err);
        })
    });

});