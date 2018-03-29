exports.list_of_files = [
    'test/scripts/jquery-3.2.1.min.js',
    'test/scripts/dbhelper.js',
    'test/cases/insert/*.js',
    'test/cases/select/*.js',
    'test/cases/count/*.js',
    'test/cases/update/*.js',
    'test/cases/delete/*.js',
    'test/cases/helper/*.js',
    'test/cases/clear/*.js',
    'test/cases/column_option/*.js',
    'test/cases/db_test.js',
    {
        pattern: 'test/static/*.json',
        included: false,
        served: true,
    },
    {
        pattern: 'output/*.js',
        included: false,
        served: true,
    },
    'test/setup.js'
];