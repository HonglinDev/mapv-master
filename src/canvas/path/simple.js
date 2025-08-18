/**
 * @author kyle / http://nikai.us/
 */

import DataSet from "../../data/DataSet";
import {draw as drawHoneycomb} from "../shape/honeycomb";

export default {
    drawDataSet: function (context, dataSet, options) {

        var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;

        for (var i = 0, len = data.length; i < len; i++) {
            var item = data[i];
            this.draw(context, item, options);
        }

    },
    draw: function (context, data, options) {
        var type = data.geometry.type;
        var coordinates = data.geometry._coordinates || data.geometry.coordinates;
        var symbol = data.symbol || options.symbol || 'circle';
        switch (type) {
            case 'Point':
                var size = data._size || data.size || options._size || options.size || 5;
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
                this.drawLineString(context, coordinates);
                break;
            case 'MultiLineString':
                for (var i = 0; i < coordinates.length; i++) {
                    var lineString = coordinates[i];
                    this.drawLineString(context, lineString);
                }
                break;
            case 'Polygon':
                this.drawPolygon(context, coordinates);
                break;
            case 'MultiPolygon':
                for (var i = 0; i < coordinates.length; i++) {
                    var polygon = coordinates[i];
                    this.drawPolygon(context, polygon);
                    if (options.multiPolygonDraw) {
                        var flag = options.multiPolygonDraw();
                        if (flag) {
                            return flag;
                        }
                    }
                }
                break;
            default:
                console.error('type' + type + 'is not support now!');
                break;
        }
    },

    /**
     * 绘制图片标记
     */
    drawImageMarker: function(context, data, options) {
        var coordinates = data.geometry._coordinates || data.geometry.coordinates;
        var x = coordinates[0];
        var y = coordinates[1];
        
        // 获取图片相关配置
        var imageOptions = Object.assign({}, options.image || {}, data.image || {});
        var imageUrl = imageOptions.url;
        
        if (imageUrl) {
            var img = new Image();
            img.onload = function() {
                var size = data._size || data.size || options._size || options.size || 20;
                var width = imageOptions.width || size;
                var height = imageOptions.height || size;
                
                // 居中绘制
                context.drawImage(img, x - width/2, y - height/2, width, height);
            };
            img.src = imageUrl;
        } else {
            // 如果没有图片，则绘制默认圆形
            var size = data._size || data.size || options._size || options.size || 5;
            context.arc(x, y, size, 0, Math.PI * 2);
        }
    },

    drawLineString: function(context, coordinates) {
        for (var j = 0; j < coordinates.length; j++) {
            var x = coordinates[j][0];
            var y = coordinates[j][1];
            if (j == 0) {
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y);
            }
        }
    },

    drawPolygon: function(context, coordinates) {
        context.beginPath();

        for (var i = 0; i < coordinates.length; i++) {
            var coordinate = coordinates[i];

            context.moveTo(coordinate[0][0], coordinate[0][1]);
            for (var j = 1; j < coordinate.length; j++) {
                context.lineTo(coordinate[j][0], coordinate[j][1]);
            }
            context.lineTo(coordinate[0][0], coordinate[0][1]);
            context.closePath();
        }

    },

    /**
     * 增强版多边形绘制，支持渐变填充
     */
    drawPolygonEnhanced: function(context, coordinates, options) {
        context.beginPath();

        for (var i = 0; i < coordinates.length; i++) {
            var coordinate = coordinates[i];

            context.moveTo(coordinate[0][0], coordinate[0][1]);
            for (var j = 1; j < coordinate.length; j++) {
                context.lineTo(coordinate[j][0], coordinate[j][1]);
            }
            context.lineTo(coordinate[0][0], coordinate[0][1]);
            context.closePath();
            
            // 如果配置了渐变填充
            if (options.gradient) {
                var gradient = context.createLinearGradient(
                    coordinate[0][0], coordinate[0][1],
                    coordinate[2] ? coordinate[2][0] : coordinate[0][0], 
                    coordinate[2] ? coordinate[2][1] : coordinate[0][1]
                );
                
                // 添加渐变色点
                for (var key in options.gradient) {
                    gradient.addColorStop(parseFloat(key), options.gradient[key]);
                }
                
                context.fillStyle = gradient;
            }
        }
    }
}