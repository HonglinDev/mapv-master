/**
 * @author kyle / http://nikai.us/
 */

import pathSimple from "../path/simple";
import DataSet from "../../data/DataSet";

export default {
    draw: function (context, dataSet, options) {
        
        var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;

        // console.log('xxxx',options)
        context.save();

        for (var key in options) {
            context[key] = options[key];
        }


        // console.log(data);
        if (options.bigData) {
            context.save();
            context.beginPath();

            for (var i = 0, len = data.length; i < len; i++) {

                var item = data[i];

                pathSimple.draw(context, item, options);

            };

            var type = options.bigData;

            if (type == 'Point' || type == 'Polygon' || type == 'MultiPolygon') {

                context.fill();
                
                if (context.lineDash) {
                    context.setLineDash(context.lineDash);
                }
                
                if (item.lineDash) {
                    context.setLineDash(item.lineDash);
                }

                if ((item.strokeStyle || options.strokeStyle) && options.lineWidth) {
                    context.stroke();
                }

            } else if (type == 'LineString' || type == 'MultiLineString') {
                context.stroke();
            }

            context.restore();
        } else {

            for (var i = 0, len = data.length; i < len; i++) {

                var item = data[i];

                context.save();

                if (item.fillStyle || item._fillStyle) {
                    context.fillStyle = item.fillStyle || item._fillStyle;
                }

                if (item.strokeStyle || item._strokeStyle) {
                    context.strokeStyle = item.strokeStyle || item._strokeStyle;
                }

                if (context.lineDash) {
                    context.setLineDash(context.lineDash);
                }
                
                if (item.lineDash) {
                    context.setLineDash(item.lineDash);
                }

                var type = item.geometry.type;

                context.beginPath();

                options.multiPolygonDraw = function() {
                    context.fill();

                    if ((item.strokeStyle || options.strokeStyle) && options.lineWidth) {
                        context.stroke();
                    }
                }
                pathSimple.draw(context, item, options);

                if (type == 'Point' || type == 'Polygon' || type == 'MultiPolygon') {

                    context.fill();

                    if ((item.strokeStyle || options.strokeStyle) && options.lineWidth) {
                        context.stroke();
                    }

                } else if (type == 'LineString' || type == 'MultiLineString') {
                    if (item.lineWidth || item._lineWidth) {
                        context.lineWidth = item.lineWidth || item._lineWidth;
                    }
                    context.stroke();
                }

                context.restore();

            };
        }

        context.restore();

    },
    
    /**
     * 增强版绘制函数，支持更多自定义选项
     */
    drawEnhanced: function (context, dataSet, options) {
        var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;
        
        context.save();
        
        // 应用全局上下文设置
        for (var key in options) {
            // 跳过一些特殊属性，避免覆盖
            if (!['data', 'filter', 'transferCoordinate'].includes(key)) {
                context[key] = options[key];
            }
        }
        
        // 如果有数据过滤器，则应用
        if (options.filter && typeof options.filter === 'function') {
            data = data.filter(options.filter);
        }
        
        // 大数据模式处理
        if (options.bigData) {
            context.save();
            context.beginPath();
            
            for (var i = 0, len = data.length; i < len; i++) {
                var item = data[i];
                pathSimple.draw(context, item, options);
            }
            
            var type = options.bigData;
            if (type == 'Point' || type == 'Polygon' || type == 'MultiPolygon') {
                context.fill();
                
                if (context.lineDash) {
                    context.setLineDash(context.lineDash);
                }
                
                if (item.lineDash) {
                    context.setLineDash(item.lineDash);
                }
                
                if ((item.strokeStyle || options.strokeStyle) && options.lineWidth) {
                    context.stroke();
                }
            } else if (type == 'LineString' || type == 'MultiLineString') {
                context.stroke();
            }
            
            context.restore();
        } else {
            // 逐个绘制数据项
            for (var i = 0, len = data.length; i < len; i++) {
                var item = data[i];
                
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
                
                if (context.lineDash) {
                    context.setLineDash(context.lineDash);
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
                
                var type = item.geometry.type;
                context.beginPath();
                
                options.multiPolygonDraw = function() {
                    context.fill();
                    if ((item.strokeStyle || options.strokeStyle) && options.lineWidth) {
                        context.stroke();
                    }
                }
                
                // 绘制元素
                pathSimple.draw(context, item, options);
                
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
}