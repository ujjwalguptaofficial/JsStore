export const isNull = (value) => {
    if (value == null) {
        return true;
    } else {
        switch (typeof value) {
            // case 'string': return value.length === 0;
            case 'number': return isNaN(value);
        }
    }
    return false;
};