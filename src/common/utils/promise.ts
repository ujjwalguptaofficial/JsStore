export const promise = <T>(cb: (res, rej?) => any) => {
    return new Promise<T>(cb);
}