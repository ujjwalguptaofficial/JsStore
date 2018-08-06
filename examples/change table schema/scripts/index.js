var connection = new JsStore.Instance(new Worker('scripts/jsstore.worker.js'));
window.onload = function () {
    initiateDb();
    $('#btnAddStudent').click(function () {
        window.location.href = 'add.html';
    })
    $('#tblGrid tbody').on('click', '.edit', function () {
        var StudentId = $(this).parents().eq(1).attr('itemid');
        window.location.href = 'add.html?id=' + StudentId;
    });
    $('#tblGrid tbody').on('click', '.delete', function () {
        var Result = confirm('Are you sure, you want to delete?');
        if (Result) {
            var StudentId = $(this).parents().eq(1).attr('itemid');
            deleteData(StudentId);
        }
    });
};

function deleteData(studentId) {
    connection.remove({
        from: 'Student',
        where: {
            Id: Number(studentId)
        }
    }).then(function (rowsDeleted) {
        console.log(rowsDeleted + ' rows deleted');
        if (rowsDeleted > 0) {
            showTableData();
        }
    }).catch(function (error) {
        console.log(err);
        alert(error.message);
    });
}


function insertStudents(students) {
    connection.insert({
        into: "Student",
        values: students
    }).then(function (rowsAdded) {
        if (rowsAdded > 0) {
            alert('Successfully added');
        }
    }).catch(function (err) {
        console.log(err);
        alert('Error Occured while adding data')
    });
}

function getAllStudent() {
    return connection.select({
        from: "Student"
    });
}
//This function refreshes the table
function showTableData() {
    getAllStudent().then(function (students) {
        var HtmlString = "";
        students.forEach(function (student) {
            HtmlString += "<tr ItemId=" + student.Id + "><td>" +
                student.Name + "</td><td>" +
                student.Gender + "</td><td>" +
                student.Country + "</td><td>" +
                student.City + "</td><td>" +
                "<a href='#' class='edit'>Edit</a></td>" +
                "<td><a href='#' class='delete''>Delete</a></td>";
        })
        $('#tblGrid tbody').html(HtmlString);
    }).catch(function (error) {
        console.log(error);
    });
}

function getPreStudents() {
    //Student Array
    var Students = [{
            Name: 'Alfreds',
            Gender: 'male',
            Country: 'Germany',
            City: 'Berlin'
        },
        {
            Name: 'george',
            Gender: 'male',
            Country: 'America',
            City: 'xyx'
        },
        {
            Name: 'Berglunds',
            Gender: 'female',
            Country: 'Sweden',
            City: 'Luleå'
        },
        {
            Name: 'Eastern',
            Gender: 'male',
            Country: 'Canada',
            City: 'qwe'
        },
    ]
    return Students;
}