import { Base } from "./base";
import { IError } from "../../common/index";
export declare class Clear extends Base {
    constructor(tableName: string, onSuccess: () => void, onError: (err: IError) => void);
    execute(): void;
}
