import { SelectQuery, IError } from '../../../common/index';
export declare class Union {
    execute(query: SelectQuery[], onSuccess: (results: object[]) => void, onError: (err: IError) => void): void;
}
