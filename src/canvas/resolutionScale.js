/**
 * @author kyle / http://nikai.us/
 */

export default function (context) {
    var devicePixelRatio = window.devicePixelRatio || 1;
    context.canvas.width = context.canvas.width * devicePixelRatio;
    context.canvas.height = context.canvas.height * devicePixelRatio;
    context.canvas.style.width = context.canvas.width / devicePixelRatio + 'px';
    context.canvas.style.height = context.canvas.height / devicePixelRatio  + 'px';
    context.scale(devicePixelRatio, devicePixelRatio);
}

// 添加获取设备像素比的函数
export function getDevicePixelRatio() {
    return window.devicePixelRatio || 1;
}

// 添加不改变canvas尺寸的缩放函数
export function scaleContext(context) {
    var devicePixelRatio = window.devicePixelRatio || 1;
    context.scale(devicePixelRatio, devicePixelRatio);
    return devicePixelRatio;
}