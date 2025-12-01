/**
 * 工具函数集合
 */

/**
 * 根据两点坐标获取角度
 * @param start 起点坐标 [x, y]
 * @param end 终点坐标 [x, y]
 * @returns 角度（不是弧度）
 */
export function getAngle(start: number[], end: number[]): number {
    const diff_x = end[0] - start[0];
    const diff_y = end[1] - start[1];
    let deg = 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
    
    // 调整角度范围，确保结果在0-360度之间
    if (end[0] < start[0]) {
        deg = deg + 180;
    }
    
    return deg;
}