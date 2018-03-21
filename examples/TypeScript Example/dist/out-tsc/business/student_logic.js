import * as Service from '../service/main';
import * as $ from 'jquery';
export var Business;
(function (Business) {
    var StudentLogic = /** @class */ (function () {
        function StudentLogic() {
            this._service = new Service.Student();
            this._service.createDb();
            this.registerEvents();
        }
        StudentLogic.prototype.registerEvents = function () {
            var _this = this;
            // add button
            $('#divContainer').on('click', 'td .btn-add', function () {
                _this.addStudent();
            });
            // edit button
            $('#divContainer').on('click', 'td .btn-edit', function () {
                var id = $(this).parents('tr').attr('data-id');
                editStudent(Number(id));
            });
            // delete button
            $('#divContainer').on('click', 'td .btn-delete', function () {
                var id = $(this).parents('tr').attr('data-id');
                deleteStudent(Number(id));
            });
            $('#divContainer').on('click', 'td .btn-update', function () {
                var id = $(this).parents('tr').attr('data-id');
                updateStudent(Number(id));
            });
            var deleteStudent = function (id) {
                _this.deleteStudent(id);
            };
            var editStudent = function (id) {
                _this.editStudent(id);
            };
            var updateStudent = function (id) {
                _this.updateStudent(id);
            };
        };
        StudentLogic.prototype.getRowWithTextbox = function (student) {
            return "<tr class=" + (student ? "tr-edit" : "tr-add") + " data-id=" + (student ? student._id : "") + ">\n                        <td><input type=\"text\" value=" + (student ? student._name : "") + "></td>\n                        <td><input type=\"text\" value=" + (student ? student._gender : "") + "></td>\n                        <td><input type=\"text\" value=" + (student ? student._country : "") + "></td>\n                        <td><input type=\"text\" value=" + (student ? student._city : "") + "></td>\n                        <td>\n                            <button class=" + (student ? "btn-update" : "btn-add") + ">" + (student ? "Update" : "Add") + "</button>\n                        </td>\n                        <td><button>Cancel</button></td>\n                    </tr>";
        };
        StudentLogic.prototype.deleteStudent = function (studentId) {
            this._service.deleteStudent(studentId).then(function (rowsDeleted) {
                if (rowsDeleted > 0) {
                    var row = $("#tblStudents tbody tr[data-id='" + studentId + "']");
                    row.remove();
                }
            }).catch(function (err) {
                alert(err._message);
            });
        };
        StudentLogic.prototype.updateStudent = function (studentId) {
            var _this = this;
            var columns = $("#tblStudents tbody tr[data-id='" + studentId + "']").find('td');
            var updated_value = {
                _name: columns[0].querySelector('input').value,
                _gender: columns[1].querySelector('input').value,
                _country: columns[2].querySelector('input').value,
                _city: columns[3].querySelector('input').value
            };
            this._service.updateStudent(studentId, updated_value).then(function (rowsUpdated) {
                if (rowsUpdated > 0) {
                    updated_value._id = studentId;
                    $("#tblStudents tbody tr[data-id='" + studentId + "']")[0].outerHTML =
                        _this.getHtmlRow(updated_value);
                }
            }).catch(function (err) {
                alert(err._message);
            });
        };
        StudentLogic.prototype.addStudent = function () {
            var _this = this;
            var columns = document.querySelectorAll('.tr-add td');
            var student = {
                _name: columns[0].querySelector('input').value,
                _gender: columns[1].querySelector('input').value,
                _country: columns[2].querySelector('input').value,
                _city: columns[3].querySelector('input').value
            };
            this._service.addStudent(student).then(function (rowsAdded) {
                if (rowsAdded > 0) {
                    _this.refreshStudentList();
                    alert('successfully added');
                }
            }).catch(function (err) {
                console.error(err);
                alert(err._message);
            });
        };
        StudentLogic.prototype.editStudent = function (studentId) {
            var _this = this;
            this._service.getStudent(studentId).then(function (students) {
                if (students.length > 0) {
                    var row = $("#tblStudents tbody tr[data-id='" + studentId + "']")[0];
                    row.outerHTML = _this.getRowWithTextbox(students[0]);
                }
            }).catch(function (err) {
                alert(err._message);
            });
        };
        StudentLogic.prototype.clearAddText = function () {
            var columns = document.querySelectorAll('.tr-add td');
            columns.forEach(function (column) {
                column.innerHTML = "";
            });
        };
        StudentLogic.prototype.refreshStudentList = function () {
            var _this = this;
            this._service.getStudents().then(function (results) {
                var table_body = document.querySelector('#tblStudents tbody');
                var html = _this.getRowWithTextbox();
                results.forEach(function (student) {
                    html += _this.getHtmlRow(student);
                });
                table_body.innerHTML = html;
            }).catch(function (err) {
                console.error(err);
                alert(err._message);
            });
        };
        StudentLogic.prototype.getHtmlRow = function (student) {
            return "<tr data-id=" + student._id + ">\n            <td>" + student._name + "</td>\n            <td>" + student._gender + "</td>\n            <td>" + student._country + "</td>\n            <td>" + student._city + "</td>\n            <td><button class=\"btn-edit\">Edit</button></td>\n            <td><button class=\"btn-delete\">Delete</button></td>\n            </tr>";
        };
        return StudentLogic;
    }());
    Business.StudentLogic = StudentLogic;
})(Business || (Business = {}));
//# sourceMappingURL=P:/Users/ujjwal/Documents/projects/JsStore/Example/TypeScript Example/business/student_logic.js.map