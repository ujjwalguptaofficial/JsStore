var getEmployeeDbSchema = () => {
    const dbSchema = {
        name: "employee_db",
        tables: [{
            name: 'employee',
            columns: {
                employeeId: {
                    primaryKey: true,
                    autoIncrement: true
                },
                employeeName: {
                    dataType: 'string', notNull: true
                },
                gender: {
                    dataType: 'string', notNull: true
                },
                stateCode: {
                    dataType: 'string',
                    notNull: true
                },
                salary: {
                    dataType: 'number',
                    notNull: true
                }
            }
        }]
    };
    return dbSchema;
}


const getEmployeeDbValues = () => {
    return [{
        employeeName: 'Jerome',
        gender: 'M',
        stateCode: 'FL',
        salary: 83000.0000
    }, {
        employeeName: 'Ray',
        gender: 'M',
        stateCode: 'AL',
        salary: 88000.0000
    }, {
        employeeName: 'Stella',
        gender: 'F',
        stateCode: 'AL',
        salary: 76000.0000
    }, {
        employeeName: 'Gilbert',
        gender: 'M',
        stateCode: 'Ar',
        salary: 42000.0000
    }, {
        employeeName: 'Edward',
        gender: 'M',
        stateCode: 'FL',
        salary: 93000.0000
    }, {
        employeeName: 'Ernest',
        gender: 'F',
        stateCode: 'Al',
        salary: 64000.0000
    }, {
        employeeName: 'Jorge',
        gender: 'F',
        stateCode: 'IN',
        salary: 75000.0000
    }, {
        employeeName: 'Nicholas',
        gender: 'F',
        stateCode: 'Ge',
        salary: 71000.0000
    }, {
        employeeName: 'Lawrence',
        gender: 'M',
        stateCode: 'IN',
        salary: 95000.0000
    }, {
        employeeName: 'Salvador',
        gender: 'M',
        stateCode: 'Co',
        salary: 75000.0000
    }];
}