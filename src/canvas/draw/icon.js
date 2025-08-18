/**
 * @author wanghyper
 * This file is to draw icon
 */

import DataSet from '../../data/DataSet';

const imageMap = {};
let stacks = {};
export default {
    draw: function (context, dataSet, options) {
        var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;
        for (var i = 0, len = data.length; i < len; i++) {
            const item = data[i];
            if (item.geometry) {
                // 如果是聚类点且配置了图标选项
                if (item.properties && item.properties.cluster) {
                    this.drawClusterIcon(item, options, context);
                } else {
                    var icon = item.icon || options.icon;
                    if (typeof icon === 'string') {
                        let url = window.encodeURIComponent(icon);
                        let img = imageMap[url];
                        if (img) {
                            drawItem(img, options, context, item);
                        } else {
                            if (!stacks[url]) {
                                stacks[url] = [];
                                getImage(
                                    url,
                                    function (img, src) {
                                        stacks[src] && stacks[src].forEach(fun => fun(img));
                                        stacks[src] = null;
                                        imageMap[src] = img;
                                    },
                                    function (src) {
                                        stacks[src] && stacks[src].forEach(fun => fun('error'));
                                        stacks[src] = null;
                                        imageMap[src] = 'error';
                                    }
                                );
                            }
                            stacks[url].push(function (img) {
                                drawItem(img, options, context, item);
                            });
                        }
                    } else {
                        drawItem(icon, options, context, item);
                    }
                }
            }
        }
    },

    /**
     * 绘制聚类图标
     * @param {*} item 数据项
     * @param {*} options 配置项
     * @param {*} context 画布上下文
     */
    drawClusterIcon: function(item, options, context) {
        var coordinates = item.geometry._coordinates || item.geometry.coordinates;
        var x = coordinates[0];
        var y = coordinates[1];

        // 获取图标配置
        var iconOptions = Object.assign({}, options.iconOptions || {}, item.iconOptions || {});
        
        // 如果配置了显示图标且图标url存在
        if (iconOptions.show !== false && (iconOptions.url || item.icon)) {
            var iconUrl = iconOptions.url;
            // 如果url是函数，则根据聚合点数量调用
            if (typeof iconOptions.url === 'function') {
                var count = item.properties ? (item.properties.point_count || 0) : 0;
                iconUrl = iconOptions.url(count);
            }

            if (iconUrl) {
                let url = window.encodeURIComponent(iconUrl);
                let img = imageMap[url];
                
                if (img) {
                    if (img === 'error') {
                        // 图片加载失败，绘制默认点
                        this.drawDefaultPoint(context, x, y, item, options);
                    } else {
                        this.drawImageWithText(context, img, x, y, item, options, iconOptions);
                    }
                } else {
                    // 异步加载图片
                    if (!stacks[url]) {
                        stacks[url] = [];
                        getImage(
                            url,
                            function (img, src) {
                                stacks[src] && stacks[src].forEach(fun => fun(img));
                                stacks[src] = null;
                                imageMap[src] = img;
                            },
                            function (src) {
                                stacks[src] && stacks[src].forEach(fun => fun('error'));
                                stacks[src] = null;
                                imageMap[src] = 'error';
                            }
                        );
                    }
                    stacks[url].push((img) => {
                        if (img === 'error') {
                            this.drawDefaultPoint(context, x, y, item, options);
                        } else {
                            this.drawImageWithText(context, img, x, y, item, options, iconOptions);
                        }
                    });
                }
                return;
            }
        }
        
        // 默认绘制圆形聚类点
        this.drawDefaultClusterPoint(context, x, y, item, options);
    },

    /**
     * 绘制默认点
     */
    drawDefaultPoint: function(context, x, y, item, options) {
        context.beginPath();
        context.arc(x, y, options.size || 5, 0, Math.PI * 2);
        context.fillStyle = options.fillStyle || 'rgba(255, 0, 0, 0.8)';
        context.fill();
    },

    /**
     * 绘制带文字的图片
     */
    drawImageWithText: function(context, img, x, y, item, options, iconOptions) {
        context.save();
        
        // 设置图标大小
        var iconWidth = item.size || iconOptions.width || 40;
        var iconHeight = item.size || iconOptions.height || 40;
        
        // 根据聚合点数量动态调整图标大小
        var pointCount = item.properties ? (item.properties.point_count || 0) : 0;
        if (pointCount > 100) {
            iconWidth = 50;
            iconHeight = 50;
        } else if (pointCount > 50) {
            iconWidth = 45;
            iconHeight = 45;
        }

        var iconOffset = iconOptions.offset || { x: 0, y: 0 };
        // 修改坐标计算方式，使图标以中心点对齐
        x = x - ~~(iconWidth / 2) + iconOffset.x;
        y = y - ~~(iconHeight / 2) + iconOffset.y;

        // 添加阴影效果
        if (iconOptions.shadowBlur) {
            context.shadowBlur = iconOptions.shadowBlur;
        }
        if (iconOptions.shadowColor) {
            context.shadowColor = iconOptions.shadowColor;
        }

        // 绘制图片
        context.drawImage(img, x, y, iconWidth, iconHeight);

        // 绘制文字
        if (iconOptions.show !== false) {
            // 文字样式设置
            context.fillStyle = options.fillStyle || 'white';
            context.textBaseline = 'middle';
            context.textAlign = 'center';

            // 动态字体大小
            const fontSize = iconOptions.fontSize || Math.floor(iconWidth / 6);
            context.font = `${fontSize}px Arial`;

            // 绘制文字（完全居中）
            const text = pointCount.toString();
            if (text) {
                const textX = x + iconWidth / 2;
                // 获取字体度量信息以实现精确垂直居中
                const metrics = context.measureText(text);
                const fontHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
                const textY = y + iconHeight / 2 + (metrics.actualBoundingBoxAscent - fontHeight / 2);
                context.fillText(text, textX, textY);
            }
        }
        
        context.restore();
    },

    /**
     * 绘制默认的聚类圆点
     */
    drawDefaultClusterPoint: function(context, x, y, item, options) {
        context.save();
        
        var size = item.size || options.size || 10;
        var pointCount = item.properties ? (item.properties.point_count || 0) : 0;
        
        // 根据点数量调整大小和颜色
        if (pointCount > 100) {
            size = 20;
        } else if (pointCount > 50) {
            size = 18;
        } else if (pointCount > 10) {
            size = 16;
        }
        
        // 绘制圆形
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2);
        
        // 根据数量设置颜色
        if (pointCount > 100) {
            context.fillStyle = 'rgba(255, 0, 0, 0.8)';
        } else if (pointCount > 50) {
            context.fillStyle = 'rgba(255, 165, 0, 0.8)';
        } else if (pointCount > 10) {
            context.fillStyle = 'rgba(255, 255, 0, 0.8)';
        } else {
            context.fillStyle = 'rgba(0, 128, 0, 0.8)';
        }
        
        context.fill();
        
        // 绘制边框
        context.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        context.lineWidth = 1;
        context.stroke();
        
        // 绘制数字
        if (options.label && options.label.show !== false) {
            context.fillStyle = options.label.fillStyle || 'white';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.font = (options.label.font || 'bold 12px Arial');
            
            var text = pointCount.toString();
            context.fillText(text, x, y);
        }
        
        context.restore();
    }
};

