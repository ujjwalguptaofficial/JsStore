export const promiseAll = <T>(promises: any) => {
    return Promise.all<T>(promises);
};