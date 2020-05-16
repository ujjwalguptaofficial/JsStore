import { IError, IntersectQuery } from '../../../common/index';
import { Base } from '../base';
export declare class Intersect extends Base {
    execute(intersectQry: IntersectQuery, onSuccess: (results: object[]) => void, onError: (err: IError) => void): void;
}
