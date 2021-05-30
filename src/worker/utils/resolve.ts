import { isArray } from "./is_array";

export const variableFromPath = (path: string) => {
    const properties: string[] = isArray(path) ? path as any : path.split(".");
    return properties.reduce((prev, curr) => prev && prev[curr], self);
}