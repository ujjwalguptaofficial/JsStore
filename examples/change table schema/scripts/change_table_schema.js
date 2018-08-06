var dbName = "Students";

function getNewDbSchema() {
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
            }, {
                name: "Address", // new column
                default: null
            }
        ],
        version: 2 // increment version for every update
    }
    var dataBase = {
        name: "Students",
        tables: [tblStudent]
    }

    return dataBase;
}

function initiateDb() {

    connection.isDbExist({
        dbName: dbName,
        table: {
            name: "Student", // we want to update schema for table Student. 
            // If you have multiple table, just specify one.
            version: 2 // same as what you have specified in the table
        }
    }).then(function (isExist) {
        if (isExist) { // version 2 is already there
            connection.openDb(dbName).then(function () {
                console.log('db opened');
            });
            showTableData();
        } else { // version 2 is new and you can recreate the table schema
            createNewDbSchema();
        }
    }).catch(function (err) {
        console.log(err);
        alert(err.message);
    });
}

function getAllSavedStudent() {
    return new Promise(function (resolve, reject) {
        // open the connection
        // without opening the connection , you can't get the data
        connection.openDb(dbName);
        getAllStudent().then(resolve).catch(reject);
    });


}

function createNewDbSchema() {
    // since we are changing Student table
    // let's fetch all data and save into a variable
    // because when table schema will be changed, all data for the particular table will be cleared.
    getAllSavedStudent().then(function (students) {
        // now we have data, let's change the table schema
        var DataBase = getNewDbSchema();
        connection.createDb(DataBase).then(function (tables) {
            // new column address value will be null
            insertStudents(students);
            showTableData();
        });
    }).catch(function (err) {
        console.log(err);
        alert(err.message);
    });
}