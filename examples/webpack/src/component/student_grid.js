import {
    StudentService
} from "../service/student_service";
import * as $ from "jquery";
export class StudentGrid {
    getHtml() {
        return `<table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>Country</th>
                            <th>City</th>
                        </tr>
                        <tr>
                            <td><input type="text"/></td>
                            <td><input type="text"/></td>
                            <td><input type="text"/></td>
                            <td><input type="text"/></td>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>`
    }

    loadStudentsFromIdb() {
        var studentService = new StudentService();
        var html = '';
        studentService.getStudents().forEach((result) => {

        })
        $('table').html(html);
    }
}