import * as $ from 'jquery';
import { StudentService } from '../storage_service/student_service';
import { Student } from '../model/student';

export class StudentLogic {
    service: StudentService;

    constructor() {
        this.registerEvents_();
        this.service = new StudentService();
    }

    private registerEvents_() {
        // add button
        $('#divContainer').on('click', 'td .btn-add', () => {
            this.addStudent();
        });
        // edit button
        $('#divContainer').on('click', 'td .btn-edit', (el:any) => {
            const id = $(el.target).parents('tr').attr('data-id');
            this.editStudent(Number(id));
        });
        // delete button
        $('#divContainer').on('click', 'td .btn-delete', (el:any) => {
            const id = $(el.target).parents('tr').attr('data-id');
            this.deleteStudent(Number(id));
        });

        $('#divContainer').on('click', 'td .btn-update', (el:any) => {
            const id = $(el.target).parents('tr').attr('data-id');
            this.updateStudent(Number(id));
        });

        $('#divContainer').on('click', 'td .btn-add-cancel', (el: any) => {
            const row = $(el.target).parents('tr');
            row.find('input').val('');
        });

        $('#divContainer').on('click', 'td .btn-update-cancel', () => {
            this.refreshStudentList();
        });

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
                    <td>
                    <button class=${student ? "btn-update-cancel" : "btn-add-cancel"}>${student ? "Cancel" : "Clear"}</button>
                    </td>
                </tr>`;
    }

    async deleteStudent(studentId: number) {

        try {
            const rowsDeleted = await this.service.deleteStudent(studentId);
            if (rowsDeleted > 0) {
                const row = $("#tblStudents tbody tr[data-id='" + studentId + "']");
                row.remove();
            }
        }
        catch (err) {
            alert(err.message);
        }
    }

    async updateStudent(studentId: number) {
        const columns = $("#tblStudents tbody tr[data-id='" + studentId + "']").find('td');
        const updatedValue: Student = {
            name: columns[0].querySelector('input').value,
            gender: columns[1].querySelector('input').value,
            country: columns[2].querySelector('input').value,
            city: columns[3].querySelector('input').value
        };

        try {
            const rowsUpdated = await this.service.updateStudent(studentId, updatedValue);
            if (rowsUpdated > 0) {
                updatedValue.id = studentId;
                ($("#tblStudents tbody tr[data-id='" + studentId + "']")[0] as HTMLElement).outerHTML =
                    this.getHtmlRow(updatedValue);
            }
        }
        catch (err) {
            alert(err.message);
        }
    }

    async addStudent() {
        const columns = document.querySelectorAll('.tr-add td');
        const student: Student = {
            name: columns[0].querySelector('input').value,
            gender: columns[1].querySelector('input').value,
            country: columns[2].querySelector('input').value,
            city: columns[3].querySelector('input').value
        };
        try {
            const rowsAdded = await this.service.addStudent(student);
            if (rowsAdded > 0) {
                this.refreshStudentList();
                alert('successfully added');
            }
        }
        catch (err) {
            console.error(err);
            alert(err.message);
        }
    }

    async editStudent(studentId: number) {

        try {
            const students = await this.service.getStudent(studentId);
            if (students.length > 0) {
                const row: HTMLElement = $("#tblStudents tbody tr[data-id='" + studentId + "']")[0];
                row.outerHTML = this.getRowWithTextbox(students[0]);
            }
        }
        catch (err) {
            alert(err.message);
        }
    }

    async refreshStudentList() {
        try {
            const results = await this.service.getStudents();
            const tableBody = document.querySelector('#tblStudents tbody');
            let html = this.getRowWithTextbox();
            results.forEach(student => {
                html += this.getHtmlRow(student);
            });
            tableBody.innerHTML = html;
        }
        catch (err) {
            console.error(err);
            alert(err.message);
        }
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