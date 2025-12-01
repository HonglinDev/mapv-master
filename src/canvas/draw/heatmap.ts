/**
 * 绘制热力图
 * @author kyle / http://nikai.us/
 */

import Intensity from "../../utils/data-range/Intensity";
import pathSimple from "../path/simple";
import Canvas from "../../utils/Canvas";
import DataSet from "../../data/DataSet";
import {devicePixelRatio} from "../../utils/window";

// 导入DataSet中的DataItem类型
import { DataItem as DataSetDataItem } from "../../data/DataSet";

// 定义数据项接口，扩展自DataSetDataItem
interface DataItem extends DataSetDataItem {
    count?: number;
}

// 定义热力图选项接口
interface HeatmapOptions {
    size?: number;
    _size?: number;
    max?: number;
    min?: number;
    range?: number[];
    maxOpacity?: number;
    minOpacity?: number;
    strength?: number;
    gradient?: Record<string, string>;
    withoutAlpha?: boolean;
    absolute?: boolean;
    [key: string]: any; // 支持动态属性
}

/**
 * 创建热力图圆形点
 * @param size 圆形大小
 * @returns Canvas对象，包含绘制好的圆形
 */
function createCircle(size: number): HTMLCanvasElement {
    const shadowBlur = size / 2;
    const r2 = size + shadowBlur;
    const offsetDistance = 10000;

    const circle = Canvas(r2 * 2, r2 * 2) as HTMLCanvasElement;
    const context = circle.getContext('2d');
    
    if (!context) {
        return circle;
    }

    context.shadowBlur = shadowBlur;
    context.shadowColor = 'black';
    context.shadowOffsetX = context.shadowOffsetY = offsetDistance;

    context.beginPath();
    context.arc(r2 - offsetDistance, r2 - offsetDistance, size, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
    return circle;
}

/**
 * 对热力图像素进行着色处理
 * @param pixels 像素数据
 * @param gradient 渐变颜色数据
 * @param options 热力图选项
 */
function colorize(pixels: Uint8ClampedArray, gradient: Uint8ClampedArray, options: HeatmapOptions): void {
    const max = getMax(options);
    const min = getMin(options);
    const diff = max - min;
    const range = options.range || null;

    let jMin = 0;
    let jMax = 1024;
    if (range && range.length === 2) {
        jMin = (range[0] - min) / diff * 1024;
    }

    if (range && range.length === 2) {
        jMax = (range[1] - min) / diff * 1024;
    }

    const maxOpacity = options.maxOpacity || 0.8;
    const minOpacity = options.minOpacity || 0;

    for (let i = 3, len = pixels.length, j: number; i < len; i += 4) {
        j = pixels[i] * 4; // 从透明度值获取渐变颜色

        // 调整透明度范围
        if (pixels[i] / 256 > maxOpacity) {
            pixels[i] = 256 * maxOpacity;
        }
        if (pixels[i] / 256 < minOpacity) {
            pixels[i] = 256 * minOpacity;
        }

        // 根据范围设置颜色
        if (j && j >= jMin && j <= jMax) {
            pixels[i - 3] = gradient[j];
            pixels[i - 2] = gradient[j + 1];
            pixels[i - 1] = gradient[j + 2];
        } else {
            pixels[i] = 0;
        }
    }
}

/**
 * 获取最大值
 * @param options 热力图选项
 * @returns 最大值
 */
function getMax(options: HeatmapOptions): number {
    return options.max || 100;
}

/**
 * 获取最小值
 * @param options 热力图选项
 * @returns 最小值
 */
function getMin(options: HeatmapOptions): number {
    return options.min || 0;
}

/**
 * 绘制灰度热力图
 * @param context Canvas上下文
 * @param dataSet 数据集
 * @param options 热力图选项
 */
function drawGray(context: CanvasRenderingContext2D, dataSet: DataItem[], options: HeatmapOptions): void {
    const max = getMax(options);
    const min = getMin(options);
    
    // 确定热力图点大小
    let size = options._size;
    if (size === undefined) {
        size = options.size;
        if (size === undefined) {
            size = 13;
        }
    }

    // 创建强度对象，用于颜色渐变
    const intensity = new Intensity({
        gradient: options.gradient,
        max: max,
        min: min
    });

    // 创建圆形点
    const circle = createCircle(size);
    const circleHalfWidth = circle.width / 2;
    const circleHalfHeight = circle.height / 2;

    // 按透明度排序数据，优化绘制性能
    const dataOrderByAlpha: Record<string, DataItem[]> = {};

    dataSet.forEach(function(item) {
        const count = item.count === undefined ? 1 : item.count;
        const alpha = Math.min(1, count / max).toFixed(2);
        dataOrderByAlpha[alpha] = dataOrderByAlpha[alpha] || [];
        dataOrderByAlpha[alpha].push(item);
    });

    // 绘制数据
    for (const i in dataOrderByAlpha) {
        if (isNaN(parseFloat(i))) continue;
        const _data = dataOrderByAlpha[i];
        context.beginPath();
        
        if (!options.withoutAlpha) {
            context.globalAlpha = parseFloat(i);
        }
        
        context.strokeStyle = intensity.getColor(parseFloat(i) * max);
        
        _data.forEach(function(item) {
            if (!item.geometry) {
                return;
            }

            const coordinates = item.geometry._coordinates || item.geometry.coordinates;
            const type = item.geometry.type;
            
            if (type === 'Point') {
                    const count = item.count === undefined ? 1 : item.count;
                    context.globalAlpha = count / max;
                    const pointCoordinates = coordinates as number[];
                    context.drawImage(circle, pointCoordinates[0] - circleHalfWidth, pointCoordinates[1] - circleHalfHeight);
                } else if (type === 'LineString') {
                    const count = item.count === undefined ? 1 : item.count;
                    context.globalAlpha = count / max;
                    context.beginPath();
                    pathSimple.draw(context, item, options);
                    context.stroke();
                }
        });
    }
}

/**
 * 主绘制函数
 * @param context Canvas上下文
 * @param dataSet 数据集
 * @param options 热力图选项
 */
function draw(context: CanvasRenderingContext2D, dataSet: DataSet | DataItem[], options: HeatmapOptions): void {
    // 检查画布大小
    if (context.canvas.width <= 0 || context.canvas.height <= 0) {
        return;
    }

    // 设置强度
    const strength = options.strength || 0.3;
    context.strokeStyle = 'rgba(0,0,0,' + strength + ')';

    // 创建阴影画布
    let shadowCanvas = Canvas(context.canvas.width, context.canvas.height) as HTMLCanvasElement;
    const shadowContext = shadowCanvas.getContext('2d');
    
    if (!shadowContext) {
        return;
    }
    
    shadowContext.scale(devicePixelRatio, devicePixelRatio);

    // 获取数据
    const data = dataSet instanceof DataSet ? dataSet.get() : dataSet;

    context.save();

    // 创建强度对象
    let intensity = new Intensity({
        gradient: options.gradient
    });

    // 绘制灰度热力图
        drawGray(shadowContext, data as DataItem[], options);

        // 着色处理
        if (!options.absolute) {
            const colored = shadowContext.getImageData(0, 0, context.canvas.width, context.canvas.height);
            colorize(colored.data as Uint8ClampedArray, intensity.getImageData() as Uint8ClampedArray, options);
            context.putImageData(colored, 0, 0);

            context.restore();
        }

        // 释放资源
        intensity = null as any;
        shadowCanvas = null as any;
}

export default {
    draw
};