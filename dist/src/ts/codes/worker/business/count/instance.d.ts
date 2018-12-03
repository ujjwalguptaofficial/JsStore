import { Where } from "./where";
import { CountQuery } from "../../types";
import { IError } from "../../interfaces";
export declare class Instance extends Where {
    constructor(query: CountQuery, onSuccess: (noOfRecord: number) => void, onError: (error: IError) => void);
    execute(): void;
    private initTransaction_;
}
