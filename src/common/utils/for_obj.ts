export const forObj = (obj: object, cb: (key, value) => void) => {
    for (const key in obj) {
        cb(key, obj[key]);
    }
}