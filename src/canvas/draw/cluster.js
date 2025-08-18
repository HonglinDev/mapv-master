/**
 * @author kyle / http://nikai.us/
 */

import DataSet from '../../data/DataSet';

const imageMap = {};
let stacks = {};
export default {
    draw: function (context, dataSet, options) {
        context.save();
        const data = dataSet instanceof DataSet ? dataSet.get() : dataSet;
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            let coordinates = item.geometry._coordinates || item.geometry.coordinates;
            context.beginPath();
            if (item.properties && item.properties.cluster) {
                // 增强聚类点绘制功能
                this.drawClusterPoint(item, options, context);
            } else {
                this.drawIcon(item, options, context);
            }
        }
        context.restore();
    },
    
    /**
     * 绘制聚类点
     * @param {*} item 数据项
     * @param {*} options 配置项
     * @param {*} context 画布上下文
     */
    drawClusterPoint: function(item, options, context) {
        let coordinates = item.geometry._coordinates || item.geometry.coordinates;
        let x = coordinates[0];
        let y = coordinates[1];
        
        // 获取标签配置
        let labelOptions = Object.assign({}, options.label || {});
        
        // 绘制聚类圆形
        context.beginPath();
        context.arc(x, y, item.size, 0, Math.PI * 2);
        context.fillStyle = item.fillStyle || 'rgba(200, 0, 0, 0.8)';
        context.fill();
        
        // 绘制边框
        context.strokeStyle = 'rgba(255, 255, 255, 1)';
        context.lineWidth = 1;
        context.stroke();
        
        // 绘制标签文字
        if (labelOptions.show !== false) {
            context.fillStyle = labelOptions.fillStyle || 'white';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            
            if (labelOptions.font) {
                context.font = labelOptions.font;
            } else {
                context.font = 'bold 14px Arial';
            }

            if (labelOptions.shadowColor) {
                context.shadowColor = labelOptions.shadowColor;
            }

            if (labelOptions.shadowBlur) {
                context.shadowBlur = labelOptions.shadowBlur;
            }

            let text = item.properties.point_count.toString();
            let textWidth = context.measureText(text).width;
            
            // 支持文字垂直居中
            context.fillText(text, x, y);
        }
    },

    drawIcon(item, options, context) {
        let [x, y] = item.geometry._coordinates || item.geometry.coordinates;
        let iconOptions = Object.assign({}, options.iconOptions, item.iconOptions);
        const drawPoint = () => {
            context.beginPath();
            context.arc(x, y, options.size || 5, 0, Math.PI * 2);
            context.fillStyle = options.fillStyle || 'red';
            context.fill();
        };
        
        // 如果配置了图标选项且要求显示图标
        if (iconOptions && iconOptions.show !== false && iconOptions.url) {
            let iconUrl = iconOptions.url;
            // 如果url是函数，则根据聚合点数量调用
            if (typeof iconOptions.url === 'function') {
                var count = item.properties ? (item.properties.point_count || 0) : 0;
                iconUrl = iconOptions.url(count);
            }
            
            let iconWidth = item.size || iconOptions.width || 40;
            let iconHeight = item.size || iconOptions.height || 40;
            
            // 根据聚合点数量动态调整图标大小
            var pointCount = item.properties ? (item.properties.point_count || 0) : 0;
            if (pointCount > 100) {
                iconWidth = 50;
                iconHeight = 50;
            } else if (pointCount > 50) {
                iconWidth = 45;
                iconHeight = 45;
            }
            
            let iconOffset = iconOptions.offset || {x: 0, y: 0};
            // 修改坐标计算方式，使图标以中心点对齐
            x = x - ~~(iconWidth / 2) + iconOffset.x;
            y = y - ~~(iconHeight / 2) + iconOffset.y;
            
            // 确保 urlValue 是字符串
            var url = typeof iconUrl === 'string' ? window.encodeURIComponent(iconUrl) : '';
            
            if (!url) {
                drawPoint();
                return;
            }
            
            let img = imageMap[url];
            if (img) {
                if (img === 'error') {
                    drawPoint();
                } else {
                    // 如果点设置了阴影，这里要给图片也加上阴影，不然图片遮不住点的阴影
                    if (iconOptions.shadowBlur) {
                        context.shadowBlur = iconOptions.shadowBlur;
                    }
                    if (iconOptions.shadowColor) {
                        context.shadowColor = iconOptions.shadowColor;
                    }
                    
                    if (iconWidth && iconHeight) {
                        context.drawImage(img, x, y, iconWidth, iconHeight);
                    } else {
                        context.drawImage(img, x, y);
                    }
                    
                    // 绘制图标上的文字
                    if (iconOptions.show !== false) {
                        // 文字样式设置
                        context.fillStyle = options.fillStyle || 'white';
                        context.textBaseline = 'middle';  // 垂直居中基准
                        context.textAlign = 'center';      // 水平居中

                        // 动态字体大小（根据聚合点数量调整）
                        const fontSize = iconOptions.fontSize || Math.floor(iconWidth / 6);
                        context.font = `${fontSize}px Arial`; // 使用 normal 字体样式

                        // 绘制文字（完全居中）
                        const text = pointCount.toString();
                        if (text) {
                            const textX = x + iconWidth / 2;  // 图标水平中心
                            // 获取字体的度量信息
                            const metrics = context.measureText(text);
                            // 计算文字的实际高度
                            const fontHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
                            // 调整Y坐标以实现真正的垂直居中
                            const textY = y + iconHeight / 2 + (metrics.actualBoundingBoxAscent - fontHeight / 2);

                            context.fillText(text, textX, textY);
                        }
                    }
                }
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
                            stacks[src] && stacks[src].forEach(fun => fun('error', src));
                            stacks[src] = null;
                            imageMap[src] = 'error';
                        }
                    );
                }
                stacks[url].push(
                    ((x, y, iconWidth, iconHeight) =>
                        function (img) {
                            if (img === 'error') {
                                drawPoint();
                            } else {
                                // 如果点设置了阴影，这里要给图片也加上阴影，不然图片遮不住点的阴影
                                if (iconOptions.shadowBlur) {
                                    context.shadowBlur = iconOptions.shadowBlur;
                                }
                                if (iconOptions.shadowColor) {
                                    context.shadowColor = iconOptions.shadowColor;
                                }
                                
                                context.drawImage(img, x, y, iconWidth, iconHeight);
                                
                                // 绘制图标上的文字
                                const pointCount = item.properties?.point_count || 0;
                                if (iconOptions.show !== false && pointCount > 0) {
                                    // 文字样式设置
                                    context.fillStyle = options.fillStyle || 'white';
                                    context.textBaseline = 'middle';
                                    context.textAlign = 'center';

                                    // 动态字体大小
                                    const fontSize = iconOptions.fontSize || Math.floor(iconWidth / 6);
                                    context.font = `${fontSize}px Arial`;

                                    // 绘制文字
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
                            }
                        })(x, y, iconWidth, iconHeight)
                );
            }
        } else {
            // 默认绘制点
            drawPoint();
        }
    }
};

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