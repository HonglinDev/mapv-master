/**
 * 创建Canvas元素
 * @param {number} width - Canvas宽度
 * @param {number} height - Canvas高度
 * @returns {HTMLCanvasElement | null} - 创建的Canvas元素
 */
function Canvas(width?: number, height?: number): HTMLCanvasElement | null {
    let canvas: HTMLCanvasElement | null = null;

    if (typeof document !== 'undefined') {
        canvas = document.createElement('canvas');

        if (width !== undefined) {
            canvas.width = width;
        }

        if (height !== undefined) {
            canvas.height = height;
        }
    }

    return canvas;
}

export default Canvas;