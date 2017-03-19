//Student Array
var Students = [{
        Id: 1,
        FirstName: 'Ujjwal',
        LastName: 'gupta',
        Gender: 'male',
        Country: 'India',
        state: 'Madhyapradesh',
        city: 'Singrauli'
    },
    {
        Id: 2,
        FirstName: 'george',
        LastName: 'adeil',
        Gender: 'male',
        Country: 'America',
        state: 'Boston',
        city: 'xyx'
    },
    {
        Id: 3,
        FirstName: 'abc',
        LastName: 'gupt1a',
        Gender: 'female',
        Country: 'India',
        state: 'Madhyapradesh',
        city: 'zz'
    },
    {
        Id: 4,
        FirstName: 'xyz',
        LastName: 'gupta',
        Gender: 'male',
        Country: 'Canada',
        state: 'huie',
        city: 'qwe'
    },
    {
        Id: 5,
        FirstName: 'pqr',
        LastName: 'gupta',
        Gender: 'female',
        Country: 'England',
        state: 'hey',
        city: 'assd'
    },
]
//Country Array
var Countries = [{
        Id: 1,
        Name: 'India'
    },
    {
        Id: 2,
        Name: 'America'
    },
    {
        Id: 3,
        Name: 'England'
    },
    {
        Id: 4,
        Name: 'Canada'
    },
    {
        Id: 5,
        Name: 'Japan'
    },
]
//State Array
var States = [{
        Id: 1,
        Name: 'Madhyapradesh',
        CountryId: 1
    },
    {
        Id: 2,
        Name: 'Boston',
        CountryId: 2
    },
    {
        Id: 3,
        Name: 'huie',
        CountryId: 4
    },
    {
        Id: 4,
        Name: 'hey',
        CountryId: 3
    },
]
//City Array
var Cities = [{
        Id: 1,
        Name: 'Singrauli',
        StateId: 1
    },
    {
        Id: 2,
        Name: 'xyx',
        StateId: 2
    },
    {
        Id: 3,
        Name: 'zz',
        StateId: 1
    },
    {
        Id: 4,
        Name: 'qwe',
        StateId: 3
    },
    {
        Id: 5,
        Name: 'assd',
        StateId: 4
    },
]
//Default Studentid
var StudentId = 5;
$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();

    $('input:text').blur(function () {
        CheckInputField('text', this.id);
    })
    $('input:radio').blur(function () {
        CheckInputField('radio', this.name);
    })
    $('select').blur(function () {
        CheckInputField('select', this.id);
    })
    $('#btnAddStudent').click(function () {
        $('form').slideDown(500);
    })
    $('#btnCancel').click(function () {
        FormReset();
    })
    AddDataInDb();
    ShowTableData();
    BindCountryList();
})

var DbConnection;


//This function will delete the row
function DeleteRow(element) {
    var StudentId = element.parentElement.parentElement.getAttribute('ItemId');
    for (i = 0; i < Students.length; i++) {
        if (Students[i].Id == StudentId) {
            Students.splice(i, 1);
        }
    }
    ShowTableData();
}

//This function will edit the particular row
function EditRow(element) {
    var Row = element.parentElement.parentElement;
    var Id = Row.getAttribute("ItemId");
    var FirstName = Row.cells[0].innerText;
    var LastName = Row.cells[1].innerText;
    var Gender = Row.cells[2].innerText;
    var CountryName = Row.cells[3].innerText;
    var StateName = Row.cells[4].innerText;
    var CityName = Row.cells[5].innerText;
    var StateId = GetStateId(StateName);
    var CountryId = GetCountryId(CountryName);
    var CityId = GetCityId(CityName);
    $('#txtFirstName').val(FirstName);
    $('#txtLastName').val(LastName);
    $("input[name='Gender'][value=" + Gender + "]").click();
    $('#ddlCountry').val(CountryId);
    BindStateList();
    $('#ddlState').val(StateId);
    BindCityList();
    $('#ddlCity').val(CityId);
    $('#btnSubmit span').text('Update');
    $('form').attr('data-student-id', Id).slideDown(500);

}

//This function will return the Country Id based upon the Country Name
function GetCountryId(countryName) {
    var Id;
    Countries.forEach(function (item) {
        if (item.Name == countryName) {
            Id = item.Id;
        }
    })
    return Id;
}

//This function will return the City Id based upon the City Name
function GetCityId(cityName) {
    var Id;
    Cities.forEach(function (item) {
        if (item.Name == cityName) {
            Id = item.Id;
        }
    })
    return Id;
}

