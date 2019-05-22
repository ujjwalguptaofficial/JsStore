const getDemoDbSchema = function () {

    var DATA_TYPE = JsStore.DATA_TYPE;

    var customers = {
        name: 'Customers',
        columns: {
            CustomerID: { primaryKey: true, autoIncrement: true },
            CustomerName: { notNull: true, dataType: DATA_TYPE.String },
            ContactName: { notNull: true, dataType: DATA_TYPE.String },
            Address: { notNull: true, dataType: 'string' },
            City: { notNull: true, dataType: 'string' },
            PostalCode: { dataType: 'string' },
            Country: { notNull: true, dataType: 'string' },
            Email: { dataType: 'string' }
        }
    };

    var categories = {
        name: 'Categories',
        columns: {
            CategoryID: { primaryKey: true, autoIncrement: true },
            CategoryName: { notNull: true, dataType: 'string' },
            Description: { notNull: true, dataType: 'string' }
        }
    }



    var employees = {
        name: 'Employees',
        columns: {
            employeeId: { primaryKey: true, autoIncrement: true },
            lastName: { notNull: true, dataType: 'string' },
            birthDate: { notNull: true, dataType: DATA_TYPE.DateTime },
            photo: { notNull: true, dataType: 'string' },
            notes: { dataType: 'string' },
            state: { notNull: true, dataType: 'string' },
            jobSuspendedFlag: { notNull: true, dataType: 'number' }
        }
    }

    var orderDetails = {
        name: 'OrderDetails',
        columns: {
            OrderDetailID: { primaryKey: true, autoIncrement: true },
            OrderID: { notNull: true, dataType: 'number' },
            ProductID: { notNull: true, dataType: 'number' },
            Quantity: { notNull: true, dataType: 'number' },
        }
    }

    var orders = {
        name: 'Orders',
        columns: {
            OrderID: { primaryKey: true },
            CustomerID: { notNull: true },
            EmployeeID: { notNull: true, dataType: 'number' },
            OrderDate: { notNull: true, dataType: 'string' },
            ShipperID: { notNull: true, dataType: 'number' }
        }
    }

    var products = {
        name: 'Products',
        columns: {
            ProductID: { primaryKey: true, autoIncrement: true },
            ProductName: { notNull: true, dataType: 'string' },
            SupplierID: { notNull: true, dataType: 'number' },
            CategoryID: { notNull: true, dataType: 'number' },
            Unit: { notNull: true, dataType: 'string' },
            Price: { notNull: true, dataType: 'number' },
        }
    }

    var shippers = {
        name: 'Shippers',
        columns: {
            ShipperID: { primaryKey: true, autoIncrement: true },
            ShipperName: { notNull: true, dataType: 'string' },
            Phone: { notNull: true, dataType: 'string' }
        }
    }

    var suppliers = {
        name: 'Suppliers',
        columns: {
            SupplierID: { primaryKey: true, autoIncrement: true },
            SupplierName: { notNull: true, dataType: 'string' },
            ContactName: { notNull: true, dataType: 'string' },
            Address: { notNull: true, dataType: 'string' },
            City: { notNull: true, dataType: 'string' },
            PostalCode: { notNull: true, dataType: 'string' },
            Country: { notNull: true, dataType: 'string' },
            Phone: { notNull: true, dataType: 'string' },
        }
    }

    var things = {
        name: "things",
        columns: {
            value: { dataType: 'string' }
        }
    }

    var dataBase = {
        name: "Demo",
        tables: [customers, categories, employees, orderDetails, orders, products, shippers, suppliers, things]
    };
    return dataBase;
}