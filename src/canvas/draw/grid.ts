/**
 * 绘制网格图
 * @author kyle / http://nikai.us/
 */

import Intensity from '../../utils/data-range/Intensity';
import DataSet, { DataItem as DataSetDataItem } from "../../data/DataSet";

// 定义数据项接口，扩展自DataSetDataItem
interface DataItem extends DataSetDataItem {
    count?: number;
}

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
    enableCluster?: boolean;
    offset?: Offset;
    min?: number;
    max?: number;
    gradient?: Record<string, string>;
    strokeStyle?: string;
    lineWidth?: number;
    label?: LabelOptions;
    [key: string]: any; // 支持动态属性
}

export default {
    draw: function (context: CanvasRenderingContext2D, dataSet: DataSet | DataItem[], options: DrawOptions) {
        // 保存上下文状态
        context.save();

        // 获取数据
        const data = dataSet instanceof DataSet ? dataSet.get() : dataSet;

        // 网格数据对象
        const grids: Record<string, number> = {};

        // 网格大小
        const size = options._size || options.size || 50;

        // 是否启用聚类（后端传入数据为网格数据时，传入enableCluster为false，前端不进行网格化操作，直接画方格）
        const enableCluster = 'enableCluster' in options ? options.enableCluster : true;

        // 偏移量
        const offset = options.offset || {
            x: 0,
            y: 0
        };

        // 创建强度对象，用于颜色渐变
        const intensity = new Intensity({
            min: options.min || 0,
            max: options.max || 100,
            gradient: options.gradient
        });

        if (!enableCluster) {
            // 直接绘制网格数据模式
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                if (!item.geometry) continue;
                const coordinates = item.geometry._coordinates || item.geometry.coordinates;
                const gridKey = coordinates.join(',');
                grids[gridKey] = item.count || 1;
            }
            
            // 绘制每个网格
            for (const gridKey in grids) {
                const [x, y] = gridKey.split(',').map(Number);

                context.beginPath();
                context.rect(x - size / 2, y - size / 2, size, size);
                context.fillStyle = intensity.getColor(grids[gridKey]);
                context.fill();
                
                // 如果设置了描边样式和线宽，则绘制边框
                if (options.strokeStyle && options.lineWidth) {
                    context.stroke();
                }
            }
        } else {
            // 聚类模式，将数据点聚合到网格中
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                if (!item.geometry) continue;
                const coordinates = item.geometry._coordinates || item.geometry.coordinates;
                const gridKey = Math.floor((coordinates[0] - offset.x) / size) + ',' + Math.floor((coordinates[1] - offset.y) / size);
                if (!grids[gridKey]) {
                    grids[gridKey] = 0;
                }

                grids[gridKey] += ~~(item.count || 1);
            }

            // 绘制每个网格
            for (const gridKey in grids) {
                const [x, y] = gridKey.split(',').map(Number);

                context.beginPath();
                context.rect(x * size + 0.5 + offset.x, y * size + 0.5 + offset.y, size, size);
                context.fillStyle = intensity.getColor(grids[gridKey]);
                context.fill();
                
                // 如果设置了描边样式和线宽，则绘制边框
                if (options.strokeStyle && options.lineWidth) {
                    context.stroke();
                }
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
            for (const gridKey in grids) {
                const [x, y] = gridKey.split(',').map(Number);
                const text = grids[gridKey].toString();
                const textWidth = context.measureText(text).width;
                
                if (!enableCluster) {
                    // 直接绘制模式下的标签位置
                    context.fillText(text, x - textWidth / 2, y + 5);
                } else {
                    // 聚类模式下的标签位置
                    context.fillText(text, x * size + 0.5 + offset.x + size / 2 - textWidth / 2, y * size + 0.5 + offset.y + size / 2 + 5);
                }
            }
        }

        // 恢复上下文状态
        context.restore();
    }
};