//This function will return the State id based up state names
function GetStateId(stateName) {

    var Id;
    States.forEach(function (item) {
        if (item.Name == stateName) {
            Id = item.Id;
        }
    })
    return Id;
}

//this function will bind the dropdownlist ddlcountry with countries array;
function BindCountryList() {
    var HtmlString = "<option value='0'>Select Country</option>";
    Countries.forEach(function (item) {
        HtmlString += "<option value=" + item.Id + ">" + item.Name + "</option>";
    })
    $('#ddlCountry').html(HtmlString);
}

//this function will bind the dropdownlist ddlstate with states array;
function BindStateList() {
    var CountryId = $('#ddlCountry').val();
    if (CountryId != 0) {
        var HtmlString = "<option value='0'>Select State</option>";
        States.forEach(function (item) {
            if (item.CountryId == CountryId) {
                HtmlString += "<option value=" + item.Id + ">" + item.Name + "</option>";
            }
        })
        $('#ddlState').html(HtmlString);
    }
}

//this function will bind the dropdownlist ddlcity with cities array;
function BindCityList() {
    var StateId = $('#ddlState').val();
    if (StateId != 0) {
        var HtmlString = "<option value='0'>Select City</option>";
        Cities.forEach(function (item) {
            if (item.StateId == StateId) {
                HtmlString += "<option value=" + item.Id + ">" + item.Name + "</option>";
            }
        })
        $('#ddlCity').html(HtmlString);
    }
}

//this function will check the input field based upon the control type and control id
function CheckInputField(controlType, controlId) {
    var ErrorFlag = false;
    switch (controlType) {
        case 'radio':
            var Element = $("input[name=" + controlId + "]");
            if (Element.parent().parent().next().length > 0) {
                Element.parent().parent().next().remove();
            }
            if ($('input[name="Gender"]:checked').val() == undefined) {
                var Icon = CreateIcon("error", "Required Field");
                Element.parent().parent().parent().append(Icon);
                ErrorFlag = true;
                console.log('radio');
            } else {
                var Icon = CreateIcon("ok", "Ok");
                Element.parent().parent().parent().append(Icon);
            }
            break;
        case 'text':
            var Element = $('#' + controlId);
            if (Element.parent().next().length > 0) {
                Element.parent().next().remove()
            }
            if (Element.val() == 0) {
                var Icon = CreateIcon("error", "Required Field");
                Element.parent().parent().append(Icon);
                ErrorFlag = true;
            } else {
                var Icon = CreateIcon("ok", "Ok");
                Element.parent().parent().append(Icon);

            };
            break;
        case 'select':
            var Element = $('#' + controlId);
            if (Element.parent().next().length > 0) {
                Element.parent().next().remove()
            }
            if (Element.val() == 0) {
                var Icon = CreateIcon("error", "Required Field");
                Element.parent().parent().append(Icon);
                ErrorFlag = true;
            } else {
                var Icon = CreateIcon("ok", "Ok");
                Element.parent().parent().append(Icon);
            };
            break;
    }
    return ErrorFlag;
}

//this function will return htmlstring consist of icontype and Error message.
function CreateIcon(icontype, message) {
    var HtmlString = "";
    if (icontype == 'error') {
        HtmlString = '<i class="col-sm-2 fa fa-times" style="color:red;font-size:25px;" aria-hidden="true" data-toggle="tooltip" title="' + message + '"></i>';
    } else if (icontype == 'ok') {
        HtmlString = '<i class="col-sm-2 fa fa-check" style="color:#a8e628;font-size:25px;" aria-hidden="true" data-toggle="tooltip" data-placement="right" title=' + message + '></i>';
    }
    return HtmlString;
}

//this function will check error when submit button is clicked
function CheckError() {
    var ErrorCount = 0;
    //checking FirstName
    if (CheckInputField('text', 'txtFirstName')) {
        ErrorCount++;
    }
    //checking LastName
    if (CheckInputField('text', 'txtLastName')) {
        ErrorCount++;
    }
    //checking gender
    if (CheckInputField('radio', 'Gender')) {
        ErrorCount++;
    }
    //checking country
    if (CheckInputField('select', 'ddlCountry')) {
        ErrorCount++;
    }
    //checking State
    if (CheckInputField('select', 'ddlState')) {
        ErrorCount++;
    }
    //checking city
    if (CheckInputField('select', 'ddlCity')) {
        ErrorCount++;
    }
    return ErrorCount;

}

