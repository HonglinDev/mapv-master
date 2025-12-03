import Event from "../utils/Event";
import cityCenter from "../utils/cityCenter";

// 定义地理数据类型
export type GeometryType = 'Point' | 'LineString' | 'Polygon' | 'MultiLineString' | 'MultiPolygon';

// 定义坐标类型
export type Coordinate = [number, number];
export type LineCoordinates = Coordinate[];
export type PolygonCoordinates = LineCoordinates[];
export type MultiPolygonCoordinates = PolygonCoordinates[];

// 定义几何接口
export interface Geometry {
    type: GeometryType;
    coordinates: Coordinate | LineCoordinates | PolygonCoordinates | MultiPolygonCoordinates;
    [key: string]: any;
}

// 定义数据项接口
export interface DataItem {
    geometry?: Geometry;
    lng?: number;
    lat?: number;
    city?: string;
    time?: number | string;
    [key: string]: any;
}

// 定义数据集选项接口
export interface DataSetOptions {
    [key: string]: any;
}

// 定义get方法参数接口
export interface DataSetGetArgs {
    filter?: (item: DataItem) => boolean;
    transferCoordinate?: (coordinate: Coordinate) => Coordinate;
    fromColumn?: string;
    toColumn?: string;
}

// 定义update方法参数接口
export interface DataSetUpdateCondition {
    [key: string]: any;
}

export default class DataSet {
    private _options: DataSetOptions;
    private _data: DataItem[];
    private _dataCache: DataItem[];

    /**
     * 构造函数
     * @param data 初始数据，可以是单个数据项或数据项数组
     * @param options 数据集配置选项
     */
    constructor(data?: DataItem | DataItem[], options?: DataSetOptions) {
        (Event as any).bind(this)();

        this._options = options || {};
        this._data = []; // 存储数据的数组
        this._dataCache = [];

        // 提供初始数据时添加数据
        if (data) {
            this.add(data);
        }
    }

    /**
     * 添加数据
     * @param data 要添加的数据，可以是单个数据项或数据项数组
     * @param senderId 发送者ID（预留参数）
     */
    add(data: DataItem | DataItem[], senderId?: any): void {
        if (Array.isArray(data)) {
            // 处理数组数据
            for (let i = 0, len = data.length; i < len; i++) {
                if (data[i]) {
                    if (data[i].time && typeof data[i].time === 'string') {
                        const timeStr = data[i].time as string;
                        if (timeStr.length === 14 && timeStr.substr(0, 2) === '20') {
                            data[i].time = new Date(timeStr.substr(0, 4) + '-' + timeStr.substr(4, 2) + '-' + timeStr.substr(6, 2) + ' ' + timeStr.substr(8, 2) + ':' + timeStr.substr(10, 2) + ':' + timeStr.substr(12, 2)).getTime();
                        }
                    }
                    this._data.push(data[i]);
                }
            }
        } else if (typeof data === 'object' && data !== null) {
            // 处理单个数据项
            this._data.push(data);
        } else {
            throw new Error('未知的数据类型');
        }

        this._dataCache = JSON.parse(JSON.stringify(this._data));
    }

    /**
     * 重置数据到初始状态
     */
    reset(): void {
        this._data = JSON.parse(JSON.stringify(this._dataCache));
    }

    /**
     * 获取数据
     * @param args 参数配置
     * @returns 处理后的数据数组
     */
    get(args?: DataSetGetArgs): DataItem[] {
        args = args || {};

        // 获取数据引用
        let data = this._data;

        // 应用过滤条件
        if (args.filter) {
            const newData: DataItem[] = [];
            for (let i = 0; i < data.length; i++) {
                if (args.filter(data[i])) {
                    newData.push(data[i]);
                }
            }
            data = newData;
        }

        // 转换坐标
        if (args.transferCoordinate) {
            data = this.transferCoordinate(data, args.transferCoordinate, args.fromColumn, args.toColumn);
        }

        return data;
    }

    /**
     * 设置数据
     * @param data 要设置的数据，可以是单个数据项或数据项数组
     */
    set(data: DataItem | DataItem[]): void {
        this._set(data);
        (this as any)._trigger('change');
    }

    /**
     * 内部设置数据方法
     * @param data 要设置的数据，可以是单个数据项或数据项数组
     */
    private _set(data: DataItem | DataItem[]): void {
        this.clear();
        this.add(data);
    }

    /**
     * 清空数据
     * @param args 参数配置（预留）
     */
    clear(args?: any): void {
        this._data = []; // 清空数据数组
    }

