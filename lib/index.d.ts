export declare type TEnvOptions<T> = {
    default?: T;
    release?: T;
    staging?: T;
    develop?: T;
    /**
     * Throw an error if it's not provided
     * @default true
     */
    required?: boolean;
    /**
     * Varible Will be overwided by the system environment varible if provided.
     * @default true
     */
    overwide?: boolean;
} & {
    [env: string]: T;
};
export declare type TInitOptions = {
    /**
     * Force specify now env name
     */
    env?: string;
    /**
     * default: true while nodeJS, false while web / wechat-miniprogram
     */
    loadDotEnv?: boolean;
    /**
     * Path to .env folder.
     * Will load .[env-name].env first and load .env next.
     */
    folder?: string;
    /**
     * Force load env file Path.
     * It'll ignore `folder`.
     */
    envPath?: string;
};
export declare abstract class Envs {
    private static nowEnv?;
    private static vars;
    private static types;
    static init({ env, loadDotEnv, folder, envPath }?: TInitOptions): void;
    private static getLoadDotEnv;
    private static loadDotEnvFile;
    static getNowEnv(): string;
    static register(key: string, options?: TEnvOptions<string> | string | number): void;
    static get(key: string, defaultVal?: any): any;
    static getByString(key: string, defaultVal?: string): string;
    static getByNumber(key: string, defaultVal?: number): number;
    static getByBoolean(key: string, defaultVal?: boolean): boolean;
    static getByJSON<T = unknown>(key: string, defaultVal?: {}): any;
    static getAllByString(): Record<string, string>;
    static getAll(): Record<string, string>;
}
export default Envs;
//# sourceMappingURL=index.d.ts.map