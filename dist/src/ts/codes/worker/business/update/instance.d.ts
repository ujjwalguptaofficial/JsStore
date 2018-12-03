import { Where } from "./where";
import { UpdateQuery } from "../../types";
import { IError } from "../../interfaces";
export declare class Instance extends Where {
    constructor(query: UpdateQuery, onSuccess: (rowsUpdated: number) => void, onError: (err: IError) => void);
    execute(): void;
    private executeComplexLogic_;
}
