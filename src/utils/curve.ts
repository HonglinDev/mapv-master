/**
 * 曲线生成工具
 * 根据弧线的坐标节点数组生成曲线点
 */

// 定义点接口
export interface Point {
    lng: number;
    lat: number;
}

// 定义曲线选项接口
interface CurveOptions {
    count?: number;
}

// 定义曲线点类型
export type CurvePoint = [number, number];

/**
 * 根据两点获取曲线坐标点数组
 * @param {Point} obj1 - 起点
 * @param {Point} obj2 - 终点
 * @param {number} count - 曲线线段数量，默认为40
 * @returns {CurvePoint[] | null} - 曲线坐标点数组
 */
function getCurveByTwoPoints(obj1: Point, obj2: Point, count?: number): CurvePoint[] | null {
    if (!obj1 || !obj2) {
        return null;
    }

    // 贝塞尔曲线的三个基函数
    const B1 = (x: number): number => {
        return 1 - 2 * x + x * x;
    };
    
    const B2 = (x: number): number => {
        return 2 * x - 2 * x * x;
    };
    
    const B3 = (x: number): number => {
        return x * x;
    };

    const curveCoordinates: CurvePoint[] = [];
    const pointCount = count || 40; // 曲线由点Count个小线段组成
    let inc = 0;

    const lat1 = parseFloat(obj1.lat.toString());
    const lat2 = parseFloat(obj2.lat.toString());
    const lng1 = parseFloat(obj1.lng.toString());
    const lng2 = parseFloat(obj2.lng.toString());

    // 计算曲线角度
    let adjustedLng1 = lng1;
    let adjustedLng2 = lng2;
    
    if (adjustedLng2 > adjustedLng1) {
        if (parseFloat((adjustedLng2 - adjustedLng1).toString()) > 180) {
            if (adjustedLng1 < 0) {
                adjustedLng1 = parseFloat((180 + 180 + adjustedLng1).toString());
                adjustedLng2 = parseFloat((180 + 180 + adjustedLng2).toString());
            }
        }
    }

    let t: number;
    let h: number;
    let h2: number;
    let lat3: number;
    let lng3: number;

    // 纬度相同
    if (lat2 === lat1) {
        t = 0;
        h = adjustedLng1 - adjustedLng2;
    } 
    // 经度相同
    else if (adjustedLng2 === adjustedLng1) {
        t = Math.PI / 2;
        h = lat1 - lat2;
    } 
    // 其他情况
    else {
        t = Math.atan((lat2 - lat1) / (adjustedLng2 - adjustedLng1));
        h = (lat2 - lat1) / Math.sin(t);
    }

    const t2 = t + (Math.PI / 5);
    h2 = h / 2;
    lng3 = h2 * Math.cos(t2) + adjustedLng1;
    lat3 = h2 * Math.sin(t2) + lat1;

    // 生成曲线点
    for (let i = 0; i < pointCount + 1; i++) {
        const x = adjustedLng1 * B1(inc) + lng3 * B2(inc) + adjustedLng2 * B3(inc);
        const y = lat1 * B1(inc) + lat3 * B2(inc) + lat2 * B3(inc);
        const lng1_src = obj1.lng;
        const lng2_src = obj2.lng;

        curveCoordinates.push([
            (lng1_src < 0 && lng2_src > 0) ? x - 360 : x, y
        ]);
        inc += (1 / pointCount);
    }

    return curveCoordinates;
}

/**
 * 根据弧线的坐标节点数组获取曲线点
 * @param {Point[]} points - 坐标节点数组
 * @param {CurveOptions} options - 曲线选项
 * @returns {CurvePoint[]} - 曲线坐标点数组
 */
function getCurvePoints(points: Point[], options?: CurveOptions): CurvePoint[] {
    let curvePoints: CurvePoint[] = [];
    for (let i = 0; i < points.length - 1; i++) {
        const p = getCurveByTwoPoints(points[i], points[i + 1], options?.count);
        if (p && p.length > 0) {
            curvePoints = curvePoints.concat(p);
        }
    }
    return curvePoints;
}

// 曲线工具对象
export const curve = {
    getPoints: getCurvePoints
};

export default curve;