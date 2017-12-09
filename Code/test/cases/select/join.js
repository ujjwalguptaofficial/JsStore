describe('Test join', function () {
    it('inner join', function (done) {
        var JoinLogic = {
            Table1: {
                Table: 'Orders',
                Column: 'CustomerID'
            },
            Join: 'inner',
            Table2: {
                Table: 'Customers',
                Column: 'CustomerID'
            }
        };
        Con.select({
            From: JoinLogic,
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(196);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('left join', function (done) {
        var JoinLogic = {
            Table1: {
                Table: 'Orders',
                Column: 'CustomerID'
            },
            Join: 'left',
            Table2: {
                Table: 'Customers',
                Column: 'CustomerID'
            }
        };
        Con.select({
            From: JoinLogic,
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(196);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('right join', function (done) {
        var JoinLogic = {
            Table1: {
                Table: 'Orders',
                Column: 'CustomerID'
            },
            Join: 'right',
            Table2: {
                Table: 'Customers',
                Column: 'CustomerID'
            }
        };
        Con.select({
            From: JoinLogic,
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(93);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

    it('right join', function (done) {
        var JoinLogic = {
            Table1: {
                Table: 'Orders',
                Column: 'CustomerID'
            },
            Join: 'right',
            Table2: {
                Table: 'Customers',
                Column: 'CustomerID'
            }
        };
        Con.select({
            From: JoinLogic,
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(93);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });


    it('three table join', function (done) {
        //first join between two tables
        var Join1 = {
            Table1: {
                Table: 'Orders',
                Column: 'CustomerID'
            },
            Join: 'inner',
            Table2: {
                Table: 'Customers',
                Column: 'CustomerID'
            },
            NextJoin: { // Provide details for next join 
                Table: 'Orders', // which table will be used from above two tables.,  
                Column: 'ShipperID' // which column will be used from Table
            }
            // we have defined that table Orders will be used for next join on column ShippersID
        }

        //join with third tables
        var Join2 = {
            Table1: Join1,
            Join: 'inner',
            Table2: {
                Table: 'Shippers',
                Column: 'ShipperID'
            }
        }
        Con.select({
            From: Join2,
            OnSuccess: function (results) {
                expect(results).to.be.an('array').length(196);
                done();
            },
            OnError: function (err) {
                done(err);
            }
        })
    });

});