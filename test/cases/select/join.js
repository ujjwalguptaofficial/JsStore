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

    it('left join - check for data in second table', function (done) {
        con.select({
            from: "Orders",
            order: {
                by: 'Orders.customerId',

                type: 'asc' //supprted sort type is - asc,desc

            },
            join: {
                with: "Customers",

                type: "left",

                on: "Orders.customerId=Customers.customerId",

                as: {

                    customerId: 'cId'
                }

            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(196);
            const customerIdMap = {};
            results.forEach(result => {
                if (customerIdMap[result.customerId]) {
                    const expectedData = customerIdMap[result.customerId];
                    for (const key in expectedData) {
                        expect(expectedData[key]).equal(result[key]);
                    }
                }
                else {
                    customerIdMap[result.customerId] = {
                        customerName: result.customerName
                    }
                }
            });
            done();
        }).catch(done);

    })

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

    it('left join when data match from second table using where', function (done) {
        con.select({
            from: 'Customers',
            join: {
                with: 'Orders',
                on: "Orders.customerId=Customers.customerId",
                type: "left",
                as: {
                    customerId: "orderCustomerId"
                },
                where: {
                    orderCustomerId: 2
                },
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(1);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it(`SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate
    FROM Orders
    INNER JOIN Customers
    ON Orders.CustomerID=Customers.CustomerID where shipperId=2
    `, function (done) {
        con.select({
            from: "Orders",
            join: {
                with: "Customers",
                type: "left",
                on: "Orders.customerId=Customers.customerId",
                as: {
                    customerId: 'cId'
                },
            },
            where: [{
                shipperId: 2
            }]
        }).then(function (results) {
            expect(results).to.be.an('array').length(74);
            done();
        }).catch(done)
    });

    it(`SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate
    FROM Orders
    INNER JOIN Customers
    ON Orders.CustomerID=Customers.CustomerID where shipperId=2 or employeeId=4
    `, function (done) {
        con.select({
            from: "Orders",
            join: {
                with: "Customers",
                type: "left",
                on: "Orders.customerId=Customers.customerId",
                as: {
                    customerId: 'cId'
                },
            },
            where: [
                {
                    shipperId: 2,
                },
                {
                    or: {
                        employeeId: 4,
                    }
                }
            ]
        }).then(function (results) {
            expect(results).to.be.an('array').length(97);
            done();
        }).catch(done)
    });

    it(`SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate
    FROM Orders
    INNER JOIN Customers
    ON Orders.CustomerID=Customers.CustomerID where shipperId=2 and (employeeId=4 and Orders.customerId=34) or (employeeId=4 and Orders.customerId=76) order by orderid asc    
    `, function (done) {
        con.select({
            from: "Orders",
            join: {
                with: "Customers",
                type: "left",
                on: "Orders.customerId=Customers.customerId",
                as: {
                    customerId: 'cId'
                },
            },
            where: [
                {
                    shipperId: 2,
                },
                {
                    employeeId: 4,
                    customerId: 34,
                },
                {
                    or: {
                        employeeId: 4,
                        customerId: 76,
                    }
                }
            ],
            order: {
                by: 'Orders.orderId',
                type: 'asc'
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(3);
            const expectedIds = results.map(result => result.orderId);
            expect(expectedIds).eql([10250, 10252, 10302])
            done();
        }).catch(done)
    });

    it(`SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate
    FROM Orders
    INNER JOIN Customers
    ON Orders.CustomerID=Customers.CustomerID where shipperId=2 and ((employeeId=4 and Orders.customerId=34) or (employeeId=4 and Orders.customerId=76)) order by orderid asc        
    `, function (done) {
        con.select({
            from: "Orders",
            join: {
                with: "Customers",
                type: "left",
                on: "Orders.customerId=Customers.customerId",
                as: {
                    customerId: 'cId'
                },
            },
            where: [{
                shipperId: 2,
            },
            [{
                employeeId: 4,
                customerId: 34,
            }, {
                or: {
                    employeeId: 4,
                    customerId: 76,
                }
            }]
            ],
            order: {
                by: 'Orders.orderId',
                type: 'asc'
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(3);
            const expectedIds = results.map(result => result.orderId);
            expect(expectedIds).eql([10250, 10252, 10302])
            done();
        }).catch(done)
    });

    it('left join when data does not match from second table using where', function (done) {
        con.select({
            from: 'Customers',
            join: {
                with: 'Orders',
                on: "Orders.customerId=Customers.customerId",
                type: "left",
                as: {
                    customerId: "orders_customerId"
                }
            },
            where: {
                orders_customerId: -1234
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(0);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('left join when data does not match from second table using and', function (done) {

        const selectQry = con.select({
            from: 'Customers',
            join: {
                with: 'Orders',
                on: "Orders.customerId=Customers.customerId",
                type: "left",
                as: {
                    customerId: "orders.customerId"
                },
                where: {
                    customerId: -1234
                },
            }
        });

        const countQry = con.count({
            from: 'Customers'
        });
        Promise.all([selectQry, countQry]).then(function (results) {
            expect(results[0]).to.be.an('array').length(results[1]);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('left join with and or in second table', function (done) {

        const selectQry = con.select({
            from: 'Orders',
            join: {
                with: 'Customers',
                on: "Orders.customerId=Customers.customerId",
                where: {
                    country: 'Mexico',
                    or: {
                        city: 'London'
                    }
                }
            }
        });

        // const countQry = con.count({
        //     from: 'Customers'
        // });
        Promise.all([selectQry]).then(function (results) {
            expect(results[0]).to.be.an('array').length(18);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it(`SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate
    FROM Orders
    INNER JOIN Customers
    ON Orders.CustomerID=Customers.CustomerID where (Customers.country="Mexico" or Customers.City="London")
    `, function (done) {
        const selectQry = con.select({
            from: 'Orders',
            join: {
                with: 'Customers',
                on: "Orders.customerId=Customers.customerId",
            },
            where: {
                country: 'Mexico',
                or: {
                    city: 'London'
                }
            }
        });

        Promise.all([selectQry]).then(function (results) {
            // expect(results[0]).to.be.an('array').length(18);
            expect(results[0]).to.be.an('array').length(0);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it(`SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate
    FROM Orders
    INNER JOIN Customers
    ON Orders.CustomerID=Customers.CustomerID where (Customers.country="USA" and Customers.City="Seattle")
    `, function (done) {
        const selectQry = con.select({
            from: 'Orders',
            join: {
                with: 'Customers',
                on: "Orders.customerId=Customers.customerId",
            },
            where: {
                country: 'USA',
                city: 'Seattle'
            }
        });

        // const countQry = con.count({
        //     from: 'Customers'
        // });
        Promise.all([selectQry]).then(function (results) {
            expect(results[0]).to.be.an('array').length(2);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('left join with where in second table with null value', function (done) {
        con.select({
            from: 'Customers',
            join: {
                with: 'Orders',
                on: "Orders.customerId=Customers.customerId",
                type: "left",
                as: {
                    customerId: "orderCustomerId"
                },
                where: {
                    orderCustomerId: null
                },
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(19);
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
                    email: "email",
                    countryCity: "c_countryCity"
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
                    email: "email",
                    countryCity: "c_countryCity"
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

            var error = {
                "message": "The 'on' condition must reference a column from the table specified in 'with'. Found 'Orders.customerId=Customers.customerId', but 'invalid_table' was provided in 'with'.",
                "type": "invalid_join_query"
            }
            expect(err).to.eql(error);
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

    it("where array query with join", function (done) {
        const qry1 = con.select({
            from: "Orders",
            join: [{
                with: 'Customers',
                on: 'Customers.customerId=Orders.customerId',
                where: {
                    customerId: 87,
                }
            },
            {
                with: 'Employees',
                on: 'Employees.employeeId = Orders.employeeId',
            },
            ],
            where: [{
                shipperId: 3
            }]
        });

        const qry2 = con.select({
            from: "Orders",
            join: [{
                with: 'Customers',
                on: 'Customers.customerId=Orders.customerId',
                where: [{
                    customerId: 87,
                }]
            },
            {
                with: 'Employees',
                on: 'Employees.employeeId = Orders.employeeId',
            },
            ],
            where: [{
                shipperId: 3
            }]
        });

        Promise.all([qry1, qry2]).then(results => {
            expect(results[0].length).eql(results[1].length);
            expect(results[0]).eql(results[1]);
            done();
        }).catch(done);
    })

    it("where array query with or", function (done) {
        const qry1 = con.select({
            from: "Orders",
            join: [{
                with: 'Customers',
                on: 'Customers.customerId=Orders.customerId',
                where: {
                    customerId: 87,
                    or: {
                        customerId: 90,
                    },
                }
            },
            {
                with: 'Employees',
                on: 'Employees.employeeId = Orders.employeeId',
            },
            ],
            where: [{
                shipperId: 3
            }]
        });

        const qry2 = con.select({
            from: "Orders",
            join: [{
                with: 'Customers',
                on: 'Customers.customerId=Orders.customerId',
                where: [{
                    customerId: 87,
                },
                {
                    or: {
                        customerId: 90,
                    },
                }]
            },
            {
                with: 'Employees',
                on: 'Employees.employeeId = Orders.employeeId',
            },
            ],
            where: [{
                shipperId: 3
            }]
        });

        Promise.all([qry1, qry2]).then(results => {
            expect(results[0].length).eql(results[1].length);
            expect(results[0]).eql(results[1]);
            done();
        }).catch(done);
    })

});
