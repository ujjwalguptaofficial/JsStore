import * as Service from '../service/main';
import * as Model from '../model/main';
import * as $ from 'jquery';
export namespace Business {
    export class StudentLogic {
        _service = new Service.Student();

        constructor() {
            this._service.createDb();
            this.registerEvents();
        }

        registerEvents() {
            // add button
            $('#divContainer').on('click', 'td .btn-add', () => {
                this.addStudent();
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

            var deleteStudent = (id: number) => {
                this.deleteStudent(id);
            };

            var editStudent = (id: number) => {
                this.editStudent(id);
            };

            var updateStudent = (id: number) => {
                this.updateStudent(id);
            };

        }

        getRowWithTextbox(student?: Model.Student) {
            return `<tr class=${student ? "tr-edit" : "tr-add"} data-id=${student ? student._id : ""}>
                        <td><input type="text" value=${student ? student._name : ""}></td>
                        <td><input type="text" value=${student ? student._gender : ""}></td>
                        <td><input type="text" value=${student ? student._country : ""}></td>
                        <td><input type="text" value=${student ? student._city : ""}></td>
                        <td>
                            <button class=${student ? "btn-update" : "btn-add"}>${student ? "Update" : "Add"}</button>
                        </td>
                        <td><button>Cancel</button></td>
                    </tr>`;
        }

        deleteStudent(studentId) {
            this._service.deleteStudent(studentId).then(rowsDeleted => {
                if (rowsDeleted > 0) {
                    var row = $("#tblStudents tbody tr[data-id='" + studentId + "']");
                    row.remove();
                }
            }).catch(err => {
                alert(err._message);
            });
        }

        updateStudent(studentId) {
            var columns = $("#tblStudents tbody tr[data-id='" + studentId + "']").find('td');
            var updated_value: Model.Student = {
                _name: columns[0].querySelector('input').value,
                _gender: columns[1].querySelector('input').value,
                _country: columns[2].querySelector('input').value,
                _city: columns[3].querySelector('input').value
            };
            this._service.updateStudent(studentId, updated_value).then((rowsUpdated) => {
                if (rowsUpdated > 0) {
                    updated_value._id = studentId;
                    ($("#tblStudents tbody tr[data-id='" + studentId + "']")[0] as HTMLElement).outerHTML =
                        this.getHtmlRow(updated_value);
                }
            }).catch(err => {
                alert(err._message);
            });
        }

        addStudent() {
            var columns = document.querySelectorAll('.tr-add td');
            var student: Model.Student = {
                _name: columns[0].querySelector('input').value,
                _gender: columns[1].querySelector('input').value,
                _country: columns[2].querySelector('input').value,
                _city: columns[3].querySelector('input').value
            };
            this._service.addStudent(student).then((rowsAdded) => {
                if (rowsAdded > 0) {
                    this.refreshStudentList();
                    alert('successfully added');
                }
            }).catch((err) => {
                console.error(err);
                alert(err._message);
            });
        }

        editStudent(studentId) {
            this._service.getStudent(studentId).then(students => {
                if (students.length > 0) {
                    var row: HTMLElement = $("#tblStudents tbody tr[data-id='" + studentId + "']")[0];
                    row.outerHTML = this.getRowWithTextbox(students[0]);
                }
            }).catch(err => {
                alert(err._message);
            });
        }

        clearAddText() {
            var columns = document.querySelectorAll('.tr-add td');
            (columns as any).forEach(column => {
                column.innerHTML = "";
            });
        }

        refreshStudentList() {
            this._service.getStudents().then((results: Model.Student[]) => {
                var table_body = document.querySelector('#tblStudents tbody');
                var html = this.getRowWithTextbox();
                results.forEach(student => {
                    html += this.getHtmlRow(student);
                });
                table_body.innerHTML = html;

            }).catch((err) => {
                console.error(err);
                alert(err._message);
            });
        }

        private getHtmlRow(student) {
            return `<tr data-id=${student._id}>
            <td>${student._name}</td>
            <td>${student._gender}</td>
            <td>${student._country}</td>
            <td>${student._city}</td>
            <td><button class="btn-edit">Edit</button></td>
            <td><button class="btn-delete">Delete</button></td>
            </tr>`;
        }

    }
}