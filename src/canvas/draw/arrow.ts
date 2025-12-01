/**
 * 绘制沿线箭头
 * @author kyle / http://nikai.us/
 */

import pathSimple from "../path/simple";
import DataSet from "../../data/DataSet";
import {getAngle} from "../../utils/index.js";
import {devicePixelRatio} from "../../utils/window.js";

// 图片缓存对象
const imageCache: Record<string, HTMLImageElement | null> = {};

// 定义数据项接口
interface DataItem {
    fillStyle?: string;
    _fillStyle?: string;
    strokeStyle?: string;
    _strokeStyle?: string;
    geometry: {
        type: string;
        coordinates: number[][];
        _coordinates?: number[][];
    };
}

// 定义箭头选项接口
interface ArrowOptions {
    url?: string;
    interval?: number;
}

// 定义绘制选项接口
interface DrawOptions {
    arrow: ArrowOptions;
    [key: string]: any; // 支持动态属性
}

const object = {
    draw: function (context: CanvasRenderingContext2D, dataSet: DataSet | DataItem[], options: DrawOptions) {
        // 默认箭头图片URL
        let imageCacheKey = 'http://huiyan.baidu.com/github/tools/gis-drawing/static/images/direction.png';
        if (options.arrow && options.arrow.url) {
            imageCacheKey = options.arrow.url;
        }

        // 初始化图片缓存
        if (!imageCache[imageCacheKey]) {
            imageCache[imageCacheKey] = null;
        }

        let directionImage = imageCache[imageCacheKey];
        
        // 如果图片未加载，异步加载图片后重新绘制
        if (!directionImage) {
            const args = Array.prototype.slice.call(arguments);
            const image = new Image();
            image.onload = () => {
                imageCache[imageCacheKey] = image;
                object.draw.apply(null, args as [CanvasRenderingContext2D, DataSet | DataItem[], DrawOptions]);
            }
            image.src = imageCacheKey;
            return;
        }
        
        // 获取数据
        const data = dataSet instanceof DataSet ? dataSet.get() : dataSet;

        context.save();

        // 设置上下文属性
        for (const key in options) {
            (context as any)[key] = options[key];
        }

        let points: number[][] = [];
        let preCoordinate: number[] | null = null;
        
        // 遍历数据绘制箭头
        for (let i = 0, len = data.length; i < len; i++) {
            const item = data[i];

            context.save();

            // 设置填充样式
            if (item.fillStyle || item._fillStyle) {
                context.fillStyle = item.fillStyle || item._fillStyle;
            }

            // 设置描边样式
            if (item.strokeStyle || item._strokeStyle) {
                context.strokeStyle = item.strokeStyle || item._strokeStyle;
            }

            // 确保geometry存在
            if (!item.geometry) {
                context.restore();
                continue;
            }
            
            const type = item.geometry.type;

            context.beginPath();
            // 处理LineString类型数据
            if (type === 'LineString') {
                const coordinates = item.geometry._coordinates || item.geometry.coordinates;
                const interval = options.arrow.interval !== undefined ? options.arrow.interval : 1;
                
                // 遍历坐标点绘制箭头
                for (let j = 0; j < coordinates.length; j += interval) {
                    if (coordinates[j] && coordinates[j + 1]) {
                        const coordinate = coordinates[j];

                        // 跳过距离过近的点
                        if (preCoordinate && getDistance(coordinate, preCoordinate) < 30) {
                            continue;
                        }

                        context.save();
                        // 计算角度并旋转
                        const angle = getAngle(coordinates[j], coordinates[j + 1]);
                        context.translate(coordinate[0], coordinate[1]);
                        context.rotate((angle) * Math.PI / 180);
                        // 绘制箭头图片
                        context.drawImage(directionImage, -directionImage.width / 4, -directionImage.height / 4, directionImage.width / 2, directionImage.height / 2);
                        context.restore();

                        points.push(coordinate);
                        preCoordinate = coordinate;
                    }
                }
            }

            context.restore();

        };

        context.restore();

    }
}

/**
 * 计算两点之间的距离
 * @param coordinateA 第一个坐标点
 * @param coordinateB 第二个坐标点
 * @returns 两点之间的距离
 */
function getDistance(coordinateA: number[], coordinateB: number[]): number {
    return Math.sqrt(Math.pow(coordinateA[0] - coordinateB[0], 2) + Math.pow(coordinateA[1] - coordinateB[1], 2));
}

export default object;