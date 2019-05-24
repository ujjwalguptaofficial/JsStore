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

    it('select from student left join with studentdetail', function (done) {
        con.select({
            from: "Student",
            join: {
                with: "StudentDetail",
                on: "Student.Name=StudentDetail.Name"
            },
            order: { by: 'Order', type: 'asc' }
            // from: {
            //     table1: { table: 'Student', column: 'Name', order: { by: 'Order', type: 'asc' } },
            //     join: 'left',
            //     table2: { table: 'StudentDetail', column: 'Name' }
            // }
        }).then(function (results) {
            expect(results).to.be.an('array').length(5);
            for (var i = 0; i < results.length; i++) {
                expect(results[i]['Student']['Order']).to.be.equal((i + 1).toString());
            }
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('drop db', function (done) {
        con.dropDb().then(function () {
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('open db Demo', function (done) {
        con.initDb(getDemoDbSchema()).then(function (isDbCreated) {
            expect(isDbCreated).to.be.an('boolean').equal(false);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

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
                Phone: '55555555555555'
            },
            {
                Name: 'Test3',
                Card: 'Test3-card',
                Phone: '33333333333333'
            },
            {
                Name: 'Test2',
                Card: 'Test2-card',
                Phone: '22222222222222'
            },
            {
                Name: 'Test4',
                Card: 'Test4-card',
                Phone: '44444444444444'
            },
            {
                Name: 'Test1',
                Card: 'Test1-card',
                Phone: '11111111111111'
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
                Phone: { notNull: true, dataType: "string" }
            }
        }
        var dataBase = {
            name: "Students",
            tables: [tblStudent, tblStudentDetail]
        }

        return dataBase;
    }
});


