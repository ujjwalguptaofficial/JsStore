import { setCrossBrowserIndexedDb } from "@worker/utils";

export const IS_WORKER = typeof (self as any).alert === 'undefined' && typeof ServiceWorkerGlobalScope === 'undefined';
export const IS_IDB_SUPPORTED = setCrossBrowserIndexedDb();