import {
    StudentGrid
} from "./component/student_grid";
var componentStudentGrid = new StudentGrid()
document.getElementById('app').innerHTML = componentStudentGrid.getHtml();
componentStudentGrid.loadStudentsFromIdb();