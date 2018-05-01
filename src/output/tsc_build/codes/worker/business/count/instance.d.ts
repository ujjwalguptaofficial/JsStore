import { Where } from "./where";
import { ICount, IError } from "../../interfaces";
export declare class Instance extends Where {
    constructor(query: ICount, onSuccess: (noOfRecord: number) => void, onError: (error: IError) => void);
    execute(): void;
    private initTransaction_();
}
