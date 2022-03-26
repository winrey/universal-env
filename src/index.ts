import path from 'path';
import dotenv from 'dotenv';

const DEFAULT_ENV = 'release';
const UNSET_STRING = ['', 'undefined'];
const FALSILY_STRING = ['0', 'false', 'none', 'null', 'n/a', '[]', '{}', 'f', 'off'];

// export const isNodeJs = () => {
//   return typeof window === 'undefined' ? true : false ;
// }

const mapIfMatch = (env: string, map: Record<string, string>) => {
  env = env.toLowerCase();
  return env in map ? map[env] : env || DEFAULT_ENV;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any,no-var
declare var wx: any;

const isWechatMiniProgram = () => {
  try {
    return wx?.getAccountInfoSync;
  } catch {
    return false;
  }
};
const isNodeJS = () => !isWechatMiniProgram() && typeof process !== 'undefined' && process && process.env;

/**
 * 获取环境名称
 * @returns develop -> 开发环境  staging -> 体验版/测试环境  release -> 正式环境
 */
const getEnvName = () => {
  if (isWechatMiniProgram()) {
    // MiniProgram
    const { envVersion } = wx.getAccountInfoSync().miniProgram;
    return mapIfMatch(envVersion, {
      develop: 'develop',
      trial: 'staging',
      release: 'release',
    });
  }
  if (isNodeJS()) {
    // node环境
    const nodeEnv = process.env.NODE_ENV || '';
    return mapIfMatch(nodeEnv, {
      development: 'develop',
      staging: 'staging',
      production: 'release',
    });
  }
  console.warn(`[ENV_NAME] This Env is neither MiniProgram Nor NodeJs. Env fallback to "${DEFAULT_ENV}". `);
  return DEFAULT_ENV;
};

/**
 * 获取环境变量
 */
const getEnvVar = (name: string) => {
  if (typeof process !== 'undefined' && process && process.env && process.env[name]) {
    return process.env[name];
  }
  return;
};

// const findDefined = (arr: any[]) => arr.find(v => v !== undefined)

export type TEnvOptions<T = string | number | boolean | object> = {
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
   * Varible Will be overrided by the system environment varible if provided.
   * @default true
   */
  override?: boolean;
  /**
   * Check Duplicate Key and give you a warn log
   * @default true
   */
  checkDuplicate?: boolean;
  /**
   * Default type when get
   * @default "string"
   */
  type?: 'string' | 'boolean' | 'number' | 'json';
} & { [env: string]: T };

export type TInitOptions = {
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
  /**
   * Force load env file Path.
   * It'll ignore `folder`.
   */
  vars?: { [key: string]: TEnvOptions | string | number };
};

export abstract class Envs {
  private static nowEnv?: string;
  private static vars = new Map<string, string>();
  private static types = new Map<string, string>();

  static init({ env, loadDotEnv, folder, envPath, vars }: TInitOptions = {}) {
    Envs.nowEnv = env;
    env = this.getNowEnv();
    if (Envs.getLoadDotEnv(loadDotEnv)) {
      Envs.loadDotEnvFile(envPath, folder);
    }
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => this.register(k, v));
    }
  }

  private static getLoadDotEnv(passed?: boolean) {
    if (passed !== undefined) {
      return passed;
    }
    if (isNodeJS()) return true;
    return false;
  }

  private static loadDotEnvFile(envPath?: string, folder?: string) {
    if (envPath) {
      dotenv.config({ path: envPath });
      return;
    }
    folder = folder ?? process.cwd();
    const env = path.resolve(folder, `.${this.getNowEnv()}.env`);
    dotenv.config({ path: env });
    const local = path.resolve(folder, '.env');
    dotenv.config({ path: local });
  }

  static getNowEnv() {
    if (Envs.nowEnv) return Envs.nowEnv;
    return (Envs.nowEnv = getEnvName());
  }

  static set(key: string, options: TEnvOptions | string | number | boolean = {}) {
    this.register(key, options);
  }

  static register(key: string, options: TEnvOptions | string | number | boolean = {}) {
    if (typeof options === 'string') {
      options = { default: options, type: 'string' };
    }
    if (typeof options === 'number') {
      options = { default: String(options), type: 'number' };
    }
    if (typeof options === 'boolean') {
      options = { default: String(options), type: 'boolean' };
    }
    const { required = true, override = true, checkDuplicate = true, type = 'string', ...rest } = options;
    const env = this.getNowEnv();
    if (checkDuplicate && this.vars.has(key)) {
      console.warn(`DUPLICATE ENVIRONMENT VARIABLE REGISTER: ${key}`);
    }
    let val = (override ? getEnvVar(key) : undefined) ?? rest[env] ?? rest.default;
    if (type === 'json') {
      val = JSON.stringify(val);
    } else {
      val = String(val);
    }
    if (required && val === undefined) {
      throw new Error(`ENVIRONMENT VARIABLE REQUIRED: ${key}`);
    }
    this.vars.set(key, val);
    this.types.set(key, type);
  }

  static get(key: string, defaultVal?: unknown) {
    switch (this.types.get(key)) {
      case 'string':
        return this.getByString(key);
      case 'number':
        return this.getByNumber(key);
      case 'boolean':
        return this.getByBoolean(key);
      case 'json':
        return this.getByJSON(key);
    }
    return defaultVal;
  }

  static getByString(key: string, defaultVal = '') {
    return this.vars.get(key) ?? defaultVal;
  }

  /**
   * 
   * @param key 
   * @param options 
   *    defaultValFunc: () => []
   *    separator: /,|;/
   * @returns 
   */
  static getByStringList(key: string, options: {
    separator?: string | RegExp
    defaultValFunc?: () => ([]),
  } = {}) {
    const str = this.getByString(key);
    if (!str.trim()) {
      return options?.defaultValFunc?.() ?? [];
    }
    return str.split(options?.separator ?? /,|;/);
  }

  static getByNumber(key: string, defaultVal?: number) {
    return Number(this.getByString(key) || defaultVal);
  }

  static getByBoolean(key: string, defaultVal = false) {
    const str = this.getByString(key).toLowerCase();
    if (UNSET_STRING.includes(str)) {
      return defaultVal;
    }
    if (FALSILY_STRING.includes(str)) {
      return false;
    }
    return true;
  }

  static getByJSON<T = unknown>(key: string, defaultVal = {}) {
    const str = this.getByString(key);
    if (!str) {
      return defaultVal ?? {};
    }
    return JSON.parse(str) || (defaultVal as T);
  }

  static getAllByString() {
    const result: Record<string, string> = {};
    this.vars.forEach((v, k) => (result[k] = v));
    return result;
  }

  static getAll() {
    const result: Record<string, string> = {};
    this.vars.forEach((v, k) => (result[k] = this.get(k)));
    return result;
  }
}

export default Envs;
