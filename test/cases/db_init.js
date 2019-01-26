describe("initiate database", () => {
    before(() => {
        console.log('initiate database');
        var isIE = /*@cc_on!@*/ false || !!document.documentMode;
        if (isIE) {
            console.log('test runing for ie');
            con = new JsStore.Instance(new Worker('../output/jsstore.worker.ie.min.js'));
        } else {
            if (typeof isRuningForSauceLab != 'undefined' && isRuningForSauceLab) {
                console.log("test runing for sauce lab");
                con = new JsStore.Instance(new Worker('../output/jsstore.worker.min.js'));
            } else if (typeof isRuningForProd != 'undefined' && isRuningForProd) {
                console.log("test runing for production");
                con = new JsStore.Instance(new Worker('../output/jsstore.worker.min.js'));
            } else {
                console.log("test runing for development");
                con = new JsStore.Instance(new Worker('output/jsstore.worker.js'));
                con.setLogStatus(true);
            }
        }
    })

    it("db exist", (done) => {
        con.isDbExist('Demo').then(function (exist) {
            console.log('db exist :' + exist);
            if (exist) {
                con.openDb('Demo').then(done);
            } else {
                con.createDb(getDbSchema()).then(function () {
                    console.log('Database created');
                    done();
                });
            }
        }).catch(function (err) {
            done(err);
        });
    })
})

function getDbSchema() {
    var Column = JsStore.Column;
    var COL_OPTION = JsStore.COL_OPTION;
    var DATA_TYPE = JsStore.DATA_TYPE;

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
                dataType: DATA_TYPE.String
            },
            {
                name: "ContactName",
                notNull: true,
                dataType: DATA_TYPE.String
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
        columns: [
            new Column('employeeId').options([COL_OPTION.PrimaryKey, COL_OPTION.AutoIncrement]),
            new Column('lastName').options([COL_OPTION.NotNull]).setDataType(DATA_TYPE.String),
            new Column('birthDate').options([COL_OPTION.NotNull]).setDataType(DATA_TYPE.DateTime),
            new Column('photo').options([COL_OPTION.NotNull]).setDataType(DATA_TYPE.String),
            new Column('notes').setDataType(DATA_TYPE.String),
            new Column('state').options([COL_OPTION.NotNull]).setDataType(DATA_TYPE.String),
            new Column('jobSuspendedFlag').options([COL_OPTION.NotNull]).setDataType(DATA_TYPE.Number)
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
                dataType: DATA_TYPE.Number
            },
            {
                name: "ProductID",
                notNull: true,
                dataType: DATA_TYPE.Number
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

    var things = {
        name: "things",
        columns: [{
            name: 'value',
            dataType: 'string'
        }]
    }

    var dataBase = {
        name: "Demo",
        tables: [customers, categories, employees, orderDetails, orders, products, shippers, suppliers, things]
    };
    return dataBase;
}