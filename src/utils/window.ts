/**
 * 全局对象和设备像素比模块
 */

// 获取全局对象，优先使用window，如果不存在则使用空对象
const global: Window & typeof globalThis = typeof window === 'undefined' ? {} as any : window;

// 获取设备像素比，默认值为1
const devicePixelRatio: number = global.devicePixelRatio || 1;

// 导出设备像素比
export {devicePixelRatio};
// 导出全局对象作为window
export {global as window};
// 默认导出全局对象
export default global;