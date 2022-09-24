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
            groupBy: ["cId"]
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

    it('two table join & group by with aggregate', function (done) {
        con.select({
            from: 'Orders',
            join: [{
                with: 'Customers',
                on: "Orders.customerId=Customers.customerId",
                type: 'inner'
            }],
            groupBy: 'city',
            aggregate: {
                count: 'customerId'
            }

        }).then(function (results) {
            expect(results).to.be.an('array').length(58);
            const map = { "Aachen": 2, "Albuquerque": 7, "Anchorage": 4, "Barcelona": 2, "Barquisimeto": 5, "Bergamo": 3, "Bern": 2, "Boise": 4, "Brandenburg": 2, "Bräcke": 4, "Buenos Aires": 1, "Campinas": 1, "Caracas": 1, "Charleroi": 2, "Cork": 6, "Cowes": 3, "Cunewalde": 7, "Elgin": 3, "Frankfurt a.M.": 3, "Genève": 2, "Graz": 10, "Helsinki": 1, "I. de Margarita": 1, "Köln": 1, "København": 2, "Lander": 6, "Leipzig": 1, "Lille": 1, "Lisboa": 5, "London": 9, "Luleå": 3, "Lyon": 2, "Madrid": 4, "Marseille": 3, "Montréal": 5, "México D.F.": 9, "München": 4, "Münster": 1, "Nantes": 1, "Oulu": 7, "Portland": 3, "Reggio Emilia": 3, "Reims": 2, "Resende": 2, "Rio de Janeiro": 8, "Salzburg": 3, "San Cristóbal": 2, "Seattle": 2, "Sevilla": 1, "Stavern": 1, "Strasbourg": 4, "Stuttgart": 4, "São Paulo": 8, "Torino": 1, "Toulouse": 5, "Tsawassen": 4, "Walla": 1, "Århus": 2 };
            results.forEach(result => {
                const cityValue = map[result.city];
                expect(result['count(customerId)']).equal(cityValue);
            })
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('three table join & group by', function (done) {
        con.select({
            from: 'Orders',
            join: [{
                with: 'Customers',
                on: "Orders.customerId=Customers.customerId"
            }, {
                with: "Shippers",
                on: "Orders.shipperId=Shippers.shipperId",
                as: {
                    shipperId: 'Shippers.shipperId'
                }
            }],
            groupBy: 'city',

        }).then(function (results) {
            expect(results).to.be.an('array').length(58);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

});