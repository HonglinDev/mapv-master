/**
 * @author kyle / http://nikai.us/
 */

import DataSet from '../../data/DataSet';

const imageMap = {};
let stacks = {};
export default {
    draw: function (context, dataSet, options) {
        // 保存当前画布状态
        context.save();
        // 获取数据集，如果是DataSet实例则调用get()方法获取，否则直接使用
        const data = dataSet instanceof DataSet ? dataSet.get() : dataSet;
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            // 开始一个新的绘制路径
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
    drawClusterPoint: function (item, options, context) {
        //if判断为新增, 即如果显示聚合点且聚合点的iconOptions.show === true,则显示图像
        if (options.label && options.label.iconOptions && options.show !== false && options.label.iconOptions.show) {
            this.drawSeanIcon(item, options.label, context);
        } else {
            // 获取元素的坐标
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
                // 设置字体样式
                if (labelOptions.font) {
                    context.font = labelOptions.font;
                } else {
                    context.font = 'bold 14px Arial';
                }
                // 设置阴影颜色
                if (labelOptions.shadowColor) {
                    context.shadowColor = labelOptions.shadowColor;
                }
                // 设置阴影模糊程度
                if (labelOptions.shadowBlur) {
                    context.shadowBlur = labelOptions.shadowBlur;
                }
                // 获取标签文本
                let text = item.properties.point_count.toString();
                let textWidth = context.measureText(text).width;
                // 绘制文本
                context.fillText(text, x + 0.5 - textWidth / 2, y + 0.5 + 3);
            }
        }
    },
    /**
     * 绘制图标
     * @param {Object} item - 数据项
     * @param {Object} options - 绘制选项
     * @param {Object} context - 画布上下文
     */
    drawIcon: function drawIcon(item, options, context) {
        var _ref = item.geometry._coordinates || item.geometry.coordinates,
            _ref2 = slicedToArray(_ref, 2),
            x = _ref2[0],
            y = _ref2[1];

        var iconOptions = Object.assign({}, options.iconOptions, item.iconOptions);
        // 定义绘制点标记的方法
        var drawPoint = function drawPoint() {
            context.beginPath();
            context.arc(x, y, options.size || 5, 0, Math.PI * 2);
            context.fillStyle = options.fillStyle || 'red';
            context.fill();
        };
        // 如果没有图标URL，则绘制点标记
        if (!iconOptions.url) {
            drawPoint();
            return;
        }
        var iconWidth = iconOptions.width;
        var iconHeight = iconOptions.height;
        var iconOffset = iconOptions.offset || { x: 0, y: 0 };
        x = x - ~~iconWidth / 2 + iconOffset.x;
        y = y - ~~iconHeight / 2 + iconOffset.y;
        var url = window.encodeURIComponent(iconOptions.url);
        var img = imageMap[url];
        // 根据图像缓存状态进行绘制或加载图像
        if (img) {
            if (img === 'error') {
                drawPoint();
            } else if (iconWidth && iconHeight) {
                context.drawImage(img, x, y, iconWidth, iconHeight);
            } else {
                context.drawImage(img, x, y);
            }
            // 绘制标签
            if (iconOptions.label && iconOptions.label.show !== false) {
                drawLabel(context, x + ~~iconWidth / 2, y + ~~iconHeight / 2, iconWidth, iconHeight, iconOptions.label);
            }
        } else {
            if (!stacks[url]) {
                stacks[url] = [];
                getImage(url, function (img, src) {
                    stacks[src] && stacks[src].forEach(function (fun) {
                        return fun(img);
                    });
                    stacks[src] = null;
                    imageMap[src] = img;
                }, function (src) {
                    stacks[src] && stacks[src].forEach(function (fun) {
                        return fun('error', src);
                    });
                    stacks[src] = null;
                    imageMap[src] = 'error';
                    drawPoint();
                });
            }
            stacks[url].push(function (x, y, iconWidth, iconHeight) {
                return function (img) {
                    if (img === 'error') {
                        drawPoint();
                    } else if (iconWidth && iconHeight) {
                        context.drawImage(img, x, y, iconWidth, iconHeight);
                    } else {
                        context.drawImage(img, x, y);
                    }
                    // 绘制标签
                    if (iconOptions.label && iconOptions.label.show !== false) {
                        drawLabel(context, x + ~~iconWidth / 2, y + ~~iconHeight / 2, iconWidth, iconHeight, iconOptions.label);
                    }
                };
            }(x, y, iconWidth, iconHeight));
        }
    },
    // 确保这段代码在 mapv.js 中已经正确实现
    drawSeanIcon: function drawSeanIcon(item, options, context) {
        var _ref = item.geometry._coordinates || item.geometry.coordinates,
            _ref2 = slicedToArray(_ref, 2),
            x = _ref2[0],
            y = _ref2[1];

        var iconOptions = Object.assign({}, options.iconOptions, item.iconOptions);
        var drawPoint = function drawPoint() {
            context.arc(x, y, options.size || 5, 0, Math.PI * 2);
            context.fillStyle = options.fillStyle || 'red';
            context.fill();
        };

        // 正确处理 url 作为函数的情况
        var urlValue = iconOptions.url;
        console.log('原始URL值:', urlValue);

        if (typeof iconOptions.url === 'function') {
            // 从 item.properties.point_count 获取聚合点数量
            var count = item.properties ? (item.properties.point_count || 0) : 0;
            console.log('调用函数，聚合点数:', count);
            urlValue = iconOptions.url(count);
            console.log('函数返回的URL:', urlValue);
        }

        console.log('实际使用的图标URL:', urlValue, "mapv图标");

        if (!urlValue) {
            console.log('没有图标URL，绘制默认点');
            drawPoint();
            return;
        }

        // 设置图像width和height，确保图标比数字大
        var iconWidth = item.size || 40;  // 增大默认图标尺寸
        var iconHeight = item.size || 40; // 增大默认图标尺寸

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

        // 确保 urlValue 是字符串
        var url = typeof urlValue === 'string' ? window.encodeURIComponent(urlValue) : '';

        if (!url) {
            console.log('URL 编码失败，绘制默认点');
            drawPoint();
            return;
        }

        var img = imageMap[url];

        if (img) {
            if (img === 'error') {
                console.log('图片加载错误，绘制默认点');
                drawPoint();
            } else if (iconWidth && iconHeight) {
                //如果点设置了阴影，这里要给图片也加上阴影，不然图片遮不住点的阴影
                context.shadowBlur = iconOptions.shadowBlur;
                context.shadowColor = iconOptions.shadowColor;
                context.drawImage(img, x, y, iconWidth, iconHeight);
            } else {
                context.shadowBlur = iconOptions.shadowBlur;
                context.shadowColor = iconOptions.shadowColor;
                context.drawImage(img, x, y);
            }

            if (options.iconOptions.show) {
                // 文字样式设置
                context.fillStyle = options.fillStyle || 'white';
                context.textBaseline = 'middle';  // 垂直居中基准
                context.textAlign = 'center';      // 水平居中

                // 动态字体大小（根据聚合点数量调整）
                const pointCount = (item.properties && item.properties.point_count) || 0;
                // 修改为图标大小的一半
                const fontSize = options.iconOptions.fontSize || Math.floor(iconWidth / 6);
                context.font = `${fontSize}px Arial`; // 使用 normal 字体样式

                // 绘制文字（完全居中）
                const text = pointCount.toString();
                if (text) {
                    const textX = x + iconWidth / 2;  // 图标水平中心
                    // const textY = y + iconHeight / 2; // 图标垂直中心
                    // context.fillText(text, textX, textY);
                    // 为了更精确的垂直居中，需要考虑字体度量
                    // 获取字体的度量信息
                    const metrics = context.measureText(text);
                    // 计算文字的实际高度
                    const fontHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
                    // 调整Y坐标以实现真正的垂直居中
                    const textY = y + iconHeight / 2 + (metrics.actualBoundingBoxAscent - fontHeight / 2);

                    context.fillText(text, textX, textY);
                    // context.strokeStyle = 'red';
                    // context.beginPath();
                    // context.moveTo(x + iconWidth / 2, y);
                    // context.lineTo(x + iconWidth / 2, y + iconHeight);
                    // context.moveTo(x, y + iconHeight / 2);
                    // context.lineTo(x + iconWidth, y + iconHeight / 2);
                    // context.stroke();
                }
            }

        } else {
            // 缓存，操作同上
            if (!stacks[url]) {
                stacks[url] = [];
                console.log('开始加载图片:', urlValue);
                getImage(url, function (img, src) {
                    console.log('图片加载成功:', src);
                    stacks[src] && stacks[src].forEach(function (fun) {
                        return fun(img);
                    });
                    stacks[src] = null;
                    imageMap[src] = img;
                }, function (src) {
                    console.log('图片加载失败:', src);
                    stacks[src] && stacks[src].forEach(function (fun) {
                        return fun('error', src);
                    });
                    stacks[src] = null;
                    imageMap[src] = 'error';
                    drawPoint();
                });
            }
            stacks[url].push(function (x, y, iconWidth, iconHeight) {
                return function (img) {
                    if (img === 'error') {
                        console.log('图片加载错误，绘制默认点');
                        drawPoint();
                    } else if (iconWidth && iconHeight) {
                        context.shadowBlur = iconOptions.shadowBlur;
                        context.shadowColor = iconOptions.shadowColor;
                        context.drawImage(img, x, y, iconWidth, iconHeight);
                    } else {
                        context.shadowBlur = iconOptions.shadowBlur;
                        context.shadowColor = iconOptions.shadowColor;
                        context.drawImage(img, x, y);
                    }

                    if (options.iconOptions.show) {
                        // 文字样式设置
                        context.fillStyle = options.fillStyle || 'white';
                        context.textBaseline = 'middle';  // 垂直居中基准
                        context.textAlign = 'center';      // 水平居中

                        // 动态字体大小（根据聚合点数量调整）
                        const pointCount = (item.properties && item.properties.point_count) || 0;
                        // 修改为图标大小的一半
                        const fontSize = options.iconOptions.fontSize || Math.floor(iconWidth / 6);
                        context.font = `${fontSize}px Arial`; // 使用 normal 字体样式

                        // 绘制文字（完全居中）
                        const text = pointCount.toString();
                        if (text) {
                            const textX = x + iconWidth / 2;  // 图标水平中心
                            // const textY = y + iconHeight / 2; // 图标垂直中心
                            // context.fillText(text, textX, textY);
                            // 为了更精确的垂直居中，需要考虑字体度量
                            // 获取字体的度量信息
                            const metrics = context.measureText(text);
                            // 计算文字的实际高度
                            const fontHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
                            // 调整Y坐标以实现真正的垂直居中
                            const textY = y + iconHeight / 2 + (metrics.actualBoundingBoxAscent - fontHeight / 2);

                            context.fillText(text, textX, textY);
                            // context.strokeStyle = 'red';
                            // context.beginPath();
                            // context.moveTo(x + iconWidth / 2, y);
                            // context.lineTo(x + iconWidth / 2, y + iconHeight);
                            // context.moveTo(x, y + iconHeight / 2);
                            // context.lineTo(x + iconWidth, y + iconHeight / 2);
                            // context.stroke();
                        }

                    }

                };
            }(x, y, iconWidth, iconHeight));
        }
    }
};
// 定义绘制标签的方法
function drawLabel(context, x, y, iconWidth, iconHeight, labelOptions) {
    var text = labelOptions.text || '';
    var fontSize = labelOptions.fontSize || '12px';
    var fontColor = labelOptions.fontColor || 'black';
    var font = fontSize + ' sans-serif';
    var padding = labelOptions.padding || 5;
    var backgroundColor = labelOptions.backgroundColor || 'white';
    var borderColor = labelOptions.borderColor || 'black';
    var borderWidth = labelOptions.borderWidth || 1;

    // 设置字体样式
    context.font = font;
    context.fillStyle = fontColor;
    var textWidth = context.measureText(text).width;
    var textHeight = parseInt(fontSize, 10);

    // 计算标签的位置
    var labelWidth = textWidth + 2 * padding;
    var labelHeight = textHeight + 2 * padding;

    // 解析位置属性
    var parsePosition = function parsePosition(value, total, defaultValue) {
        if (typeof value === 'string' && value.endsWith('%')) {
            return parseFloat(value) / 100 * total;
        } else if (typeof value === 'number') {
            return value;
        } else if (value === 'center') {
            return -total / 2;
        } else {
            return defaultValue;
        }
    };

    // 计算标签的偏移量
    var top = parsePosition(labelOptions.top, labelHeight, -labelHeight / 2);
    var left = parsePosition(labelOptions.left, labelWidth, -labelWidth / 2);
    var right = parsePosition(labelOptions.right, labelWidth, labelWidth / 2);
    var bottom = parsePosition(labelOptions.bottom, labelHeight, labelHeight / 2);

    // 计算标签的最终位置
    var labelX = x + left;
    var labelY = y + top;

    // 如果设置了 bottom，调整 labelY
    if (labelOptions.bottom !== undefined) {
        labelY = y - iconHeight / 2 - labelHeight - bottom;
    }

    // 绘制标签背景
    context.fillStyle = backgroundColor;
    context.fillRect(labelX, labelY, labelWidth, labelHeight);

    // 绘制标签边框（根据 labelOptions.border 决定是否绘制）
    if (labelOptions.border !== false) {
        context.strokeStyle = borderColor;
        context.lineWidth = borderWidth;
        context.strokeRect(labelX, labelY, labelWidth, labelHeight);
    }

    // 绘制标签文本
    context.fillStyle = fontColor;
    context.fillText(text, labelX + padding, labelY + padding + textHeight);
}
/**
 * 加载图像资源
 * @param {String} url - 图像URL
 * @param {Function} callback - 成功回调函数
 * @param {Function} fallback - 失败回调函数
 */
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