function drawItem(img, options, context, item) {
    context.save();
    var coordinates = item.geometry._coordinates || item.geometry.coordinates;
    var x = coordinates[0];
    var y = coordinates[1];
    var offset = options.offset || {x: 0, y: 0};
    var width = item.width || options._width || options.width;
    var height = item.height || options._height || options.height;
    x = x - ~~width / 2 + offset.x;
    y = y - ~~height / 2 + offset.y;
    if (typeof img === 'string') {
        context.beginPath();
        context.arc(x, y, options.size || 5, 0, Math.PI * 2);
        context.fillStyle = options.fillStyle || 'red';
        context.fill();
        return;
    }
    var deg = item.deg || options.deg;
    if (deg) {
        context.translate(x, y);
        context.rotate((deg * Math.PI) / 180);
        context.translate(-x, -y);
    }

    if (options.sx && options.sy && options.swidth && options.sheight && options.width && options.height) {
        context.drawImage(img, options.sx, options.sy, options.swidth, options.sheight, x, y, width, height);
    } else if (width && height) {
        context.drawImage(img, x, y, width, height);
    } else {
        context.drawImage(img, x, y);
    }
    context.restore();
}

function getImage(url, callback, fallback) {
    let img = new Image();
    img.onload = function () {
        callback && callback(img, url);
    };
    img.onerror = function () {
        fallback && fallback(url);
    };
    img.src = window.decodeURIComponent(url);
}