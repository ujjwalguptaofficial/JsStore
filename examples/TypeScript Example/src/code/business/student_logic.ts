import * as $ from 'jquery';
import { StudentService } from '../service/student_service';
import { Student } from '../model/student';

export class StudentLogic {
    private service_ = new StudentService();

    constructor() {
        this.registerEvents_();
    }

    private registerEvents_() {
        // add button
        $('#divContainer').on('click', 'td .btn-add', () => {
            this.addStudent();
        });
        // edit button
        $('#divContainer').on('click', 'td .btn-edit', function () {
            const id = $(this).parents('tr').attr('data-id');
            editStudent(Number(id));
        });
        // delete button
        $('#divContainer').on('click', 'td .btn-delete', function () {
            const id = $(this).parents('tr').attr('data-id');
            deleteStudent(Number(id));
        });

        $('#divContainer').on('click', 'td .btn-update', function () {
            const id = $(this).parents('tr').attr('data-id');
            updateStudent(Number(id));
        });

        const deleteStudent = (id: number) => {
            this.deleteStudent(id);
        };

        const editStudent = (id: number) => {
            this.editStudent(id);
        };

        const updateStudent = (id: number) => {
            this.updateStudent(id);
        };

    }

    getRowWithTextbox(student?: Student) {
        return `<tr class=${student ? "tr-edit" : "tr-add"} data-id=${student ? student.id : ""}>
                    <td><input type="text" value=${student ? student.name : ""}></td>
                    <td><input type="text" value=${student ? student.gender : ""}></td>
                    <td><input type="text" value=${student ? student.country : ""}></td>
                    <td><input type="text" value=${student ? student.city : ""}></td>
                    <td>
                        <button class=${student ? "btn-update" : "btn-add"}>${student ? "Update" : "Add"}</button>
                    </td>
                    <td><button>Cancel</button></td>
                </tr>`;
    }

    deleteStudent(studentId) {
        this.service_.deleteStudent(studentId).then(rowsDeleted => {
            if (rowsDeleted > 0) {
                const row = $("#tblStudents tbody tr[data-id='" + studentId + "']");
                row.remove();
            }
        }).catch(err => {
            alert(err.message);
        });
    }

    updateStudent(studentId) {
        const columns = $("#tblStudents tbody tr[data-id='" + studentId + "']").find('td');
        const updatedValue: Student = {
            name: columns[0].querySelector('input').value,
            gender: columns[1].querySelector('input').value,
            country: columns[2].querySelector('input').value,
            city: columns[3].querySelector('input').value
        };
        this.service_.updateStudent(studentId, updatedValue).then((rowsUpdated) => {
            if (rowsUpdated > 0) {
                updatedValue.id = studentId;
                ($("#tblStudents tbody tr[data-id='" + studentId + "']")[0] as HTMLElement).outerHTML =
                    this.getHtmlRow(updatedValue);
            }
        }).catch(err => {
            alert(err.message);
        });
    }

    addStudent() {
        const columns = document.querySelectorAll('.tr-add td');
        const student: Student = {
            name: columns[0].querySelector('input').value,
            gender: columns[1].querySelector('input').value,
            country: columns[2].querySelector('input').value,
            city: columns[3].querySelector('input').value
        };
        this.service_.addStudent(student).then((rowsAdded) => {
            if (rowsAdded > 0) {
                this.refreshStudentList();
                alert('successfully added');
            }
        }).catch((err) => {
            console.error(err);
            alert(err.message);
        });
    }

    editStudent(studentId) {
        this.service_.getStudent(studentId).then(students => {
            if (students.length > 0) {
                const row: HTMLElement = $("#tblStudents tbody tr[data-id='" + studentId + "']")[0];
                row.outerHTML = this.getRowWithTextbox(students[0]);
            }
        }).catch(err => {
            alert(err.message);
        });
    }

    clearAddText() {
        const columns = document.querySelectorAll('.tr-add td');
        (columns as any).forEach(column => {
            column.innerHTML = "";
        });
    }

    refreshStudentList() {
        this.service_.getStudents().then(results => {
            const tableBody = document.querySelector('#tblStudents tbody');
            let html = this.getRowWithTextbox();
            results.forEach(student => {
                html += this.getHtmlRow(student);
            });
            tableBody.innerHTML = html;

        }).catch((err) => {
            console.error(err);
            alert(err.message);
        });
    }

    private getHtmlRow(student: Student) {
        return `<tr data-id=${student.id}>
            <td>${student.name}</td>
            <td>${student.gender}</td>
            <td>${student.country}</td>
            <td>${student.city}</td>
            <td><button class="btn-edit">Edit</button></td>
            <td><button class="btn-delete">Delete</button></td>
            </tr>`;
    }

}