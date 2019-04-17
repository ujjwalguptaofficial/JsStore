export declare class KeyStore {
    static init(): Promise<{}>;
    static get<T>(key: string): Promise<T>;
    static set(key: string, value: any): Promise<{}>;
    static remove(key: string): Promise<number>;
    static close(): Promise<{}>;
}
