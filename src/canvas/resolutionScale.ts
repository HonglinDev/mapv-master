/**
 * 分辨率缩放模块
 * @author kyle / http://nikai.us/
 */

/**
 * 调整画布分辨率以适配设备像素比
 * @param context Canvas上下文
 */
export default function (context: CanvasRenderingContext2D): void {
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    // 调整画布实际尺寸
    context.canvas.width = context.canvas.width * devicePixelRatio;
    context.canvas.height = context.canvas.height * devicePixelRatio;
    
    // 保持画布显示尺寸不变
    context.canvas.style.width = context.canvas.width / devicePixelRatio + 'px';
    context.canvas.style.height = context.canvas.height / devicePixelRatio  + 'px';
    
    // 缩放上下文
    context.scale(devicePixelRatio, devicePixelRatio);
}

/**
 * 获取设备像素比
 * @returns 设备像素比
 */
export function getDevicePixelRatio(): number {
    return window.devicePixelRatio || 1;
}

/**
 * 缩放上下文但不改变画布尺寸
 * @param context Canvas上下文
 * @returns 设备像素比
 */
export function scaleContext(context: CanvasRenderingContext2D): number {
    const devicePixelRatio = window.devicePixelRatio || 1;
    context.scale(devicePixelRatio, devicePixelRatio);
    return devicePixelRatio;
}