//this function will update the rows after the click on update button
function UpdateDetails(fName, lName, gender, country, state, city) {
    var Studentid = $('form').attr('data-student-id');
    Students.forEach(function (item) {
        if (item.Id == Studentid) {
            item.FirstName = fName;
            item.LastName = lName;
            item.Gender = gender;
            item.Country = country;
            item.city = city;
        }
    })
}

//This function will reset the form and removes every extra element
function FormReset() {

    $('form input:text').each(function () {
        var Element = $(this);
        if (Element.parent().next().length > 0) {
            Element.parent().next().remove()
        }
    })
    $('form select').each(function () {
        var Element = $(this);
        if (Element.parent().next().length > 0) {
            Element.parent().next().remove()
        }
    })
    $('form input:radio').each(function () {
        var Element = $(this);
        if (Element.parent().parent().next().length > 0) {
            Element.parent().parent().next().remove();
        }
    })

    $('#btnSubmit span').text('Submit');
    $('#divError').hide();
    $('form').trigger("reset").slideUp(500);
}

//This function will Add details in the Students array
function AddDetails() {
    var ErrorCount = CheckError();
    if (ErrorCount == 0) {
        var FName = $('#txtFirstName').val();
        var LName = $('#txtLastName').val();
        var Gender = $("input[name='Gender']:checked").val();
        var Country = $('#ddlCountry option:selected').text();
        var State = $('#ddlState option:selected').text();
        var City = $('#ddlCity option:selected').text();
        var Value = {
            Id: ++StudentId,
            FirstName: FName,
            LastName: LName,
            Gender: Gender,
            Country: Country,
            State: State,
            City: City
        };
        if ($('#btnSubmit span').text() == 'Submit') {
            DbConnection.insert({
                Into: "student",
                Values: [Value]
            }, function (rowsCount) {
                alert(rowsCount + "rows affected");
                FormReset();
                ShowTableData();
            }, function (error) {
                console.log(error);
            })
            //Students.push({ Id: ++StudentId, FirstName: FName, LastName: LName, Gender: Gender, Country: Country, state: State, city: City })
        } else {
            var Id = $('form').attr('data-student-id');
            DbConnection.update({
                Table: 'student',
                Set: {
                    FirstName: FName,
                    LastName: LName,
                    Gender: Gender,
                    Country: Country,
                    State: State,
                    City: City
                },
                Where: {
                    Id: Number(Id)
                }
            }, function (rowsAffected) {
                console.log(rowsAffected);
                if (rowsAffected > 0) {
                    FormReset();
                    ShowTableData();
                }
            }, function (error) {
                console.log(error)
            })
            //UpdateDetails(FName, LName, Gender, Country, State, City);
        }

    } else {
        var ErrorInfo = ErrorCount + " error occured : place the mouse over the respective icon for description";
        $('#divError').show(500);
        $('#spanErrorText').text(ErrorInfo);
    }
}

function AddDataInDb() {


    var Table1 = {
        Name: "Student",
        Columns: [{
                Name: "Id",
                PrimaryKey: true
            },
            {
                Name: "FirstName"
            },
            {
                Name: "LastName"
            },
            {
                Name: "Gender"
            },
            {
                Name: "Country"
            },
            {
                Name: "State"
            },
            {
                Name: "City"
            }
        ],
        Version: 5
    }
    var DataBase = {
        Name: "Students",
        Tables: [Table1]
    }

    DbConnection = new JsStorage.Main().createDb(DataBase, function (dbConnection) {
        if (localStorage.getItem('page_started') != '1') {
            dbConnection.insert({
                Into: Table1.Name,
                Values: Students
            }, function (rowsAffected) {
                localStorage.setItem('page_started', '1');
                alert('Add completed' + 'rows affected:' + rowsAffected);
            }, function () {
                alert('Error Occured while adding data')
            })
        }

    });

}

//This function refreshes the table
function ShowTableData() {
    DbConnection.select({
        From: "student"
    }, function (students) {
        var HtmlString = "";
        students.forEach(function (item) {
            HtmlString += "<tr ItemId=" + item.Id + "><td>" + item.FirstName + "</td><td>" + item.LastName + "</td><td>" +
                item.Gender + "</td><td>" + item.Country + "</td><td>" + item.State + "</td><td>" + item.City + "</td><td>" + "<a href='#'  onclick='EditRow(this)'>Edit</a></td>" + "<td><a href='#' onclick='DeleteRow(this)'>Delete</a></td>";
        }, function (error) {
            console.log(error);
        })
        $('#tblContainer').html(HtmlString);
    });
}