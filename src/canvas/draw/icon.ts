/**
 * 绘制图标
 * @author wanghyper
 */

import DataSet, { DataItem as DataSetDataItem } from '../../data/DataSet';

// 图片缓存对象
const imageMap: Record<string, HTMLImageElement | 'error' | null> = {};
// 图片加载队列
let stacks: Record<string, Array<(img: HTMLImageElement | 'error') => void>> = {};

// 定义聚类点属性接口
interface ClusterProperties {
    cluster: boolean;
    point_count: number;
    [key: string]: any;
}

// 定义数据项接口，扩展自DataSetDataItem
type DataItem = DataSetDataItem & {
    properties?: ClusterProperties;
    icon?: string | HTMLImageElement;
    iconOptions?: IconOptions;
    size?: number;
    width?: number;
    height?: number;
    deg?: number;
}

// 定义偏移量接口
interface Offset {
    x: number;
    y: number;
}

// 定义图标选项接口
interface IconOptions {
    show?: boolean;
    url?: string | ((count: number) => string);
    width?: number;
    height?: number;
    offset?: Offset;
    shadowBlur?: number;
    shadowColor?: string;
    fontSize?: number;
    [key: string]: any;
}

// 定义标签选项接口
interface LabelOptions {
    show?: boolean;
    fillStyle?: string;
    font?: string;
    [key: string]: any;
}

// 定义绘制选项接口
interface DrawOptions {
    icon?: string | HTMLImageElement;
    iconOptions?: IconOptions;
    size?: number;
    width?: number;
    height?: number;
    _width?: number;
    _height?: number;
    offset?: Offset;
    fillStyle?: string;
    deg?: number;
    sx?: number;
    sy?: number;
    swidth?: number;
    sheight?: number;
    label?: LabelOptions;
    [key: string]: any;
}

