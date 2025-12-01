/**
 * 绘制蜂窝图（六边形网格）
 * @author kyle / http://nikai.us/
 */

import Intensity from "../../utils/data-range/Intensity";
import DataSet from "../../data/DataSet";

// 定义中心点接口
interface Point {
    x: number;
    y: number;
}

// 导入DataSet中的DataItem类型
import { DataItem } from "../../data/DataSet";

// 定义偏移量接口
interface Offset {
    x: number;
    y: number;
}

// 定义标签选项接口
interface LabelOptions {
    show?: boolean;
    fillStyle?: string;
    font?: string;
    shadowColor?: string;
    shadowBlur?: number;
}

// 定义绘制选项接口
interface DrawOptions {
    _size?: number;
    size?: number;
    offset?: Offset;
    max?: number;
    gradient?: Record<string, string>;
    strokeStyle?: string;
    lineWidth?: number;
    label?: LabelOptions;
    [key: string]: any; // 支持动态属性
}

// 定义六边形网格数据接口
type HexBin = DataItem[] & {
    i: number;
    j: number;
    x: number;
    y: number;
    count?: number;
};

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

export default {
    draw: function(context: CanvasRenderingContext2D, dataSet: DataSet | DataItem[], options: DrawOptions) {
        // 保存上下文状态
        context.save();

        // 获取数据
        const data = dataSet instanceof DataSet ? dataSet.get() : dataSet;

        // 设置上下文属性
        for (const key in options) {
            (context as any)[key] = options[key];
        }

        // 偏移量
        const offset = options.offset || {
            x: 10,
            y: 10
        };

        // 计算六边形参数
        let r = options._size || options.size || 40;
        r = r / 2 / Math.sin(Math.PI / 3);
        const dx = r * 2 * Math.sin(Math.PI / 3);
        const dy = r * 1.5;

        // 六边形网格数据
        const binsById: Record<string, HexBin> = {};

        // 将数据点分配到六边形网格中
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (!item.geometry) continue;
            
            const coordinates = item.geometry._coordinates || item.geometry.coordinates;
            const py = (coordinates[1] - offset.y) / dy;
            let pj = Math.round(py);
            const px = (coordinates[0] - offset.x) / dx - (pj & 1 ? 0.5 : 0);
            let pi = Math.round(px);
            const py1 = py - pj;

            // 调整六边形归属
            if (Math.abs(py1) * 3 > 1) {
                const px1 = px - pi;
                const pi2 = pi + (px < pi ? -1 : 1) / 2;
                const pj2 = pj + (py < pj ? -1 : 1);
                const px2 = px - pi2;
                const py2 = py - pj2;
                if (px1 * px1 + py1 * py1 > px2 * px2 + py2 * py2) {
                    pi = pi2 + (pj & 1 ? 1 : -1) / 2;
                    pj = pj2;
                }
            }

            // 生成网格ID并存储数据
            const id = pi + "-" + pj;
            let bin = binsById[id];
            if (bin) {
                bin.push(item);
            } else {
                bin = binsById[id] = [item] as HexBin;
                bin.i = pi;
                bin.j = pj;
                bin.x = (pi + (pj & 1 ? 1 / 2 : 0)) * dx;
                bin.y = pj * dy;
            }
        }

        // 创建强度对象，用于颜色渐变
        const intensity = new Intensity({
            max: options.max || 100,
            maxSize: r,
            gradient: options.gradient
        });

        // 绘制六边形网格
        for (const key in binsById) {
            const item = binsById[key];

            context.beginPath();

            // 绘制六边形
            for (let j = 0; j < 6; j++) {
                const result = hex_corner({
                    x: item.x + offset.x,
                    y: item.y + offset.y
                }, r, j);

                context.lineTo(result[0], result[1]);
            }

            context.closePath();

            // 计算网格内数据总和
            let count = 0;
            for (let i = 0; i < item.length; i++) {
                count += item[i].count || 1;
            }
            item.count = count;

            // 设置填充颜色并绘制
            context.fillStyle = intensity.getColor(count);
            context.fill();
            
            // 如果设置了描边样式和线宽，则绘制边框
            if (options.strokeStyle && options.lineWidth) {
                context.stroke();
            }
        }

        // 如果需要显示标签
        if (options.label && options.label.show !== false) {
            // 设置标签样式
            context.fillStyle = options.label.fillStyle || 'white';

            if (options.label.font) {
                context.font = options.label.font;
            }

            if (options.label.shadowColor) {
                context.shadowColor = options.label.shadowColor;
            }

            if (options.label.shadowBlur) {
                context.shadowBlur = options.label.shadowBlur;
            }

            // 绘制标签
            for (const key in binsById) {
                const item = binsById[key];
                let text = item.count || 0;
                if (text < 0) {
                    text = parseFloat(text.toFixed(2));
                } else {
                    text = Math.floor(text);
                }
                const textWidth = context.measureText(text.toString()).width;
                context.fillText(text.toString(), item.x + offset.x - textWidth / 2, item.y + offset.y + 5);
            }
        }

        // 恢复上下文状态
        context.restore();
    }
};