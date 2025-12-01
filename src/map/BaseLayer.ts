import DataSet, { DataItem } from '../data/DataSet';
import TWEEN from '../utils/Tween';
import Intensity from '../utils/data-range/Intensity';
import Category from '../utils/data-range/Category';
import Choropleth from '../utils/data-range/Choropleth';
import drawHeatmap from '../canvas/draw/heatmap';
import drawArrow from '../canvas/draw/arrow';
import drawClip from '../canvas/draw/clip';
import drawSimple from '../canvas/draw/simple';
import webglDrawSimple from '../webgl/draw/simple';
import drawGrid from '../canvas/draw/grid';
import drawCluster from '../canvas/draw/cluster';
import drawHoneycomb from '../canvas/draw/honeycomb';
import drawText from '../canvas/draw/text';
import drawIcon from '../canvas/draw/icon';
import pathSimple from '../canvas/path/simple';
import clear from '../canvas/clear';
// @ts-ignore
import Supercluster from '../utils/supercluster';

// 定义地图类型
export interface Map {[key: string]: any;}

// 定义动画选项接口
export interface AnimationOptions {
    enabled?: boolean;
    stepsRange?: {
        start: number;
        end: number;
    };
    duration?: number;
}

// 定义图层选项接口
export interface LayerOptions {
    draw?: string;
    maxZoom?: number;
    clusterRadius?: number;
    minPoints?: number;
    extent?: number;
    maxSize?: number;
    minSize?: number;
    gradient?: any;
    max?: number;
    min?: number;
    splitList?: any[];
    color?: any;
    context?: string;
    arrow?: {
        show?: boolean;
        [key: string]: any;
    };
    intensity?: any;
    animation?: AnimationOptions;
    methods?: {
        click?: (dataItem: DataItem | null, e: any) => void;
        mousemove?: (dataItem: DataItem | null, e: any) => void;
        hover?: (dataItem: DataItem | null, e: any) => void;
        doubleClick?: (dataItem: DataItem | null, e: any) => void;
        tap?: (dataItem: DataItem | null, e: any) => void;
    };
    [key: string]: any;
}

// 定义像素坐标接口
export interface Pixel {
    x: number;
    y: number;
}

// 定义上下文配置接口
export interface ContextConfig {
    globalAlpha: number;
    globalCompositeOperation: string;
    imageSmoothingEnabled: boolean;
    strokeStyle: string;
    fillStyle: string;
    shadowOffsetX: number;
    shadowOffsetY: number;
    shadowBlur: number;
    shadowColor: string;
    lineWidth: number;
    lineCap: string;
    lineJoin: string;
    miterLimit: number;
    lineDashOffset: number;
    font: string;
    textAlign: string;
    textBaseline: string;
    [key: string]: any;
}

// 定义图例选项接口
export interface LegendOptions {
    [key: string]: any;
}

// 定义聚合点类型
export interface ClusterPoint {
    id: number;
    numPoints: number;
    [key: string]: any;
}

// 定义聚合树节点类型
export interface ClusterTreeNode {
    points: ClusterPoint[];
    max: number;
    min: number;
    [key: string]: any;
}

// 定义Supercluster类型
export interface SuperclusterInstance {
    load(data: DataItem[]): void;
    trees: ClusterTreeNode[];
    getChildren(id: number): any[];
    [key: string]: any;
}

// 定义BaseLayer类
export default class BaseLayer {
    protected dataSet: DataSet;
    protected map: Map;
    protected options: LayerOptions;
    protected supercluster?: SuperclusterInstance;
    protected clusterDataSet?: DataSet;
    protected intensity?: Intensity;
    protected category?: Category;
    protected choropleth?: Choropleth;
    protected canvasLayer?: any;
    protected animator?: any;
    protected context?: string;
    protected steps?: { step: number };

    constructor(map: Map, dataSet: DataSet | DataItem[] | DataItem, options: LayerOptions) {
        let processedDataSet: DataSet;
        if (!(dataSet instanceof DataSet)) {
            processedDataSet = new DataSet(dataSet);
        } else {
            processedDataSet = dataSet;
        }

        this.dataSet = processedDataSet;
        this.map = map;
        this.options = options;
        if (options.draw === 'cluster') {
            this.refreshCluster(options);
        }
    }

