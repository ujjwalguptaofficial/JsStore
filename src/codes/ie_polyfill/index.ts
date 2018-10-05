import { addPromise } from "../promise_polyfill/index";
import { addFind } from "./find";
import { addFindIndex } from "./find_index";


export const addPolyfill = () => {
    addFind();
    addFindIndex();
    addPromise();
};
