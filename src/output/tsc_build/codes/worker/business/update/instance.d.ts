import { Where } from "./where";
import { IUpdate, IError } from "../../interfaces";
export declare class Instance extends Where {
    constructor(query: IUpdate, onSuccess: () => void, onError: (err: IError) => void);
    execute(): void;
    private executeComplexLogic_();
}
