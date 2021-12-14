"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Envs = void 0;
const tslib_1 = require("tslib");
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const dotenv_1 = (0, tslib_1.__importDefault)(require("dotenv"));
const DEFAULT_ENV = "release";
const UNSET_STRING = ["", "undefined"];
const FALSILY_STRING = ["0", "false", "none", "null", "n/a", "[]", "{}", "f", "off"];
const mapIfMatch = (env, map) => {
    env = env.toLowerCase();
    return env in map ? map[env] : (env || DEFAULT_ENV);
};
const isWechatMiniProgram = () => wx && wx.getAccountInfoSync;
const isNodeJS = () => !isWechatMiniProgram() && typeof process !== "undefined" && process && process.env;
/**
 * 获取环境名称
 * @returns develop -> 开发环境  staging -> 体验版/测试环境  release -> 正式环境
 */
const getEnvName = () => {
    if (isWechatMiniProgram()) {
        // MiniProgram
        const { envVersion } = wx.getAccountInfoSync().miniProgram;
        return mapIfMatch(envVersion, {
            "develop": "develop",
            "trial": "staging",
            "release": "release",
        });
    }
    if (isNodeJS()) {
        // node环境
        const nodeEnv = process.env.NODE_ENV || "";
        return mapIfMatch(nodeEnv, {
            "development": "develop",
            "staging": "staging",
            "production": "release",
        });
    }
    console.warn(`[ENV_NAME] This Env is neither MiniProgram Nor NodeJs. Env fallback to "${DEFAULT_ENV}". `);
    return DEFAULT_ENV;
};
/**
 * 获取环境变量
 */
