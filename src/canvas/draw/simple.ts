/**
 * 简单绘制模块
 * @author kyle / http://nikai.us/
 */

import pathSimple from "../path/simple";
import DataSet from "../../data/DataSet";

// 直接使用DataSet中的DataItem类型
import { DataItem } from '../../data/DataSet';

// 定义绘制选项接口
interface DrawOptions {
    bigData?: string;
    fillStyle?: string;
    strokeStyle?: string;
    lineWidth?: number;
    lineDash?: number[];
    filter?: (item: DataItem) => boolean;
    multiPolygonDraw?: () => void;
    transferCoordinate?: (coordinate: number[]) => number[];
    [key: string]: any; // 支持动态属性
}

export default {
    draw: function (context: CanvasRenderingContext2D, dataSet: DataSet | DataItem[], options: DrawOptions) {
        // 获取数据
        const data = dataSet instanceof DataSet ? dataSet.get() : dataSet;

        // 保存上下文状态
        context.save();

        // 设置上下文属性
        for (const key in options) {
            (context as any)[key] = options[key];
        }

        // 大数据模式
        if (options.bigData) {
            context.save();
            context.beginPath();

            // 绘制所有数据项
            for (let i = 0, len = data.length; i < len; i++) {
                const item = data[i];
                pathSimple.draw(context, item, options);
            }

            const type = options.bigData;

            // 根据几何类型进行填充或描边
            if (type == 'Point' || type == 'Polygon' || type == 'MultiPolygon') {
                context.fill();
                
                // 设置虚线样式
                if ((context as any).lineDash) {
                    context.setLineDash((context as any).lineDash);
                }
                
                // 应用数据项的虚线样式
                const lastItem = data[data.length - 1];
                if (lastItem.lineDash) {
                    context.setLineDash(lastItem.lineDash);
                }

                // 描边
                if ((lastItem.strokeStyle || options.strokeStyle) && options.lineWidth) {
                    context.stroke();
                }

            } else if (type == 'LineString' || type == 'MultiLineString') {
                // 线类型直接描边
                context.stroke();
            }

            context.restore();
        } else {
            // 普通模式，逐个绘制数据项
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

                // 设置虚线样式
                if ((context as any).lineDash) {
                    context.setLineDash((context as any).lineDash);
                }
                
                if (item.lineDash) {
                    context.setLineDash(item.lineDash);
                }

                // 确保geometry存在
                if (!item.geometry) continue;
                const type = item.geometry.type;

                context.beginPath();

                // 定义多边形绘制函数
                options.multiPolygonDraw = function() {
                    context.fill();
                    if ((item.strokeStyle || options.strokeStyle) && options.lineWidth) {
                        context.stroke();
                    }
                };
                
                // 绘制数据项
                pathSimple.draw(context, item, options);

                // 根据几何类型进行填充或描边
                if (type == 'Point' || type == 'Polygon' || type == 'MultiPolygon') {
                    context.fill();
                    if ((item.strokeStyle || options.strokeStyle) && options.lineWidth) {
                        context.stroke();
                    }
                } else if (type == 'LineString' || type == 'MultiLineString') {
                    // 线类型设置线宽后描边
                    if (item.lineWidth || item._lineWidth) {
                        context.lineWidth = item.lineWidth || item._lineWidth;
                    }
                    context.stroke();
                }

                context.restore();
            }
        }

        context.restore();
    },
    
    /**
     * 增强版绘制函数，支持更多自定义选项
     * @param context Canvas上下文
     * @param dataSet 数据集
     * @param options 绘制选项
     */
    drawEnhanced: function (context: CanvasRenderingContext2D, dataSet: DataSet | DataItem[], options: DrawOptions) {
        // 获取数据
        let data = dataSet instanceof DataSet ? dataSet.get() : dataSet;
        
        // 保存上下文状态
        context.save();
        
        // 应用全局上下文设置
        for (const key in options) {
            // 跳过一些特殊属性，避免覆盖
            if (!['data', 'filter', 'transferCoordinate'].includes(key)) {
                (context as any)[key] = options[key];
            }
        }
        
        // 如果有数据过滤器，则应用
        if (options.filter && typeof options.filter === 'function') {
            data = data.filter(options.filter as (value: DataItem, index: number, array: DataItem[]) => unknown);
        }
        
        // 大数据模式处理
        if (options.bigData) {
            context.save();
            context.beginPath();
            
            // 绘制所有数据项
            for (let i = 0, len = data.length; i < len; i++) {
                const item = data[i];
                pathSimple.draw(context, item, options);
            }
            
            const type = options.bigData;
            
            // 根据几何类型进行填充或描边
            if (type == 'Point' || type == 'Polygon' || type == 'MultiPolygon') {
                context.fill();
                
                // 设置虚线样式
                if ((context as any).lineDash) {
                    context.setLineDash((context as any).lineDash);
                }
                
                // 应用最后一个数据项的虚线样式
                const lastItem = data[data.length - 1];
                if (lastItem.lineDash) {
                    context.setLineDash(lastItem.lineDash);
                }
                
                // 描边
                if ((lastItem.strokeStyle || options.strokeStyle) && options.lineWidth) {
                    context.stroke();
                }
            } else if (type == 'LineString' || type == 'MultiLineString') {
                context.stroke();
            }
            
            context.restore();
        } else {
            // 普通模式，逐个绘制数据项
            for (let i = 0, len = data.length; i < len; i++) {
                const item = data[i];
                
                context.save();
                
                // 应用单个元素的样式设置
                if (item.fillStyle || item._fillStyle) {
                    context.fillStyle = item.fillStyle || item._fillStyle;
                }
                
                if (item.strokeStyle || item._strokeStyle) {
                    context.strokeStyle = item.strokeStyle || item._strokeStyle;
                }
                
                if (item.lineWidth || item._lineWidth) {
                    context.lineWidth = item.lineWidth || item._lineWidth;
                }
                
                // 设置虚线样式
                if ((context as any).lineDash) {
                    context.setLineDash((context as any).lineDash);
                }
                
                if (item.lineDash) {
                    context.setLineDash(item.lineDash);
                }
                
                // 添加阴影效果支持
                if (item.shadowBlur || options.shadowBlur) {
                    context.shadowBlur = item.shadowBlur || options.shadowBlur || 0;
                }
                
                if (item.shadowColor || options.shadowColor) {
                    context.shadowColor = item.shadowColor || options.shadowColor || 'rgba(0, 0, 0, 0)';
                }
                
                if (item.shadowOffsetX || options.shadowOffsetX) {
                    context.shadowOffsetX = item.shadowOffsetX || options.shadowOffsetX || 0;
                }
                
                if (item.shadowOffsetY || options.shadowOffsetY) {
                    context.shadowOffsetY = item.shadowOffsetY || options.shadowOffsetY || 0;
                }
                
                // 确保geometry存在
                if (!item.geometry) continue;
                const type = item.geometry.type;
                context.beginPath();
                
                // 定义多边形绘制函数
                options.multiPolygonDraw = function() {
                    context.fill();
                    if ((item.strokeStyle || options.strokeStyle) && options.lineWidth) {
                        context.stroke();
                    }
                };
                
                // 绘制元素
                pathSimple.draw(context, item, options);
                
                // 根据几何类型进行填充或描边
                if (type == 'Point' || type == 'Polygon' || type == 'MultiPolygon') {
                    context.fill();
                    
                    if ((item.strokeStyle || options.strokeStyle) && options.lineWidth) {
                        context.stroke();
                    }
                } else if (type == 'LineString' || type == 'MultiLineString') {
                    context.stroke();
                }
                
                context.restore();
            }
        }
        
        context.restore();
    }
};