describe('Test select complex case', function () {

    it('select with where array without limit and skip', function (done) {
        con.select({
            from: "Customers",
            where: [{
                country: "Mexico"
            }],
            skip: null,
            limit: null,
            ignoreCase: false,
            distinct: false,
            order: null,
            groupBy: null,
            aggregate: null,
            join: null
        }).then(function (results) {
            expect(results).to.be.an('array').length(5);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with multiple or', function (done) {
        con.select({
            from: 'Customers',
            where: {
                country: 'Mexico',
                or: {
                    city: 'Madrid',
                    address: {
                        like: '%a%'
                    }
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(73);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with and "&" like', function (done) {
        con.select({
            from: 'Customers',
            where: {
                address: {
                    like: '%a%'
                },
                city: 'London'
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(4);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with and "&" not', function (done) {
        con.select({
            from: 'Customers',
            where: {
                country: {
                    '!=': 'Mexico'
                },
                city: 'London'
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(6);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with multiple and (wrong data)', function (done) {
        con.select({
            from: 'Customers',
            where: {
                address: 'hisrtgb',
                city: 'London'
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(0);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with or (wrong data)', function (done) {
        con.select({
            from: 'Customers',
            where: {
                address: 'hisrtgb',
                or: {
                    city: 'London'
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(6);
            done();
        }).catch(function (err) {
            done(err);
        })
    });


    it("sql qry - select * from customers where city='london' or address like 'a%' ", function (done) {
        con.select({
            from: 'Customers',
            where: {
                city: 'London',
                or: {
                    address: {
                        like: 'a%'
                    }
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(16);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it("sql qry - select * from customers where city='dsfgtbb' or address like 'a%' ", function (done) {
        con.select({
            from: 'Customers',
            where: {
                city: 'dsfgtbb',
                or: {
                    address: {
                        like: 'a%'
                    }
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(10);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it("sql qry - SELECT * FROM Customers WHERE country='Mexico' and (city='London' or address like '%a%')", function (done) {
        con.select({
            from: 'Customers',
            where: [{
                country: 'Mexico'
            },
            {
                city: 'London',
                or: {
                    address: {
                        like: '%a%'
                    }
                }
            }
            ]
        }).then(function (results) {
            if (results.length > 0) {
                var expected_id_list = [80, 2, 58, 3, 13];
                var id_list = [];
                results.forEach(function (element) {
                    id_list.push(element.customerId);
                });
                expect(id_list).to.be.an('array').length(5).deep.equal(expected_id_list);
                done();
            } else {
                done('no results');
            }
        }).catch(function (err) {
            done(err);
        })
    });

    it("sql qry - SELECT * FROM Customers WHERE country='Mexizfdfco' and (city='London' or address like '%a%')", function (done) {
        con.select({
            from: 'Customers',
            where: [{
                country: 'Mexizfdfco'
            },
            {
                city: 'London',
                or: {
                    address: {
                        like: '%a%'
                    }
                }
            }
            ]
        }).then(function (results) {
            expect(results).to.be.an('array').length(0);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it("sql qry - SELECT * FROM Customers WHERE country='Mexico' or (city='London' and address like '%a%')", function (done) {
        con.select({
            from: 'Customers',
            where: [{
                country: 'Mexico'
            },
            {
                or: {
                    city: 'London',
                    address: {
                        like: '%a%'
                    }
                }
            }
            ]
        }).then(function (results) {
            var expected_id_list = [2, 3, 13, 58, 80, 4, 11, 16, 72];
            var id_list = [];
            results.forEach(function (element) {
                id_list.push(element.customerId);
            });
            expect(id_list).to.be.an('array').length(9).deep.equal(expected_id_list);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it("sql qry - SELECT * FROM Customers WHERE country='Mexico' or (city='London' and address like '%adsfvbbbb%')", function (done) {
        con.select({
            from: 'Customers',
            where: [{
                country: 'Mexico'
            },
            {
                or: {
                    city: 'London',
                    address: {
                        like: '%adsfvbbbb%'
                    }
                }
            }
            ]
        }).then(function (results) {
            var expected_id_list = [2, 3, 13, 58, 80];
            var id_list = [];
            results.forEach(function (element) {
                id_list.push(element.customerId);
            });
            expect(id_list).to.be.an('array').length(5).deep.equal(expected_id_list);
            done();
        }).catch(function (err) {
            done(err);
        })
    });


    it("sql qry - SELECT * FROM Customers WHERE country='Mexico' and (city='London' or address like '%a%') and contactName like '%a%'", function (done) {
        con.select({
            from: 'Customers',
            where: [{
                country: 'Mexico'
            },
            {
                city: 'London',
                or: {
                    address: {
                        like: '%a%'
                    }
                }
            },
            {
                contactName: {
                    like: '%a%'
                }
            }
            ]
        }).then(function (results) {
            expect(results).to.be.an('array').length(4);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it("sql qry - SELECT * FROM Customers WHERE country='Mexico' and (city='London' or address like '%a%') or contactName like 'a%'", function (done) {
        con.select({
            from: 'Customers',
            where: [{
                country: 'Mexico'
            },
            {
                city: 'London',
                or: {
                    address: {
                        like: '%a%'
                    }
                }
            },
            {
                or: {
                    contactName: {
                        like: 'a%'
                    }
                }
            }
            ]
        }).then(function (results) {
            expect(results).to.be.an('array').length(13);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it("select * from employees where jobSuspendedFlag=0 && state in('Working', 'Diagnostics', 'FinalTest')", function (done) {
        con.select({
            from: 'Employees',
            where: {
                jobSuspendedFlag: 0,
                state: {
                    in: ['Working', 'Diagnostics', 'FinalTest']
                }
            }
        }).
            then(function (results) {
                expect(results).to.be.an('array').length(15);
                done();
            }).
            catch(function (err) {
                done(err);
            })
    });

    it("select with ignore case true where one column is in query of type number & other column is like", function (done) {
        con.select({
            from: "Categories",
            ignoreCase: true,
            where: {
                categoryId: {
                    in: [5, 6, 7]
                },
                categoryName: {
                    like: '%c%'
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(2);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it("select with ignore case true where column is in query of type number", function (done) {
        con.select({
            from: "Categories",
            ignoreCase: true,
            where: {
                categoryId: {
                    in: [5, 6, 7]
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(3);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with where as array, limit', function (done) {
        con.select({
            from: "Customers",
            where: [{
                country: 'Mexico'
            },
            {
                or: {
                    country: 'UK'
                }
            }],
            limit: 2
        }).then(function (results) {
            const expectedId = [2, 3];
            expect(results).to.be.an('array').length(expectedId.length);
            results.forEach(function (val, index) {
                expect(val.customerId).to.equal(expectedId[index]);
            })
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with where as array, skip', function (done) {
        con.select({
            from: "Customers",
            where: [{
                country: 'Mexico'
            },
            {
                or: {
                    country: 'UK'
                }
            }],
            skip: 2
        }).then(function (results) {
            const expectedId = [13, 58, 80, 4, 11, 16, 19, 38, 53, 72];
            expect(results).to.be.an('array').length(expectedId.length);
            results.forEach(function (val, index) {
                expect(val.customerId).to.equal(expectedId[index]);
            })
            done();
        }).catch(function (err) {
            done(err);
        })
    });


    it('select with where as array, skip & limit', function (done) {
        con.select({
            from: "Customers",
            where: [{
                country: 'Mexico'
            },
            {
                or: {
                    country: 'UK'
                }
            }],
            skip: 2,
            limit: 2
        }).then(function (results) {
            const expectedId = [13, 58];
            expect(results).to.be.an('array').length(expectedId.length);
            results.forEach(function (val, index) {
                expect(val.customerId).to.equal(expectedId[index]);
            })
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('SELECT * FROM Orders WHERE (shipperId = 3 AND employeeId = 4) OR (shipperId = 2 AND employeeId = 3) AND (orderId < 10300 AND customerId = 88) OR orderID > 10400;', function (done) {
        con.select({
            from: 'Orders',
            where: [{
                shipperId: 3,
                employeeId: 4
            }, {
                or: {
                    shipperId: 2,
                    employeeId: 3
                }
            },
            {
                orderId: {
                    '<': 10300
                },
                customerId: 88
            }, {
                or: {
                    orderId: { '>': 10400 }
                }
            }
            ]
        }).then(function (results) {
            expect(results).to.be.an('array').length(44);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('SELECT * from Products where supplierID=1 and ((categoryId=1 and price=18) or (categoryId=2 and price=22))    ', function (done) {
        con.select({
            from: "Products",
            where: [{
                supplierId: 1,
            }, [{
                categoryId: 1,
                price: 18,
            }, {
                or: {
                    categoryId: 2,
                    price: 22,
                }
            }]
            ]
        }).then(function (results) {
            expect(results).to.be.an('array').length(1).eql([
                { "productId": 1, "productName": "Chais", "supplierId": 1, "categoryId": 1, "unit": "10 boxes x 20 bags", "price": 18 }
            ])
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('SELECT * from Products where supplierID=1 or ((categoryId=1 and price=18) or (categoryId=2 and price=22))    ', function (done) {
        con.select({
            from: "Products",
            where: [{
                supplierId: 1,
            }, {
                or: [{
                    categoryId: 1,
                    price: 18,
                }, {
                    or: {
                        categoryId: 2,
                        price: 22,
                    }
                }]
            }
            ]
        }).then(function (results) {
            expect(results).to.be.an('array').length(7);
            const productIds = results.map(item => item.productId);
            const expectedIds = [1, 2, 3, 35, 39, 76, 4];
            expect(productIds).eql(expectedIds);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it(`SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate
    FROM Orders
    where orderId<1000000 && shipperId=2 and ((employeeId=4 and customerId=34) or (employeeId=4 and customerId=76)) order by orderid asc        
    `, function (done) {
        con.select({
            from: "Orders",
            order: {
                by: 'customerId',
                type: 'asc' //supprted sort type is - asc,desc
            },
            where: [{
                orderId: {
                    '<': 1000000
                }
            }, {
                shipperId: 2,
            },
            [{
                employeeId: 4,
                customerId: 34,
            }, {
                or: {
                    employeeId: 4,
                    customerId: 76
                }
            }],
            ]
        }).then(function (results) {
            expect(results).to.be.an('array').length(3);
            const expectedIds = results.map(result => result.orderId);
            expect(expectedIds).eql([10250, 10252, 10302])
            done();
        }).catch(done)
    });

    it(`SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate
    FROM Orders
    where shipperId=2 and ((employeeId=4 and customerId=34) or (employeeId=4 and customerId=76)) and orderId<1000000 order by orderid asc        
    `, function (done) {
        con.select({
            from: "Orders",
            order: {
                by: 'customerId',
                type: 'asc' //supprted sort type is - asc,desc
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
                    customerId: 76
                }
            }],
            {
                orderId: {
                    '<': 1000000
                }
            },
            ]
        }).then(function (results) {
            expect(results).to.be.an('array').length(3);
            const expectedIds = results.map(result => result.orderId);
            expect(expectedIds).eql([10250, 10252, 10302])
            done();
        }).catch(done)
    });
});