/**
 * 简单路径绘制模块
 * @author kyle / http://nikai.us/
 */

import DataSet from "../../data/DataSet";
import {draw as drawHoneycomb} from "../shape/honeycomb";

// 导入DataSet中的DataItem类型
import { DataItem as DataSetDataItem } from "../../data/DataSet";

// 定义数据项接口，扩展自DataSetDataItem
interface DataItem extends DataSetDataItem {
    symbol?: string;
    size?: number;
    _size?: number;
    image?: ImageOptions;
}

// 定义图片选项接口
interface ImageOptions {
    url?: string;
    width?: number;
    height?: number;
    [key: string]: any;
}

// 定义绘制选项接口
interface DrawOptions {
    symbol?: string;
    size?: number;
    _size?: number;
    bigData?: string;
    multiPolygonDraw?: () => boolean | void;
    image?: ImageOptions;
    gradient?: Record<string, string>;
    [key: string]: any; // 支持动态属性
}

export default {
    /**
     * 绘制数据集
     * @param context Canvas上下文
     * @param dataSet 数据集
     * @param options 绘制选项
     */
    drawDataSet: function (context: CanvasRenderingContext2D, dataSet: DataSet | DataItem[], options: DrawOptions) {
        // 获取数据
        const data = dataSet instanceof DataSet ? dataSet.get() : dataSet;

        // 遍历绘制每个数据项
        for (let i = 0, len = data.length; i < len; i++) {
            const item = data[i];
            this.draw(context, item, options);
        }
    },
    
    /**
     * 绘制单个数据项
     * @param context Canvas上下文
     * @param data 数据项
     * @param options 绘制选项
     * @returns 布尔值或undefined
     */
    draw: function (context: CanvasRenderingContext2D, data: DataItem, options: DrawOptions): boolean | void {
        // 确保geometry存在
        if (!data.geometry) return;
        
        const type = data.geometry.type;
        const coordinates = data.geometry._coordinates || data.geometry.coordinates;
        const symbol = data.symbol || options.symbol || 'circle';
        
        // 根据几何类型绘制
        switch (type) {
            case 'Point':
                const size = data._size || data.size || options._size || options.size || 5;
                
                // 根据符号类型绘制
                if (symbol === 'circle') {
                    if (options.bigData === 'Point') {
                        context.moveTo(coordinates[0], coordinates[1]);
                    }
                    context.arc(coordinates[0], coordinates[1], size, 0, Math.PI * 2);
                } else if (symbol === 'rect') {
                    context.rect(coordinates[0] - size / 2, coordinates[1] - size / 2, size, size);
                } else if (symbol === 'honeycomb') {
                    drawHoneycomb(context, coordinates[0], coordinates[1], size);
                } else if (symbol === 'image') {
                    // 支持图片标记
                    this.drawImageMarker(context, data, options);
                }
                break;
            case 'LineString':
                this.drawLineString(context, coordinates as number[][]);
                break;
            case 'MultiLineString':
                for (let i = 0; i < (coordinates as number[][][]).length; i++) {
                    const lineString = (coordinates as number[][][])[i];
                    this.drawLineString(context, lineString);
                }
                break;
            case 'Polygon':
                this.drawPolygon(context, coordinates as number[][][]);
                break;
            case 'MultiPolygon':
                for (let i = 0; i < (coordinates as number[][][][]).length; i++) {
                    const polygon = (coordinates as number[][][][])[i];
                    this.drawPolygon(context, polygon);
                    if (options.multiPolygonDraw) {
                        const flag = options.multiPolygonDraw();
                        if (flag) {
                            return flag;
                        }
                    }
                }
                break;
            default:
                console.error('类型 ' + type + ' 目前不支持！');
                break;
        }
    },

    /**
     * 绘制图片标记
     * @param context Canvas上下文
     * @param data 数据项
     * @param options 绘制选项
     */
    drawImageMarker: function(context: CanvasRenderingContext2D, data: DataItem, options: DrawOptions) {
        // 确保geometry存在
        if (!data.geometry) return;
        
        const coordinates = data.geometry._coordinates || data.geometry.coordinates;
        const x = coordinates[0];
        const y = coordinates[1];
        
        // 获取图片相关配置
        const imageOptions = Object.assign({}, options.image || {}, data.image || {});
        const imageUrl = imageOptions.url;
        
        if (imageUrl) {
            const img = new Image();
            img.onload = function() {
                const size = data._size || data.size || options._size || options.size || 20;
                const width = imageOptions.width || size;
                const height = imageOptions.height || size;
                
                // 居中绘制
                context.drawImage(img, x - width/2, y - height/2, width, height);
            };
            img.src = imageUrl;
        } else {
            // 如果没有图片，则绘制默认圆形
            const size = data._size || data.size || options._size || options.size || 5;
            context.arc(x, y, size, 0, Math.PI * 2);
        }
    },

    /**
     * 绘制线串
     * @param context Canvas上下文
     * @param coordinates 坐标数组
     */
    drawLineString: function(context: CanvasRenderingContext2D, coordinates: number[][]) {
        for (let j = 0; j < coordinates.length; j++) {
            const x = coordinates[j][0];
            const y = coordinates[j][1];
            if (j == 0) {
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y);
            }
        }
    },

    /**
     * 绘制多边形
     * @param context Canvas上下文
     * @param coordinates 坐标数组
     */
    drawPolygon: function(context: CanvasRenderingContext2D, coordinates: number[][][]) {
        context.beginPath();

        for (let i = 0; i < coordinates.length; i++) {
            const coordinate = coordinates[i];

            context.moveTo(coordinate[0][0], coordinate[0][1]);
            for (let j = 1; j < coordinate.length; j++) {
                context.lineTo(coordinate[j][0], coordinate[j][1]);
            }
            context.lineTo(coordinate[0][0], coordinate[0][1]);
            context.closePath();
        }
    },

    /**
     * 增强版多边形绘制，支持渐变填充
     * @param context Canvas上下文
     * @param coordinates 坐标数组
     * @param options 绘制选项
     */
    drawPolygonEnhanced: function(context: CanvasRenderingContext2D, coordinates: number[][][], options: DrawOptions) {
        context.beginPath();

        for (let i = 0; i < coordinates.length; i++) {
            const coordinate = coordinates[i];

            context.moveTo(coordinate[0][0], coordinate[0][1]);
            for (let j = 1; j < coordinate.length; j++) {
                context.lineTo(coordinate[j][0], coordinate[j][1]);
            }
            context.lineTo(coordinate[0][0], coordinate[0][1]);
            context.closePath();
            
            // 如果配置了渐变填充
            if (options.gradient) {
                const gradient = context.createLinearGradient(
                    coordinate[0][0], coordinate[0][1],
                    coordinate[2] ? coordinate[2][0] : coordinate[0][0], 
                    coordinate[2] ? coordinate[2][1] : coordinate[0][1]
                );
                
                // 添加渐变色点
                for (const key in options.gradient) {
                    gradient.addColorStop(parseFloat(key), options.gradient[key]);
                }
                
                context.fillStyle = gradient;
            }
        }
    }
};