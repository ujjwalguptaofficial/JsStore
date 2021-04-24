export const isWorker = typeof (self as any).alert === 'undefined' && typeof ServiceWorkerGlobalScope === 'undefined';