    refreshCluster(options: LayerOptions): void {
        options = options || this.options;
        this.supercluster = new Supercluster({
            maxZoom: options.maxZoom || 19,
            radius: options.clusterRadius || 100,
            minPoints: options.minPoints || 2,
            extent: options.extent || 512
        });

        this.supercluster.load(this.dataSet.get());
        // 拿到每个级别下的最大值最小值
        this.supercluster.trees.forEach(item => {
            let max = 0;
            let min = Infinity;
            item.points.forEach(point => {
                max = Math.max(point.numPoints || 0, max);
                min = Math.min(point.numPoints || Infinity, min);
            });
            item.max = max;
            item.min = min;
        });
        this.clusterDataSet = new DataSet();
    }

    getDefaultContextConfig(): ContextConfig {
        return {
            globalAlpha: 1,
            globalCompositeOperation: 'source-over',
            imageSmoothingEnabled: true,
            strokeStyle: '#000000',
            fillStyle: '#000000',
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowBlur: 0,
            shadowColor: 'rgba(0, 0, 0, 0)',
            lineWidth: 1,
            lineCap: 'butt',
            lineJoin: 'miter',
            miterLimit: 10,
            lineDashOffset: 0,
            font: '10px sans-serif',
            textAlign: 'start',
            textBaseline: 'alphabetic'
        };
    }

    initDataRange(options: LayerOptions): void {
        const self = this;
        self.intensity = new Intensity({
            maxSize: self.options.maxSize,
            minSize: self.options.minSize,
            gradient: self.options.gradient,
            max: self.options.max || this.dataSet.getMax('count')
        });
        self.category = new Category(self.options.splitList || []);
        self.choropleth = new Choropleth(self.options.splitList || []);
        if (self.options.splitList === undefined) {
            self.category.generateByDataSet(this.dataSet, self.options.color);
        }
        if (self.options.splitList === undefined) {
            const min = self.options.min || this.dataSet.getMin('count') || 0;
            const max = self.options.max || this.dataSet.getMax('count') || 100;
            self.choropleth.generateByMinMax(min, max);
        }
    }

    getLegend(options: LegendOptions): any {
        const draw = this.options.draw;
        let legend = null;
        const self = this;
        if (self.options.draw === 'intensity' || self.options.draw === 'heatmap') {
            return this.intensity?.getLegend(options);
        } else if (self.options.draw === 'category') {
            return this.category?.getLegend(options);
        } else if (self.options.draw === 'choropleth') {
            return this.choropleth?.getLegend(options);
        }
        return legend;
    }

    processData(data: DataItem[]): void {
        const self = this;
        const draw = self.options.draw;
        if (draw === 'bubble' || draw === 'intensity' || draw === 'category' || draw === 'choropleth' || draw === 'simple') {
            for (let i = 0; i < data.length; i++) {
                const item = data[i];

                if (self.options.draw === 'bubble') {
                    data[i]._size = self.intensity?.getSize(item.count);
                } else {
                    data[i]._size = undefined;
                }

                let styleType = '_fillStyle';

                if (data[i].geometry?.type === 'LineString' || self.options.styleType === 'stroke') {
                    styleType = '_strokeStyle';
                }

                if (self.options.draw === 'intensity') {
                    data[i][styleType] = self.intensity?.getColor(item.count);
                } else if (self.options.draw === 'category') {
                    data[i][styleType] = self.category?.get(item.count);
                } else if (self.options.draw === 'choropleth') {
                    data[i][styleType] = self.choropleth?.get(item.count);
                }
            }
        }
    }

    isEnabledTime(): boolean {
        const animationOptions = this.options.animation;
        const flag = animationOptions && !(animationOptions.enabled === false);
        return !!flag;
    }

    argCheck(options: LayerOptions): void {
        if (options.draw === 'heatmap') {
            if (options.strokeStyle) {
                console.warn(
                    '[heatmap] options.strokeStyle is discard, pleause use options.strength [eg: options.strength = 0.1]'
                );
            }
        }
    }

