import { Where } from "./where";
import { UpdateQuery, IError } from "../../../common/index";
export declare class Instance extends Where {
    constructor(query: UpdateQuery, onSuccess: (rowsUpdated: number) => void, onError: (err: IError) => void);
    execute(): void;
    private executeComplexLogic_;
}