export default {
    draw: function (context: CanvasRenderingContext2D, dataSet: DataSet | DataItem[], options: DrawOptions) {
        const data = dataSet instanceof DataSet ? dataSet.get() : dataSet;
        
        for (let i = 0, len = data.length; i < len; i++) {
            const item = data[i];
            if (item.geometry) {
                // 如果是聚类点且配置了图标选项
                if (item.properties && item.properties.cluster) {
                    this.drawClusterIcon(item, options, context);
                } else {
                    const icon = item.icon || options.icon;
                    
                    if (typeof icon === 'string') {
                        const url = window.encodeURIComponent(icon);
                        const img = imageMap[url];
                        
                        if (img) {
                            drawItem(img, options, context, item);
                        } else {
                            if (!stacks[url]) {
                                stacks[url] = [];
                                getImage(
                                    url,
                                    function (img, src) {
                                        stacks[src] && stacks[src].forEach(fun => fun(img));
                                        stacks[src] = null as any;
                                        imageMap[src] = img;
                                    },
                                    function (src) {
                                        stacks[src] && stacks[src].forEach(fun => fun('error'));
                                        stacks[src] = null as any;
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
     * @param item 数据项
     * @param options 配置项
     * @param context 画布上下文
     */
    drawClusterIcon: function(item: DataItem, options: DrawOptions, context: CanvasRenderingContext2D) {
        // 确保geometry存在
        if (!item.geometry) return;
        
        const coordinates = item.geometry._coordinates || item.geometry.coordinates;
        const x = coordinates[0];
        const y = coordinates[1];

        // 获取图标配置
        const iconOptions = Object.assign({}, options.iconOptions || {}, item.iconOptions || {});
        
        // 如果配置了显示图标且图标url存在
        if (iconOptions.show !== false && (iconOptions.url || item.icon)) {
            let iconUrl: string = '';
            
            // 如果url是函数，则根据聚合点数量调用
            if (typeof iconOptions.url === 'function') {
                const count = item.properties ? (item.properties.point_count || 0) : 0;
                iconUrl = iconOptions.url(count);
            } else if (typeof iconOptions.url === 'string') {
                iconUrl = iconOptions.url;
            }

            if (iconUrl) {
                const url = window.encodeURIComponent(iconUrl);
                const img = imageMap[url];
                
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
                                stacks[src] = null as any;
                                imageMap[src] = img;
                            },
                            function (src) {
                                stacks[src] && stacks[src].forEach(fun => fun('error'));
                                stacks[src] = null as any;
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
     * @param context 画布上下文
     * @param x x坐标
     * @param y y坐标
     * @param item 数据项
     * @param options 配置项
     */
    drawDefaultPoint: function(context: CanvasRenderingContext2D, x: number, y: number, item: DataItem, options: DrawOptions) {
        context.beginPath();
        context.arc(x, y, options.size || 5, 0, Math.PI * 2);
        context.fillStyle = options.fillStyle || 'rgba(255, 0, 0, 0.8)';
        context.fill();
    },

    /**
     * 绘制带文字的图片
     * @param context 画布上下文
     * @param img 图片对象
     * @param x x坐标
     * @param y y坐标
     * @param item 数据项
     * @param options 配置项
     * @param iconOptions 图标配置项
     */
    drawImageWithText: function(context: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, item: DataItem, options: DrawOptions, iconOptions: IconOptions) {
        context.save();
        
        // 设置图标大小
        let iconWidth = item.size || iconOptions.width || 40;
        let iconHeight = item.size || iconOptions.height || 40;
        
        // 根据聚合点数量动态调整图标大小
        const pointCount = item.properties ? (item.properties.point_count || 0) : 0;
        if (pointCount > 100) {
            iconWidth = 50;
            iconHeight = 50;
        } else if (pointCount > 50) {
            iconWidth = 45;
            iconHeight = 45;
        }

        const iconOffset = iconOptions.offset || { x: 0, y: 0 };
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
     * @param context 画布上下文
     * @param x x坐标
     * @param y y坐标
     * @param item 数据项
     * @param options 配置项
     */
    drawDefaultClusterPoint: function(context: CanvasRenderingContext2D, x: number, y: number, item: DataItem, options: DrawOptions) {
        context.save();
        
        let size = item.size || options.size || 10;
        const pointCount = item.properties ? (item.properties.point_count || 0) : 0;
        
        // 根据点数量调整大小
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
            
            const text = pointCount.toString();
            context.fillText(text, x, y);
        }
        
        context.restore();
    }
};

/**
 * 绘制单个图标项
 * @param img 图片对象
 * @param options 配置项
 * @param context 画布上下文
 * @param item 数据项
 */
function drawItem(img: HTMLImageElement | 'error', options: DrawOptions, context: CanvasRenderingContext2D, item: DataItem) {
    // 确保geometry存在
    if (!item.geometry) return;
    
    context.save();
    const coordinates = item.geometry._coordinates || item.geometry.coordinates;
    const x = coordinates[0];
    const y = coordinates[1];
    const offset = options.offset || {x: 0, y: 0};
    const width = item.width || options._width || options.width;
    const height = item.height || options._height || options.height;
    
    // 计算图标中心点坐标
    const centerX = x - ~~(width || 0) / 2 + offset.x;
    const centerY = y - ~~(height || 0) / 2 + offset.y;
    
    // 如果图片加载失败，绘制默认圆点
    if (img === 'error') {
        context.beginPath();
        context.arc(centerX, centerY, options.size || 5, 0, Math.PI * 2);
        context.fillStyle = options.fillStyle || 'red';
        context.fill();
        context.restore();
        return;
    }
    
    // 处理旋转角度
    const deg = item.deg || options.deg;
    if (deg) {
        context.translate(centerX, centerY);
        context.rotate((deg * Math.PI) / 180);
        context.translate(-centerX, -centerY);
    }

    // 绘制图片
    if (options.sx !== undefined && options.sy !== undefined && options.swidth !== undefined && options.sheight !== undefined && options.width !== undefined && options.height !== undefined) {
        context.drawImage(img, options.sx, options.sy, options.swidth, options.sheight, centerX, centerY, width || 0, height || 0);
    } else if (width && height) {
        context.drawImage(img, centerX, centerY, width, height);
    } else {
        context.drawImage(img, centerX, centerY);
    }
    
    context.restore();
}

/**
 * 加载图片
 * @param url 图片URL
 * @param callback 成功回调
 * @param fallback 失败回调
 */
function getImage(url: string, callback: (img: HTMLImageElement, src: string) => void, fallback: (src: string) => void) {
    const img = new Image();
    img.onload = function () {
        callback && callback(img, url);
    };
    img.onerror = function () {
        fallback && fallback(url);
    };
    img.src = window.decodeURIComponent(url);
}