import { Table } from "./table";
import { IDataBase } from "../../common/index";
export declare class DataBase {
    name: string;
    tables: Table[];
    constructor(dataBase: IDataBase);
}
