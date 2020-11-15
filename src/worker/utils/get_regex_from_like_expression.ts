import { OCCURENCE } from "../../common/index";

export const getRegexFromLikeExpression = (likeExpression: string) => {
    const filterValues = likeExpression.split('%');
    let filterValue: string;
    let occurence: OCCURENCE;
    if (filterValues[1]) {
        filterValue = filterValues[1];
        occurence = filterValues.length > 2 ? OCCURENCE.Any : OCCURENCE.Last;
    }
    else {
        filterValue = filterValues[0];
        occurence = OCCURENCE.First;
    }
    switch (occurence) {
        case OCCURENCE.First:
            return new RegExp(`^${filterValue}`, 'i');
        case OCCURENCE.Last:
            return new RegExp(`${filterValue}$`, 'i');
        default:
            return new RegExp(`${filterValue}`, 'i');
    }
}