    /**
     * 更新数据
     * @param cbk 更新回调函数
     * @param condition 更新条件
     */
    update(cbk: (item: DataItem) => void, condition?: DataSetUpdateCondition): void {
        const data = this._data;
        for (let i = 0; i < data.length; i++) {
            if (condition) {
                let flag = true;
                for (const key in condition) {
                    if (data[i][key] != condition[key]) {
                        flag = false;
                    }
                }
                if (flag) {
                    cbk && cbk(data[i]);
                }
            } else {
                cbk && cbk(data[i]);
            }
        }

        this._dataCache = JSON.parse(JSON.stringify(this._data));

        (this as any)._trigger('change');
    }

    /**
     * 转换坐标
     * @param data 要转换的数据数组
     * @param transferFn 坐标转换函数
     * @param fromColumn 源坐标列名
     * @param toColumnName 目标坐标列名
     * @returns 转换后的数据数组
     */
    transferCoordinate(data: DataItem[], transferFn: (coordinate: Coordinate) => Coordinate, fromColumn?: string, toColumnName?: string): DataItem[] {
        toColumnName = toColumnName || '_coordinates';
        fromColumn = fromColumn || 'coordinates';

        for (let i = 0; i < data.length; i++) {
            const geometry = data[i].geometry;
            if (!geometry) continue;
            
            const coordinates = geometry[fromColumn];
            switch (geometry.type) {
                case 'Point':
                    geometry[toColumnName] = transferFn(coordinates as Coordinate);
                    break;
                case 'LineString':
                    const newLineCoordinates: Coordinate[] = [];
                    for (let j = 0; j < (coordinates as LineCoordinates).length; j++) {
                        newLineCoordinates.push(transferFn((coordinates as LineCoordinates)[j]));
                    }
                    geometry[toColumnName] = newLineCoordinates;
                    break;
                case 'MultiLineString':
                case 'Polygon':
                    const newPolygonCoordinates = this.getPolygon(coordinates as PolygonCoordinates, transferFn);
                    geometry[toColumnName] = newPolygonCoordinates;
                    break;
                case 'MultiPolygon':
                    const newMultiPolygonCoordinates: PolygonCoordinates[] = [];
                    for (let c = 0; c < (coordinates as MultiPolygonCoordinates).length; c++) {
                        const polygon = (coordinates as MultiPolygonCoordinates)[c];
                        const newPolygon = this.getPolygon(polygon, transferFn);
                        newMultiPolygonCoordinates.push(newPolygon);
                    }
                    geometry[toColumnName] = newMultiPolygonCoordinates;
                    break;
            }
        }

        return data;
    }

    /**
     * 处理多边形坐标转换
     * @param coordinates 多边形坐标数组
     * @param transferFn 坐标转换函数
     * @returns 转换后的多边形坐标数组
     */
    private getPolygon(coordinates: PolygonCoordinates, transferFn: (coordinate: Coordinate) => Coordinate): PolygonCoordinates {
        const newCoordinates: PolygonCoordinates = [];
        for (let c = 0; c < coordinates.length; c++) {
            const coordinate = coordinates[c];
            const newcoordinate: Coordinate[] = [];
            for (let j = 0; j < coordinate.length; j++) {
                newcoordinate.push(transferFn(coordinate[j]));
            }
            newCoordinates.push(newcoordinate);
        }
        return newCoordinates;
    }

    /**
     * 初始化几何信息
     * @param transferFn 自定义几何转换函数
     */
    initGeometry(transferFn?: (item: DataItem) => Geometry): void {
        if (transferFn) {
            this._data.forEach((item) => {
                item.geometry = transferFn(item);
            });
        } else {
            this._data.forEach((item) => {
                if (!item.geometry) {
                    if (item.lng !== undefined && item.lat !== undefined) {
                        item.geometry = {
                            type: 'Point',
                            coordinates: [item.lng, item.lat]
                        };
                    } else if (item.city) {
                        const center = cityCenter.getCenterByCityName(item.city);
                        if (center) {
                            item.geometry = {
                                type: 'Point',
                                coordinates: [center.lng, center.lat]
                            };
                        }
                    }
                }
            });
        }
    }

    /**
     * 获取当前列的最大值
     * @param columnName 列名
     * @returns 最大值或undefined
     */
    getMax(columnName: string): number | undefined {
        const data = this._data;

        if (!data || data.length <= 0) {
            return undefined;
        }

        let max = parseFloat(data[0][columnName]);

        for (let i = 1; i < data.length; i++) {
            const value = parseFloat(data[i][columnName]);
            if (value > max) {
                max = value;
            }
        }

        return max;
    }

