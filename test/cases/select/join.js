describe('Test join', function () {
    it('inner join', function (done) {
        var joinLogic = {
            table1: {
                table: 'Orders',
                column: 'CustomerID'
            },
            join: 'inner',
            table2: {
                table: 'Customers',
                column: 'CustomerID'
            }
        };
        con.select({
            from: joinLogic
        }).then(function (results) {
            expect(results).to.be.an('array').length(196);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('left join', function (done) {
        var joinLogic = {
            table1: {
                table: 'Orders',
                column: 'CustomerID'
            },
            join: 'left',
            table2: {
                table: 'Customers',
                column: 'CustomerID'
            }
        };
        con.select({
            from: joinLogic
        }).then(function (results) {
            expect(results).to.be.an('array').length(196);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('right join using left', function (done) {
        var joinLogic = {
            table1: {
                table: 'Customers',
                column: 'CustomerID'
            },
            join: 'left',
            table2: {
                table: 'Orders',
                column: 'CustomerID'
            }
        };
        con.select({
            from: joinLogic
        }).then(function (results) {
            expect(results).to.be.an('array').length(93);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('three table join', function (done) {
        //first join between two tables
        var join1 = {
            table1: {
                table: 'Orders',
                column: 'CustomerID'
            },
            join: 'inner',
            table2: {
                table: 'Customers',
                column: 'CustomerID'
            },
            nextJoin: { // Provide details for next join 
                table: 'Orders', // which table will be used from above two tables.,  
                column: 'ShipperID' // which column will be used from Table
            }
            // we have defined that table Orders will be used for next join on column ShippersID
        }

        //join with third tables
        var join2 = {
            table1: join1,
            join: 'inner',
            table2: {
                table: 'Shippers',
                column: 'ShipperID'
            }
        }
        con.select({
            from: join2
        }).then(function (results) {
            expect(results).to.be.an('array').length(196);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

});