var dbName = "Students";

function initiateDb() {
    connection.isDbExist(dbName).then(function (isExist) {
        if (isExist) {
            connection.openDb(dbName).then(function () {
                console.log('db opened');
            });
            showTableData();
        } else {
            var DataBase = getDbSchema();
            connection.createDb(DataBase).then(function (tables) {
                console.log(tables);
            });
            var students = getPreStudents();
            insertStudents(students);
            showTableData();
        }
    }).catch(function (err) {
        console.log(err);
        alert(err.message);
    });
}

function getDbSchema() {
    var tblStudent = {
        name: "Student",
        columns: [{
                name: "Id",
                primaryKey: true,
                autoIncrement: true
            },
            {
                name: "Name",
                notNull: true,
                dataType: "string"
            },
            {
                name: "Gender",
                dataType: "string",
                default: 'male'
            },
            {
                name: "Country",
                notNull: true,
                dataType: "string"
            },
            {
                name: "City",
                notNull: true
            }
        ]
    }
    var dataBase = {
        name: "Students",
        tables: [tblStudent]
    }

    return dataBase;
}