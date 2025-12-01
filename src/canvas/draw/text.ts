/**
 * 文本绘制模块
 * @author Mofei Zhu<mapv@zhuwenlong.com>
 */

import pathSimple from "../path/simple";
import DataSet from "../../data/DataSet";

// 定义数据项接口
interface DataItem {
    offset?: Offset;
    geometry: {
        coordinates: number[];
        _coordinates?: number[];
    };
    [key: string]: any; // 支持动态属性
}

// 定义偏移量接口
interface Offset {
    x: number;
    y: number;
}

// 定义矩形接口
interface RectPoint {
    x: number;
    y: number;
}

interface Rect {
    sw: RectPoint; // 西南角
    ne: RectPoint; // 东北角
}

// 定义绘制选项接口
interface DrawOptions {
    _size?: number;
    size?: number;
    textKey?: string;
    textAlign?: CanvasTextAlign;
    textBaseline?: CanvasTextBaseline;
    avoid?: boolean;
    offset?: Offset;
    [key: string]: any; // 支持动态属性
}

export default {
    /**
     * 绘制文本
     * @param context Canvas上下文
     * @param dataSet 数据集
     * @param options 绘制选项
     */
    draw: function (context: CanvasRenderingContext2D, dataSet: DataSet | DataItem[], options: DrawOptions) {
        // 获取数据
        const data = dataSet instanceof DataSet ? dataSet.get() : dataSet;
        
        // 保存上下文状态
        context.save();

        // 设置上下文属性
        for (const key in options) {
            (context as any)[key] = options[key];
        }

        const rects: Rect[] = [];
            
        // 设置字体大小
        const size = options._size || options.size;
        if (size) {
            context.font = "bold " + size + "px Arial";
        } else {
            context.font = "bold 12px Arial";
        }

        // 文本属性
        const textKey = options.textKey || 'text';

        // 设置文本对齐方式
        if (!options.textAlign) {
            context.textAlign = 'center';
        }

        // 设置文本基线
        if (!options.textBaseline) {
            context.textBaseline = 'middle';
        }

        // 标注避让模式
        if (options.avoid) {
            for (let i = 0, len = data.length; i < len; i++) {
                // 获取偏移量
                const offset = data[i].offset || options.offset || {
                    x: 0,
                    y: 0
                };

                const item = data[i];
                
                // 确保geometry存在
                if (!item.geometry) continue;
                
                // 获取坐标
                const coordinates = item.geometry._coordinates || item.geometry.coordinates;
                const x = coordinates[0] + offset.x;
                const y = coordinates[1] + offset.y;
                const text = item[textKey] as string;
                
                // 测量文本宽度
                const textWidth = context.measureText(text).width;

                // 计算文本矩形区域
                const px = x - textWidth / 2; 
                const py = y - (size || 12) / 2;

                const rect: Rect = {
                    sw: {
                        x: px,
                        y: py + (size || 12)
                    },
                    ne: {
                        x: px + textWidth,
                        y: py 
                    }
                };

                // 检查是否重叠，不重叠则绘制
                if (!hasOverlay(rects, rect)) {
                    rects.push(rect);
                    context.fillText(text, x, y);
                }
            }
        } else {
            // 普通绘制模式
            for (let i = 0, len = data.length; i < len; i++) {
                // 获取偏移量
                const offset = data[i].offset || options.offset || {
                    x: 0,
                    y: 0
                };
                
                const item = data[i];
                
                // 确保geometry存在
                if (!item.geometry) continue;
                
                // 获取坐标
                const coordinates = item.geometry._coordinates || item.geometry.coordinates;
                const x = coordinates[0] + offset.x;
                const y = coordinates[1] + offset.y;
                const text = item[textKey] as string;
                
                // 绘制文本
                context.fillText(text, x, y);
            }
        }

        // 恢复上下文状态
        context.restore();
    }
}

/**
 * 检查当前矩形是否与已有的矩形列表重叠
 * @param rects 已有的矩形列表
 * @param overlay 当前矩形
 * @returns 是否重叠
 */
function hasOverlay(rects: Rect[], overlay: Rect): boolean {
    for (let i = 0; i < rects.length; i++) {
        if (isRectOverlay(rects[i], overlay)) {
            return true;
        }
    }
    return false;
}

/**
 * 判断两个矩形是否重叠
 * @param rect1 第一个矩形
 * @param rect2 第二个矩形
 * @returns 是否重叠
 */
function isRectOverlay(rect1: Rect, rect2: Rect): boolean {
    // minx、miny 两个矩形右下角最小的x和y
    // maxx、maxy 两个矩形左上角最大的x和y
    const minx = Math.min(rect1.ne.x, rect2.ne.x);
    const miny = Math.min(rect1.sw.y, rect2.sw.y);
    const maxx = Math.max(rect1.sw.x, rect2.sw.x);
    const maxy = Math.max(rect1.ne.y, rect2.ne.y);
    
    // 如果最小右下角大于最大左上角，则重叠
    if (minx > maxx && miny > maxy) {
        return true;
    }
    return false;
}