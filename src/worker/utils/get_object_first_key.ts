export const getObjectFirstKey = (value) => {
    for (const key in value) {
        return key;
    }
};