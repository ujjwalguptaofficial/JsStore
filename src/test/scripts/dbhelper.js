var Con = new JsStore.Instance(new Worker('../output/jsstore.worker.js'));
// JsStore.enableLog();

function initDb() {
    console.log('initiate database');
    Con.isDbExist('Demo').then(function (exist) {
        console.log('db exist :' + exist);
        if (exist) {
            Con.openDb('Demo').then(onDbInit);
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
    var customers = {
        name: 'Customers',
        columns: [{
                name: "CustomerID",
                primaryKey: true,
                autoIncrement: true
            },
            {
                name: "CustomerName",
                notNull: true,
                dataType: 'string'
            },
            {
                name: "ContactName",
                notNull: true,
                dataType: 'string'
            },
            {
                name: "Address",
                notNull: true,
                dataType: 'string',
                advTextSearch: true
            },
            {
                name: "City",
                notNull: true,
                dataType: 'string'
            },
            {
                name: "PostalCode",
                dataType: 'string'
            },
            {
                name: "Country",
                notNull: true,
                dataType: 'string'
            },
            {
                name: "Email",
                dataType: 'string',
                enableSearch: false
            }
        ]
    };

    var categories = {
        name: 'Categories',
        columns: [{
                name: "CategoryID",
                primaryKey: true,
                autoIncrement: true
            },
            {
                name: "CategoryName",
                notNull: true,
                dataType: 'string'
            },
            {
                name: "Description",
                notNull: true,
                dataType: 'string'
            }
        ]
    }

    var employees = {
        name: 'Employees',
        columns: [{
                name: "EmployeeID",
                primaryKey: true,
                autoIncrement: true
            },
            {
                name: "LastName",
                notNull: true,
                dataType: 'string'
            },
            {
                name: "BirthDate",
                notNull: true,
                dataType: 'string'
            },
            {
                name: "Photo",
                notNull: true,
                dataType: 'string'
            },
            {
                name: "Notes",
                dataType: 'string'
            }
        ]
    }

    var orderDetails = {
        name: 'OrderDetails',
        columns: [{
                name: "OrderDetailID",
                primaryKey: true,
                autoIncrement: true
            },
            {
                name: "OrderID",
                notNull: true,
                dataType: 'number'
            },
            {
                name: "ProductID",
                notNull: true,
                dataType: 'number'
            },
            {
                name: "Quantity",
                notNull: true,
                dataType: 'number'
            }
        ]
    }

    var orders = {
        name: 'Orders',
        columns: [{
                name: "OrderID",
                primaryKey: true
            },
            {
                name: "CustomerID",
                notNull: true,
                dataType: 'number'
            },
            {
                name: "EmployeeID",
                notNull: true,
                dataType: 'number'
            },
            {
                name: "OrderDate",
                notNull: true,
                dataType: 'string'
            },
            {
                name: "ShipperID",
                notNull: true,
                dataType: 'number'
            }
        ]
    }

    var products = {
        name: 'Products',
        columns: [{
                name: "ProductID",
                primaryKey: true,
                autoIncrement: true
            },
            {
                name: "ProductName",
                notNull: true,
                dataType: 'string'
            },
            {
                name: "SupplierID",
                notNull: true,
                dataType: 'number'
            },
            {
                name: "CategoryID",
                notNull: true,
                dataType: 'number'
            },
            {
                name: "Unit",
                notNull: true,
                dataType: 'string'
            },
            {
                name: "Price",
                notNull: true,
                dataType: 'number'
            }
        ]
    }

    var shippers = {
        name: 'Shippers',
        columns: [{
                name: "ShipperID",
                primaryKey: true,
                autoIncrement: true
            },
            {
                name: "ShipperName",
                notNull: true,
                dataType: 'string'
            },
            {
                name: "Phone",
                notNull: true,
                dataType: 'string'
            }
        ]
    }

    var suppliers = {
        name: 'Suppliers',
        columns: [{
                name: "SupplierID",
                primaryKey: true,
                autoIncrement: true
            },
            {
                name: "SupplierName",
                notNull: true,
                dataType: 'string'
            },
            {
                name: "ContactName",
                notNull: true,
                dataType: 'string'
            },
            {
                name: "Address",
                notNull: true,
                dataType: 'string'
            },
            {
                name: "City",
                notNull: true,
                dataType: 'string'
            },
            {
                name: "PostalCode",
                notNull: true,
                dataType: 'string'
            },
            {
                name: "Country",
                notNull: true,
                dataType: 'string'
            },
            {
                name: "Phone",
                notNull: true,
                dataType: 'string'
            }
        ]
    }

    var dataBase = {
        name: "Demo",
        tables: [customers, categories, employees, orderDetails, orders, products, shippers, suppliers]
    };
    return dataBase;
}