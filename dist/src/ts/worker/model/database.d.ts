import { Table } from "./table";
import { IDataBase } from "../interfaces";
export declare class DataBase {
    name: string;
    tables: Table[];
    constructor(dataBase: IDataBase);
}