    drawContext(context: CanvasRenderingContext2D | WebGLRenderingContext, dataSet: DataSet, options: LayerOptions, nwPixel: Pixel): void {
        const self = this;
        switch (self.options.draw) {
            case 'heatmap':
                drawHeatmap.draw(context as CanvasRenderingContext2D, dataSet, self.options);
                break;
            case 'grid':
            case 'cluster':
            case 'honeycomb':
                self.options.offset = {
                    x: nwPixel.x,
                    y: nwPixel.y
                };
                if (self.options.draw === 'grid') {
                    drawGrid.draw(context as CanvasRenderingContext2D, dataSet, self.options);
                } else if (self.options.draw === 'cluster') {
                    drawCluster.draw(context as CanvasRenderingContext2D, dataSet, self.options);
                } else {
                    drawHoneycomb.draw(context as CanvasRenderingContext2D, dataSet, self.options);
                }
                break;
            case 'text':
                drawText.draw(context as CanvasRenderingContext2D, dataSet, self.options);
                break;
            case 'icon':
                drawIcon.draw(context as CanvasRenderingContext2D, dataSet, self.options);
                break;
            case 'clip':
                drawClip.draw(context as CanvasRenderingContext2D, dataSet, self.options);
                break;
            default:
                if (self.options.context === 'webgl') {
                    webglDrawSimple.draw(context as WebGLRenderingContext, dataSet, self.options);
                } else {
                    // 使用增强版绘制函数
                    if (self.options.enhancedDraw) {
                        drawSimple.drawEnhanced(context as CanvasRenderingContext2D, dataSet, self.options);
                    } else {
                        drawSimple.draw(context as CanvasRenderingContext2D, dataSet, self.options);
                    }
                }
        }

        if (self.options.arrow && self.options.arrow.show !== false) {
            drawArrow.draw(context as CanvasRenderingContext2D, dataSet, self.options as any);
        }
    }

    isPointInPath(context: CanvasRenderingContext2D | WebGLRenderingContext | null, pixel: Pixel): DataItem | null {
        const ctx = this.getContext();
        const conf = this.getDefaultContextConfig();
        for (const i in conf) {
            (ctx as any)[i] = conf[i];
        }
        let data: DataItem[];
        if (
            this.options.draw === 'cluster' &&
            (!this.options.maxClusterZoom || this.options.maxClusterZoom >= this.getZoom())
        ) {
            data = this.clusterDataSet?.get() || [];
        } else {
            data = this.dataSet.get();
        }
        for (let i = 0; i < data.length; i++) {
            (ctx as CanvasRenderingContext2D).beginPath();
            const options = this.options;
            const x = pixel.x * (this.canvasLayer?.devicePixelRatio || 1);
            const y = pixel.y * (this.canvasLayer?.devicePixelRatio || 1);

            options.multiPolygonDraw = function () {
                if ((ctx as CanvasRenderingContext2D).isPointInPath(x, y)) {
                    return data[i];
                }
                return null;
            };

            pathSimple.draw(ctx as CanvasRenderingContext2D, data[i], options);

            const geoType = data[i].geometry?.type;
            if (geoType?.indexOf('LineString') !== -1) {
                if ((ctx as CanvasRenderingContext2D).isPointInStroke && (ctx as CanvasRenderingContext2D).isPointInStroke(x, y)) {
                    return data[i];
                }
            } else {
                if ((ctx as CanvasRenderingContext2D).isPointInPath(x, y)) {
                    return data[i];
                }
            }
        }
        return null;
    }
    
    // 递归获取聚合点下的所有原始点数据
    getClusterPoints(cluster: any): any[] {
        if (cluster.type !== 'Feature') {
            return [];
        }
        const children = this.supercluster?.getChildren(cluster.id) || [];
        return children
            .map(item => {
                if (item.type === 'Feature') {
                    return this.getClusterPoints(item);
                } else {
                    return item;
                }
            })
            .flat();
    }

    /**
     * 获取指定范围内的数据点
     * @param {Object} bounds - 地理范围边界
     */
    getDataInBounds(bounds: { contains: (coords: any) => boolean }): DataItem[] {
        const data = this.dataSet.get();
        const result: DataItem[] = [];
        
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (item.geometry && item.geometry.coordinates) {
                const coords = item.geometry.coordinates;
                if (bounds.contains(coords)) {
                    result.push(item);
                }
            }
        }
        
