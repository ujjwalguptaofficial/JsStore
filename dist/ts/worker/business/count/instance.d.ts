import { Where } from "./where";
import { IError, CountQuery } from "../../../common/index";
export declare class Instance extends Where {
    constructor(query: CountQuery, onSuccess: (noOfRecord: number) => void, onError: (error: IError) => void);
    execute(): void;
    private initTransaction_;
}
