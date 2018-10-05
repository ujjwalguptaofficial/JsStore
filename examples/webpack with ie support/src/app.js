import {
    StudentGrid
} from "./component/student_grid";
import Promise from "promise-polyfill";
window.Promise = Promise;
var componentStudentGrid = new StudentGrid()
document.getElementById('app').innerHTML = componentStudentGrid.getHtml();
componentStudentGrid.init();