        return result;
    }

    /**
     * 根据条件过滤数据
     * @param {Function} filter - 过滤函数
     */
    filterData(filter: (item: DataItem) => boolean): DataSet {
        if (typeof filter === 'function') {
            const filteredData = this.dataSet.filter(filter);
            return new DataSet(filteredData);
        }
        return this.dataSet;
    }

    /**
     * 更新数据集
     * @param {Array|DataSet} data - 新数据
     */
    updateData(data: DataSet | DataItem[]): void {
        if (data instanceof DataSet) {
            this.dataSet = data;
        } else if (Array.isArray(data)) {
            this.dataSet.set(data);
        }
        
        // 如果是聚类图，需要刷新聚类
        if (this.options.draw === 'cluster') {
            this.refreshCluster(this.options);
        }
        
        // 重新初始化数据范围
        this.initDataRange(this.options);
        
        // 重新绘制
        this.draw();
    }

    /**
     * 添加数据
     * @param {Object|Array} data - 要添加的数据
     */
    addData(data: DataItem | DataItem[]): void {
        this.dataSet.add(data);
        
        // 如果是聚类图，需要刷新聚类
        if (this.options.draw === 'cluster') {
            this.refreshCluster(this.options);
        }
        
        // 重新初始化数据范围
        this.initDataRange(this.options);
        
        // 重新绘制
        this.draw();
    }

    /**
     * 清除数据
     */
    clearData(): void {
        this.dataSet.clear();
        
        // 如果是聚类图，需要刷新聚类
        if (this.options.draw === 'cluster') {
            this.refreshCluster(this.options);
        }
        
        // 重新绘制
        this.draw();
    }

    /**
     * 获取数据统计信息
     */
    getDataStats(): {
        count: number;
        minX: number | undefined;
        maxX: number | undefined;
        minY: number | undefined;
        maxY: number | undefined;
        minCount: number | undefined;
        maxCount: number | undefined;
        avgCount: number;
    } {
        const data = this.dataSet.get();
        return {
            count: data.length,
            minX: this.dataSet.getMin('x'),
            maxX: this.dataSet.getMax('x'),
            minY: this.dataSet.getMin('y'),
            maxY: this.dataSet.getMax('y'),
            minCount: this.dataSet.getMin('count'),
            maxCount: this.dataSet.getMax('count'),
            avgCount: this.dataSet.getAverage('count')
        };
    }

    clickEvent(pixel: Pixel, e: any): void {
        if (!this.options.methods) {
            return;
        }
        const dataItem = this.isPointInPath(this.getContext(), pixel);

        if (dataItem) {
            if (this.options.draw === 'cluster') {
                const children = this.getClusterPoints(dataItem);
                dataItem.children = children;
            }
            this.options.methods.click?.(dataItem, e);
        } else {
            this.options.methods.click?.(null, e);
        }
    }

    mousemoveEvent(pixel: Pixel, e: any): void {
        if (!this.options.methods) {
            return;
        }
        const dataItem = this.isPointInPath(this.getContext(), pixel);
        if (dataItem) {
            if (this.options.draw === 'cluster') {
                const children = this.getClusterPoints(dataItem);
                dataItem.children = children;
            }
            this.options.methods.mousemove?.(dataItem, e);
        } else {
            this.options.methods.mousemove?.(null, e);
        }
    }
    
    /**
     * 悬停事件处理
     * @param {Object} pixel - 像素坐标
     * @param {Event} e - 事件对象
     */
    hoverEvent(pixel: Pixel, e: any): void {
        if (!this.options.methods || !this.options.methods.hover) {
            return;
        }
        
        const dataItem = this.isPointInPath(this.getContext(), pixel);
        if (dataItem) {
            if (this.options.draw === 'cluster') {
                const children = this.getClusterPoints(dataItem);
                dataItem.children = children;
            }
            this.options.methods.hover?.(dataItem, e);
        } else {
            this.options.methods.hover?.(null, e);
        }
    }
    
    /**
     * 双击事件处理
     * @param {Object} pixel - 像素坐标
     * @param {Event} e - 事件对象
     */
    doubleClickEvent(pixel: Pixel, e: any): void {
        if (!this.options.methods || !this.options.methods.doubleClick) {
            return;
        }
        
        const dataItem = this.isPointInPath(this.getContext(), pixel);
        if (dataItem) {
            if (this.options.draw === 'cluster') {
                const children = this.getClusterPoints(dataItem);
                dataItem.children = children;
            }
            this.options.methods.doubleClick?.(dataItem, e);
        } else {
            this.options.methods.doubleClick?.(null, e);
        }
    }

    tapEvent(pixel: Pixel, e: any): void {
        if (!this.options.methods) {
            return;
        }
        const dataItem = this.isPointInPath(this.getContext(), pixel);
        if (dataItem) {
            if (this.options.draw === 'cluster') {
                const children = this.getClusterPoints(dataItem);
                dataItem.children = children;
            }
            this.options.methods.tap?.(dataItem, e);
        } else {
            this.options.methods.tap?.(null, e);
        }
    }

    /**
     * obj.options
     */
    update(obj: { options: LayerOptions }, isDraw?: boolean): void {
        const self = this;
        const _options = obj.options;
        const options = self.options;
        for (const i in _options) {
            options[i] = _options[i];
        }
        self.init(options);
        if (isDraw !== false) {
            self.draw();
        }
    }

    /**
     * 更新图层选项
     * @param {Object} options - 新选项
     * @param {Boolean} redraw - 是否重绘
     */
    updateOptions(options: Partial<LayerOptions>, redraw: boolean = true): void {
        const self = this;
        for (const key in options) {
            self.options[key] = options[key];
        }
        
        // 如果修改了与数据范围相关的选项，需要重新初始化
        if (options.max !== undefined || options.min !== undefined || 
            options.gradient !== undefined || options.splitList !== undefined) {
            self.initDataRange(self.options);
        }
        
        if (redraw) {
            self.draw();
        }
    }

    setOptions(options: LayerOptions): void {
        const self = this;
        self.dataSet.reset();
        // console.log('xxx1')
        self.init(options);
        // console.log('xxx')
        self.draw();
    }

    set(obj: { options: LayerOptions }): void {
        const self = this;
        const ctx = this.getContext();
        const conf = this.getDefaultContextConfig();
        for (const i in conf) {
            (ctx as any)[i] = conf[i];
        }
        self.init(obj.options);
        self.draw();
    }

    destroy(): void {
        this.unbindEvent();
        this.hide();
    }

    initAnimator(): void {
        const self = this;
        const animationOptions = self.options.animation;

        if (self.options.draw === 'time' || self.isEnabledTime()) {
            if (!animationOptions?.stepsRange) {
                animationOptions!.stepsRange = {
                    start: this.dataSet.getMin('time') || 0,
                    end: this.dataSet.getMax('time') || 0
                };
            }

            this.steps = { step: animationOptions!.stepsRange!.start };
            self.animator = new TWEEN.Tween(this.steps)
                .onUpdate(function (this: { step: number }) {
                    self._canvasUpdate(this.step);
                })
                .repeat(Infinity);

            this.addAnimatorEvent();

            const duration = (animationOptions?.duration || 5) * 1000;

            self.animator.to({ step: animationOptions!.stepsRange!.end }, duration);
            self.animator.start();
        } else {
            self.animator?.stop();
        }
    }

    addAnimatorEvent(): void {}

    animatorMovestartEvent(): void {
        const animationOptions = this.options.animation;
        if (this.isEnabledTime() && this.animator) {
            this.steps!.step = animationOptions!.stepsRange!.start;
            this.animator.stop();
        }
    }

    animatorMoveendEvent(): void {
        if (this.isEnabledTime() && this.animator) {
            this.animator.start();
        }
    }
    
    /**
     * 导出数据为GeoJSON格式
     */
    toGeoJSON(): {
        type: string;
        features: any[];
    } {
        const data = this.dataSet.get();
        const geojson = {
            type: "FeatureCollection",
            features: [] as any[]
        };
        
        data.forEach(item => {
            if (item.geometry) {
                geojson.features.push({
                    type: "Feature",
                    properties: Object.assign({}, item),
                    geometry: item.geometry
                });
            }
        });
        
        return geojson;
    }
    
    /**
     * 导出数据为CSV格式
     */
    toCSV(): string {
        const data = this.dataSet.get();
        if (data.length === 0) return "";
        
        // 获取所有属性名作为表头
        const headers = Object.keys(data[0]).filter(key => key !== 'geometry');
        let csv = headers.join(',') + '\n';
        
        // 添加数据行
        data.forEach(item => {
            const row = headers.map(header => {
                let value = item[header];
                // 如果是数组或对象，转换为JSON字符串
                if (typeof value === 'object') {
                    value = JSON.stringify(value);
                }
                // 转义包含逗号或引号的值
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    value = '"' + value.replace(/"/g, '""') + '"';
                }
                return value;
            });
            csv += row.join(',') + '\n';
        });
        
        return csv;
    }

    // 以下方法需要在子类中实现
    init(options: LayerOptions): void {}
    draw(): void {}
    getContext(): CanvasRenderingContext2D | WebGLRenderingContext | null { return null; }
    getZoom(): number { return 0; }
    unbindEvent(): void {}
    hide(): void {}
    _canvasUpdate(step: number): void {}
}

if (typeof window !== 'undefined') {
    requestAnimationFrame(animate);
}

function animate(time: number): void {
    requestAnimationFrame(animate);
    TWEEN.update(time);
}
