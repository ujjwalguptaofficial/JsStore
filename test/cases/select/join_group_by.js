describe("join with group by", function () {
    it('inner join & group by', function (done) {
        con.select({
            from: "Orders",
            join: {
                with: "Customers",
                type: "inner",
                on: "Orders.CustomerID=Customers.CustomerID",
                as: {
                    CustomerName: "name",
                    ContactName: "cName",
                    CustomerID: "cId"
                }
            },
            groupBy:["cId"]
        }).then(function (results) {
            expect(results).to.be.an('array').length(74);
            var firstValue = results[0];
            // console.log(firstValue);
            expect(firstValue).to.be.an('object').to.haveOwnProperty('name');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('cName');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('OrderID');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('CustomerID');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('EmployeeID');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('cId');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('ShipperID');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('Address');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('City');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('PostalCode');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('Country');
            done();
        }).catch(function (err) {
            done(err);
        })
    });
    
});