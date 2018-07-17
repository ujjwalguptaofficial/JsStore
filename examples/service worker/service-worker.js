self.addEventListener('fetch', function (event) {
  console.log("fetch event:", event.request.url);
});
importScripts('./jsstore.js');
importScripts('./jsstore.worker.js');

var connection = new JsStore.Instance();
var dbName = "Demo";

connection.isDbExist(dbName).then(function (isExist) {
  if (isExist) {
    connection.openDb(DbName).then(function () {
      console.log('db opened');
    });
  } else {
    var DataBase = getDatabase();
    connection.createDb(DataBase).then(function (tables) {
      console.log(tables);
    });
  }
}).catch(function (err) {
  console.log(err);
});

function getDatabase() {
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