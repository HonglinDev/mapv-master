/**
 * @author kyle / http://nikai.us/
 */

export default function (context) {
    context && context.clearRect && context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    //context.canvas.width = context.canvas.width;
    //context.canvas.height = context.canvas.height;
}

// 添加一个带参数的清除函数，可以指定清除区域
export function clearRect(context, x, y, width, height) {
    context && context.clearRect && context.clearRect(x, y, width, height);
}