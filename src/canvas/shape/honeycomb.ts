/**
 * 蜂窝形状绘制模块
 */

// 定义中心点接口
interface Point {
    x: number;
    y: number;
}

/**
 * 计算六边形的角点坐标
 * @param center 中心点
 * @param size 六边形大小
 * @param i 角点索引（0-5）
 * @returns 角点坐标
 */
function hex_corner(center: Point, size: number, i: number): number[] {
    const angle_deg = 60 * i + 30;
    const angle_rad = Math.PI / 180 * angle_deg;
    return [center.x + size * Math.cos(angle_rad), center.y + size * Math.sin(angle_rad)];
}

/**
 * 绘制六边形
 * @param context Canvas上下文
 * @param x 中心点x坐标
 * @param y 中心点y坐标
 * @param size 六边形大小
 */
function draw(context: CanvasRenderingContext2D, x: number, y: number, size: number): void {
    for (let j = 0; j < 6; j++) {
        const result = hex_corner({
            x: x,
            y: y
        }, size, j);

        context.lineTo(result[0], result[1]);
    }
}

export {draw};