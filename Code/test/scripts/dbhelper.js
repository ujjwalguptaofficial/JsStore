var Con = new JsStore.Instance();
// JsStore.enableLog();

function initDb() {
    console.log('initiate database');
    JsStore.isDbExist('Demo', function (exist) {
            console.log('db exist :' + exist);
            if (exist) {
                Con.openDb('Demo', onDbInit);
            } else {
                Con.createDb(DataBase, function () {
                    console.log('Database created');
                    onDbInit();
                });
                // insertIntoDb();
            }
        },
        function (err) {
            console.log(err);
            //alert(err.Message);
        });
}

var Customers = {
    Name: 'Customers',
    Columns: [{
            Name: "CustomerID",
            PrimaryKey: true,
            AutoIncrement: true
        },
        {
            Name: "CustomerName",
            NotNull: true,
            DataType: 'string'
        },
        {
            Name: "ContactName",
            NotNull: true,
            DataType: 'string'
        },
        {
            Name: "Address",
            NotNull: true,
            DataType: 'string'
        },
        {
            Name: "City",
            NotNull: true,
            DataType: 'string'
        },
        {
            Name: "PostalCode",
            DataType: 'string'
        },
        {
            Name: "Country",
            NotNull: true,
            DataType: 'string'
        }
    ]
};

var Categories = {
    Name: 'Categories',
    Columns: [{
            Name: "CategoryID",
            PrimaryKey: true,
            AutoIncrement: true
        },
        {
            Name: "CategoryName",
            NotNull: true,
            DataType: 'string'
        },
        {
            Name: "Description",
            NotNull: true,
            DataType: 'string'
        }
    ]
}

var Employees = {
    Name: 'Employees',
    Columns: [{
            Name: "EmployeeID",
            PrimaryKey: true,
            AutoIncrement: true
        },
        {
            Name: "LastName",
            NotNull: true,
            DataType: 'string'
        },
        {
            Name: "BirthDate",
            NotNull: true,
            DataType: 'string'
        },
        {
            Name: "Photo",
            NotNull: true,
            DataType: 'string'
        },
        {
            Name: "Notes",
            DataType: 'string'
        }
    ]
}

var OrderDetails = {
    Name: 'OrderDetails',
    Columns: [{
            Name: "OrderDetailID",
            PrimaryKey: true,
            AutoIncrement: true
        },
        {
            Name: "OrderID",
            NotNull: true,
            DataType: 'number'
        },
        {
            Name: "ProductID",
            NotNull: true,
            DataType: 'number'
        },
        {
            Name: "Quantity",
            NotNull: true,
            DataType: 'number'
        }
    ]
}

var Orders = {
    Name: 'Orders',
    Columns: [{
            Name: "OrderID",
            PrimaryKey: true
        },
        {
            Name: "CustomerID",
            NotNull: true,
            DataType: 'number'
        },
        {
            Name: "EmployeeID",
            NotNull: true,
            DataType: 'number'
        },
        {
            Name: "OrderDate",
            NotNull: true,
            DataType: 'string'
        },
        {
            Name: "ShipperID",
            NotNull: true,
            DataType: 'number'
        }
    ]
}

var Products = {
    Name: 'Products',
    Columns: [{
            Name: "ProductID",
            PrimaryKey: true,
            AutoIncrement: true
        },
        {
            Name: "ProductName",
            NotNull: true,
            DataType: 'string'
        },
        {
            Name: "SupplierID",
            NotNull: true,
            DataType: 'number'
        },
        {
            Name: "CategoryID",
            NotNull: true,
            DataType: 'number'
        },
        {
            Name: "Unit",
            NotNull: true,
            DataType: 'string'
        },
        {
            Name: "Price",
            NotNull: true,
            DataType: 'number'
        }
    ]
}

var Shippers = {
    Name: 'Shippers',
    Columns: [{
            Name: "ShipperID",
            PrimaryKey: true,
            AutoIncrement: true
        },
        {
            Name: "ShipperName",
            NotNull: true,
            DataType: 'string'
        },
        {
            Name: "Phone",
            NotNull: true,
            DataType: 'string'
        }
    ]
}

var Suppliers = {
    Name: 'Suppliers',
    Columns: [{
            Name: "SupplierID",
            PrimaryKey: true,
            AutoIncrement: true
        },
        {
            Name: "SupplierName",
            NotNull: true,
            DataType: 'string'
        },
        {
            Name: "ContactName",
            NotNull: true,
            DataType: 'string'
        },
        {
            Name: "Address",
            NotNull: true,
            DataType: 'string'
        },
        {
            Name: "City",
            NotNull: true,
            DataType: 'string'
        },
        {
            Name: "PostalCode",
            NotNull: true,
            DataType: 'string'
        },
        {
            Name: "Country",
            NotNull: true,
            DataType: 'string'
        },
        {
            Name: "Phone",
            NotNull: true,
            DataType: 'string'
        }
    ]
}

