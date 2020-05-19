import { IError, IntersectQuery } from '../../../common/index';
import { Helper } from '../select/orderby_helper';
export declare class Intersect extends Helper {
    execute(intersectQry: IntersectQuery, onSuccess: (results: object[]) => void, onError: (err: IError) => void): void;
}
