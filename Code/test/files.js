exports.list_of_files = [
    'scripts/jquery-3.2.1.min.js',
    'scripts/dbhelper.js',
    'cases/insert/*.js',
    'cases/select/*.js',
    'cases/count/*.js',
    'cases/update/*.js',
    'cases/delete/*.js',
    'cases/helper/*.js',
    'cases/clear/*.js',
    'cases/column_option/*.js',
    'cases/db_test.js',
    {
        pattern: 'static/*.json',
        included: false,
        served: true,
    },
    'setup.js'
];