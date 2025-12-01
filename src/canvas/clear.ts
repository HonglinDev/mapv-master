/**
 * 清除Canvas画布
 * @author kyle / http://nikai.us/
 */

/**
 * 清除整个Canvas画布
 * @param {CanvasRenderingContext2D} context - Canvas上下文
 */
export default function clear(context: CanvasRenderingContext2D): void {
    if (context && context.clearRect && context.canvas) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }
    //context.canvas.width = context.canvas.width;
    //context.canvas.height = context.canvas.height;
}

/**
 * 清除Canvas指定区域
 * @param {CanvasRenderingContext2D} context - Canvas上下文
 * @param {number} x - 清除区域左上角X坐标
 * @param {number} y - 清除区域左上角Y坐标
 * @param {number} width - 清除区域宽度
 * @param {number} height - 清除区域高度
 */
export function clearRect(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
): void {
    if (context && context.clearRect) {
        context.clearRect(x, y, width, height);
    }
}