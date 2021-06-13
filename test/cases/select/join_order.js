describe('select join order test', function () {
    it('create db student', function (done) {
        con.initDb(getDatabase()).then(function (isDbCreated) {
            expect(isDbCreated).to.be.an('boolean').equal(true);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('insert into student', function (done) {
        var students = getStudents();
        con.insert({
            into: "Student",
            values: students
        }).then(function () {
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('insert into student Order Details', function (done) {
        var details = getStudentsDetails();
        con.insert({
            into: "StudentDetail",
            values: details
        }).then(function () {
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select from student left join with studentdetail without as', function (done) {
        con.select({
            from: "Student",
            join: {
                with: "StudentDetail",
                on: "Student.Name=StudentDetail.Name"
            },
            order: { by: 'Student.Order', type: 'asc' }
        }).then(function (results) {
            if (isRuningForProd() || isRuningForSauce()) {
                expect(results).to.be.an('array').length(5);
                for (var i = 0; i < results.length; i++) {
                    expect(results[i]['Order']).to.be.equal((i + 1).toString());
                }
                done();
            }
            else {
                done(results);
            }
        }).catch(function (err) {
            var error = { "message": "column Id exist in both table Student & StudentDetail", "type": "invalid_join_query" };
            expect(error).to.be.eql(err);
            done();
        })
    });

    it('select from student left join with studentdetail with as', function (done) {
        con.select({
            from: "Student",
            join: {
                with: "StudentDetail",
                on: "Student.Name=StudentDetail.Name",
                as: {
                    Id: 'StudentDetailId'
                }
            },
            order: { by: 'Student.Order', type: 'asc' }
        }).then(function (results) {
            expect(results).to.be.an('array').length(5);
            for (var i = 0; i < results.length; i++) {
                expect(results[i]['Order']).to.be.equal((i + 1).toString());
            }
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select from student left join with studentdetail with as & limit 3', function (done) {
        con.select({
            from: "Student",
            join: {
                with: "StudentDetail",
                on: "Student.Name=StudentDetail.Name",
                as: {
                    Id: 'StudentDetailId'
                }
            },
            order: { by: 'Student.Order', type: 'asc' },
            limit: 3
        }).then(function (results) {
            expect(results).to.be.an('array').length(3);
            // console.log(JSON.stringify(results));
            for (var i = 0; i < results.length; i++) {
                expect(results[i]['Order']).to.be.equal((i + 1).toString());
            }
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select from student left join with studentdetail with as & invalid order query', function (done) {
        con.select({
            from: "Student",
            join: {
                with: "StudentDetail",
                on: "Student.Name=StudentDetail.Name",
                as: {
                    Id: 'StudentDetailId'
                }
            },
            order: { by: 'Order', type: 'asc' }
        }).catch(function (err) {
            if (isRuningForProd() || isRuningForSauce()) {
                expect(err).to.be.an('object').haveOwnProperty('type').equal('invalid_join_query');
            }
            else {
                var error = { "message": "Cannot read property 'columns' of undefined", "type": "invalid_order_query" };
                if (GetBrowserName().match(/chrome/i)) {
                    expect(error).to.be.eql(err);
                }
                else {
                    expect(err.type).to.be.eql(error.type);
                }
            }
            done();
        })
    });

    it('select from student left join with studentdetail with as & order type desc', function (done) {
        con.select({
            from: "Student",
            join: {
                with: "StudentDetail",
                on: "Student.Name=StudentDetail.Name",
                as: {
                    Id: 'StudentDetailId'
                }
            },
            order: { by: 'Student.Order', type: 'desc' }
        }).then(function (results) {
            expect(results).to.be.an('array').length(5);
            for (var i = 0, length = results.length; i < length; i++) {
                expect(results[i]['Order']).to.be.equal((length - i).toString());
            }
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('drop db student', function (done) {
        con.dropDb().then(function () {
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('open db Demo', function (done) {
        con.openDb("Demo").then(function (isDbCreated) {
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('order table test', function (done) {
        con.select({
            from: "Orders",
            order: {
                by: 'Orders.customerId',
                type: "desc"
            },
            join: [{
                with: "Shippers",
                on: "Shippers.shipperId = Orders.shipperId"
            }]
        }).then(function () {
            done();
        }).catch(done);
    })

    function getStudents() {
        //Student Array
        var Students = [{
            Name: 'Test5',
            Gender: 'male',
            Order: '5'
        },
        {
            Name: 'Test3',
            Gender: 'male',
            Order: '3'
        },
        {
            Name: 'Test2',
            Gender: 'female',
            Order: '2'
        },
        {
            Name: 'Test4',
            Gender: 'male',
            Order: '4'
        },
        {
            Name: 'Test1',
            Gender: 'male',
            Order: '1'
        }
        ]
        return Students;
    };

    function getStudentsDetails() {
        var Details = [
            {
                Name: 'Test5',
                Card: 'Test5-card',
                phone: '55555555555555'
            },
            {
                Name: 'Test3',
                Card: 'Test3-card',
                phone: '33333333333333'
            },
            {
                Name: 'Test2',
                Card: 'Test2-card',
                phone: '22222222222222'
            },
            {
                Name: 'Test4',
                Card: 'Test4-card',
                phone: '44444444444444'
            },
            {
                Name: 'Test1',
                Card: 'Test1-card',
                phone: '11111111111111'
            }
        ]
        return Details;
    }

    function getDatabase() {
        var tblStudent = {
            name: "Student",
            columns: {
                Id: { primaryKey: true, autoIncrement: true },
                Name: { notNull: true, dataType: "string" },
                Gender: { dataType: "string", default: 'male' },
                Order: { notNull: true, dataType: "string" }
            }
        }
        var tblStudentDetail = {
            name: "StudentDetail",
            columns: {
                Id: { primaryKey: true, autoIncrement: true },
                Name: { notNull: true, dataType: "string" },
                Card: { dataType: "string", default: '--' },
                phone: { notNull: true, dataType: "string" }
            }
        }
        var dataBase = {
            name: "Students",
            tables: [tblStudent, tblStudentDetail]
        }

        return dataBase;
    }
});