var DataBase = {
        Name: "Demo",
        Tables: [Customers, Categories, Employees, OrderDetails, Orders, Products, Shippers, Suppliers]
    },
    TableInsertCount = 0;

function onDataInserted() {
    ++TableInsertCount;
    if (TableInsertCount == 8) {
        setStatusMsg('All data inserted');
        onDbInit();
    }
}

function insertIntoDb() {
    insertCustomers();
    insertCategories();
    insertEmployees();
    insertOrderDetails();
    insertOrders();
    insertProducts();
    insertShippers();
    insertSuppliers();
}

function setStatusMsg(msg) {
    console.log(msg);
}

function insertCustomers() {
    $.getJSON("static/Customers.json", function (results) {
        setStatusMsg('Inserting data into table Customers');
        Con.insert({
            Into: 'Customers',
            Values: results,
            OnSuccess: function (rowsInserted) {
                var Msg = rowsInserted + " rows inserted for table customers";
                setStatusMsg(Msg);
                onDataInserted();
            },
            OnError: function (err) {
                Console.error(err);
            }
        })
    })
}

function insertCategories() {
    $.getJSON("static/Categories.json", function (results) {
        setStatusMsg('Inserting data into table Categories');
        Con.insert({
            Into: 'Categories',
            Values: results,
            OnSuccess: function (rowsInserted) {
                var Msg = rowsInserted + " rows inserted for table Categories";
                setStatusMsg(Msg);
                onDataInserted();
            },
            OnError: function (err) {
                Console.error(err);
            }
        })
    })
}

function insertEmployees() {
    $.getJSON("static/Employees.json", function (results) {
        setStatusMsg('Inserting data into table Employees');
        Con.insert({
            Into: 'Employees',
            Values: results,
            OnSuccess: function (rowsInserted) {
                var Msg = rowsInserted + " rows inserted for table Employees";
                setStatusMsg(Msg);
                onDataInserted();
            },
            OnError: function (err) {
                Console.error(err);
            }
        })
    })
}

function insertOrderDetails() {
    $.getJSON("static/OrderDetails.json", function (results) {
        setStatusMsg('Inserting data into table OrderDetails');
        Con.insert({
            Into: 'OrderDetails',
            Values: results,
            OnSuccess: function (rowsInserted) {
                var Msg = rowsInserted + " rows inserted for table OrderDetails";
                setStatusMsg(Msg);
                onDataInserted();
            },
            OnError: function (err) {
                Console.error(err);
            }
        })
    })
}


function insertOrders() {
    $.getJSON("static/Orders.json", function (results) {
        setStatusMsg('Inserting data into table Orders');
        Con.insert({
            Into: 'Orders',
            Values: results,
            SkipDataCheck: true,
            OnSuccess: function (rowsInserted) {
                var Msg = rowsInserted + " rows inserted for table Orders";
                setStatusMsg(Msg);
                onDataInserted();
            },
            OnError: function (err) {
                Console.error(err);
            }
        })
    })
}

function insertProducts() {
    $.getJSON("static/Products.json", function (results) {
        setStatusMsg('Inserting data into table Products');
        Con.insert({
            Into: 'Products',
            Values: results,
            OnSuccess: function (rowsInserted) {
                var Msg = rowsInserted + " rows inserted for table Products";
                setStatusMsg(Msg);
                onDataInserted();
            },
            OnError: function (err) {
                Console.error(err);
            }
        })
    })
}

function insertShippers() {
    $.getJSON("static/Shippers.json", function (results) {
        setStatusMsg('Inserting data into table Shippers');
        Con.insert({
            Into: 'Shippers',
            Values: results,
            OnSuccess: function (rowsInserted) {
                var Msg = rowsInserted + " rows inserted for table Shippers";
                setStatusMsg(Msg);
                onDataInserted();
            },
            OnError: function (err) {
                Console.error(err);
            }
        })
    })
}

function insertSuppliers() {
    $.getJSON("static/Suppliers.json", function (results) {
        setStatusMsg('Inserting data into table Suppliers');
        Con.insert({
            Into: 'Suppliers',
            Values: results,
            OnSuccess: function (rowsInserted) {
                var Msg = rowsInserted + " rows inserted for table Suppliers";
                setStatusMsg(Msg);
                onDataInserted();
            },
            OnError: function (err) {
                Console.error(err);
            }
        })
    })
}