const getEnvVar = (name) => {
    if (typeof process !== "undefined" && process && process.env && process.env[name]) {
        return process.env[name];
    }
    return;
};
class Envs {
    static init({ env, loadDotEnv, folder = "./", envPath } = {}) {
        Envs.nowEnv = env;
        env = this.getNowEnv();
        if (Envs.getLoadDotEnv(loadDotEnv)) {
            Envs.loadDotEnvFile(envPath, folder);
        }
    }
    static getLoadDotEnv(passed) {
        if (passed !== undefined) {
            return passed;
        }
        if (isNodeJS())
            return true;
        return false;
    }
    static loadDotEnvFile(envPath, folder) {
        if (envPath) {
            dotenv_1.default.config({ path: envPath });
            return;
        }
        folder = folder !== null && folder !== void 0 ? folder : process.cwd();
        const env = path_1.default.resolve(folder, `.${this.getNowEnv()}.env`);
        dotenv_1.default.config({ path: env });
        const local = path_1.default.resolve(folder, '.env');
        dotenv_1.default.config({ path: local });
    }
    static getNowEnv() {
        if (Envs.nowEnv)
            return Envs.nowEnv;
        return Envs.nowEnv = getEnvName();
    }
    static register(key, options = {}) {
        var _a, _b;
        if (typeof options === "string") {
            options = { default: options, type: 'string' };
        }
        if (typeof options === "number") {
            options = { default: String(options), type: 'number' };
        }
        if (typeof options === "boolean") {
            options = { default: String(options), type: 'boolean' };
        }
        const { required = true, overwide = true, type = "string" } = options, rest = (0, tslib_1.__rest)(options, ["required", "overwide", "type"]);
        const env = this.getNowEnv();
        if (this.vars.has(key)) {
            console.warn(`DUPLICATE ENVIRONMENT VARIABLE REGISTER: ${key}`);
        }
        const val = (_b = (_a = (overwide ? getEnvVar(key) : undefined)) !== null && _a !== void 0 ? _a : rest[env]) !== null && _b !== void 0 ? _b : rest.default;
        if (required && val === undefined) {
            throw new Error(`ENVIRONMENT VARIABLE REQUIRED: ${key}`);
        }
        this.vars.set(key, val);
        this.types.set(key, type);
    }
    static get(key, defaultVal) {
        switch (this.types.get(key)) {
            case 'string': return this.getByString(key);
            case 'number': return this.getByNumber(key);
            case 'boolean': return this.getByBoolean(key);
            case 'json': return this.getByJSON(key);
        }
        return defaultVal;
    }
    static getByString(key, defaultVal = "") {
        var _a;
        return (_a = this.vars.get(key)) !== null && _a !== void 0 ? _a : defaultVal;
    }
    static getByNumber(key, defaultVal) {
        return Number(this.getByString(key) || defaultVal);
    }
    static getByBoolean(key, defaultVal = false) {
        const str = this.getByString(key).toLowerCase();
        if (UNSET_STRING.includes(str)) {
            return defaultVal;
        }
        if (FALSILY_STRING.includes(str)) {
            return false;
        }
        return true;
    }
    static getByJSON(key, defaultVal = {}) {
        const str = this.getByString(key);
        if (!str) {
            return defaultVal !== null && defaultVal !== void 0 ? defaultVal : {};
        }
        return JSON.parse(str) || defaultVal;
    }
    static getAllByString() {
        const result = {};
        this.vars.forEach((v, k) => result[k] = v);
        return result;
    }
    static getAll() {
        const result = {};
        this.vars.forEach((v, k) => result[k] = this.get(k));
        return result;
    }
}
exports.Envs = Envs;
Envs.vars = new Map();
Envs.types = new Map();
exports.default = Envs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLDZEQUF1QjtBQUN2QixpRUFBMkI7QUFFM0IsTUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFBO0FBQzdCLE1BQU0sWUFBWSxHQUFHLENBQUMsRUFBRSxFQUFFLFdBQVcsQ0FBQyxDQUFBO0FBQ3RDLE1BQU0sY0FBYyxHQUFHLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQTtBQVNwRixNQUFNLFVBQVUsR0FBRyxDQUFDLEdBQVcsRUFBRSxHQUEyQixFQUFFLEVBQUU7SUFDOUQsR0FBRyxHQUFHLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtJQUN2QixPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksV0FBVyxDQUFDLENBQUM7QUFDdEQsQ0FBQyxDQUFBO0FBRUQsTUFBTSxtQkFBbUIsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLGtCQUFrQixDQUFBO0FBQzdELE1BQU0sUUFBUSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxPQUFPLE9BQU8sS0FBSyxXQUFXLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUE7QUFFekc7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLEdBQUcsR0FBRyxFQUFFO0lBRXRCLElBQUksbUJBQW1CLEVBQUUsRUFBRTtRQUN6QixjQUFjO1FBQ2QsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLFdBQVcsQ0FBQTtRQUMxRCxPQUFPLFVBQVUsQ0FBQyxV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QUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIlxuaW1wb3J0IGRvdGVudiBmcm9tIFwiZG90ZW52XCJcblxuY29uc3QgREVGQVVMVF9FTlYgPSBcInJlbGVhc2VcIlxuY29uc3QgVU5TRVRfU1RSSU5HID0gW1wiXCIsIFwidW5kZWZpbmVkXCJdXG5jb25zdCBGQUxTSUxZX1NUUklORyA9IFtcIjBcIiwgXCJmYWxzZVwiLCBcIm5vbmVcIiwgXCJudWxsXCIsIFwibi9hXCIsIFwiW11cIiwgXCJ7fVwiLCBcImZcIiwgXCJvZmZcIl1cblxuLy8gZXhwb3J0IGNvbnN0IGlzTm9kZUpzID0gKCkgPT4ge1xuLy8gICByZXR1cm4gdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgPyB0cnVlIDogZmFsc2UgO1xuLy8gfVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueSxuby12YXJcbmRlY2xhcmUgdmFyIHd4OiBhbnlcblxuY29uc3QgbWFwSWZNYXRjaCA9IChlbnY6IHN0cmluZywgbWFwOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSA9PiB7XG4gIGVudiA9IGVudi50b0xvd2VyQ2FzZSgpXG4gIHJldHVybiBlbnYgaW4gbWFwID8gbWFwW2Vudl0gOiAoZW52IHx8IERFRkFVTFRfRU5WKTtcbn1cblxuY29uc3QgaXNXZWNoYXRNaW5pUHJvZ3JhbSA9ICgpID0+IHd4ICYmIHd4LmdldEFjY291bnRJbmZvU3luY1xuY29uc3QgaXNOb2RlSlMgPSAoKSA9PiAhaXNXZWNoYXRNaW5pUHJvZ3JhbSgpICYmIHR5cGVvZiBwcm9jZXNzICE9PSBcInVuZGVmaW5lZFwiICYmIHByb2Nlc3MgJiYgcHJvY2Vzcy5lbnZcblxuLyoqXG4gKiDojrflj5bnjq/looPlkI3np7BcbiAqIEByZXR1cm5zIGRldmVsb3AgLT4g5byA5Y+R546v5aKDICBzdGFnaW5nIC0+IOS9k+mqjOeJiC/mtYvor5Xnjq/looMgIHJlbGVhc2UgLT4g5q2j5byP546v5aKDXG4gKi9cbmNvbnN0IGdldEVudk5hbWUgPSAoKSA9PiB7XG5cbiAgaWYgKGlzV2VjaGF0TWluaVByb2dyYW0oKSkge1xuICAgIC8vIE1pbmlQcm9ncmFtXG4gICAgY29uc3QgeyBlbnZWZXJzaW9uIH0gPSB3eC5nZXRBY2NvdW50SW5mb1N5bmMoKS5taW5pUHJvZ3JhbVxuICAgIHJldHVybiBtYXBJZk1hdGNoKGVudlZlcnNpb24sIHsgXG4gICAgICBcImRldmVsb3BcIjogXCJkZXZlbG9wXCIsXG4gICAgICBcInRyaWFsXCI6IFwic3RhZ2luZ1wiLFxuICAgICAgXCJyZWxlYXNlXCI6IFwicmVsZWFzZVwiLFxuICAgIH0pXG4gIH1cbiAgaWYgKGlzTm9kZUpTKCkpIHtcbiAgICAvLyBub2Rl546v5aKDXG4gICAgY29uc3Qgbm9kZUVudiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WIHx8IFwiXCJcbiAgICByZXR1cm4gbWFwSWZNYXRjaChub2RlRW52LCB7IFxuICAgICAgXCJkZXZlbG9wbWVudFwiOiBcImRldmVsb3BcIixcbiAgICAgIFwic3RhZ2luZ1wiOiBcInN0YWdpbmdcIixcbiAgICAgIFwicHJvZHVjdGlvblwiOiBcInJlbGVhc2VcIixcbiAgICB9KVxuICB9XG4gIGNvbnNvbGUud2FybihgW0VOVl9OQU1FXSBUaGlzIEVudiBpcyBuZWl0aGVyIE1pbmlQcm9ncmFtIE5vciBOb2RlSnMuIEVudiBmYWxsYmFjayB0byBcIiR7REVGQVVMVF9FTlZ9XCIuIGApXG4gIHJldHVybiBERUZBVUxUX0VOVlxufVxuXG4vKipcbiAqIOiOt+WPlueOr+Wig+WPmOmHj1xuICovXG5jb25zdCBnZXRFbnZWYXIgPSAobmFtZTogc3RyaW5nKSA9PiB7XG4gIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBwcm9jZXNzICYmIHByb2Nlc3MuZW52ICYmIHByb2Nlc3MuZW52W25hbWVdKSB7XG4gICAgcmV0dXJuIHByb2Nlc3MuZW52W25hbWVdXG4gIH1cbiAgcmV0dXJuO1xufVxuXG4vLyBjb25zdCBmaW5kRGVmaW5lZCA9IChhcnI6IGFueVtdKSA9PiBhcnIuZmluZCh2ID0+IHYgIT09IHVuZGVmaW5lZClcblxuZXhwb3J0IHR5cGUgVEVudk9wdGlvbnM8VD4gPSB7XG4gIGRlZmF1bHQ/OiBULFxuICByZWxlYXNlPzogVCxcbiAgc3RhZ2luZz86IFQsXG4gIGRldmVsb3A/OiBULFxuICAvKiogXG4gICAqIFRocm93IGFuIGVycm9yIGlmIGl0J3Mgbm90IHByb3ZpZGVkXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlcXVpcmVkPzogYm9vbGVhbixcbiAgLyoqIFxuICAgKiBWYXJpYmxlIFdpbGwgYmUgb3ZlcndpZGVkIGJ5IHRoZSBzeXN0ZW0gZW52aXJvbm1lbnQgdmFyaWJsZSBpZiBwcm92aWRlZC5cbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgb3ZlcndpZGU/OiBib29sZWFuXG4gIC8qKiBcbiAgICogRGVmYXVsdCB0eXBlIHdoZW4gZ2V0XG4gICAqIEBkZWZhdWx0IFwic3RyaW5nXCJcbiAgICovXG4gIC8vIHR5cGU/OiBcInN0cmluZ1wiIHwgXCJib29sZWFuXCIgfCBcIm51bWJlclwiIHwgXCJqc29uXCJcbn0gJiB7IFtlbnY6IHN0cmluZ106IFQgfVxuXG5leHBvcnQgdHlwZSBUSW5pdE9wdGlvbnMgPSB7XG4gIC8qKiBcbiAgICogRm9yY2Ugc3BlY2lmeSBub3cgZW52IG5hbWUgXG4gICAqL1xuICBlbnY/OiBzdHJpbmdcbiAgLyoqIFxuICAgKiBkZWZhdWx0OiB0cnVlIHdoaWxlIG5vZGVKUywgZmFsc2Ugd2hpbGUgd2ViIC8gd2VjaGF0LW1pbmlwcm9ncmFtXG4gICAqL1xuICBsb2FkRG90RW52PzogYm9vbGVhblxuICAvKiogXG4gICAqIFBhdGggdG8gLmVudiBmb2xkZXIuXG4gICAqIFdpbGwgbG9hZCAuW2Vudi1uYW1lXS5lbnYgZmlyc3QgYW5kIGxvYWQgLmVudiBuZXh0LlxuICAgKi9cbiAgZm9sZGVyPzogc3RyaW5nXG4gIC8qKiBcbiAgICogRm9yY2UgbG9hZCBlbnYgZmlsZSBQYXRoLlxuICAgKiBJdCdsbCBpZ25vcmUgYGZvbGRlcmAuXG4gICAqL1xuICBlbnZQYXRoPzogc3RyaW5nXG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFbnZzIHtcbiAgcHJpdmF0ZSBzdGF0aWMgbm93RW52Pzogc3RyaW5nXG4gIHByaXZhdGUgc3RhdGljIHZhcnMgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpXG4gIHByaXZhdGUgc3RhdGljIHR5cGVzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKVxuXG4gIHN0YXRpYyBpbml0KHsgZW52LCBsb2FkRG90RW52LCBmb2xkZXI9XCIuL1wiLCBlbnZQYXRoIH06IFRJbml0T3B0aW9ucyA9IHt9KSB7XG4gICAgRW52cy5ub3dFbnYgPSBlbnZcbiAgICBlbnYgPSB0aGlzLmdldE5vd0VudigpXG4gICAgaWYgKEVudnMuZ2V0TG9hZERvdEVudihsb2FkRG90RW52KSkge1xuICAgICAgRW52cy5sb2FkRG90RW52RmlsZShlbnZQYXRoLCBmb2xkZXIpXG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgZ2V0TG9hZERvdEVudihwYXNzZWQ/OiBib29sZWFuKSB7XG4gICAgaWYgKHBhc3NlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gcGFzc2VkXG4gICAgfVxuICAgIGlmIChpc05vZGVKUygpKSByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgbG9hZERvdEVudkZpbGUoZW52UGF0aD86IHN0cmluZywgZm9sZGVyPzogc3RyaW5nKSB7XG4gICAgaWYgKGVudlBhdGgpIHtcbiAgICAgIGRvdGVudi5jb25maWcoeyBwYXRoOiBlbnZQYXRoIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgZm9sZGVyID0gZm9sZGVyID8/IHByb2Nlc3MuY3dkKClcbiAgICBjb25zdCBlbnYgPSBwYXRoLnJlc29sdmUoZm9sZGVyLCBgLiR7dGhpcy5nZXROb3dFbnYoKX0uZW52YClcbiAgICBkb3RlbnYuY29uZmlnKHsgcGF0aDogZW52IH0pXG4gICAgY29uc3QgbG9jYWwgPSBwYXRoLnJlc29sdmUoZm9sZGVyLCAnLmVudicpXG4gICAgZG90ZW52LmNvbmZpZyh7IHBhdGg6IGxvY2FsIH0pXG4gIH1cblxuICBzdGF0aWMgZ2V0Tm93RW52KCkge1xuICAgIGlmIChFbnZzLm5vd0VudikgcmV0dXJuIEVudnMubm93RW52XG4gICAgcmV0dXJuIEVudnMubm93RW52ID0gZ2V0RW52TmFtZSgpXG4gIH1cblxuICBzdGF0aWMgcmVnaXN0ZXIoa2V5OiBzdHJpbmcsIG9wdGlvbnM6IFRFbnZPcHRpb25zPHN0cmluZz4gfCBzdHJpbmcgfCBudW1iZXIgPSB7fSkge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgb3B0aW9ucyA9IHsgZGVmYXVsdDogb3B0aW9ucywgdHlwZTogJ3N0cmluZycgfVxuICAgIH1cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIG9wdGlvbnMgPSB7IGRlZmF1bHQ6IFN0cmluZyhvcHRpb25zKSwgdHlwZTogJ251bWJlcicgfVxuICAgIH1cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICBvcHRpb25zID0geyBkZWZhdWx0OiBTdHJpbmcob3B0aW9ucyksIHR5cGU6ICdib29sZWFuJyB9XG4gICAgfVxuICAgIGNvbnN0IHsgcmVxdWlyZWQgPSB0cnVlLCBvdmVyd2lkZSA9IHRydWUsIHR5cGUgPSBcInN0cmluZ1wiLCAuLi5yZXN0IH0gPSBvcHRpb25zXG4gICAgY29uc3QgZW52ID0gdGhpcy5nZXROb3dFbnYoKVxuICAgIGlmICh0aGlzLnZhcnMuaGFzKGtleSkpIHtcbiAgICAgIGNvbnNvbGUud2FybihgRFVQTElDQVRFIEVOVklST05NRU5UIFZBUklBQkxFIFJFR0lTVEVSOiAke2tleX1gKVxuICAgIH1cbiAgICBjb25zdCB2YWwgPSAob3ZlcndpZGUgPyBnZXRFbnZWYXIoa2V5KSA6IHVuZGVmaW5lZCkgPz8gcmVzdFtlbnZdID8/IHJlc3QuZGVmYXVsdFxuICAgIGlmIChyZXF1aXJlZCAmJiB2YWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFTlZJUk9OTUVOVCBWQVJJQUJMRSBSRVFVSVJFRDogJHtrZXl9YClcbiAgICB9XG4gICAgdGhpcy52YXJzLnNldChrZXksIHZhbClcbiAgICB0aGlzLnR5cGVzLnNldChrZXksIHR5cGUpXG4gIH1cblxuICBzdGF0aWMgZ2V0KGtleTogc3RyaW5nLCBkZWZhdWx0VmFsPzogYW55KSB7XG4gICAgc3dpdGNoICh0aGlzLnR5cGVzLmdldChrZXkpKSB7XG4gICAgICBjYXNlICdzdHJpbmcnOiByZXR1cm4gdGhpcy5nZXRCeVN0cmluZyhrZXkpXG4gICAgICBjYXNlICdudW1iZXInOiByZXR1cm4gdGhpcy5nZXRCeU51bWJlcihrZXkpXG4gICAgICBjYXNlICdib29sZWFuJzogcmV0dXJuIHRoaXMuZ2V0QnlCb29sZWFuKGtleSlcbiAgICAgIGNhc2UgJ2pzb24nOiByZXR1cm4gdGhpcy5nZXRCeUpTT04oa2V5KVxuICAgIH1cbiAgICByZXR1cm4gZGVmYXVsdFZhbFxuICB9XG5cbiAgc3RhdGljIGdldEJ5U3RyaW5nKGtleTogc3RyaW5nLCBkZWZhdWx0VmFsID0gXCJcIikge1xuICAgIHJldHVybiB0aGlzLnZhcnMuZ2V0KGtleSkgPz8gZGVmYXVsdFZhbFxuICB9XG5cbiAgc3RhdGljIGdldEJ5TnVtYmVyKGtleTogc3RyaW5nLCBkZWZhdWx0VmFsPzogbnVtYmVyKSB7XG4gICAgcmV0dXJuIE51bWJlcih0aGlzLmdldEJ5U3RyaW5nKGtleSkgfHwgZGVmYXVsdFZhbClcbiAgfVxuXG4gIHN0YXRpYyBnZXRCeUJvb2xlYW4oa2V5OiBzdHJpbmcsIGRlZmF1bHRWYWwgPSBmYWxzZSkge1xuICAgIGNvbnN0IHN0ciA9IHRoaXMuZ2V0QnlTdHJpbmcoa2V5KS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKFVOU0VUX1NUUklORy5pbmNsdWRlcyhzdHIpKSB7XG4gICAgICByZXR1cm4gZGVmYXVsdFZhbFxuICAgIH1cbiAgICBpZiAoRkFMU0lMWV9TVFJJTkcuaW5jbHVkZXMoc3RyKSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBzdGF0aWMgZ2V0QnlKU09OPFQ9dW5rbm93bj4oa2V5OiBzdHJpbmcsIGRlZmF1bHRWYWwgPSB7fSkge1xuICAgIGNvbnN0IHN0ciA9IHRoaXMuZ2V0QnlTdHJpbmcoa2V5KVxuICAgIGlmICghc3RyKSB7XG4gICAgICByZXR1cm4gZGVmYXVsdFZhbCA/PyB7fVxuICAgIH1cbiAgICByZXR1cm4gSlNPTi5wYXJzZShzdHIpIHx8IGRlZmF1bHRWYWwgYXMgVFxuICB9XG5cbiAgc3RhdGljIGdldEFsbEJ5U3RyaW5nKCkge1xuICAgIGNvbnN0IHJlc3VsdDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9XG4gICAgdGhpcy52YXJzLmZvckVhY2goKHYsIGspID0+IHJlc3VsdFtrXSA9IHYpXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG5cbiAgc3RhdGljIGdldEFsbCgpIHtcbiAgICBjb25zdCByZXN1bHQ6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fVxuICAgIHRoaXMudmFycy5mb3JFYWNoKCh2LCBrKSA9PiByZXN1bHRba10gPSB0aGlzLmdldChrKSlcbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRW52c1xuIl19