describe('Multiple db connection', function () {

    // it('drop db employee_db', function (done) {
    //     con.initDb(getEmployeeDbSchema()).then(function () {
    //         con.dropDb().then(function (result) {
    //             done();
    //         }).catch(done);
    //     }).catch(done);
    // });
    if (GetBrowserName().match(/chrome/i)) {
        it('getDbList api', function (done) {
            con.getDbList().then(function (result) {
                expect(result).to.be.an('array').to.length(3);
                done();
            }).catch(function (err) {
                done(err);
            })
        });
    }

    var dashboardConnection = new JsStore.Connection();
    var dbUpdateConnection = new JsStore.Connection();
    var employeeConnection = new JsStore.Connection();

    it('open db Dashboard', function () {
        return dashboardConnection.openDb("Dashboard");
    })

    it('open db DbUpdateTest', function () {
        return dbUpdateConnection.openDb("DbUpdateTest", 2);
    })

    it('open db employee', function () {
        return employeeConnection.openDb("employee_db");
    })

    it('select from employee', function () {
        return employeeConnection.select({
            from: 'employee'
        }).then(results => {
            expect(results).to.be.an('array').length(10)
        })
    })

    it('select from job', function () {
        return dashboardConnection.select({
            from: 'Job'
        }).then(results => {
            expect(results).to.be.an('array').length(26)
        })
    })

    it('select from DbUpdateTest', function () {
        return dbUpdateConnection.select({
            from: 'test'
        }).then(results => {
            expect(results).to.be.an('array').length(0)
        })
    })

    it('select wrong table from employee db', function () {
        return employeeConnection.select({
            from: 'employees'
        }).catch(err => {
            var error = {
                "message": "Table 'employees' does not exist",
                "type": "table_not_exist"
            };
            expect(err).to.be.an('object').eql(error);
        })
    })


});