    /**
     * 获取当前列的总和
     * @param columnName 列名
     * @returns 总和或undefined
     */
    getSum(columnName: string): number | undefined {
        const data = this._data;

        if (!data || data.length <= 0) {
            return undefined;
        }

        let sum = 0;

        for (let i = 0; i < data.length; i++) {
            if (data[i][columnName]) {
                sum += parseFloat(data[i][columnName]);
            }
        }

        return sum;
    }

    /**
     * 获取当前列的最小值
     * @param columnName 列名
     * @returns 最小值或undefined
     */
    getMin(columnName: string): number | undefined {
        const data = this._data;

        if (!data || data.length <= 0) {
            return undefined;
        }

        let min = parseFloat(data[0][columnName]);

        for (let i = 1; i < data.length; i++) {
            const value = parseFloat(data[i][columnName]);
            if (value < min) {
                min = value;
            }
        }

        return min;
    }

    /**
     * 获取去重的数据
     * @param columnName 列名
     * @returns 去重后的字符串数组或undefined
     */
    getUnique(columnName: string): string[] | undefined {
        const data = this._data;

        if (!data || data.length <= 0) {
            return undefined;
        }

        const maps: { [key: string]: boolean } = {};

        for (let i = 1; i < data.length; i++) {
            maps[data[i][columnName]] = true;
        }

        const result: string[] = [];
        for (const key in maps) {
            result.push(key);
        }

        return result;
    }

    /**
     * 获取平均值
     * @param columnName 列名
     * @returns 平均值
     */
    getAverage(columnName: string): number {
        const data = this._data;

        if (!data || data.length <= 0) {
            return 0;
        }

        let sum = 0;
        let count = 0;

        for (let i = 0; i < data.length; i++) {
            if (data[i][columnName] !== undefined) {
                sum += parseFloat(data[i][columnName]);
                count++;
            }
        }

        return count > 0 ? sum / count : 0;
    }

    /**
     * 数据排序
     * @param columnName 排序列名
     * @param order 排序方式 'asc' 或 'desc'
     */
    sort(columnName: string, order: 'asc' | 'desc' = 'asc'): void {
        this._data.sort((a, b) => {
            const aVal = parseFloat(a[columnName]);
            const bVal = parseFloat(b[columnName]);
            
            if (order === 'desc') {
                return bVal - aVal;
            }
            return aVal - bVal;
        });
        
        (this as any)._trigger('change');
    }

    /**
     * 数据分页
     * @param page 页码（从1开始）
     * @param pageSize 每页数据条数
     * @returns 分页后的数据数组
     */
    getPage(page: number, pageSize: number): DataItem[] {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        return this._data.slice(start, end);
    }

    /**
     * 获取数据总数
     * @returns 数据总数
     */
    getTotal(): number {
        return this._data.length;
    }

    /**
     * 数据分组
     * @param columnName 分组列名
     * @returns 分组后的对象，键为分组值，值为对应的数据数组
     */
    groupBy(columnName: string): { [key: string]: DataItem[] } {
        const groups: { [key: string]: DataItem[] } = {};
        
        this._data.forEach(item => {
            const key = item[columnName];
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(item);
        });
        
        return groups;
    }

    /**
     * 查找数据
     * @param predicate 查找条件函数
     * @returns 找到的第一个数据项或null
     */
    find(predicate: (item: DataItem) => boolean): DataItem | null {
        for (let i = 0; i < this._data.length; i++) {
            if (predicate(this._data[i])) {
                return this._data[i];
            }
        }
        return null;
    }

    /**
     * 查找所有匹配的数据
     * @param predicate 查找条件函数
     * @returns 所有匹配的数据项数组
     */
    findAll(predicate: (item: DataItem) => boolean): DataItem[] {
        return this._data.filter(predicate);
    }

    /**
     * 数据映射转换
     * @param mapper 映射函数
     * @returns 映射后的数组
     */
    map<T>(mapper: (item: DataItem, index: number, array: DataItem[]) => T): T[] {
        return this._data.map(mapper);
    }

    /**
     * 数据过滤
     * @param predicate 过滤函数
     * @returns 过滤后的数组
     */
    filter(predicate: (item: DataItem, index: number, array: DataItem[]) => boolean): DataItem[] {
        return this._data.filter(predicate);
    }
}
