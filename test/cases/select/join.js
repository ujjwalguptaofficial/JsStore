describe('Test join', function () {
    it('inner join', function (done) {
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
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(196);
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

    it('inner join with reversed table', function (done) {
        con.select({
            from: "Customers",
            join: {
                with: "Orders",
                type: "inner",
                on: "Orders.customerId=Customers.customerId",
                as: {
                    customerName: "name",
                    contactName: "cName",
                    customerId: "cId"
                }
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
                on: "Orders.customerId=Customers.customerId"
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(196);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('left join with alias', function (done) {
        con.select({
            from: "Customers",
            join: {
                with: "Orders",
                type: "left",
                on: "Customers.customerId=Orders.customerId",
                as: {
                    orderId: 'oid'
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(215);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('left join when some data does not match from first table', function (done) {
        con.update({
            in: "Orders",
            set: {
                shipperId: 1234567890
            },
            where: {
                orderId: 10248
            }
        });

        con.select({
            from: "Orders",
            join: {
                with: "Shippers",
                on: "Shippers.shipperId = Orders.shipperId",
                type: "left"
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(196);
            expect(results[0]).to.be.an('object').to.haveOwnProperty('shipperName').equal(null);
            expect(results[1]).to.be.an('object').to.haveOwnProperty('shipperName').equal("Speedy Express");
            done();
        }).catch(function (err) {
            done(err);
        })

    });


    it('left join with alias when data does not match in second table', function (done) {
        con.update({
            in: "Orders",
            set: {
                shipperId: 1234567890
            },
            where: {
                orderId: 10249
            }
        });

        con.select({
            from: "Orders",
            join: {
                with: "Shippers",
                on: "Shippers.shipperId = Orders.shipperId",
                type: "left",
                as: {
                    shipperId: "shipperId",
                    shipperName: "shipperName",
                    phone: "phone"
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(196);
            //console.log('results', results[1]);
            expect(results[0]).to.be.an('object').to.haveOwnProperty('shipperId').equal(null);
            expect(results[0]).to.be.an('object').to.haveOwnProperty('shipperName').equal(null);
            expect(results[1]).to.be.an('object').to.haveOwnProperty('shipperName').equal(null);
            expect(results[2]).to.be.an('object').to.haveOwnProperty('shipperName').equal("United Package");

        }).catch(function (err) {
            done(err);
        })

        con.update({
            in: "Orders",
            set: {
                shipperId: 1
            },
            where: {
                orderId: 10249
            }
        });

        con.update({
            in: "Orders",
            set: {
                shipperId: 3
            },
            where: {
                orderId: 10248
            }
        }).then(function () {
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
                on: "Orders.customerId=Customers.customerId"
            }
        }).then(function (results) {
            // console.table(results);
            expect(results).to.be.an('array').length(215);
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
                on: "Orders.customerId=Customers.customerId"
            }, {
                with: "Shippers",
                type: "inner",
                on: "Orders.shipperId=Shippers.shipperId"
            }]
        }).then(function (results) {
            expect(results).to.be.an('array').length(196);
            var result = results[0];
            expect(result.customerId).to.be.an('number');
            expect(result.orderId).to.be.an('number');
            expect(result.shipperId).to.be.an('number');
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('self join ', function (done) {
        con.select({
            from: "Customers",
            join: {
                with: "Customers",
                type: "inner",
                on: "Customers.city=Customers.city",
                as: {
                    customerName: "name",
                    contactName: "cName",
                    customerId: "cId",
                    address: "address",
                    postalCode: "postalCode",
                    country: "country",
                    email: "email"
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(183);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('self join with where', function (done) {
        con.select({
            from: "Customers",
            join: {
                with: "Customers",
                type: "inner",
                on: "Customers.city=Customers.city",
                as: {
                    customerName: "name",
                    contactName: "cName",
                    customerId: "cId",
                    address: "address",
                    postalCode: "postalCode",
                    country: "country",
                    email: "email"
                },
                where: {
                    customerId: { '<': 90 }
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(177);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('inner join with invalid first table', function (done) {
        con.select({
            from: "invalid_table",
            join: {
                with: "Orders",
                type: "inner",
                on: "Orders.customerId=Customers.customerId"
            }
        }).catch(function (err) {
            var error = { "message": "Table 'invalid_table' does not exist", "type": "table_not_exist" };
            expect(err).to.eql(error);
            done();
        })
    });

    it('inner join with invalid join table', function (done) {
        con.select({
            from: "Customers",
            join: {
                with: "invalid_table",
                type: "inner",
                on: "Orders.customerId=Customers.customerId"
            }
        }).then(function (result) {
            done(result);
        }).catch(function (err) {
            if (isRuningForProd() || isRuningForSauce()) {
                var error = { "message": "Table 'invalid_table' does not exist", "type": "table_not_exist" };
                expect(err).to.eql(error);
            }
            else {
                var error = {
                    "message": "on value should contains value of with", "type": "invalid_join_query"
                }
                expect(err).to.eql(error);
            }
            done();
        })
    });

    it('inner join with invalid column in first table', function (done) {
        con.select({
            from: "Customers",
            join: {
                with: "Orders",
                type: "inner",
                on: "Orders.CustomerId=Customers.customerId",
                as: {
                    customerId: 'cId'
                }
            }
        }).then(function (result) {
            expect(result).to.be.an('array').length(0);
            done();
        }).catch(function (err) {
            if (isRuningForProd() || isRuningForSauce()) {
                expect(err).to.be.an('object').haveOwnProperty('type').equal('invalid_join_query');
            }
            else {
                var error = { "message": "column CustomerId does not exist in table Orders", "type": "invalid_join_query" };
                expect(err).to.eql(error);
            }
            done();
        })
    });

    it('inner join with invalid column in second table', function (done) {
        con.select({
            from: "Customers",
            join: {
                with: "Orders",
                type: "inner",
                on: "Orders.customerId=Customers.CustomerId",
                as: {
                    customerId: 'cId'
                }
            }
        }).then(function (result) {
            expect(result).to.be.an('array').length(0);
            done();
        }).catch(function (err) {
            if (isRuningForProd() || isRuningForSauce()) {
                expect(err).to.be.an('object').haveOwnProperty('type').equal('invalid_join_query');
            }
            else {
                var error = { "message": "column CustomerId does not exist in table Customers", "type": "invalid_join_query" };
                expect(err).to.eql(error);
            }
            done();
        })
    });

    it('join with zero records', function (done) {
        con.select({
            from: "Customers",
            where: {
                customerId: 500000
            },
            join: {
                with: "Orders",
                type: "left",
                on: "Customers.customerId=Orders.customerId"
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(0);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('multiple left join', function (done) {
        con.select({
            from: "Customers",
            join: [
                { with: "Orders", type: "left", on: "Customers.customerId=Orders.customerId" },
                { with: "Employees", type: "left", on: "Orders.employeeId=Employees.employeeId" }
            ]
        }).then(function (results) {
            expect(results).to.be.an('array').length(215);
            done();
        }).catch(done);
    });

    it('join data check for undefined issue when using as', function (done) {
        con.select({
            from: "Orders",
            join: {
                with: "Shippers",
                on: "Shippers.shipperId = Orders.shipperId",
                as: {
                    shipperId: "shipperId",
                    shipperName: "shipperName"
                }
            },
            limit: 5
        }).then(function (results) {
            expect(results).to.be.an('array').length(5);
            var fourthValue = results[3];
            expect(fourthValue).to.be.an('object').to.haveOwnProperty('shipperId').equal(1);
            expect(fourthValue).to.be.an('object').to.haveOwnProperty('shipperName').equal("Speedy Express");
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('when one row of a table matches with multiple row of another table', function (done) {
        con.update({
            in: "Shippers",
            set: {
                phone: "(503) 555-9931"
            },
            where: {
                shipperId: {
                    '!=': 6
                }
            }
        });
        con.select({
            from: "Suppliers",
            join: [{
                with: "Shippers",
                on: "Shippers.phone = Suppliers.phone"
            }]
        }).then(function (results1) {
            con.select({
                from: "Shippers",
                join: [{
                    with: "Suppliers",
                    on: "Shippers.phone = Suppliers.phone"
                }]
            }).then(function (results2) {
                results2.forEach(function (result, i) {
                    expect(result).to.be.an('object').eql(results1[i]);
                });
                done();
            }).catch(function (err) {
                done(err);
            })
        }).catch(function (err) {
            done(err);
        })

    });

    // it('join with ignoreCase', function (done) {
    //     con.select({
    //         from: "Customers",
    //         where: {
    //             country: "Mexico"
    //         },
    //         join: {
    //             with: 'Orders',
    //             on: 'Customers.customerId=Orders.customerId',
    //             type: 'left'
    //         }
    //     }).then(function (results) {
    //         return results.length;
    //     }).then(function (length) {
    //         con.select({
    //             from: "Customers",
    //             ignoreCase: true,
    //             where: {
    //                 country: "mexico"
    //             },
    //             join: {
    //                 with: 'Orders',
    //                 on: 'Customers.customerId=Orders.customerId',
    //                 type: 'left'
    //             }
    //         }).then(function (results) {
    //             expect(length).equal(results.length);
    //             done();
    //         }).catch(done);
    //     }).catch(done);

    // })

});