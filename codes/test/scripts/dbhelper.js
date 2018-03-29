var Con = new JsStore.Instance(new Worker('../output/jsstore.worker.js'));
// JsStore.enableLog();

function initDb() {
    console.log('initiate database');
    Con.isDbExist('Demo').then(function (exist) {
        console.log('db exist :' + exist);
        if (exist) {
            Con.openDb('Demo').then(function () {
                onDbInit
            });
        } else {
            Con.createDb(getDbSchema()).then(function () {
                console.log('Database created');
                onDbInit();
            });
        }
    }).catch(function (err) {
        console.log(err);
        //alert(err.Message);
    });
}

function getDbSchema() {
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
                DataType: 'string',
                AdvTextSearch: true
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
            },
            {
                Name: "Email",
                DataType: 'string',
                EnableSearch: false
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
    };
    return DataBase;
}