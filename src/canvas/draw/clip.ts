/**
 * 绘制裁剪区域
 * @author Mofei Zhu<mapv@zhuwenlong.com>
 */

import pathSimple from "../path/simple";
import drawSimple from "./simple";
import clear from "../clear";
import DataSet from "../../data/DataSet";

// 定义数据项接口
interface DataItem {
    [key: string]: any; // 支持动态属性
}

// 定义绘制选项接口
interface DrawOptions {
    fillStyle?: string;
    multiPolygonDraw?: () => void;
    [key: string]: any; // 支持动态属性
}

export default {
    draw: function (context: CanvasRenderingContext2D, dataSet: DataSet | DataItem[], options: DrawOptions) {
        // 获取数据
        const data = dataSet instanceof DataSet ? dataSet.get() : dataSet;
        
        // 保存上下文状态
        context.save();

        // 设置填充样式，默认为半透明黑色
        context.fillStyle = options.fillStyle || 'rgba(0, 0, 0, 0.5)';
        // 绘制背景矩形
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        // 定义多边形绘制函数
        options.multiPolygonDraw = function() {
            context.save();
            context.clip();
            clear(context);
            context.restore();
        };

        // 遍历数据，为每个数据项绘制裁剪区域
        for (let i = 0, len = data.length; i < len; i++) {
            context.beginPath();
            // 绘制数据项路径
            pathSimple.drawDataSet(context, [data[i]], options);
            context.save();
            // 设置裁剪区域
            context.clip();
            // 清除裁剪区域内的内容
            clear(context);
            context.restore();
        }

        // 恢复上下文状态
        context.restore();
    }
};