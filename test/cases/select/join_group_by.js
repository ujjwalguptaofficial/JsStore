describe("join with group by", function () {
    it('inner join & group by', function (done) {
        con.select({
            from: "Orders",
            join: {
                with: "Customers",
                type: "inner",
                on: "Orders.customerId=Customers.customerId",
                as: {
                    customerName: "name",
                    contactName: "cName",
                    customerId: "cId"
                }
            },
            groupBy:["cId"]
        }).then(function (results) {
            expect(results).to.be.an('array').length(74);
            var firstValue = results[0];
            // console.log(firstValue);
            expect(firstValue).to.be.an('object').to.haveOwnProperty('name');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('cName');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('orderId');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('customerId');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('employeeId');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('cId');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('shipperId');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('address');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('city');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('postalCode');
            expect(firstValue).to.be.an('object').to.haveOwnProperty('country');
            done();
        }).catch(function (err) {
            done(err);
        })
    });
    
});