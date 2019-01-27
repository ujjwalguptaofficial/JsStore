export const promise = <T>(callBack: (resolve, reject) => void) => {
    return new Promise<T>(callBack);
};