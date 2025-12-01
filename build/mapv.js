(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.mapv = {}));
})(this, (function (exports) { 'use strict';

    var version = "2.0.62";

    /**
     * 清除Canvas画布
     * @author kyle / http://nikai.us/
     */
    /**
     * 清除整个Canvas画布
     * @param {CanvasRenderingContext2D} context - Canvas上下文
     */
    function clear(context) {
        if (context && context.clearRect && context.canvas) {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        }
        //context.canvas.width = context.canvas.width;
        //context.canvas.height = context.canvas.height;
    }

    /**
     * 分辨率缩放模块
     * @author kyle / http://nikai.us/
     */
    /**
     * 调整画布分辨率以适配设备像素比
     * @param context Canvas上下文
     */
    function resolutionScale$1 (context) {
        var devicePixelRatio = window.devicePixelRatio || 1;
        // 调整画布实际尺寸
        context.canvas.width = context.canvas.width * devicePixelRatio;
        context.canvas.height = context.canvas.height * devicePixelRatio;
        // 保持画布显示尺寸不变
        context.canvas.style.width = context.canvas.width / devicePixelRatio + 'px';
        context.canvas.style.height = context.canvas.height / devicePixelRatio + 'px';
        // 缩放上下文
        context.scale(devicePixelRatio, devicePixelRatio);
    }

    /*
     * @Author: 李红林 1770679549@qq.com
     * @Date: 2025-12-01 14:42:23
     * @LastEditors: 李红林 1770679549@qq.com
     * @LastEditTime: 2025-12-01 15:27:41
     * @FilePath: \mapv-master\src\utils\Event.ts
     * @Description:
     *
     */
    // 定义事件类
    var Event = /** @class */ (function () {
        function Event() {
            this._subscribers = {}; // 事件订阅者集合
        }
        /**
         * 订阅事件，添加事件监听器
         * @param {String} event        事件名称。可用事件: 'put', 'update', 'remove'
         * @param {function} callback   回调方法。接收三个参数:
         *                                  {String} event - 事件名称
         *                                  {Object | null} params - 事件参数
         *                                  {String | Number} senderId - 发送者ID
         */
        Event.prototype.on = function (event, callback) {
            var subscribers = this._subscribers[event];
            if (!subscribers) {
                subscribers = [];
                this._subscribers[event] = subscribers;
            }
            subscribers.push({
                callback: callback
            });
        };
        /**
         * 取消订阅事件，移除事件监听器
         * @param {String} event - 事件名称
         * @param {function} callback - 回调函数
         */
        Event.prototype.off = function (event, callback) {
            var subscribers = this._subscribers[event];
            if (subscribers) {
                //this._subscribers[event] = subscribers.filter(listener => listener.callback != callback);
                for (var i = 0; i < subscribers.length; i++) {
                    if (subscribers[i].callback === callback) {
                        subscribers.splice(i, 1);
                        i--;
                    }
                }
            }
        };
        /**
         * 触发事件
         * @param {String} event - 事件名称
         * @param {Object | null} params - 事件参数
         * @param {String} [senderId] - 可选的发送者ID
         * @private
         */
        Event.prototype._trigger = function (event, params, senderId) {
            if (event === '*') {
                throw new Error('不能触发事件 *');
            }
            var subscribers = [];
            if (event in this._subscribers) {
                subscribers.push.apply(subscribers, this._subscribers[event]);
            }
            if ('*' in this._subscribers) {
                subscribers.push.apply(subscribers, this._subscribers['*']);
            }
            for (var i = 0, len = subscribers.length; i < len; i++) {
                var subscriber = subscribers[i];
                if (subscriber.callback) {
                    subscriber.callback(event, params, senderId || null);
                }
            }
        };
        /**
         * 将事件方法绑定到对象
         * @param {Object} obj - 要绑定事件方法的对象
         */
        Event.bind = function (obj) {
            var event = new Event();
            obj.on = event.on.bind(event);
            obj.off = event.off.bind(event);
            obj._trigger = event._trigger.bind(event);
            obj._subscribers = event._subscribers;
        };
        return Event;
    }());

    /**
     * 根据城市名称获取中心坐标
     * @author kyle / http://nikai.us/
     */
    // 城市中心数据
    var citycenter = {
        municipalities: [
            { n: "北京", g: "116.395645,39.929986|12" },
            { n: "上海", g: "121.487899,31.249162|12" },
            { n: "天津", g: "117.210813,39.14393|12" },
            { n: "重庆", g: "106.530635,29.544606|12" }
        ],
        provinces: [
            { n: "安徽", g: "117.216005,31.859252|8", cities: [{ n: "合肥", g: "117.282699,31.866942|12" }] },
            { n: "福建", g: "117.984943,26.050118|8", cities: [{ n: "福州", g: "119.330221,26.047125|12" }] },
            { n: "广东", g: "113.394818,23.408004|8", cities: [{ n: "广州", g: "113.30765,23.120049|12" }] },
            { n: "广西", g: "108.671981,23.745228|8", cities: [{ n: "南宁", g: "108.377632,22.81689|12" }] },
            { n: "贵州", g: "106.713478,26.578343|8", cities: [{ n: "贵阳", g: "106.713478,26.578343|12" }] },
            { n: "海南", g: "110.33119,20.031971|8", cities: [{ n: "海口", g: "110.33119,20.031971|12" }] },
            { n: "河北", g: "114.514862,38.042818|8", cities: [{ n: "石家庄", g: "114.514862,38.042818|12" }] },
            { n: "河南", g: "113.625368,34.746599|8", cities: [{ n: "郑州", g: "113.625368,34.746599|12" }] },
            { n: "黑龙江", g: "126.642464,45.756967|8", cities: [{ n: "哈尔滨", g: "126.642464,45.756967|12" }] },
            { n: "湖北", g: "114.305393,30.59285|8", cities: [{ n: "武汉", g: "114.305393,30.59285|12" }] },
            { n: "湖南", g: "112.93881,28.22808|8", cities: [{ n: "长沙", g: "112.93881,28.22808|12" }] },
            { n: "吉林", g: "125.3245,43.817075|8", cities: [{ n: "长春", g: "125.3245,43.817075|12" }] },
            { n: "江苏", g: "118.796877,32.060255|8", cities: [{ n: "南京", g: "118.796877,32.060255|12" }] },
            { n: "江西", g: "115.858198,28.682025|8", cities: [{ n: "南昌", g: "115.858198,28.682025|12" }] },
            { n: "辽宁", g: "123.43286,41.805698|8", cities: [{ n: "沈阳", g: "123.43286,41.805698|12" }] },
            { n: "内蒙古", g: "111.670801,40.818311|6", cities: [{ n: "呼和浩特", g: "111.670801,40.818311|12" }] },
            { n: "宁夏", g: "106.258357,38.468011|6", cities: [{ n: "银川", g: "106.258357,38.468011|12" }] },
            { n: "青海", g: "101.778245,36.623178|6", cities: [{ n: "西宁", g: "101.778245,36.623178|12" }] },
            { n: "山东", g: "117.000923,36.675807|8", cities: [{ n: "济南", g: "117.000923,36.675807|12" }] },
            { n: "山西", g: "112.54884,37.857014|8", cities: [{ n: "太原", g: "112.54884,37.857014|12" }] },
            { n: "陕西", g: "108.939751,34.341568|8", cities: [{ n: "西安", g: "108.939751,34.341568|12" }] },
            { n: "四川", g: "104.065735,30.570206|8", cities: [{ n: "成都", g: "104.065735,30.570206|12" }] },
            { n: "西藏", g: "91.117514,29.646921|6", cities: [{ n: "拉萨", g: "91.117514,29.646921|12" }] },
            { n: "新疆", g: "87.616842,43.825592|6", cities: [{ n: "乌鲁木齐", g: "87.616842,43.825592|12" }] },
            { n: "云南", g: "102.832891,24.880058|8", cities: [{ n: "昆明", g: "102.832891,24.880058|12" }] },
            { n: "浙江", g: "120.153576,30.287459|8", cities: [{ n: "杭州", g: "120.153576,30.287459|12" }] }
        ],
        other: [
            { n: "钓鱼岛", g: "123.474498,25.746388|15" },
            { n: "三沙", g: "112.338941,16.834872|14" }
        ]
    };
    /**
     * 解析地理坐标字符串
     * @param {string} g - 地理坐标字符串，格式为"lng,lat|zoom"
     * @returns {Coordinate} - 解析后的坐标对象
     */
    function getCenter(g) {
        var item = g.split("|");
        var coords = item[0].split(",");
        return {
            lng: parseFloat(coords[0]),
            lat: parseFloat(coords[1])
        };
    }
    /**
     * 根据城市名称获取省份名称
     * @param {string} name - 城市名称
     * @returns {string | null} - 省份名称，找不到返回null
     */
    function getProvinceNameByCityName(name) {
        var provinces = citycenter.provinces;
        for (var i = 0; i < provinces.length; i++) {
            var provinceName = provinces[i].n;
            var cities = provinces[i].cities || [];
            for (var j = 0; j < cities.length; j++) {
                if (cities[j].n === name) {
                    return provinceName;
                }
            }
        }
        return null;
    }
    /**
     * 根据城市名称获取城市中心坐标
     * @param {string} name - 城市名称
     * @returns {Coordinate | null} - 城市中心坐标，找不到返回null
     */
    function getCenterByCityName(name) {
        // 移除城市名称中的"市"字
        name = name.replace('市', '');
        // 先查找直辖市
        for (var i = 0; i < citycenter.municipalities.length; i++) {
            if (citycenter.municipalities[i].n === name) {
                return getCenter(citycenter.municipalities[i].g);
            }
        }
        // 查找其他地区
        for (var i = 0; i < citycenter.other.length; i++) {
            if (citycenter.other[i].n === name) {
                return getCenter(citycenter.other[i].g);
            }
        }
        // 查找省份和下属城市
        var provinces = citycenter.provinces;
        for (var i = 0; i < provinces.length; i++) {
            // 先查找省份
            if (provinces[i].n === name) {
                return getCenter(provinces[i].g);
            }
            // 查找下属城市
            var cities = provinces[i].cities || [];
            for (var j = 0; j < cities.length; j++) {
                if (cities[j].n === name) {
                    return getCenter(cities[j].g);
                }
            }
        }
        return null;
    }
    var cityCenter = {
        getProvinceNameByCityName: getProvinceNameByCityName,
        getCenterByCityName: getCenterByCityName
    };

    /**
     * @author kyle / http://nikai.us/
     */
    var DataSet$1 = /** @class */ (function () {
        function DataSet(data, options) {
            Event.bind(this)();
            this._options = options || {};
            this._data = []; // map with data indexed by id
            this._dataCache = [];
            // add initial data when provided
            if (data) {
                this.add(data);
            }
        }
        /**
         * Add data.
         */
        DataSet.prototype.add = function (data, senderId) {
            if (Array.isArray(data)) {
                // Array
                for (var i = 0, len = data.length; i < len; i++) {
                    if (data[i]) {
                        if (data[i].time && typeof data[i].time === 'string') {
                            var timeStr = data[i].time;
                            if (timeStr.length === 14 && timeStr.substr(0, 2) === '20') {
                                data[i].time = new Date(timeStr.substr(0, 4) + '-' + timeStr.substr(4, 2) + '-' + timeStr.substr(6, 2) + ' ' + timeStr.substr(8, 2) + ':' + timeStr.substr(10, 2) + ':' + timeStr.substr(12, 2)).getTime();
                            }
                        }
                        this._data.push(data[i]);
                    }
                }
            }
            else if (typeof data === 'object' && data !== null) {
                // Single item
                this._data.push(data);
            }
            else {
                throw new Error('Unknown dataType');
            }
            this._dataCache = JSON.parse(JSON.stringify(this._data));
        };
        DataSet.prototype.reset = function () {
            this._data = JSON.parse(JSON.stringify(this._dataCache));
        };
        /**
         * get data.
         */
        DataSet.prototype.get = function (args) {
            args = args || {};
            // TODO: 不修改原始数据，在数据上挂载新的名称，每次修改数据直接修改新名称下的数据，可以省去deepCopy
            // var data = deepCopy(this._data);
            var data = this._data;
            if (args.filter) {
                var newData = [];
                for (var i = 0; i < data.length; i++) {
                    if (args.filter(data[i])) {
                        newData.push(data[i]);
                    }
                }
                data = newData;
            }
            if (args.transferCoordinate) {
                data = this.transferCoordinate(data, args.transferCoordinate, args.fromColumn, args.toColumn);
            }
            // console.timeEnd('transferCoordinate time')
            return data;
        };
        /**
         * set data.
         */
        DataSet.prototype.set = function (data) {
            this._set(data);
            this._trigger('change');
        };
        /**
         * set data.
         */
        DataSet.prototype._set = function (data) {
            this.clear();
            this.add(data);
        };
        /**
         * clear data.
         */
        DataSet.prototype.clear = function (args) {
            this._data = []; // map with data indexed by id
        };
        /**
         * remove data.
         */
        DataSet.prototype.remove = function (args) { };
        /**
         * update data.
         */
        DataSet.prototype.update = function (cbk, condition) {
            var data = this._data;
            for (var i = 0; i < data.length; i++) {
                if (condition) {
                    var flag = true;
                    for (var key in condition) {
                        if (data[i][key] != condition[key]) {
                            flag = false;
                        }
                    }
                    if (flag) {
                        cbk && cbk(data[i]);
                    }
                }
                else {
                    cbk && cbk(data[i]);
                }
            }
            this._dataCache = JSON.parse(JSON.stringify(this._data));
            this._trigger('change');
        };
        /**
         * transfer coordinate.
         */
        DataSet.prototype.transferCoordinate = function (data, transferFn, fromColumn, toColumnName) {
            toColumnName = toColumnName || '_coordinates';
            fromColumn = fromColumn || 'coordinates';
            for (var i = 0; i < data.length; i++) {
                var geometry = data[i].geometry;
                if (!geometry)
                    continue;
                var coordinates = geometry[fromColumn];
                switch (geometry.type) {
                    case 'Point':
                        geometry[toColumnName] = transferFn(coordinates);
                        break;
                    case 'LineString':
                        var newLineCoordinates = [];
                        for (var j = 0; j < coordinates.length; j++) {
                            newLineCoordinates.push(transferFn(coordinates[j]));
                        }
                        geometry[toColumnName] = newLineCoordinates;
                        break;
                    case 'MultiLineString':
                    case 'Polygon':
                        var newPolygonCoordinates = this.getPolygon(coordinates, transferFn);
                        geometry[toColumnName] = newPolygonCoordinates;
                        break;
                    case 'MultiPolygon':
                        var newMultiPolygonCoordinates = [];
                        for (var c = 0; c < coordinates.length; c++) {
                            var polygon = coordinates[c];
                            var newPolygon = this.getPolygon(polygon, transferFn);
                            newMultiPolygonCoordinates.push(newPolygon);
                        }
                        geometry[toColumnName] = newMultiPolygonCoordinates;
                        break;
                }
            }
            return data;
        };
        DataSet.prototype.getPolygon = function (coordinates, transferFn) {
            var newCoordinates = [];
            for (var c = 0; c < coordinates.length; c++) {
                var coordinate = coordinates[c];
                var newcoordinate = [];
                for (var j = 0; j < coordinate.length; j++) {
                    newcoordinate.push(transferFn(coordinate[j]));
                }
                newCoordinates.push(newcoordinate);
            }
            return newCoordinates;
        };
        DataSet.prototype.initGeometry = function (transferFn) {
            if (transferFn) {
                this._data.forEach(function (item) {
                    item.geometry = transferFn(item);
                });
            }
            else {
                this._data.forEach(function (item) {
                    if (!item.geometry) {
                        if (item.lng !== undefined && item.lat !== undefined) {
                            item.geometry = {
                                type: 'Point',
                                coordinates: [item.lng, item.lat]
                            };
                        }
                        else if (item.city) {
                            var center = cityCenter.getCenterByCityName(item.city);
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
        };
        /**
         * 获取当前列的最大值
         */
        DataSet.prototype.getMax = function (columnName) {
            var data = this._data;
            if (!data || data.length <= 0) {
                return undefined;
            }
            var max = parseFloat(data[0][columnName]);
            for (var i = 1; i < data.length; i++) {
                var value = parseFloat(data[i][columnName]);
                if (value > max) {
                    max = value;
                }
            }
            return max;
        };
        /**
         * 获取当前列的总和
         */
        DataSet.prototype.getSum = function (columnName) {
            var data = this._data;
            if (!data || data.length <= 0) {
                return undefined;
            }
            var sum = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i][columnName]) {
                    sum += parseFloat(data[i][columnName]);
                }
            }
            return sum;
        };
        /**
         * 获取当前列的最小值
         */
        DataSet.prototype.getMin = function (columnName) {
            var data = this._data;
            if (!data || data.length <= 0) {
                return undefined;
            }
            var min = parseFloat(data[0][columnName]);
            for (var i = 1; i < data.length; i++) {
                var value = parseFloat(data[i][columnName]);
                if (value < min) {
                    min = value;
                }
            }
            return min;
        };
        /**
         * 获取去重的数据
         */
        DataSet.prototype.getUnique = function (columnName) {
            var data = this._data;
            if (!data || data.length <= 0) {
                return undefined;
            }
            var maps = {};
            for (var i = 1; i < data.length; i++) {
                maps[data[i][columnName]] = true;
            }
            var result = [];
            for (var key in maps) {
                result.push(key);
            }
            return result;
        };
        /**
         * 获取平均值
         */
        DataSet.prototype.getAverage = function (columnName) {
            var data = this._data;
            if (!data || data.length <= 0) {
                return 0;
            }
            var sum = 0;
            var count = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i][columnName] !== undefined) {
                    sum += parseFloat(data[i][columnName]);
                    count++;
                }
            }
            return count > 0 ? sum / count : 0;
        };
        /**
         * 数据排序
         * @param {string} columnName - 排序列名
         * @param {string} order - 排序方式 'asc' 或 'desc'
         */
        DataSet.prototype.sort = function (columnName, order) {
            if (order === void 0) { order = 'asc'; }
            this._data.sort(function (a, b) {
                var aVal = parseFloat(a[columnName]);
                var bVal = parseFloat(b[columnName]);
                if (order === 'desc') {
                    return bVal - aVal;
                }
                return aVal - bVal;
            });
            this._trigger('change');
        };
        /**
         * 数据分页
         * @param {number} page - 页码（从1开始）
         * @param {number} pageSize - 每页数据条数
         */
        DataSet.prototype.getPage = function (page, pageSize) {
            var start = (page - 1) * pageSize;
            var end = start + pageSize;
            return this._data.slice(start, end);
        };
        /**
         * 获取数据总数
         */
        DataSet.prototype.getTotal = function () {
            return this._data.length;
        };
        /**
         * 数据分组
         * @param {string} columnName - 分组列名
         */
        DataSet.prototype.groupBy = function (columnName) {
            var groups = {};
            this._data.forEach(function (item) {
                var key = item[columnName];
                if (!groups[key]) {
                    groups[key] = [];
                }
                groups[key].push(item);
            });
            return groups;
        };
        /**
         * 查找数据
         * @param {function} predicate - 查找条件函数
         */
        DataSet.prototype.find = function (predicate) {
            for (var i = 0; i < this._data.length; i++) {
                if (predicate(this._data[i])) {
                    return this._data[i];
                }
            }
            return null;
        };
        /**
         * 查找所有匹配的数据
         * @param {function} predicate - 查找条件函数
         */
        DataSet.prototype.findAll = function (predicate) {
            return this._data.filter(predicate);
        };
        /**
         * 数据映射转换
         * @param {function} mapper - 映射函数
         */
        DataSet.prototype.map = function (mapper) {
            return this._data.map(mapper);
        };
        /**
         * 数据过滤
         * @param {function} filter - 过滤函数
         */
        DataSet.prototype.filter = function (predicate) {
            return this._data.filter(predicate);
        };
        return DataSet;
    }());

    /**
     * 蜂窝形状绘制模块
     */
    /**
     * 计算六边形的角点坐标
     * @param center 中心点
     * @param size 六边形大小
     * @param i 角点索引（0-5）
     * @returns 角点坐标
     */
    function hex_corner$1(center, size, i) {
        var angle_deg = 60 * i + 30;
        var angle_rad = Math.PI / 180 * angle_deg;
        return [center.x + size * Math.cos(angle_rad), center.y + size * Math.sin(angle_rad)];
    }
    /**
     * 绘制六边形
     * @param context Canvas上下文
     * @param x 中心点x坐标
     * @param y 中心点y坐标
     * @param size 六边形大小
     */
    function draw$4(context, x, y, size) {
        for (var j = 0; j < 6; j++) {
            var result = hex_corner$1({
                x: x,
                y: y
            }, size, j);
            context.lineTo(result[0], result[1]);
        }
    }

    /**
     * 简单路径绘制模块
     * @author kyle / http://nikai.us/
     */
    var pathSimple = {
        /**
         * 绘制数据集
         * @param context Canvas上下文
         * @param dataSet 数据集
         * @param options 绘制选项
         */
        drawDataSet: function (context, dataSet, options) {
            // 获取数据
            var data = dataSet instanceof DataSet$1 ? dataSet.get() : dataSet;
            // 遍历绘制每个数据项
            for (var i = 0, len = data.length; i < len; i++) {
                var item = data[i];
                this.draw(context, item, options);
            }
        },
        /**
         * 绘制单个数据项
         * @param context Canvas上下文
         * @param data 数据项
         * @param options 绘制选项
         * @returns 布尔值或undefined
         */
        draw: function (context, data, options) {
            // 确保geometry存在
            if (!data.geometry)
                return;
            var type = data.geometry.type;
            var coordinates = data.geometry._coordinates || data.geometry.coordinates;
            var symbol = data.symbol || options.symbol || 'circle';
            // 根据几何类型绘制
            switch (type) {
                case 'Point':
                    var size = data._size || data.size || options._size || options.size || 5;
                    // 根据符号类型绘制
                    if (symbol === 'circle') {
                        if (options.bigData === 'Point') {
                            context.moveTo(coordinates[0], coordinates[1]);
                        }
                        context.arc(coordinates[0], coordinates[1], size, 0, Math.PI * 2);
                    }
                    else if (symbol === 'rect') {
                        context.rect(coordinates[0] - size / 2, coordinates[1] - size / 2, size, size);
                    }
                    else if (symbol === 'honeycomb') {
                        draw$4(context, coordinates[0], coordinates[1], size);
                    }
                    else if (symbol === 'image') {
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
                    console.error('类型 ' + type + ' 目前不支持！');
                    break;
            }
        },
        /**
         * 绘制图片标记
         * @param context Canvas上下文
         * @param data 数据项
         * @param options 绘制选项
         */
        drawImageMarker: function (context, data, options) {
            // 确保geometry存在
            if (!data.geometry)
                return;
            var coordinates = data.geometry._coordinates || data.geometry.coordinates;
            var x = coordinates[0];
            var y = coordinates[1];
            // 获取图片相关配置
            var imageOptions = Object.assign({}, options.image || {}, data.image || {});
            var imageUrl = imageOptions.url;
            if (imageUrl) {
                var img_1 = new Image();
                img_1.onload = function () {
                    var size = data._size || data.size || options._size || options.size || 20;
                    var width = imageOptions.width || size;
                    var height = imageOptions.height || size;
                    // 居中绘制
                    context.drawImage(img_1, x - width / 2, y - height / 2, width, height);
                };
                img_1.src = imageUrl;
            }
            else {
                // 如果没有图片，则绘制默认圆形
                var size = data._size || data.size || options._size || options.size || 5;
                context.arc(x, y, size, 0, Math.PI * 2);
            }
        },
        /**
         * 绘制线串
         * @param context Canvas上下文
         * @param coordinates 坐标数组
         */
        drawLineString: function (context, coordinates) {
            for (var j = 0; j < coordinates.length; j++) {
                var x = coordinates[j][0];
                var y = coordinates[j][1];
                if (j == 0) {
                    context.moveTo(x, y);
                }
                else {
                    context.lineTo(x, y);
                }
            }
        },
        /**
         * 绘制多边形
         * @param context Canvas上下文
         * @param coordinates 坐标数组
         */
        drawPolygon: function (context, coordinates) {
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
         * @param context Canvas上下文
         * @param coordinates 坐标数组
         * @param options 绘制选项
         */
        drawPolygonEnhanced: function (context, coordinates, options) {
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
                    var gradient = context.createLinearGradient(coordinate[0][0], coordinate[0][1], coordinate[2] ? coordinate[2][0] : coordinate[0][0], coordinate[2] ? coordinate[2][1] : coordinate[0][1]);
                    // 添加渐变色点
                    for (var key in options.gradient) {
                        gradient.addColorStop(parseFloat(key), options.gradient[key]);
                    }
                    context.fillStyle = gradient;
                }
            }
        }
    };

    /**
     * 简单绘制模块
     * @author kyle / http://nikai.us/
     */
    var drawSimple = {
        draw: function (context, dataSet, options) {
            // 获取数据
            var data = dataSet instanceof DataSet$1 ? dataSet.get() : dataSet;
            // 保存上下文状态
            context.save();
            // 设置上下文属性
            for (var key in options) {
                context[key] = options[key];
            }
            // 大数据模式
            if (options.bigData) {
                context.save();
                context.beginPath();
                // 绘制所有数据项
                for (var i = 0, len = data.length; i < len; i++) {
                    var item = data[i];
                    pathSimple.draw(context, item, options);
                }
                var type = options.bigData;
                // 根据几何类型进行填充或描边
                if (type == 'Point' || type == 'Polygon' || type == 'MultiPolygon') {
                    context.fill();
                    // 设置虚线样式
                    if (context.lineDash) {
                        context.setLineDash(context.lineDash);
                    }
                    // 应用数据项的虚线样式
                    var lastItem = data[data.length - 1];
                    if (lastItem.lineDash) {
                        context.setLineDash(lastItem.lineDash);
                    }
                    // 描边
                    if ((lastItem.strokeStyle || options.strokeStyle) && options.lineWidth) {
                        context.stroke();
                    }
                }
                else if (type == 'LineString' || type == 'MultiLineString') {
                    // 线类型直接描边
                    context.stroke();
                }
                context.restore();
            }
            else {
                var _loop_1 = function (i, len) {
                    var item = data[i];
                    context.save();
                    // 设置填充样式
                    if (item.fillStyle || item._fillStyle) {
                        context.fillStyle = item.fillStyle || item._fillStyle;
                    }
                    // 设置描边样式
                    if (item.strokeStyle || item._strokeStyle) {
                        context.strokeStyle = item.strokeStyle || item._strokeStyle;
                    }
                    // 设置虚线样式
                    if (context.lineDash) {
                        context.setLineDash(context.lineDash);
                    }
                    if (item.lineDash) {
                        context.setLineDash(item.lineDash);
                    }
                    // 确保geometry存在
                    if (!item.geometry)
                        return "continue";
                    var type = item.geometry.type;
                    context.beginPath();
                    // 定义多边形绘制函数
                    options.multiPolygonDraw = function () {
                        context.fill();
                        if ((item.strokeStyle || options.strokeStyle) && options.lineWidth) {
                            context.stroke();
                        }
                    };
                    // 绘制数据项
                    pathSimple.draw(context, item, options);
                    // 根据几何类型进行填充或描边
                    if (type == 'Point' || type == 'Polygon' || type == 'MultiPolygon') {
                        context.fill();
                        if ((item.strokeStyle || options.strokeStyle) && options.lineWidth) {
                            context.stroke();
                        }
                    }
                    else if (type == 'LineString' || type == 'MultiLineString') {
                        // 线类型设置线宽后描边
                        if (item.lineWidth || item._lineWidth) {
                            context.lineWidth = item.lineWidth || item._lineWidth;
                        }
                        context.stroke();
                    }
                    context.restore();
                };
                // 普通模式，逐个绘制数据项
                for (var i = 0, len = data.length; i < len; i++) {
                    _loop_1(i, len);
                }
            }
            context.restore();
        },
        /**
         * 增强版绘制函数，支持更多自定义选项
         * @param context Canvas上下文
         * @param dataSet 数据集
         * @param options 绘制选项
         */
        drawEnhanced: function (context, dataSet, options) {
            // 获取数据
            var data = dataSet instanceof DataSet$1 ? dataSet.get() : dataSet;
            // 保存上下文状态
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
                // 绘制所有数据项
                for (var i = 0, len = data.length; i < len; i++) {
                    var item = data[i];
                    pathSimple.draw(context, item, options);
                }
                var type = options.bigData;
                // 根据几何类型进行填充或描边
                if (type == 'Point' || type == 'Polygon' || type == 'MultiPolygon') {
                    context.fill();
                    // 设置虚线样式
                    if (context.lineDash) {
                        context.setLineDash(context.lineDash);
                    }
                    // 应用最后一个数据项的虚线样式
                    var lastItem = data[data.length - 1];
                    if (lastItem.lineDash) {
                        context.setLineDash(lastItem.lineDash);
                    }
                    // 描边
                    if ((lastItem.strokeStyle || options.strokeStyle) && options.lineWidth) {
                        context.stroke();
                    }
                }
                else if (type == 'LineString' || type == 'MultiLineString') {
                    context.stroke();
                }
                context.restore();
            }
            else {
                var _loop_2 = function (i, len) {
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
                    // 设置虚线样式
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
                    // 确保geometry存在
                    if (!item.geometry)
                        return "continue";
                    var type = item.geometry.type;
                    context.beginPath();
                    // 定义多边形绘制函数
                    options.multiPolygonDraw = function () {
                        context.fill();
                        if ((item.strokeStyle || options.strokeStyle) && options.lineWidth) {
                            context.stroke();
                        }
                    };
                    // 绘制元素
                    pathSimple.draw(context, item, options);
                    // 根据几何类型进行填充或描边
                    if (type == 'Point' || type == 'Polygon' || type == 'MultiPolygon') {
                        context.fill();
                        if ((item.strokeStyle || options.strokeStyle) && options.lineWidth) {
                            context.stroke();
                        }
                    }
                    else if (type == 'LineString' || type == 'MultiLineString') {
                        context.stroke();
                    }
                    context.restore();
                };
                // 普通模式，逐个绘制数据项
                for (var i = 0, len = data.length; i < len; i++) {
                    _loop_2(i, len);
                }
            }
            context.restore();
        }
    };

    /**
     * 创建Canvas元素
     * @param {number} width - Canvas宽度
     * @param {number} height - Canvas高度
     * @returns {HTMLCanvasElement | null} - 创建的Canvas元素
     */
    function Canvas(width, height) {
        var canvas = null;
        if (typeof document !== 'undefined') {
            canvas = document.createElement('canvas');
            if (width !== undefined) {
                canvas.width = width;
            }
            if (height !== undefined) {
                canvas.height = height;
            }
        }
        return canvas;
    }

    /**
     * 强度映射工具
     * @author kyle / http://nikai.us/
     */
    /**
     * 强度映射类，用于处理数据的强度映射，包括颜色渐变、大小映射等
     */
    var Intensity = /** @class */ (function () {
        /**
         * 构造函数
         * @param {IntensityOptions} [options] - 配置选项
         */
        function Intensity(options) {
            this.paletteCtx = null;
            options = options || {};
            this.gradient = options.gradient || {
                0.25: "rgba(0, 0, 255, 1)",
                0.55: "rgba(0, 255, 0, 1)",
                0.85: "rgba(255, 255, 0, 1)",
                1.0: "rgba(255, 0, 0, 1)"
            };
            this.maxSize = options.maxSize || 35;
            this.minSize = options.minSize || 0;
            this.max = options.max || 100;
            this.min = options.min || 0;
            this.initPalette();
        }
        /**
         * 设置最大值
         * @param {number} value - 最大值
         */
        Intensity.prototype.setMax = function (value) {
            this.max = value || 100;
        };
        /**
         * 设置最小值
         * @param {number} value - 最小值
         */
        Intensity.prototype.setMin = function (value) {
            this.min = value || 0;
        };
        /**
         * 设置最大尺寸
         * @param {number} maxSize - 最大尺寸
         */
        Intensity.prototype.setMaxSize = function (maxSize) {
            this.maxSize = maxSize || 35;
        };
        /**
         * 设置最小尺寸
         * @param {number} minSize - 最小尺寸
         */
        Intensity.prototype.setMinSize = function (minSize) {
            this.minSize = minSize || 0;
        };
        /**
         * 初始化调色板
         */
        Intensity.prototype.initPalette = function () {
            var gradient = this.gradient;
            var canvas = Canvas(256, 1);
            if (canvas) {
                this.paletteCtx = canvas.getContext('2d');
                if (this.paletteCtx) {
                    var lineGradient = this.paletteCtx.createLinearGradient(0, 0, 256, 1);
                    for (var key in gradient) {
                        lineGradient.addColorStop(parseFloat(key), gradient[key]);
                    }
                    this.paletteCtx.fillStyle = lineGradient;
                    this.paletteCtx.fillRect(0, 0, 256, 1);
                }
            }
        };
        /**
         * 根据值获取颜色
         * @param {number} value - 输入值
         * @returns {string} - 颜色字符串
         */
        Intensity.prototype.getColor = function (value) {
            var imageData = this.getImageData(value);
            return "rgba(".concat(imageData[0], ", ").concat(imageData[1], ", ").concat(imageData[2], ", ").concat(imageData[3] / 256, ")");
        };
        /**
         * 根据值获取图像数据
         * @param {number} [value] - 输入值，可选
         * @returns {Uint8ClampedArray | number[]} - 图像数据
         */
        Intensity.prototype.getImageData = function (value) {
            if (!this.paletteCtx) {
                return [0, 0, 0, 0];
            }
            var imageData = this.paletteCtx.getImageData(0, 0, 256, 1).data;
            if (value === undefined) {
                return imageData;
            }
            var max = this.max;
            var min = this.min;
            var normalizedValue = value;
            if (normalizedValue > max) {
                normalizedValue = max;
            }
            if (normalizedValue < min) {
                normalizedValue = min;
            }
            var index = Math.floor((normalizedValue - min) / (max - min) * (256 - 1)) * 4;
            return [imageData[index], imageData[index + 1], imageData[index + 2], imageData[index + 3]];
        };
        /**
         * 根据值获取尺寸
         * @param {number} value - 输入值
         * @returns {number} - 尺寸
         */
        Intensity.prototype.getSize = function (value) {
            var size = 0;
            var max = this.max;
            var min = this.min;
            var maxSize = this.maxSize;
            var minSize = this.minSize;
            var normalizedValue = value;
            if (normalizedValue > max) {
                normalizedValue = max;
            }
            if (normalizedValue < min) {
                normalizedValue = min;
            }
            if (max > min) {
                size = minSize + (normalizedValue - min) / (max - min) * (maxSize - minSize);
            }
            else {
                return maxSize;
            }
            return size;
        };
        /**
         * 设置渐变色
         * @param {Gradient} gradient - 渐变配置
         */
        Intensity.prototype.setGradient = function (gradient) {
            this.gradient = gradient;
            this.initPalette();
        };
        /**
         * 获取当前渐变色配置
         * @returns {Gradient} - 渐变配置
         */
        Intensity.prototype.getGradient = function () {
            return this.gradient;
        };
        /**
         * 根据预设主题设置渐变色
         * @param {string} theme - 主题名称
         * @returns {boolean} - 是否成功设置主题
         */
        Intensity.prototype.setTheme = function (theme) {
            var themes = {
                'rainbow': {
                    0.0: 'blue',
                    0.25: 'cyan',
                    0.5: 'lime',
                    0.75: 'yellow',
                    1.0: 'red'
                },
                'fire': {
                    0.0: 'black',
                    0.25: 'purple',
                    0.5: 'orange',
                    0.75: 'yellow',
                    1.0: 'white'
                },
                'water': {
                    0.0: 'white',
                    0.25: 'lightblue',
                    0.5: 'blue',
                    0.75: 'darkblue',
                    1.0: 'black'
                },
                'earth': {
                    0.0: 'green',
                    0.25: 'yellowgreen',
                    0.5: 'yellow',
                    0.75: 'orange',
                    1.0: 'brown'
                }
            };
            if (themes[theme]) {
                this.gradient = themes[theme];
                this.initPalette();
                return true;
            }
            return false;
        };
        /**
         * 获取预设主题列表
         * @returns {string[]} - 主题列表
         */
        Intensity.prototype.getThemes = function () {
            return ['rainbow', 'fire', 'water', 'earth'];
        };
        /**
         * 更新最大最小值
         * @param {number} min - 最小值
         * @param {number} max - 最大值
         */
        Intensity.prototype.setMinMax = function (min, max) {
            this.min = min;
            this.max = max;
        };
        /**
         * 更新最大最小尺寸
         * @param {number} minSize - 最小尺寸
         * @param {number} maxSize - 最大尺寸
         */
        Intensity.prototype.setMinMaxSize = function (minSize, maxSize) {
            this.minSize = minSize;
            this.maxSize = maxSize;
        };
        /**
         * 获取图例
         * @param {LegendOptions} options - 图例选项
         * @returns {HTMLCanvasElement | null} - 图例Canvas元素
         */
        Intensity.prototype.getLegend = function (options) {
            var gradient = this.gradient;
            var width = options.width || 20;
            var height = options.height || 180;
            var canvas = Canvas(width, height);
            if (!canvas) {
                return null;
            }
            var paletteCtx = canvas.getContext('2d');
            if (!paletteCtx) {
                return null;
            }
            var lineGradient = paletteCtx.createLinearGradient(0, height, 0, 0);
            for (var key in gradient) {
                lineGradient.addColorStop(parseFloat(key), gradient[key]);
            }
            paletteCtx.fillStyle = lineGradient;
            paletteCtx.fillRect(0, 0, width, height);
            // 添加数值标签
            if (options.showLabels !== false) {
                paletteCtx.fillStyle = 'black';
                paletteCtx.font = '12px Arial';
                paletteCtx.textAlign = 'left';
                // 添加最大值和最小值标签
                var maxLabel = this.max.toString();
                var minLabel = this.min.toString();
                paletteCtx.fillText(maxLabel, width + 5, 12);
                paletteCtx.fillText(minLabel, width + 5, height);
                // 添加中间值标签
                var midValue = (this.max + this.min) / 2;
                var midLabel = midValue.toFixed(1);
                paletteCtx.fillText(midLabel, width + 5, height / 2);
            }
            return canvas;
        };
        return Intensity;
    }());

    /**
     * 全局对象和设备像素比模块
     */
    // 获取全局对象，优先使用window，如果不存在则使用空对象
    var global$4 = typeof window === 'undefined' ? {} : window;
    // 获取设备像素比，默认值为1
    var devicePixelRatio = global$4.devicePixelRatio || 1;

    /**
     * 绘制热力图
     * @author kyle / http://nikai.us/
     */
    /**
     * 创建热力图圆形点
     * @param size 圆形大小
     * @returns Canvas对象，包含绘制好的圆形
     */
    function createCircle(size) {
        var shadowBlur = size / 2;
        var r2 = size + shadowBlur;
        var offsetDistance = 10000;
        var circle = Canvas(r2 * 2, r2 * 2);
        var context = circle.getContext('2d');
        if (!context) {
            return circle;
        }
        context.shadowBlur = shadowBlur;
        context.shadowColor = 'black';
        context.shadowOffsetX = context.shadowOffsetY = offsetDistance;
        context.beginPath();
        context.arc(r2 - offsetDistance, r2 - offsetDistance, size, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
        return circle;
    }
    /**
     * 对热力图像素进行着色处理
     * @param pixels 像素数据
     * @param gradient 渐变颜色数据
     * @param options 热力图选项
     */
    function colorize(pixels, gradient, options) {
        var max = getMax(options);
        var min = getMin(options);
        var diff = max - min;
        var range = options.range || null;
        var jMin = 0;
        var jMax = 1024;
        if (range && range.length === 2) {
            jMin = (range[0] - min) / diff * 1024;
        }
        if (range && range.length === 2) {
            jMax = (range[1] - min) / diff * 1024;
        }
        var maxOpacity = options.maxOpacity || 0.8;
        var minOpacity = options.minOpacity || 0;
        for (var i = 3, len = pixels.length, j = void 0; i < len; i += 4) {
            j = pixels[i] * 4; // 从透明度值获取渐变颜色
            // 调整透明度范围
            if (pixels[i] / 256 > maxOpacity) {
                pixels[i] = 256 * maxOpacity;
            }
            if (pixels[i] / 256 < minOpacity) {
                pixels[i] = 256 * minOpacity;
            }
            // 根据范围设置颜色
            if (j && j >= jMin && j <= jMax) {
                pixels[i - 3] = gradient[j];
                pixels[i - 2] = gradient[j + 1];
                pixels[i - 1] = gradient[j + 2];
            }
            else {
                pixels[i] = 0;
            }
        }
    }
    /**
     * 获取最大值
     * @param options 热力图选项
     * @returns 最大值
     */
    function getMax(options) {
        return options.max || 100;
    }
    /**
     * 获取最小值
     * @param options 热力图选项
     * @returns 最小值
     */
    function getMin(options) {
        return options.min || 0;
    }
    /**
     * 绘制灰度热力图
     * @param context Canvas上下文
     * @param dataSet 数据集
     * @param options 热力图选项
     */
    function drawGray(context, dataSet, options) {
        var max = getMax(options);
        var min = getMin(options);
        // 确定热力图点大小
        var size = options._size;
        if (size === undefined) {
            size = options.size;
            if (size === undefined) {
                size = 13;
            }
        }
        // 创建强度对象，用于颜色渐变
        var intensity = new Intensity({
            gradient: options.gradient,
            max: max,
            min: min
        });
        // 创建圆形点
        var circle = createCircle(size);
        var circleHalfWidth = circle.width / 2;
        var circleHalfHeight = circle.height / 2;
        // 按透明度排序数据，优化绘制性能
        var dataOrderByAlpha = {};
        dataSet.forEach(function (item) {
            var count = item.count === undefined ? 1 : item.count;
            var alpha = Math.min(1, count / max).toFixed(2);
            dataOrderByAlpha[alpha] = dataOrderByAlpha[alpha] || [];
            dataOrderByAlpha[alpha].push(item);
        });
        // 绘制数据
        for (var i in dataOrderByAlpha) {
            if (isNaN(parseFloat(i)))
                continue;
            var _data = dataOrderByAlpha[i];
            context.beginPath();
            if (!options.withoutAlpha) {
                context.globalAlpha = parseFloat(i);
            }
            context.strokeStyle = intensity.getColor(parseFloat(i) * max);
            _data.forEach(function (item) {
                if (!item.geometry) {
                    return;
                }
                var coordinates = item.geometry._coordinates || item.geometry.coordinates;
                var type = item.geometry.type;
                if (type === 'Point') {
                    var count = item.count === undefined ? 1 : item.count;
                    context.globalAlpha = count / max;
                    var pointCoordinates = coordinates;
                    context.drawImage(circle, pointCoordinates[0] - circleHalfWidth, pointCoordinates[1] - circleHalfHeight);
                }
                else if (type === 'LineString') {
                    var count = item.count === undefined ? 1 : item.count;
                    context.globalAlpha = count / max;
                    context.beginPath();
                    pathSimple.draw(context, item, options);
                    context.stroke();
                }
            });
        }
    }
    /**
     * 主绘制函数
     * @param context Canvas上下文
     * @param dataSet 数据集
     * @param options 热力图选项
     */
    function draw$3(context, dataSet, options) {
        // 检查画布大小
        if (context.canvas.width <= 0 || context.canvas.height <= 0) {
            return;
        }
        // 设置强度
        var strength = options.strength || 0.3;
        context.strokeStyle = 'rgba(0,0,0,' + strength + ')';
        // 创建阴影画布
        var shadowCanvas = Canvas(context.canvas.width, context.canvas.height);
        var shadowContext = shadowCanvas.getContext('2d');
        if (!shadowContext) {
            return;
        }
        shadowContext.scale(devicePixelRatio, devicePixelRatio);
        // 获取数据
        var data = dataSet instanceof DataSet$1 ? dataSet.get() : dataSet;
        context.save();
        // 创建强度对象
        var intensity = new Intensity({
            gradient: options.gradient
        });
        // 绘制灰度热力图
        drawGray(shadowContext, data, options);
        // 着色处理
        if (!options.absolute) {
            var colored = shadowContext.getImageData(0, 0, context.canvas.width, context.canvas.height);
            colorize(colored.data, intensity.getImageData(), options);
            context.putImageData(colored, 0, 0);
            context.restore();
        }
        // 释放资源
        intensity = null;
        shadowCanvas = null;
    }
    var drawHeatmap = {
        draw: draw$3
    };

    /**
     * 绘制网格图
     * @author kyle / http://nikai.us/
     */
    var drawGrid = {
        draw: function (context, dataSet, options) {
            // 保存上下文状态
            context.save();
            // 获取数据
            var data = dataSet instanceof DataSet$1 ? dataSet.get() : dataSet;
            // 网格数据对象
            var grids = {};
            // 网格大小
            var size = options._size || options.size || 50;
            // 是否启用聚类（后端传入数据为网格数据时，传入enableCluster为false，前端不进行网格化操作，直接画方格）
            var enableCluster = 'enableCluster' in options ? options.enableCluster : true;
            // 偏移量
            var offset = options.offset || {
                x: 0,
                y: 0
            };
            // 创建强度对象，用于颜色渐变
            var intensity = new Intensity({
                min: options.min || 0,
                max: options.max || 100,
                gradient: options.gradient
            });
            if (!enableCluster) {
                // 直接绘制网格数据模式
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    if (!item.geometry)
                        continue;
                    var coordinates = item.geometry._coordinates || item.geometry.coordinates;
                    var gridKey = coordinates.join(',');
                    grids[gridKey] = item.count || 1;
                }
                // 绘制每个网格
                for (var gridKey in grids) {
                    var _a = gridKey.split(',').map(Number), x = _a[0], y = _a[1];
                    context.beginPath();
                    context.rect(x - size / 2, y - size / 2, size, size);
                    context.fillStyle = intensity.getColor(grids[gridKey]);
                    context.fill();
                    // 如果设置了描边样式和线宽，则绘制边框
                    if (options.strokeStyle && options.lineWidth) {
                        context.stroke();
                    }
                }
            }
            else {
                // 聚类模式，将数据点聚合到网格中
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    if (!item.geometry)
                        continue;
                    var coordinates = item.geometry._coordinates || item.geometry.coordinates;
                    var gridKey = Math.floor((coordinates[0] - offset.x) / size) + ',' + Math.floor((coordinates[1] - offset.y) / size);
                    if (!grids[gridKey]) {
                        grids[gridKey] = 0;
                    }
                    grids[gridKey] += ~~(item.count || 1);
                }
                // 绘制每个网格
                for (var gridKey in grids) {
                    var _b = gridKey.split(',').map(Number), x = _b[0], y = _b[1];
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
                for (var gridKey in grids) {
                    var _c = gridKey.split(',').map(Number), x = _c[0], y = _c[1];
                    var text = grids[gridKey].toString();
                    var textWidth = context.measureText(text).width;
                    if (!enableCluster) {
                        // 直接绘制模式下的标签位置
                        context.fillText(text, x - textWidth / 2, y + 5);
                    }
                    else {
                        // 聚类模式下的标签位置
                        context.fillText(text, x * size + 0.5 + offset.x + size / 2 - textWidth / 2, y * size + 0.5 + offset.y + size / 2 + 5);
                    }
                }
            }
            // 恢复上下文状态
            context.restore();
        }
    };

    /**
     * 绘制蜂窝图（六边形网格）
     * @author kyle / http://nikai.us/
     */
    /**
     * 计算六边形的角点坐标
     * @param center 中心点
     * @param size 六边形大小
     * @param i 角点索引（0-5）
     * @returns 角点坐标
     */
    function hex_corner(center, size, i) {
        var angle_deg = 60 * i + 30;
        var angle_rad = Math.PI / 180 * angle_deg;
        return [center.x + size * Math.cos(angle_rad), center.y + size * Math.sin(angle_rad)];
    }
    var drawHoneycomb = {
        draw: function (context, dataSet, options) {
            // 保存上下文状态
            context.save();
            // 获取数据
            var data = dataSet instanceof DataSet$1 ? dataSet.get() : dataSet;
            // 设置上下文属性
            for (var key in options) {
                context[key] = options[key];
            }
            // 偏移量
            var offset = options.offset || {
                x: 10,
                y: 10
            };
            // 计算六边形参数
            var r = options._size || options.size || 40;
            r = r / 2 / Math.sin(Math.PI / 3);
            var dx = r * 2 * Math.sin(Math.PI / 3);
            var dy = r * 1.5;
            // 六边形网格数据
            var binsById = {};
            // 将数据点分配到六边形网格中
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                if (!item.geometry)
                    continue;
                var coordinates = item.geometry._coordinates || item.geometry.coordinates;
                var py = (coordinates[1] - offset.y) / dy;
                var pj = Math.round(py);
                var px = (coordinates[0] - offset.x) / dx - (pj & 1 ? 0.5 : 0);
                var pi = Math.round(px);
                var py1 = py - pj;
                // 调整六边形归属
                if (Math.abs(py1) * 3 > 1) {
                    var px1 = px - pi;
                    var pi2 = pi + (px < pi ? -1 : 1) / 2;
                    var pj2 = pj + (py < pj ? -1 : 1);
                    var px2 = px - pi2;
                    var py2 = py - pj2;
                    if (px1 * px1 + py1 * py1 > px2 * px2 + py2 * py2) {
                        pi = pi2 + (pj & 1 ? 1 : -1) / 2;
                        pj = pj2;
                    }
                }
                // 生成网格ID并存储数据
                var id = pi + "-" + pj;
                var bin = binsById[id];
                if (bin) {
                    bin.push(item);
                }
                else {
                    bin = binsById[id] = [item];
                    bin.i = pi;
                    bin.j = pj;
                    bin.x = (pi + (pj & 1 ? 1 / 2 : 0)) * dx;
                    bin.y = pj * dy;
                }
            }
            // 创建强度对象，用于颜色渐变
            var intensity = new Intensity({
                max: options.max || 100,
                maxSize: r,
                gradient: options.gradient
            });
            // 绘制六边形网格
            for (var key in binsById) {
                var item = binsById[key];
                context.beginPath();
                // 绘制六边形
                for (var j = 0; j < 6; j++) {
                    var result = hex_corner({
                        x: item.x + offset.x,
                        y: item.y + offset.y
                    }, r, j);
                    context.lineTo(result[0], result[1]);
                }
                context.closePath();
                // 计算网格内数据总和
                var count = 0;
                for (var i = 0; i < item.length; i++) {
                    count += item[i].count || 1;
                }
                item.count = count;
                // 设置填充颜色并绘制
                context.fillStyle = intensity.getColor(count);
                context.fill();
                // 如果设置了描边样式和线宽，则绘制边框
                if (options.strokeStyle && options.lineWidth) {
                    context.stroke();
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
                for (var key in binsById) {
                    var item = binsById[key];
                    var text = item.count || 0;
                    if (text < 0) {
                        text = parseFloat(text.toFixed(2));
                    }
                    else {
                        text = Math.floor(text);
                    }
                    var textWidth = context.measureText(text.toString()).width;
                    context.fillText(text.toString(), item.x + offset.x - textWidth / 2, item.y + offset.y + 5);
                }
            }
            // 恢复上下文状态
            context.restore();
        }
    };

    function createShader(gl, src, type) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        return shader;
    }

    function initShaders(gl, vs_source, fs_source) {

        var vertexShader = createShader(gl, vs_source, gl.VERTEX_SHADER);
        var fragmentShader = createShader(gl, fs_source, gl.FRAGMENT_SHADER);
         
        var glProgram = gl.createProgram();
         
        gl.attachShader(glProgram, vertexShader);
        gl.attachShader(glProgram, fragmentShader);
        gl.linkProgram(glProgram);
     
        gl.useProgram(glProgram);

        return glProgram;
    }

    function getColorData(color) {
        var tmpCanvas = document.createElement('canvas');
        var tmpCtx = tmpCanvas.getContext('2d');
        tmpCanvas.width = 1;
        tmpCanvas.height = 1;
        tmpCtx.fillStyle = color;
        tmpCtx.fillRect(0, 0, 1, 1);
        return tmpCtx.getImageData(0, 0, 1, 1).data;
    }

    var vs_s$2 = [
        'attribute vec4 a_Position;',
        'void main() {',
        'gl_Position = a_Position;',
        'gl_PointSize = 30.0;',
        '}'
    ].join('');

    var fs_s$2 = [
        'precision mediump float;',
        'uniform vec4 u_FragColor;',
        'void main() {',
        'gl_FragColor = u_FragColor;',
        '}'
    ].join('');

    function draw$2(gl, data, options) {

        if (!data) {
            return;
        }

        var program = initShaders(gl, vs_s$2, fs_s$2);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

        //gl.clearColor(0.0, 0.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        var halfCanvasWidth = gl.canvas.width / 2;
        var halfCanvasHeight = gl.canvas.height / 2;

        // Create a buffer object
        var vertexBuffer = gl.createBuffer();
        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        var a_Position = gl.getAttribLocation(program, 'a_Position');
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);

        var uFragColor = gl.getUniformLocation(program, 'u_FragColor');

        var colored = getColorData(options.strokeStyle || 'red');

        gl.uniform4f(uFragColor,
            colored[0] / 255,
            colored[1] / 255,
            colored[2] / 255,
            colored[3] / 255);

        gl.lineWidth(options.lineWidth || 1);

        for (var i = 0, len = data.length; i < len; i++) {
            var _geometry = data[i].geometry._coordinates;

            var verticesData = [];

            for (var j = 0; j < _geometry.length; j++) {
                var item = _geometry[j];

                var x = (item[0] - halfCanvasWidth) / halfCanvasWidth;
                var y = (halfCanvasHeight - item[1]) / halfCanvasHeight;
                verticesData.push(x, y);
            }

            var vertices = new Float32Array(verticesData);
            // Write date into the buffer object
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
            gl.drawArrays(gl.LINE_STRIP, 0, _geometry.length);
        }

    }
    var line = {
        draw: draw$2
    };

    var vs_s$1 = [
        'attribute vec4 a_Position;',
        'attribute float a_PointSize;',
        'void main() {',
        'gl_Position = a_Position;',
        'gl_PointSize = a_PointSize;',
        '}'
    ].join('');

    var fs_s$1 = [
        'precision mediump float;',
        'uniform vec4 u_FragColor;',
        'void main() {',
        'gl_FragColor = u_FragColor;',
        '}'
    ].join('');

    function draw$1 (gl, data, options) {

        if (!data) {
            return;
        }

        var program = initShaders(gl, vs_s$1, fs_s$1);

        var a_Position = gl.getAttribLocation(program, 'a_Position');

        var a_PointSize = gl.getAttribLocation(program, 'a_PointSize');

        var uFragColor = gl.getUniformLocation(program, 'u_FragColor');

        //gl.clearColor(0.0, 0.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        var halfCanvasWidth = gl.canvas.width / 2;
        var halfCanvasHeight = gl.canvas.height / 2;

        var verticesData = [];
        var count = 0;
        for (var i = 0; i < data.length; i++) {
            var item = data[i].geometry._coordinates;

            var x = (item[0]- halfCanvasWidth) / halfCanvasWidth;
            var y = (halfCanvasHeight - item[1]) / halfCanvasHeight;

            if (x < -1 || x > 1 || y < -1 || y > 1) {
                continue;
            }
            verticesData.push(x, y);
            count++;
        }

        var vertices = new Float32Array(verticesData);
        var n = count; // The number of vertices

        // Create a buffer object
        var vertexBuffer = gl.createBuffer();

        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);

        gl.vertexAttrib1f(a_PointSize, options._size);

        var colored = getColorData(options.fillStyle || 'red');

        gl.uniform4f(uFragColor,
            colored[0] / 255,
            colored[1] / 255,
            colored[2] / 255,
            colored[3] / 255);
        gl.drawArrays(gl.POINTS, 0, n);
    }
    var point = {
        draw: draw$1
    };

    function earcut(data, holeIndices, dim) {

        dim = dim || 2;

        var hasHoles = holeIndices && holeIndices.length,
            outerLen = hasHoles ? holeIndices[0] * dim : data.length,
            outerNode = linkedList(data, 0, outerLen, dim, true),
            triangles = [];

        if (!outerNode) return triangles;

        var minX, minY, maxX, maxY, x, y, size;

        if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);

        // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
        if (data.length > 80 * dim) {
            minX = maxX = data[0];
            minY = maxY = data[1];

            for (var i = dim; i < outerLen; i += dim) {
                x = data[i];
                y = data[i + 1];
                if (x < minX) minX = x;
                if (y < minY) minY = y;
                if (x > maxX) maxX = x;
                if (y > maxY) maxY = y;
            }

            // minX, minY and size are later used to transform coords into integers for z-order calculation
            size = Math.max(maxX - minX, maxY - minY);
        }

        earcutLinked(outerNode, triangles, dim, minX, minY, size);

        return triangles;
    }

    // create a circular doubly linked list from polygon points in the specified winding order
    function linkedList(data, start, end, dim, clockwise) {
        var i, last;

        if (clockwise === (signedArea(data, start, end, dim) > 0)) {
            for (i = start; i < end; i += dim) last = insertNode(i, data[i], data[i + 1], last);
        } else {
            for (i = end - dim; i >= start; i -= dim) last = insertNode(i, data[i], data[i + 1], last);
        }

        if (last && equals(last, last.next)) {
            removeNode(last);
            last = last.next;
        }

        return last;
    }

    // eliminate colinear or duplicate points
    function filterPoints(start, end) {
        if (!start) return start;
        if (!end) end = start;

        var p = start,
            again;
        do {
            again = false;

            if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
                removeNode(p);
                p = end = p.prev;
                if (p === p.next) return null;
                again = true;

            } else {
                p = p.next;
            }
        } while (again || p !== end);

        return end;
    }

    // main ear slicing loop which triangulates a polygon (given as a linked list)
    function earcutLinked(ear, triangles, dim, minX, minY, size, pass) {
        if (!ear) return;

        // interlink polygon nodes in z-order
        if (!pass && size) indexCurve(ear, minX, minY, size);

        var stop = ear,
            prev, next;

        // iterate through ears, slicing them one by one
        while (ear.prev !== ear.next) {
            prev = ear.prev;
            next = ear.next;

            if (size ? isEarHashed(ear, minX, minY, size) : isEar(ear)) {
                // cut off the triangle
                triangles.push(prev.i / dim);
                triangles.push(ear.i / dim);
                triangles.push(next.i / dim);

                removeNode(ear);

                // skipping the next vertice leads to less sliver triangles
                ear = next.next;
                stop = next.next;

                continue;
            }

            ear = next;

            // if we looped through the whole remaining polygon and can't find any more ears
            if (ear === stop) {
                // try filtering points and slicing again
                if (!pass) {
                    earcutLinked(filterPoints(ear), triangles, dim, minX, minY, size, 1);

                // if this didn't work, try curing all small self-intersections locally
                } else if (pass === 1) {
                    ear = cureLocalIntersections(ear, triangles, dim);
                    earcutLinked(ear, triangles, dim, minX, minY, size, 2);

                // as a last resort, try splitting the remaining polygon into two
                } else if (pass === 2) {
                    splitEarcut(ear, triangles, dim, minX, minY, size);
                }

                break;
            }
        }
    }

    // check whether a polygon node forms a valid ear with adjacent nodes
    function isEar(ear) {
        var a = ear.prev,
            b = ear,
            c = ear.next;

        if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

        // now make sure we don't have other points inside the potential ear
        var p = ear.next.next;

        while (p !== ear.prev) {
            if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
                area(p.prev, p, p.next) >= 0) return false;
            p = p.next;
        }

        return true;
    }

    function isEarHashed(ear, minX, minY, size) {
        var a = ear.prev,
            b = ear,
            c = ear.next;

        if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

        // triangle bbox; min & max are calculated like this for speed
        var minTX = a.x < b.x ? (a.x < c.x ? a.x : c.x) : (b.x < c.x ? b.x : c.x),
            minTY = a.y < b.y ? (a.y < c.y ? a.y : c.y) : (b.y < c.y ? b.y : c.y),
            maxTX = a.x > b.x ? (a.x > c.x ? a.x : c.x) : (b.x > c.x ? b.x : c.x),
            maxTY = a.y > b.y ? (a.y > c.y ? a.y : c.y) : (b.y > c.y ? b.y : c.y);

        // z-order range for the current triangle bbox;
        var minZ = zOrder(minTX, minTY, minX, minY, size),
            maxZ = zOrder(maxTX, maxTY, minX, minY, size);

        // first look for points inside the triangle in increasing z-order
        var p = ear.nextZ;

        while (p && p.z <= maxZ) {
            if (p !== ear.prev && p !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
                area(p.prev, p, p.next) >= 0) return false;
            p = p.nextZ;
        }

        // then look for points in decreasing z-order
        p = ear.prevZ;

        while (p && p.z >= minZ) {
            if (p !== ear.prev && p !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
                area(p.prev, p, p.next) >= 0) return false;
            p = p.prevZ;
        }

        return true;
    }

    // go through all polygon nodes and cure small local self-intersections
    function cureLocalIntersections(start, triangles, dim) {
        var p = start;
        do {
            var a = p.prev,
                b = p.next.next;

            if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {

                triangles.push(a.i / dim);
                triangles.push(p.i / dim);
                triangles.push(b.i / dim);

                // remove two nodes involved
                removeNode(p);
                removeNode(p.next);

                p = start = b;
            }
            p = p.next;
        } while (p !== start);

        return p;
    }

    // try splitting polygon into two and triangulate them independently
    function splitEarcut(start, triangles, dim, minX, minY, size) {
        // look for a valid diagonal that divides the polygon into two
        var a = start;
        do {
            var b = a.next.next;
            while (b !== a.prev) {
                if (a.i !== b.i && isValidDiagonal(a, b)) {
                    // split the polygon in two by the diagonal
                    var c = splitPolygon(a, b);

                    // filter colinear points around the cuts
                    a = filterPoints(a, a.next);
                    c = filterPoints(c, c.next);

                    // run earcut on each half
                    earcutLinked(a, triangles, dim, minX, minY, size);
                    earcutLinked(c, triangles, dim, minX, minY, size);
                    return;
                }
                b = b.next;
            }
            a = a.next;
        } while (a !== start);
    }

    // link every hole into the outer loop, producing a single-ring polygon without holes
    function eliminateHoles(data, holeIndices, outerNode, dim) {
        var queue = [],
            i, len, start, end, list;

        for (i = 0, len = holeIndices.length; i < len; i++) {
            start = holeIndices[i] * dim;
            end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
            list = linkedList(data, start, end, dim, false);
            if (list === list.next) list.steiner = true;
            queue.push(getLeftmost(list));
        }

        queue.sort(compareX);

        // process holes from left to right
        for (i = 0; i < queue.length; i++) {
            eliminateHole(queue[i], outerNode);
            outerNode = filterPoints(outerNode, outerNode.next);
        }

        return outerNode;
    }

    function compareX(a, b) {
        return a.x - b.x;
    }

    // find a bridge between vertices that connects hole with an outer ring and and link it
    function eliminateHole(hole, outerNode) {
        outerNode = findHoleBridge(hole, outerNode);
        if (outerNode) {
            var b = splitPolygon(outerNode, hole);
            filterPoints(b, b.next);
        }
    }

    // David Eberly's algorithm for finding a bridge between hole and outer polygon
    function findHoleBridge(hole, outerNode) {
        var p = outerNode,
            hx = hole.x,
            hy = hole.y,
            qx = -Infinity,
            m;

        // find a segment intersected by a ray from the hole's leftmost point to the left;
        // segment's endpoint with lesser x will be potential connection point
        do {
            if (hy <= p.y && hy >= p.next.y) {
                var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
                if (x <= hx && x > qx) {
                    qx = x;
                    if (x === hx) {
                        if (hy === p.y) return p;
                        if (hy === p.next.y) return p.next;
                    }
                    m = p.x < p.next.x ? p : p.next;
                }
            }
            p = p.next;
        } while (p !== outerNode);

        if (!m) return null;

        if (hx === qx) return m.prev; // hole touches outer segment; pick lower endpoint

        // look for points inside the triangle of hole point, segment intersection and endpoint;
        // if there are no points found, we have a valid connection;
        // otherwise choose the point of the minimum angle with the ray as connection point

        var stop = m,
            mx = m.x,
            my = m.y,
            tanMin = Infinity,
            tan;

        p = m.next;

        while (p !== stop) {
            if (hx >= p.x && p.x >= mx &&
                    pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {

                tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

                if ((tan < tanMin || (tan === tanMin && p.x > m.x)) && locallyInside(p, hole)) {
                    m = p;
                    tanMin = tan;
                }
            }

            p = p.next;
        }

        return m;
    }

    // interlink polygon nodes in z-order
    function indexCurve(start, minX, minY, size) {
        var p = start;
        do {
            if (p.z === null) p.z = zOrder(p.x, p.y, minX, minY, size);
            p.prevZ = p.prev;
            p.nextZ = p.next;
            p = p.next;
        } while (p !== start);

        p.prevZ.nextZ = null;
        p.prevZ = null;

        sortLinked(p);
    }

    // Simon Tatham's linked list merge sort algorithm
    // http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
    function sortLinked(list) {
        var i, p, q, e, tail, numMerges, pSize, qSize,
            inSize = 1;

        do {
            p = list;
            list = null;
            tail = null;
            numMerges = 0;

            while (p) {
                numMerges++;
                q = p;
                pSize = 0;
                for (i = 0; i < inSize; i++) {
                    pSize++;
                    q = q.nextZ;
                    if (!q) break;
                }

                qSize = inSize;

                while (pSize > 0 || (qSize > 0 && q)) {

                    if (pSize === 0) {
                        e = q;
                        q = q.nextZ;
                        qSize--;
                    } else if (qSize === 0 || !q) {
                        e = p;
                        p = p.nextZ;
                        pSize--;
                    } else if (p.z <= q.z) {
                        e = p;
                        p = p.nextZ;
                        pSize--;
                    } else {
                        e = q;
                        q = q.nextZ;
                        qSize--;
                    }

                    if (tail) tail.nextZ = e;
                    else list = e;

                    e.prevZ = tail;
                    tail = e;
                }

                p = q;
            }

            tail.nextZ = null;
            inSize *= 2;

        } while (numMerges > 1);

        return list;
    }

    // z-order of a point given coords and size of the data bounding box
    function zOrder(x, y, minX, minY, size) {
        // coords are transformed into non-negative 15-bit integer range
        x = 32767 * (x - minX) / size;
        y = 32767 * (y - minY) / size;

        x = (x | (x << 8)) & 0x00FF00FF;
        x = (x | (x << 4)) & 0x0F0F0F0F;
        x = (x | (x << 2)) & 0x33333333;
        x = (x | (x << 1)) & 0x55555555;

        y = (y | (y << 8)) & 0x00FF00FF;
        y = (y | (y << 4)) & 0x0F0F0F0F;
        y = (y | (y << 2)) & 0x33333333;
        y = (y | (y << 1)) & 0x55555555;

        return x | (y << 1);
    }

    // find the leftmost node of a polygon ring
    function getLeftmost(start) {
        var p = start,
            leftmost = start;
        do {
            if (p.x < leftmost.x) leftmost = p;
            p = p.next;
        } while (p !== start);

        return leftmost;
    }

    // check if a point lies within a convex triangle
    function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
        return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 &&
               (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 &&
               (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
    }

    // check if a diagonal between two polygon nodes is valid (lies in polygon interior)
    function isValidDiagonal(a, b) {
        return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) &&
               locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b);
    }

    // signed area of a triangle
    function area(p, q, r) {
        return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    }

    // check if two points are equal
    function equals(p1, p2) {
        return p1.x === p2.x && p1.y === p2.y;
    }

    // check if two segments intersect
    function intersects(p1, q1, p2, q2) {
        if ((equals(p1, q1) && equals(p2, q2)) ||
            (equals(p1, q2) && equals(p2, q1))) return true;
        return area(p1, q1, p2) > 0 !== area(p1, q1, q2) > 0 &&
               area(p2, q2, p1) > 0 !== area(p2, q2, q1) > 0;
    }

    // check if a polygon diagonal intersects any polygon segments
    function intersectsPolygon(a, b) {
        var p = a;
        do {
            if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
                    intersects(p, p.next, a, b)) return true;
            p = p.next;
        } while (p !== a);

        return false;
    }

    // check if a polygon diagonal is locally inside the polygon
    function locallyInside(a, b) {
        return area(a.prev, a, a.next) < 0 ?
            area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 :
            area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
    }

    // check if the middle point of a polygon diagonal is inside the polygon
    function middleInside(a, b) {
        var p = a,
            inside = false,
            px = (a.x + b.x) / 2,
            py = (a.y + b.y) / 2;
        do {
            if (((p.y > py) !== (p.next.y > py)) && (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x))
                inside = !inside;
            p = p.next;
        } while (p !== a);

        return inside;
    }

    // link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
    // if one belongs to the outer ring and another to a hole, it merges it into a single ring
    function splitPolygon(a, b) {
        var a2 = new Node(a.i, a.x, a.y),
            b2 = new Node(b.i, b.x, b.y),
            an = a.next,
            bp = b.prev;

        a.next = b;
        b.prev = a;

        a2.next = an;
        an.prev = a2;

        b2.next = a2;
        a2.prev = b2;

        bp.next = b2;
        b2.prev = bp;

        return b2;
    }

    // create a node and optionally link it with previous one (in a circular doubly linked list)
    function insertNode(i, x, y, last) {
        var p = new Node(i, x, y);

        if (!last) {
            p.prev = p;
            p.next = p;

        } else {
            p.next = last.next;
            p.prev = last;
            last.next.prev = p;
            last.next = p;
        }
        return p;
    }

    function removeNode(p) {
        p.next.prev = p.prev;
        p.prev.next = p.next;

        if (p.prevZ) p.prevZ.nextZ = p.nextZ;
        if (p.nextZ) p.nextZ.prevZ = p.prevZ;
    }

    function Node(i, x, y) {
        // vertice index in coordinates array
        this.i = i;

        // vertex coordinates
        this.x = x;
        this.y = y;

        // previous and next vertice nodes in a polygon ring
        this.prev = null;
        this.next = null;

        // z-order curve value
        this.z = null;

        // previous and next nodes in z-order
        this.prevZ = null;
        this.nextZ = null;

        // indicates whether this is a steiner point
        this.steiner = false;
    }

    // return a percentage difference between the polygon area and its triangulation area;
    // used to verify correctness of triangulation
    earcut.deviation = function (data, holeIndices, dim, triangles) {
        var hasHoles = holeIndices && holeIndices.length;
        var outerLen = hasHoles ? holeIndices[0] * dim : data.length;

        var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
        if (hasHoles) {
            for (var i = 0, len = holeIndices.length; i < len; i++) {
                var start = holeIndices[i] * dim;
                var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
                polygonArea -= Math.abs(signedArea(data, start, end, dim));
            }
        }

        var trianglesArea = 0;
        for (i = 0; i < triangles.length; i += 3) {
            var a = triangles[i] * dim;
            var b = triangles[i + 1] * dim;
            var c = triangles[i + 2] * dim;
            trianglesArea += Math.abs(
                (data[a] - data[c]) * (data[b + 1] - data[a + 1]) -
                (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
        }

        return polygonArea === 0 && trianglesArea === 0 ? 0 :
            Math.abs((trianglesArea - polygonArea) / polygonArea);
    };

    function signedArea(data, start, end, dim) {
        var sum = 0;
        for (var i = start, j = end - dim; i < end; i += dim) {
            sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
            j = i;
        }
        return sum;
    }

    // turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
    earcut.flatten = function (data) {
        var dim = data[0][0].length,
            result = {vertices: [], holes: [], dimensions: dim},
            holeIndex = 0;

        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].length; j++) {
                for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
            }
            if (i > 0) {
                holeIndex += data[i - 1].length;
                result.holes.push(holeIndex);
            }
        }
        return result;
    };

    var vs_s = [
        'attribute vec4 a_Position;',
        'void main() {',
        'gl_Position = a_Position;',
        'gl_PointSize = 30.0;',
        '}'
    ].join('');

    var fs_s = [
        'precision mediump float;',
        'uniform vec4 u_FragColor;',
        'void main() {',
        'gl_FragColor = u_FragColor;',
        '}'
    ].join('');

    function draw(gl, data, options) {

        if (!data) {
            return;
        }

        // gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        var program = initShaders(gl, vs_s, fs_s);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

        var halfCanvasWidth = gl.canvas.width / 2;
        var halfCanvasHeight = gl.canvas.height / 2;

        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());

        var a_Position = gl.getAttribLocation(program, 'a_Position');
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);

        var uFragColor = gl.getUniformLocation(program, 'u_FragColor');

        var colored = getColorData(options.fillStyle || 'red');

        gl.uniform4f(uFragColor,
            colored[0] / 255,
            colored[1] / 255,
            colored[2] / 255,
            colored[3] / 255);

        gl.lineWidth(options.lineWidth || 1);

        var verticesArr = [];
        var trianglesArr = [];

        var maxSize = 65536;
        var indexOffset = 0;

        for (var i = 0, len = data.length; i < len; i++) {

            var flatten = earcut.flatten(data[i].geometry._coordinates || data[i].geometry.coordinates);
            var vertices = flatten.vertices;
            indexOffset = verticesArr.length / 2;
            for (var j = 0; j < vertices.length; j += 2) {
                vertices[j] = (vertices[j] - halfCanvasWidth) / halfCanvasWidth;
                vertices[j + 1] = (halfCanvasHeight - vertices[j + 1]) / halfCanvasHeight;
            }

            if ((verticesArr.length + vertices.length) / 2 > maxSize) {
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesArr), gl.STATIC_DRAW);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(trianglesArr), gl.STATIC_DRAW);
                gl.drawElements(gl.TRIANGLES, trianglesArr.length, gl.UNSIGNED_SHORT, 0);
                verticesArr.length = 0;
                trianglesArr.length = 0;
                indexOffset = 0;
            }

            for (var j = 0; j < vertices.length; j++) {
                verticesArr.push(vertices[j]);
            }

            var triangles = earcut(vertices, flatten.holes, flatten.dimensions);
            for (var j = 0; j < triangles.length; j++) {
                trianglesArr.push(triangles[j] + indexOffset);
            }
        }

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesArr), gl.STATIC_DRAW);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(trianglesArr), gl.STATIC_DRAW);
        gl.drawElements(gl.TRIANGLES, trianglesArr.length, gl.UNSIGNED_SHORT, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    }
    var polygon = {
        draw: draw
    };

    /**
     * @author kyle / http://nikai.us/
     */

    var webglDrawSimple = {
        draw: function(gl, dataSet, options) {
            var data = dataSet instanceof DataSet$1 ? dataSet.get() : dataSet;
            if (data.length > 0) {
                if (data[0].geometry.type == "LineString") {
                    line.draw(gl, data, options);
                } else if (data[0].geometry.type == "Polygon" || data[0].geometry.type == "MultiPolygon") {
                    polygon.draw(gl, data, options);
                } else {
                    point.draw(gl, data, options);
                }
            }
        }
    };

    /**
     * 曲线生成工具
     * 根据弧线的坐标节点数组生成曲线点
     */
    /**
     * 根据两点获取曲线坐标点数组
     * @param {Point} obj1 - 起点
     * @param {Point} obj2 - 终点
     * @param {number} count - 曲线线段数量，默认为40
     * @returns {CurvePoint[] | null} - 曲线坐标点数组
     */
    function getCurveByTwoPoints(obj1, obj2, count) {
        if (!obj1 || !obj2) {
            return null;
        }
        // 贝塞尔曲线的三个基函数
        var B1 = function (x) {
            return 1 - 2 * x + x * x;
        };
        var B2 = function (x) {
            return 2 * x - 2 * x * x;
        };
        var B3 = function (x) {
            return x * x;
        };
        var curveCoordinates = [];
        var pointCount = count || 40; // 曲线由点Count个小线段组成
        var inc = 0;
        var lat1 = parseFloat(obj1.lat.toString());
        var lat2 = parseFloat(obj2.lat.toString());
        var lng1 = parseFloat(obj1.lng.toString());
        var lng2 = parseFloat(obj2.lng.toString());
        // 计算曲线角度
        var adjustedLng1 = lng1;
        var adjustedLng2 = lng2;
        if (adjustedLng2 > adjustedLng1) {
            if (parseFloat((adjustedLng2 - adjustedLng1).toString()) > 180) {
                if (adjustedLng1 < 0) {
                    adjustedLng1 = parseFloat((180 + 180 + adjustedLng1).toString());
                    adjustedLng2 = parseFloat((180 + 180 + adjustedLng2).toString());
                }
            }
        }
        var t;
        var h;
        var h2;
        var lat3;
        var lng3;
        // 纬度相同
        if (lat2 === lat1) {
            t = 0;
            h = adjustedLng1 - adjustedLng2;
        }
        // 经度相同
        else if (adjustedLng2 === adjustedLng1) {
            t = Math.PI / 2;
            h = lat1 - lat2;
        }
        // 其他情况
        else {
            t = Math.atan((lat2 - lat1) / (adjustedLng2 - adjustedLng1));
            h = (lat2 - lat1) / Math.sin(t);
        }
        var t2 = t + (Math.PI / 5);
        h2 = h / 2;
        lng3 = h2 * Math.cos(t2) + adjustedLng1;
        lat3 = h2 * Math.sin(t2) + lat1;
        // 生成曲线点
        for (var i = 0; i < pointCount + 1; i++) {
            var x = adjustedLng1 * B1(inc) + lng3 * B2(inc) + adjustedLng2 * B3(inc);
            var y = lat1 * B1(inc) + lat3 * B2(inc) + lat2 * B3(inc);
            var lng1_src = obj1.lng;
            var lng2_src = obj2.lng;
            curveCoordinates.push([
                (lng1_src < 0 && lng2_src > 0) ? x - 360 : x, y
            ]);
            inc += (1 / pointCount);
        }
        return curveCoordinates;
    }
    /**
     * 根据弧线的坐标节点数组获取曲线点
     * @param {Point[]} points - 坐标节点数组
     * @param {CurveOptions} options - 曲线选项
     * @returns {CurvePoint[]} - 曲线坐标点数组
     */
    function getCurvePoints(points, options) {
        var curvePoints = [];
        for (var i = 0; i < points.length - 1; i++) {
            var p = getCurveByTwoPoints(points[i], points[i + 1], options === null || options === void 0 ? void 0 : options.count);
            if (p && p.length > 0) {
                curvePoints = curvePoints.concat(p);
            }
        }
        return curvePoints;
    }
    // 曲线工具对象
    var curve = {
        getPoints: getCurvePoints
    };

    /* 
    FDEB algorithm implementation [www.win.tue.nl/~dholten/papers/forcebundles_eurovis.pdf].

    Author:  (github.com/upphiminn)
    2013

    */
      
    var ForceEdgeBundling = function(){
        var data_nodes = {},        // {'nodeid':{'x':,'y':},..}
                data_edges = [],        // [{'source':'nodeid1', 'target':'nodeid2'},..]
                compatibility_list_for_edge = [],
                subdivision_points_for_edge = [],
                K = 0.1,                // global bundling constant controling edge stiffness
                S_initial = 0.1,        // init. distance to move points
                P_initial = 1,          // init. subdivision number
                P_rate    = 2,          // subdivision rate increase
                C = 6,                  // number of cycles to perform
                I_initial = 70,         // init. number of iterations for cycle
                I_rate = 0.6666667,     // rate at which iteration number decreases i.e. 2/3
                compatibility_threshold = 0.6,
                eps = 1e-8;
                 

            /*** Geometry Helper Methods ***/
            function vector_dot_product(p, q){
                return p.x * q.x + p.y * q.y;
            }

            function edge_as_vector(P){
                return {'x': data_nodes[P.target].x - data_nodes[P.source].x,
                        'y': data_nodes[P.target].y - data_nodes[P.source].y}
            }

            function edge_length(e){
                return Math.sqrt(Math.pow(data_nodes[e.source].x-data_nodes[e.target].x, 2) +
                                 Math.pow(data_nodes[e.source].y-data_nodes[e.target].y, 2));
            }

            function custom_edge_length(e){
                return Math.sqrt(Math.pow(e.source.x - e.target.x, 2) + Math.pow(e.source.y - e.target.y, 2));
            }

            function edge_midpoint(e){
                var middle_x = (data_nodes[e.source].x + data_nodes[e.target].x) / 2.0;
                var middle_y = (data_nodes[e.source].y + data_nodes[e.target].y) / 2.0;
                return {'x': middle_x, 'y': middle_y};
            }

            function compute_divided_edge_length(e_idx){
                var length = 0;
                for(var i = 1; i < subdivision_points_for_edge[e_idx].length; i++){
                    var segment_length = euclidean_distance(subdivision_points_for_edge[e_idx][i],
                                                            subdivision_points_for_edge[e_idx][i-1]);
                    length += segment_length;
                }
                return length;
            }

            function euclidean_distance(p, q){
                return Math.sqrt(Math.pow(p.x-q.x, 2) + Math.pow(p.y-q.y, 2));
            }

            function project_point_on_line(p, Q)
            {   
                var L = Math.sqrt((Q.target.x - Q.source.x) * (Q.target.x - Q.source.x) + (Q.target.y - Q.source.y) * (Q.target.y - Q.source.y));
                var r = ((Q.source.y - p.y) * (Q.source.y - Q.target.y) - (Q.source.x - p.x) * (Q.target.x - Q.source.x)) / (L * L);
                
                return  {'x':(Q.source.x + r * (Q.target.x - Q.source.x)), 'y':(Q.source.y + r * (Q.target.y - Q.source.y))};
            }

            /*** ********************** ***/

            /*** Initialization Methods ***/
            function initialize_edge_subdivisions()
            {
                for(var i = 0; i < data_edges.length; i++)
                 subdivision_points_for_edge[i] = [];
            }

            function initialize_compatibility_lists()
            {
                for(var i = 0; i < data_edges.length; i++)
                    compatibility_list_for_edge[i] = []; //0 compatible edges.
            }

            function filter_self_loops(edgelist){
                var filtered_edge_list = [];
                for(var e=0; e < edgelist.length; e++){
                    if(data_nodes[edgelist[e].source].x != data_nodes[edgelist[e].target].x  &&
                       data_nodes[edgelist[e].source].y != data_nodes[edgelist[e].target].y ){ //or smaller than eps
                        filtered_edge_list.push(edgelist[e]);

                    }
                }

                return filtered_edge_list;
            }
            /*** ********************** ***/

            /*** Force Calculation Methods ***/
            function apply_spring_force(e_idx, i, kP){

                var prev = subdivision_points_for_edge[e_idx][i-1];
                var next = subdivision_points_for_edge[e_idx][i+1];
                var crnt = subdivision_points_for_edge[e_idx][i];

                var x = prev.x - crnt.x + next.x - crnt.x;
                var y = prev.y - crnt.y + next.y - crnt.y;
                
                x *= kP;
                y *= kP;
                
                return {'x' : x, 'y' : y};
            }

            function apply_electrostatic_force(e_idx, i , S){
                var sum_of_forces         = { 'x' : 0, 'y' : 0};
                var compatible_edges_list = compatibility_list_for_edge[e_idx];
                
                for(var oe = 0; oe < compatible_edges_list.length; oe++){
                    var force = {'x': subdivision_points_for_edge[compatible_edges_list[oe]][i].x - subdivision_points_for_edge[e_idx][i].x,
                                 'y': subdivision_points_for_edge[compatible_edges_list[oe]][i].y - subdivision_points_for_edge[e_idx][i].y};

                    
                    if((Math.abs(force.x) > eps)||(Math.abs(force.y) > eps)){
                    
                    var diff = ( 1 / Math.pow(custom_edge_length({'source':subdivision_points_for_edge[compatible_edges_list[oe]][i],
                                                                  'target':subdivision_points_for_edge[e_idx][i]}),1));
                    
                    sum_of_forces.x += force.x*diff;
                    sum_of_forces.y += force.y*diff;
                    }
                } 
                return sum_of_forces;
            }


            function apply_resulting_forces_on_subdivision_points(e_idx, P, S){
                var kP = K/(edge_length(data_edges[e_idx])*(P+1)); // kP=K/|P|(number of segments), where |P| is the initial length of edge P.
                            // (length * (num of sub division pts - 1))
                var resulting_forces_for_subdivision_points = [{'x':0, 'y':0}];
                for(var i = 1; i < P+1; i++){ // exclude initial end points of the edge 0 and P+1
                    var resulting_force     = {'x' : 0, 'y' : 0};
                    
                    var spring_force            = apply_spring_force(e_idx, i , kP);
                    var electrostatic_force     = apply_electrostatic_force(e_idx, i);
                    
                    resulting_force.x   = S*(spring_force.x + electrostatic_force.x);
                    resulting_force.y   = S*(spring_force.y + electrostatic_force.y);

                    resulting_forces_for_subdivision_points.push(resulting_force);
                }
                resulting_forces_for_subdivision_points.push({'x':0, 'y':0});
                return resulting_forces_for_subdivision_points;
            }
            /*** ********************** ***/

            /*** Edge Division Calculation Methods ***/
            function update_edge_divisions(P){
                for(var e_idx=0; e_idx < data_edges.length; e_idx++){

                    if( P == 1 ){
                        subdivision_points_for_edge[e_idx].push(data_nodes[data_edges[e_idx].source]); // source
                        subdivision_points_for_edge[e_idx].push(edge_midpoint(data_edges[e_idx])); // mid point
                        subdivision_points_for_edge[e_idx].push(data_nodes[data_edges[e_idx].target]); // target
                    }else {

                        var divided_edge_length = compute_divided_edge_length(e_idx);
                        var segment_length      = divided_edge_length / (P+1);
                        var current_segment_length = segment_length;
                        var new_subdivision_points = [];
                        new_subdivision_points.push(data_nodes[data_edges[e_idx].source]); //source

                        for(var i = 1; i < subdivision_points_for_edge[e_idx].length; i++){
                            var old_segment_length = euclidean_distance(subdivision_points_for_edge[e_idx][i], subdivision_points_for_edge[e_idx][i-1]);

                            while(old_segment_length > current_segment_length){
                                var percent_position = current_segment_length / old_segment_length;
                                var new_subdivision_point_x = subdivision_points_for_edge[e_idx][i-1].x;
                                var new_subdivision_point_y = subdivision_points_for_edge[e_idx][i-1].y;

                                new_subdivision_point_x += percent_position*(subdivision_points_for_edge[e_idx][i].x - subdivision_points_for_edge[e_idx][i-1].x);
                                new_subdivision_point_y += percent_position*(subdivision_points_for_edge[e_idx][i].y - subdivision_points_for_edge[e_idx][i-1].y);
                                new_subdivision_points.push( {'x':new_subdivision_point_x, 
                                                              'y':new_subdivision_point_y });
                                
                                old_segment_length     -= current_segment_length;
                                current_segment_length  = segment_length;
                            }
                            current_segment_length -= old_segment_length;
                        }
                        new_subdivision_points.push(data_nodes[data_edges[e_idx].target]); //target
                        subdivision_points_for_edge[e_idx] = new_subdivision_points;
                    }
                }
            }
            /*** ********************** ***/

            /*** Edge compatibility measures ***/
            function angle_compatibility(P, Q){
                var result = Math.abs(vector_dot_product(edge_as_vector(P),edge_as_vector(Q))/(edge_length(P)*edge_length(Q)));
                return result;
            }

            function scale_compatibility(P, Q){
                var lavg = (edge_length(P) + edge_length(Q))/2.0;
                var result = 2.0/(lavg/Math.min(edge_length(P),edge_length(Q)) + Math.max(edge_length(P), edge_length(Q))/lavg);
                return result;
            }

            function position_compatibility(P, Q){
                var lavg = (edge_length(P) + edge_length(Q))/2.0;
                var midP = {'x':(data_nodes[P.source].x + data_nodes[P.target].x)/2.0,
                            'y':(data_nodes[P.source].y + data_nodes[P.target].y)/2.0};
                var midQ = {'x':(data_nodes[Q.source].x + data_nodes[Q.target].x)/2.0,
                            'y':(data_nodes[Q.source].y + data_nodes[Q.target].y)/2.0};
                var result = lavg/(lavg + euclidean_distance(midP, midQ));
                return result;
            }

            function edge_visibility(P, Q){
                var I0 = project_point_on_line(data_nodes[Q.source], {'source':data_nodes[P.source],
                                                                      'target':data_nodes[P.target]});
                var I1 = project_point_on_line(data_nodes[Q.target], {'source':data_nodes[P.source], 
                                                                      'target':data_nodes[P.target]}); //send acutal edge points positions
                var midI = {'x':(I0.x + I1.x)/2.0, 
                            'y':(I0.y + I1.y)/2.0};
                var midP = {'x':(data_nodes[P.source].x + data_nodes[P.target].x)/2.0, 
                            'y':(data_nodes[P.source].y + data_nodes[P.target].y)/2.0};
                var result = Math.max(0, 1 - 2 * euclidean_distance(midP,midI)/euclidean_distance(I0,I1));
                return result;
            }

            function visibility_compatibility(P, Q){
                return Math.min(edge_visibility(P,Q), edge_visibility(Q,P));
            }

            function compatibility_score(P, Q){
                var result = (angle_compatibility(P,Q) * scale_compatibility(P,Q) * 
                              position_compatibility(P,Q) * visibility_compatibility(P,Q));

                return result;
            }

            function are_compatible(P, Q){
                // console.log('compatibility ' + P.source +' - '+ P.target + ' and ' + Q.source +' '+ Q.target);
                return (compatibility_score(P,Q) >= compatibility_threshold);
            }

            function compute_compatibility_lists()
            {
                for(var e = 0; e < data_edges.length - 1; e++){
                    for( var oe = e + 1 ; oe < data_edges.length; oe++){ // don't want any duplicates
                        if(e == oe)
                            continue;
                        else {
                            if(are_compatible(data_edges[e],data_edges[oe])){
                                compatibility_list_for_edge[e].push(oe);
                                compatibility_list_for_edge[oe].push(e);
                            }
                        }
                    }
                }
            }

            /*** ************************ ***/

            /*** Main Bundling Loop Methods ***/ 
            var forcebundle = function(){
                var S = S_initial;
                var I = I_initial;
                var P = P_initial;
                
                initialize_edge_subdivisions();
                initialize_compatibility_lists();
                update_edge_divisions(P);
                compute_compatibility_lists();
                for(var cycle=0; cycle < C; cycle++){
                    for (var iteration = 0; iteration < I; iteration++){
                        var forces = [];
                        for(var edge = 0; edge < data_edges.length; edge++){
                            forces[edge] = apply_resulting_forces_on_subdivision_points(edge, P, S);
                        }
                        for(var e = 0; e < data_edges.length; e++){
                            for(var i=0; i < P + 1;i++){
                                subdivision_points_for_edge[e][i].x += forces[e][i].x;
                                subdivision_points_for_edge[e][i].y += forces[e][i].y;
                            }
                        }
                    }
                    //prepare for next cycle
                    S = S / 2;
                    P = P * 2;
                    I = I_rate * I;
                    
                    update_edge_divisions(P);
                    // console.log('C' + cycle);
                    // console.log('P' + P);
                    // console.log('S' + S);
                }
                return subdivision_points_for_edge;
            };
            /*** ************************ ***/


            /*** Getters/Setters Methods ***/ 
            forcebundle.nodes = function(nl){
                if(arguments.length == 0){
                    return data_nodes;
                }
                else {
                    data_nodes = nl;
                }
                return forcebundle;
            };

            forcebundle.edges = function(ll){
                if(arguments.length == 0){
                    return data_edges;
                }
                else {
                    data_edges = filter_self_loops(ll); //remove edges to from to the same point
                }
                return forcebundle;
            };

            forcebundle.bundling_stiffness = function(k){
                if(arguments.length == 0){
                    return K;
                }
                else {
                    K = k;
                }
                return forcebundle;
            };

            forcebundle.step_size = function(step){
                if(arguments.length == 0){
                    return S_initial;
                }
                else {
                    S_initial = step;
                }
                return forcebundle;
            };

            forcebundle.cycles = function(c){
                if(arguments.length == 0){
                    return C;
                }
                else {
                    C = c;
                }
                return forcebundle;
            };

            forcebundle.iterations = function(i){
                if(arguments.length == 0){
                    return I_initial;
                }
                else {
                    I_initial = i;
                }
                return forcebundle;
            };

            forcebundle.iterations_rate = function(i){
                if(arguments.length == 0){
                    return I_rate;
                }
                else {
                    I_rate = i;
                }
                return forcebundle;
            };

            forcebundle.subdivision_points_seed = function(p){
                if(arguments.length == 0){
                    return P;
                }
                else {
                    P = p;
                }
                return forcebundle;
            };

            forcebundle.subdivision_rate = function(r){
                if(arguments.length == 0){
                    return P_rate;
                }
                else {
                    P_rate = r;
                }
                return forcebundle;
            };

            forcebundle.compatbility_threshold = function(t){
                if(arguments.length == 0){
                    return compatbility_threshold;
                }
                else {
                    compatibility_threshold = t;
                }
                return forcebundle;
            };

            /*** ************************ ***/

        return forcebundle;
    };

    /**
     * 分类映射工具
     * @author kyle / http://nikai.us/
     */
    /**
     * 分类映射类，用于处理分类数据
     */
    var Category = /** @class */ (function () {
        /**
         * 构造函数
         * @param {SplitList} splitList - 分类规则
         */
        function Category(splitList) {
            if (splitList === void 0) { splitList = { other: 1 }; }
            this.splitList = splitList;
        }
        /**
         * 根据值获取分类结果
         * @param {any} count - 输入值
         * @returns {any} - 分类结果
         */
        Category.prototype.get = function (count) {
            var splitList = this.splitList;
            var value = splitList['other'];
            for (var i in splitList) {
                if (count == i) {
                    value = splitList[i];
                    break;
                }
            }
            return value;
        };
        /**
         * 根据DataSet自动生成对应的splitList
         * @param {DataSet} dataSet - 数据集
         * @param {string[]} [color] - 颜色数组
         */
        Category.prototype.generateByDataSet = function (dataSet, color) {
            var colors = color || [
                'rgba(255, 255, 0, 0.8)',
                'rgba(253, 98, 104, 0.8)',
                'rgba(255, 146, 149, 0.8)',
                'rgba(255, 241, 193, 0.8)',
                'rgba(110, 176, 253, 0.8)',
                'rgba(52, 139, 251, 0.8)',
                'rgba(17, 102, 252, 0.8)'
            ];
            var data = dataSet.get();
            this.splitList = {};
            var count = 0;
            for (var i = 0; i < data.length; i++) {
                var dataCount = data[i].count;
                if (this.splitList[dataCount] === undefined) {
                    this.splitList[dataCount] = colors[count];
                    count++;
                }
                if (count >= colors.length - 1) {
                    break;
                }
            }
            this.splitList['other'] = colors[colors.length - 1];
        };
        /**
         * 根据唯一值自动生成splitList
         * @param {DataSet} dataSet - 数据集
         * @param {string} columnName - 列名
         * @param {string[]} [colors] - 颜色数组
         */
        Category.prototype.generateByUniqueValues = function (dataSet, columnName, colors) {
            // 注意：这里假设DataSet有getUnique方法，需要确保DataSet类中有这个方法
            var uniqueValues = dataSet.getUnique(columnName);
            var colorArray = colors || this.getDefaultColors();
            this.splitList = {};
            for (var i = 0; i < uniqueValues.length; i++) {
                this.splitList[uniqueValues[i]] = colorArray[i % colorArray.length];
            }
            this.splitList['other'] = colorArray[colorArray.length - 1];
        };
        /**
         * 获取默认颜色列表
         * @returns {string[]} - 默认颜色列表
         */
        Category.prototype.getDefaultColors = function () {
            return [
                'rgba(255, 255, 0, 0.8)',
                'rgba(253, 98, 104, 0.8)',
                'rgba(255, 146, 149, 0.8)',
                'rgba(255, 241, 193, 0.8)',
                'rgba(110, 176, 253, 0.8)',
                'rgba(52, 139, 251, 0.8)',
                'rgba(17, 102, 252, 0.8)',
                'rgba(0, 176, 104, 0.8)',
                'rgba(128, 128, 128, 0.8)',
                'rgba(255, 0, 255, 0.8)'
            ];
        };
        /**
         * 添加新的分类规则
         * @param {string} key - 分类键
         * @param {any} value - 分类值
         */
        Category.prototype.addCategory = function (key, value) {
            this.splitList[key] = value;
        };
        /**
         * 移除分类规则
         * @param {string} key - 分类键
         */
        Category.prototype.removeCategory = function (key) {
            delete this.splitList[key];
        };
        /**
         * 更新分类规则
         * @param {string} key - 分类键
         * @param {any} value - 分类值
         * @returns {boolean} - 是否更新成功
         */
        Category.prototype.updateCategory = function (key, value) {
            if (this.splitList[key] !== undefined) {
                this.splitList[key] = value;
                return true;
            }
            return false;
        };
        /**
         * 获取所有分类规则
         * @returns {SplitList} - 分类规则
         */
        Category.prototype.getCategories = function () {
            return this.splitList;
        };
        /**
         * 获取图例
         * @param {LegendOptions} options - 图例选项
         * @returns {HTMLDivElement} - 图例元素
         */
        Category.prototype.getLegend = function (options) {
            var splitList = this.splitList;
            var container = document.createElement('div');
            container.style.cssText = "background:#fff; padding: 5px; border: 1px solid #ccc;";
            var html = '';
            for (var key in splitList) {
                html += "<div style=\"line-height: 19px;\" value=\"".concat(key, "\"><span style=\"vertical-align: -2px; display: inline-block; width: 30px;height: 19px;background:").concat(splitList[key], ";\"></span><span style=\"margin-left: 3px;\">").concat(key, "<span></div>");
            }
            container.innerHTML = html;
            return container;
        };
        return Category;
    }());

    /**
     * 区间映射工具
     * @author kyle / http://nikai.us/
     */
    /**
     * 区间映射类，用于处理区间数据
     */
    var Choropleth = /** @class */ (function () {
        /**
         * 构造函数
         * @param {RangeRule[]} splitList - 区间规则
         */
        function Choropleth(splitList) {
            if (splitList === void 0) { splitList = [{ start: 0, value: 'red' }]; }
            this.splitList = splitList;
        }
        /**
         * 根据值获取区间结果
         * @param {number} count - 输入值
         * @returns {any} - 区间结果
         */
        Choropleth.prototype.get = function (count) {
            var splitList = this.splitList;
            var value = false;
            for (var i = 0; i < splitList.length; i++) {
                var rule = splitList[i];
                var startCondition = rule.start === undefined || count >= rule.start;
                var endCondition = rule.end === undefined || count < rule.end;
                if (startCondition && endCondition) {
                    value = rule.value;
                    break;
                }
            }
            return value;
        };
        /**
         * 根据DataSet自动生成对应的区间规则
         * @param {DataSet} dataSet - 数据集
         */
        Choropleth.prototype.generateByDataSet = function (dataSet) {
            var min = dataSet.getMin('count') || 0;
            var max = dataSet.getMax('count') || 100;
            this.generateByMinMax(min, max);
        };
        /**
         * 根据最小值和最大值生成区间规则
         * @param {number} min - 最小值
         * @param {number} max - 最大值
         */
        Choropleth.prototype.generateByMinMax = function (min, max) {
            var colors = [
                'rgba(255, 255, 0, 0.8)',
                'rgba(253, 98, 104, 0.8)',
                'rgba(255, 146, 149, 0.8)',
                'rgba(255, 241, 193, 0.8)',
                'rgba(110, 176, 253, 0.8)',
                'rgba(52, 139, 251, 0.8)',
                'rgba(17, 102, 252, 0.8)'
            ];
            var splitNum = Number((max - min) / 7);
            var maxNum = Number(max);
            var index = Number(min);
            this.splitList = [];
            var count = 0;
            while (index < maxNum) {
                this.splitList.push({
                    start: index,
                    end: index + splitNum,
                    value: colors[count]
                });
                count++;
                index += splitNum;
            }
        };
        /**
         * 根据自定义区间生成区间规则
         * @param {CustomRange[]} ranges - 自定义区间
         * @param {string[]} [colors] - 颜色数组
         */
        Choropleth.prototype.generateByCustomRange = function (ranges, colors) {
            var colorArray = colors || this.getDefaultColors();
            this.splitList = [];
            for (var i = 0; i < ranges.length; i++) {
                this.splitList.push({
                    start: ranges[i].start,
                    end: ranges[i].end,
                    value: colorArray[i % colorArray.length]
                });
            }
        };
        /**
         * 获取默认颜色列表
         * @returns {string[]} - 默认颜色列表
         */
        Choropleth.prototype.getDefaultColors = function () {
            return [
                'rgba(255, 255, 0, 0.8)',
                'rgba(253, 98, 104, 0.8)',
                'rgba(255, 146, 149, 0.8)',
                'rgba(255, 241, 193, 0.8)',
                'rgba(110, 176, 253, 0.8)',
                'rgba(52, 139, 251, 0.8)',
                'rgba(17, 102, 252, 0.8)',
                'rgba(0, 176, 104, 0.8)',
                'rgba(128, 128, 128, 0.8)',
                'rgba(255, 0, 255, 0.8)'
            ];
        };
        /**
         * 添加新的区间规则
         * @param {RangeRule} range - 区间规则
         */
        Choropleth.prototype.addRange = function (range) {
            this.splitList.push(range);
            // 重新排序以确保区间顺序正确
            this.splitList.sort(function (a, b) { return (a.start || 0) - (b.start || 0); });
        };
        /**
         * 移除区间规则
         * @param {number} index - 区间规则索引
         */
        Choropleth.prototype.removeRange = function (index) {
            if (index >= 0 && index < this.splitList.length) {
                this.splitList.splice(index, 1);
            }
        };
        /**
         * 更新区间规则
         * @param {number} index - 区间规则索引
         * @param {RangeRule} range - 新的区间规则
         * @returns {boolean} - 是否更新成功
         */
        Choropleth.prototype.updateRange = function (index, range) {
            if (index >= 0 && index < this.splitList.length) {
                this.splitList[index] = range;
                // 重新排序以确保区间顺序正确
                this.splitList.sort(function (a, b) { return (a.start || 0) - (b.start || 0); });
                return true;
            }
            return false;
        };
        /**
         * 获取所有区间规则
         * @returns {RangeRule[]} - 区间规则
         */
        Choropleth.prototype.getRanges = function () {
            return this.splitList;
        };
        /**
         * 获取图例
         * @param {LegendOptions} options - 图例选项
         * @returns {HTMLDivElement} - 图例元素
         */
        Choropleth.prototype.getLegend = function (options) {
            var splitList = this.splitList;
            var container = document.createElement('div');
            container.style.cssText = "background:#fff; padding: 5px; border: 1px solid #ccc;";
            var html = '';
            for (var i = 0; i < splitList.length; i++) {
                var range = splitList[i];
                var label = '';
                if (range.start !== undefined && range.end !== undefined) {
                    label = "".concat(range.start, " - ").concat(range.end);
                }
                else if (range.start !== undefined) {
                    label = "> ".concat(range.start);
                }
                else if (range.end !== undefined) {
                    label = "< ".concat(range.end);
                }
                else {
                    label = 'All';
                }
                html += "<div style=\"line-height: 19px;\"><span style=\"vertical-align: -2px; display: inline-block; width: 30px;height: 19px;background:".concat(range.value, ";\"></span><span style=\"margin-left: 3px;\">").concat(label, "<span></div>");
            }
            container.innerHTML = html;
            return container;
        };
        return Choropleth;
    }());

    /**
     * @author Mofei<http://www.zhuwenlong.com>
     */

    class MapHelper {
        constructor(id, type, opt) {
            if (!id || !type) {
                console.warn('id 和 type 为必填项');
                return false;
            }


            if (type == 'baidu') {
                if (!BMap) {
                    console.warn('请先引入百度地图JS API');
                    return false;
                }
            } else {
                console.warn('暂不支持你的地图类型');
            }
            this.type = type;
            var center = (opt && opt.center) ? opt.center : [106.962497, 38.208726];
            var zoom = (opt && opt.zoom) ? opt.zoom : 5;
            var map = this.map = new BMap.Map(id, {
                enableMapClick: false
            });
            map.centerAndZoom(new BMap.Point(center[0], center[1]), zoom);
            map.enableScrollWheelZoom(true);

            map.setMapStyle({
                style: 'light'
            });
        }

        addLayer(datas, options) {
            if (this.type == 'baidu') {
                return new mapv.baiduMapLayer(this.map, dataSet, options);
            }
        }

        getMap() {
            return this.map;
        }
    }

    /**
     * 一直覆盖在当前地图视野的Canvas对象
     *
     * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
     *
     * @param 
     * {
     *     map 地图实例对象
     * }
     */

    function CanvasLayer$1(options) {
        this.options = options || {};
        this.paneName = this.options.paneName || 'mapPane';
        this.context = this.options.context  || '2d';
        this.zIndex = this.options.zIndex || 0;
        this.mixBlendMode = this.options.mixBlendMode || null;
        this.enableMassClear = this.options.enableMassClear;
        this._map = options.map;
        this._lastDrawTime = null;
        this.show();
    }

    var global$3 = typeof window === 'undefined' ? {} : window;
    var BMap$3 = global$3.BMap || global$3.BMapGL;
    if (BMap$3) {

        CanvasLayer$1.prototype = new BMap$3.Overlay();

        CanvasLayer$1.prototype.initialize = function(map) {
            this._map = map;
            var canvas = this.canvas = document.createElement("canvas");
            canvas.style.cssText = "position:absolute;" + "left:0;" + "top:0;" + "z-index:" + this.zIndex + ";user-select:none;";
            canvas.style.mixBlendMode = this.mixBlendMode;
            this.adjustSize();
            var pane = map.getPanes()[this.paneName];
            if (!pane) {
                pane = map.getPanes().floatShadow;
            }
            pane.appendChild(canvas);
            var that = this;
            map.addEventListener('resize', function() {
                that.adjustSize();
                that._draw();
            });
            map.addEventListener('update', function() {
                that._draw();
            });
            /*
            map.addEventListener('moving', function() {
                that._draw();
            });
            */
            if (this.options.updateImmediate) {
                setTimeout(function() {
                    that._draw();
                }, 100);
            }
            return this.canvas;
        };

        CanvasLayer$1.prototype.adjustSize = function() {
            var size = this._map.getSize();
            var canvas = this.canvas;

            var devicePixelRatio = this.devicePixelRatio = global$3.devicePixelRatio || 1;

            canvas.width = size.width * devicePixelRatio;
            canvas.height = size.height * devicePixelRatio;
            if (this.context == '2d') {
                canvas.getContext(this.context).scale(devicePixelRatio, devicePixelRatio);
            }

            canvas.style.width = size.width + "px";
            canvas.style.height = size.height + "px";
        };

        CanvasLayer$1.prototype.draw = function() {
            var self = this;
            if (this.options.updateImmediate) {
                self._draw();
            } else {
                clearTimeout(self.timeoutID);
                self.timeoutID = setTimeout(function() {
                    self._draw();
                }, 15);
            }
        };

        CanvasLayer$1.prototype._draw = function() {
            var map = this._map;
            var size = map.getSize();
            var center = map.getCenter();
            if (center) {
                var pixel = map.pointToOverlayPixel(center);
                this.canvas.style.left = pixel.x - size.width / 2 + 'px';
                this.canvas.style.top = pixel.y - size.height / 2 + 'px';
                this.dispatchEvent('draw');
                this.options.update && this.options.update.call(this);
            }
        };

        CanvasLayer$1.prototype.getContainer = function() {
            return this.canvas;
        };

        CanvasLayer$1.prototype.show = function() {
            if (!this.canvas) {
                this._map.addOverlay(this);
            }
            this.canvas.style.display = "block";
        };

        CanvasLayer$1.prototype.hide = function() {
            this.canvas.style.display = "none";
            //this._map.removeOverlay(this);
        };

        CanvasLayer$1.prototype.setZIndex = function(zIndex) {
            this.zIndex = zIndex;
            this.canvas.style.zIndex = this.zIndex;
        };

        CanvasLayer$1.prototype.getZIndex = function() {
            return this.zIndex;
        };

    }

    /**
     * Tween.js - 基于MIT许可证
     * https://github.com/tweenjs/tween.js
     * ----------------------------------------------
     *
     * 查看 https://github.com/tweenjs/tween.js/graphs/contributors 获取完整贡献者列表。
     * 谢谢大家，你们太棒了！
     */
    // TWEEN主对象实现
    var TWEEN = (function () {
        var _tweens = [];
        return {
            /**
             * 获取所有活动的tween实例
             */
            getAll: function () {
                return _tweens;
            },
            /**
             * 移除所有tween实例
             */
            removeAll: function () {
                _tweens.length = 0;
            },
            /**
             * 添加一个tween实例
             */
            add: function (tween) {
                _tweens.push(tween);
            },
            /**
             * 移除一个tween实例
             */
            remove: function (tween) {
                var i = _tweens.indexOf(tween);
                if (i !== -1) {
                    _tweens.splice(i, 1);
                }
            },
            /**
             * 更新所有tween实例
             */
            update: function (time, preserve) {
                if (_tweens.length === 0) {
                    return false;
                }
                var i = 0;
                time = time !== undefined ? time : TWEEN.now();
                while (i < _tweens.length) {
                    if (_tweens[i].update(time) || preserve) {
                        i++;
                    }
                    else {
                        _tweens.splice(i, 1);
                    }
                }
                return true;
            },
            /**
             * 获取当前时间
             */
            now: function () {
                return 0; // 初始值，后续会被覆盖
            }
        };
    })();
    // Include a performance.now polyfill.
    // In node.js, use process.hrtime.
    if (typeof (window) === 'undefined' && typeof (process) !== 'undefined') {
        TWEEN.now = function () {
            var time = process.hrtime();
            // Convert [seconds, nanoseconds] to milliseconds.
            return time[0] * 1000 + time[1] / 1000000;
        };
    }
    // In a browser, use window.performance.now if it is available.
    else if (typeof (window) !== 'undefined' &&
        window.performance !== undefined &&
        window.performance.now !== undefined) {
        // This must be bound, because directly assigning this function
        // leads to an invocation exception in Chrome.
        TWEEN.now = window.performance.now.bind(window.performance);
    }
    // Use Date.now if it is available.
    else if (Date.now !== undefined) {
        TWEEN.now = Date.now;
    }
    // Otherwise, use 'new Date().getTime()'.
    else {
        TWEEN.now = function () {
            return new Date().getTime();
        };
    }
    /**
     * Tween类实现
     */
    TWEEN.Tween = function (object) {
        var _object = object;
        var _valuesStart = {};
        var _valuesEnd = {};
        var _valuesStartRepeat = {};
        var _duration = 1000;
        var _repeat = 0;
        var _repeatDelayTime;
        var _yoyo = false;
        var _isPlaying = false;
        var _delayTime = 0;
        var _startTime = null;
        var _easingFunction = TWEEN.Easing.Linear.None;
        var _interpolationFunction = TWEEN.Interpolation.Linear;
        var _chainedTweens = [];
        var _onStartCallback = null;
        var _onStartCallbackFired = false;
        var _onUpdateCallback = null;
        var _onCompleteCallback = null;
        var _onStopCallback = null;
        var tween = {
            /**
             * 设置目标属性和持续时间
             */
            to: function (properties, duration) {
                _valuesEnd = properties;
                if (duration !== undefined) {
                    _duration = duration;
                }
                return this;
            },
            /**
             * 开始tween动画
             */
            start: function (time) {
                TWEEN.add(this);
                _isPlaying = true;
                _onStartCallbackFired = false;
                _startTime = time !== undefined ? time : TWEEN.now();
                _startTime += _delayTime;
                for (var property in _valuesEnd) {
                    // Check if an Array was provided as property value
                    if (_valuesEnd[property] instanceof Array) {
                        if (_valuesEnd[property].length === 0) {
                            continue;
                        }
                        // Create a local copy of the Array with the start value at the front
                        _valuesEnd[property] = [_object[property]].concat(_valuesEnd[property]);
                    }
                    // If `to()` specifies a property that doesn't exist in the source object,
                    // we should not set that property in the object
                    if (_object[property] === undefined) {
                        continue;
                    }
                    // Save the starting value.
                    _valuesStart[property] = _object[property];
                    if ((_valuesStart[property] instanceof Array) === false) {
                        _valuesStart[property] = Number(_valuesStart[property]); // Ensures we're using numbers, not strings
                    }
                    _valuesStartRepeat[property] = _valuesStart[property] || 0;
                }
                return this;
            },
            /**
             * 停止tween动画
             */
            stop: function () {
                if (!_isPlaying) {
                    return this;
                }
                TWEEN.remove(this);
                _isPlaying = false;
                if (_onStopCallback !== null) {
                    _onStopCallback.call(_object, _object);
                }
                this.stopChainedTweens();
                return this;
            },
            /**
             * 立即结束tween动画
             */
            end: function () {
                this.update(_startTime + _duration);
                return this;
            },
            /**
             * 停止所有链式tween动画
             */
            stopChainedTweens: function () {
                for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
                    _chainedTweens[i].stop();
                }
                return this;
            },
            /**
             * 设置延迟时间
             */
            delay: function (amount) {
                _delayTime = amount;
                return this;
            },
            /**
             * 设置重复次数
             */
            repeat: function (times) {
                _repeat = times;
                return this;
            },
            /**
             * 设置重复延迟时间
             */
            repeatDelay: function (amount) {
                _repeatDelayTime = amount;
                return this;
            },
            /**
             * 设置是否反向播放
             */
            yoyo: function (yoyo) {
                _yoyo = yoyo;
                return this;
            },
            /**
             * 设置缓动函数
             */
            easing: function (easing) {
                _easingFunction = easing;
                return this;
            },
            /**
             * 设置插值函数
             */
            interpolation: function (interpolation) {
                _interpolationFunction = interpolation;
                return this;
            },
            /**
             * 设置链式tween动画
             */
            chain: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                _chainedTweens.length = 0;
                for (var i = 0, numArgs = args.length; i < numArgs; i++) {
                    _chainedTweens.push(args[i]);
                }
                return this;
            },
            /**
             * 设置开始回调
             */
            onStart: function (callback) {
                _onStartCallback = callback;
                return this;
            },
            /**
             * 设置更新回调
             */
            onUpdate: function (callback) {
                _onUpdateCallback = callback;
                return this;
            },
            /**
             * 设置完成回调
             */
            onComplete: function (callback) {
                _onCompleteCallback = callback;
                return this;
            },
            /**
             * 设置停止回调
             */
            onStop: function (callback) {
                _onStopCallback = callback;
                return this;
            },
            /**
             * 更新tween动画
             */
            update: function (time) {
                var property;
                var elapsed;
                var value;
                if (time < _startTime) {
                    return true;
                }
                if (_onStartCallbackFired === false) {
                    if (_onStartCallback !== null) {
                        _onStartCallback.call(_object, _object);
                    }
                    _onStartCallbackFired = true;
                }
                elapsed = (time - _startTime) / _duration;
                elapsed = elapsed > 1 ? 1 : elapsed;
                value = _easingFunction(elapsed);
                for (property in _valuesEnd) {
                    // Don't update properties that do not exist in the source object
                    if (_valuesStart[property] === undefined) {
                        continue;
                    }
                    var start = _valuesStart[property];
                    var end = _valuesEnd[property];
                    if (end instanceof Array) {
                        _object[property] = _interpolationFunction(end, value);
                    }
                    else {
                        // Parses relative end values with start as base (e.g.: +10, -3)
                        var parsedEnd = void 0;
                        if (typeof end === 'string') {
                            if (end.charAt(0) === '+' || end.charAt(0) === '-') {
                                parsedEnd = start + parseFloat(end);
                            }
                            else {
                                parsedEnd = parseFloat(end);
                            }
                        }
                        else {
                            parsedEnd = end;
                        }
                        // Protect against non numeric properties.
                        if (typeof parsedEnd === 'number') {
                            _object[property] = start + (parsedEnd - start) * value;
                        }
                    }
                }
                if (_onUpdateCallback !== null) {
                    _onUpdateCallback.call(_object, value);
                }
                if (elapsed === 1) {
                    if (_repeat > 0) {
                        if (isFinite(_repeat)) {
                            _repeat--;
                        }
                        // Reassign starting values, restart by making startTime = now
                        for (property in _valuesStartRepeat) {
                            var endValue = _valuesEnd[property];
                            if (typeof endValue === 'string') {
                                _valuesStartRepeat[property] += parseFloat(endValue);
                            }
                            else if (typeof endValue === 'number') {
                                _valuesStartRepeat[property] += endValue;
                            }
                            if (_yoyo) {
                                var tmp = _valuesStartRepeat[property];
                                var endVal = _valuesEnd[property];
                                if (typeof endVal === 'number') {
                                    _valuesStartRepeat[property] = endVal;
                                    _valuesEnd[property] = tmp;
                                }
                            }
                            _valuesStart[property] = _valuesStartRepeat[property];
                        }
                        if (_repeatDelayTime !== undefined) {
                            _startTime = time + _repeatDelayTime;
                        }
                        else {
                            _startTime = time + _delayTime;
                        }
                        return true;
                    }
                    else {
                        if (_onCompleteCallback !== null) {
                            _onCompleteCallback.call(_object, _object);
                        }
                        for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
                            // Make the chained tweens start exactly at the time they should,
                            // even if the `update()` method was called way past the duration of the tween
                            _chainedTweens[i].start(_startTime + _duration);
                        }
                        return false;
                    }
                }
                return true;
            }
        };
        return tween;
    };
    /**
     * 缓动函数集合
     */
    TWEEN.Easing = {
        Linear: {
            None: function (k) {
                return k;
            }
        },
        Quadratic: {
            In: function (k) {
                return k * k;
            },
            Out: function (k) {
                return k * (2 - k);
            },
            InOut: function (k) {
                if ((k *= 2) < 1) {
                    return 0.5 * k * k;
                }
                return -0.5 * (--k * (k - 2) - 1);
            }
        },
        Cubic: {
            In: function (k) {
                return k * k * k;
            },
            Out: function (k) {
                return --k * k * k + 1;
            },
            InOut: function (k) {
                if ((k *= 2) < 1) {
                    return 0.5 * k * k * k;
                }
                return 0.5 * ((k -= 2) * k * k + 2);
            }
        },
        Quartic: {
            In: function (k) {
                return k * k * k * k;
            },
            Out: function (k) {
                return 1 - (--k * k * k * k);
            },
            InOut: function (k) {
                if ((k *= 2) < 1) {
                    return 0.5 * k * k * k * k;
                }
                return -0.5 * ((k -= 2) * k * k * k - 2);
            }
        },
        Quintic: {
            In: function (k) {
                return k * k * k * k * k;
            },
            Out: function (k) {
                return --k * k * k * k * k + 1;
            },
            InOut: function (k) {
                if ((k *= 2) < 1) {
                    return 0.5 * k * k * k * k * k;
                }
                return 0.5 * ((k -= 2) * k * k * k * k + 2);
            }
        },
        Sinusoidal: {
            In: function (k) {
                return 1 - Math.cos(k * Math.PI / 2);
            },
            Out: function (k) {
                return Math.sin(k * Math.PI / 2);
            },
            InOut: function (k) {
                return 0.5 * (1 - Math.cos(Math.PI * k));
            }
        },
        Exponential: {
            In: function (k) {
                return k === 0 ? 0 : Math.pow(1024, k - 1);
            },
            Out: function (k) {
                return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
            },
            InOut: function (k) {
                if (k === 0) {
                    return 0;
                }
                if (k === 1) {
                    return 1;
                }
                if ((k *= 2) < 1) {
                    return 0.5 * Math.pow(1024, k - 1);
                }
                return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
            }
        },
        Circular: {
            In: function (k) {
                return 1 - Math.sqrt(1 - k * k);
            },
            Out: function (k) {
                return Math.sqrt(1 - (--k * k));
            },
            InOut: function (k) {
                if ((k *= 2) < 1) {
                    return -0.5 * (Math.sqrt(1 - k * k) - 1);
                }
                return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
            }
        },
        Elastic: {
            In: function (k) {
                if (k === 0) {
                    return 0;
                }
                if (k === 1) {
                    return 1;
                }
                return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
            },
            Out: function (k) {
                if (k === 0) {
                    return 0;
                }
                if (k === 1) {
                    return 1;
                }
                return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
            },
            InOut: function (k) {
                if (k === 0) {
                    return 0;
                }
                if (k === 1) {
                    return 1;
                }
                k *= 2;
                if (k < 1) {
                    return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
                }
                return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;
            }
        },
        Back: {
            In: function (k) {
                var s = 1.70158;
                return k * k * ((s + 1) * k - s);
            },
            Out: function (k) {
                var s = 1.70158;
                return --k * k * ((s + 1) * k + s) + 1;
            },
            InOut: function (k) {
                var s = 1.70158 * 1.525;
                if ((k *= 2) < 1) {
                    return 0.5 * (k * k * ((s + 1) * k - s));
                }
                return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
            }
        },
        Bounce: {
            In: function (k) {
                return 1 - TWEEN.Easing.Bounce.Out(1 - k);
            },
            Out: function (k) {
                if (k < (1 / 2.75)) {
                    return 7.5625 * k * k;
                }
                else if (k < (2 / 2.75)) {
                    return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
                }
                else if (k < (2.5 / 2.75)) {
                    return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
                }
                else {
                    return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
                }
            },
            InOut: function (k) {
                if (k < 0.5) {
                    return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
                }
                return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
            }
        }
    };
    /**
     * 插值函数集合
     */
    TWEEN.Interpolation = {
        Linear: function (v, k) {
            var m = v.length - 1;
            var f = m * k;
            var i = Math.floor(f);
            var fn = TWEEN.Interpolation.Utils.Linear;
            if (k < 0) {
                return fn(v[0], v[1], f);
            }
            if (k > 1) {
                return fn(v[m], v[m - 1], m - f);
            }
            return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
        },
        Bezier: function (v, k) {
            var b = 0;
            var n = v.length - 1;
            var pw = Math.pow;
            var bn = TWEEN.Interpolation.Utils.Bernstein;
            for (var i = 0; i <= n; i++) {
                b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
            }
            return b;
        },
        CatmullRom: function (v, k) {
            var m = v.length - 1;
            var f = m * k;
            var i = Math.floor(f);
            var fn = TWEEN.Interpolation.Utils.CatmullRom;
            if (v[0] === v[m]) {
                if (k < 0) {
                    i = Math.floor(f = m * (1 + k));
                }
                return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
            }
            else {
                if (k < 0) {
                    return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
                }
                if (k > 1) {
                    return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
                }
                return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
            }
        },
        Utils: {
            Linear: function (p0, p1, t) {
                return (p1 - p0) * t + p0;
            },
            Bernstein: function (n, i) {
                var fc = TWEEN.Interpolation.Utils.Factorial;
                return fc(n) / fc(i) / fc(n - i);
            },
            Factorial: (function () {
                var a = [1];
                return function (n) {
                    var s = 1;
                    if (a[n]) {
                        return a[n];
                    }
                    for (var i = n; i > 1; i--) {
                        s *= i;
                    }
                    a[n] = s;
                    return s;
                };
            })(),
            CatmullRom: function (p0, p1, p2, p3, t) {
                var v0 = (p2 - p0) * 0.5;
                var v1 = (p3 - p1) * 0.5;
                var t2 = t * t;
                var t3 = t * t2;
                return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
            }
        }
    };

    /**
     * 工具函数集合
     */
    /**
     * 根据两点坐标获取角度
     * @param start 起点坐标 [x, y]
     * @param end 终点坐标 [x, y]
     * @returns 角度（不是弧度）
     */
    function getAngle(start, end) {
        var diff_x = end[0] - start[0];
        var diff_y = end[1] - start[1];
        var deg = 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
        // 调整角度范围，确保结果在0-360度之间
        if (end[0] < start[0]) {
            deg = deg + 180;
        }
        return deg;
    }

    /**
     * 绘制沿线箭头
     * @author kyle / http://nikai.us/
     */
    // 图片缓存对象
    var imageCache = {};
    var object = {
        draw: function (context, dataSet, options) {
            // 默认箭头图片URL
            var imageCacheKey = 'http://huiyan.baidu.com/github/tools/gis-drawing/static/images/direction.png';
            if (options.arrow && options.arrow.url) {
                imageCacheKey = options.arrow.url;
            }
            // 初始化图片缓存
            if (!imageCache[imageCacheKey]) {
                imageCache[imageCacheKey] = null;
            }
            var directionImage = imageCache[imageCacheKey];
            // 如果图片未加载，异步加载图片后重新绘制
            if (!directionImage) {
                var args_1 = Array.prototype.slice.call(arguments);
                var image_1 = new Image();
                image_1.onload = function () {
                    imageCache[imageCacheKey] = image_1;
                    object.draw.apply(null, args_1);
                };
                image_1.src = imageCacheKey;
                return;
            }
            // 获取数据
            var data = dataSet instanceof DataSet$1 ? dataSet.get() : dataSet;
            context.save();
            // 设置上下文属性
            for (var key in options) {
                context[key] = options[key];
            }
            var preCoordinate = null;
            // 遍历数据绘制箭头
            for (var i = 0, len = data.length; i < len; i++) {
                var item = data[i];
                context.save();
                // 设置填充样式
                if (item.fillStyle || item._fillStyle) {
                    context.fillStyle = item.fillStyle || item._fillStyle;
                }
                // 设置描边样式
                if (item.strokeStyle || item._strokeStyle) {
                    context.strokeStyle = item.strokeStyle || item._strokeStyle;
                }
                // 确保geometry存在
                if (!item.geometry) {
                    context.restore();
                    continue;
                }
                var type = item.geometry.type;
                context.beginPath();
                // 处理LineString类型数据
                if (type === 'LineString') {
                    var coordinates = item.geometry._coordinates || item.geometry.coordinates;
                    var interval = options.arrow.interval !== undefined ? options.arrow.interval : 1;
                    // 遍历坐标点绘制箭头
                    for (var j = 0; j < coordinates.length; j += interval) {
                        if (coordinates[j] && coordinates[j + 1]) {
                            var coordinate = coordinates[j];
                            // 跳过距离过近的点
                            if (preCoordinate && getDistance(coordinate, preCoordinate) < 30) {
                                continue;
                            }
                            context.save();
                            // 计算角度并旋转
                            var angle = getAngle(coordinates[j], coordinates[j + 1]);
                            context.translate(coordinate[0], coordinate[1]);
                            context.rotate((angle) * Math.PI / 180);
                            // 绘制箭头图片
                            context.drawImage(directionImage, -directionImage.width / 4, -directionImage.height / 4, directionImage.width / 2, directionImage.height / 2);
                            context.restore();
                            preCoordinate = coordinate;
                        }
                    }
                }
                context.restore();
            }
            context.restore();
        }
    };
    /**
     * 计算两点之间的距离
     * @param coordinateA 第一个坐标点
     * @param coordinateB 第二个坐标点
     * @returns 两点之间的距离
     */
    function getDistance(coordinateA, coordinateB) {
        return Math.sqrt(Math.pow(coordinateA[0] - coordinateB[0], 2) + Math.pow(coordinateA[1] - coordinateB[1], 2));
    }

    /**
     * 绘制裁剪区域
     * @author Mofei Zhu<mapv@zhuwenlong.com>
     */
    var drawClip = {
        draw: function (context, dataSet, options) {
            // 获取数据
            var data = dataSet instanceof DataSet$1 ? dataSet.get() : dataSet;
            // 保存上下文状态
            context.save();
            // 设置填充样式，默认为半透明黑色
            context.fillStyle = options.fillStyle || 'rgba(0, 0, 0, 0.5)';
            // 绘制背景矩形
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
            // 定义多边形绘制函数
            options.multiPolygonDraw = function () {
                context.save();
                context.clip();
                clear(context);
                context.restore();
            };
            // 遍历数据，为每个数据项绘制裁剪区域
            for (var i = 0, len = data.length; i < len; i++) {
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

    /**
     * @author kyle / http://nikai.us/
     */
    var imageMap$1 = {};
    var stacks$1 = {};
    var drawCluster = {
        draw: function (context, dataSet, options) {
            // 保存当前画布状态
            context.save();
            // 获取数据集，如果是DataSet实例则调用get()方法获取，否则直接使用
            var data = dataSet instanceof DataSet$1 ? dataSet.get() : dataSet;
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                // 开始一个新的绘制路径
                context.beginPath();
                if (item.properties && item.properties.cluster) {
                    // 增强聚类点绘制功能
                    this.drawClusterPoint(item, options, context);
                }
                else {
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
            }
            else {
                // 获取元素的坐标
                var coordinates = item.geometry._coordinates || item.geometry.coordinates;
                var x = coordinates[0];
                var y = coordinates[1];
                // 获取标签配置
                var labelOptions = Object.assign({}, options.label || {});
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
                    }
                    else {
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
                    var text = item.properties.point_count.toString();
                    var textWidth = context.measureText(text).width;
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
            var _ref = item.geometry._coordinates || item.geometry.coordinates;
            var x = _ref[0];
            var y = _ref[1];
            var iconOptions = Object.assign({}, options.iconOptions, item.iconOptions);
            // 定义绘制点标记的方法
            var drawPoint = function drawPoint() {
                context.beginPath();
                context.arc(_ref[0], _ref[1], options.size || 5, 0, Math.PI * 2);
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
            var img = imageMap$1[url];
            // 根据图像缓存状态进行绘制或加载图像
            if (img) {
                if (img === 'error') {
                    drawPoint();
                }
                else if (iconWidth && iconHeight) {
                    context.drawImage(img, x, y, iconWidth, iconHeight);
                }
                else {
                    context.drawImage(img, x, y);
                }
                // 绘制标签
                if (iconOptions.label && iconOptions.label.show !== false) {
                    drawLabel(context, x + ~~iconWidth / 2, y + ~~iconHeight / 2, iconWidth, iconHeight, iconOptions.label);
                }
            }
            else {
                if (!stacks$1[url]) {
                    stacks$1[url] = [];
                    getImage$1(url, function (img, src) {
                        stacks$1[src] && stacks$1[src].forEach(function (fun) {
                            return fun(img);
                        });
                        stacks$1[src] = [];
                        imageMap$1[src] = img;
                    }, function (src) {
                        stacks$1[src] && stacks$1[src].forEach(function (fun) {
                            return fun('error');
                        });
                        stacks$1[src] = [];
                        imageMap$1[src] = 'error';
                        drawPoint();
                    });
                }
                stacks$1[url].push(function (x, y, iconWidth, iconHeight) {
                    return function (img) {
                        if (img === 'error') {
                            drawPoint();
                        }
                        else if (iconWidth && iconHeight) {
                            context.drawImage(img, x, y, iconWidth, iconHeight);
                        }
                        else {
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
            var _ref = item.geometry._coordinates || item.geometry.coordinates;
            var x = _ref[0];
            var y = _ref[1];
            var iconOptions = Object.assign({}, options.iconOptions, item.iconOptions);
            var drawPoint = function drawPoint() {
                context.arc(_ref[0], _ref[1], options.size || 5, 0, Math.PI * 2);
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
            var iconWidth = item.size || 40; // 增大默认图标尺寸
            var iconHeight = item.size || 40; // 增大默认图标尺寸
            // 根据聚合点数量动态调整图标大小
            var pointCount = item.properties ? (item.properties.point_count || 0) : 0;
            if (pointCount > 100) {
                iconWidth = 50;
                iconHeight = 50;
            }
            else if (pointCount > 50) {
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
            var img = imageMap$1[url];
            if (img) {
                if (img === 'error') {
                    console.log('图片加载错误，绘制默认点');
                    drawPoint();
                }
                else if (iconWidth && iconHeight) {
                    //如果点设置了阴影，这里要给图片也加上阴影，不然图片遮不住点的阴影
                    context.shadowBlur = iconOptions.shadowBlur;
                    context.shadowColor = iconOptions.shadowColor;
                    context.drawImage(img, x, y, iconWidth, iconHeight);
                }
                else {
                    context.shadowBlur = iconOptions.shadowBlur;
                    context.shadowColor = iconOptions.shadowColor;
                    context.drawImage(img, x, y);
                }
                if (options.iconOptions.show) {
                    // 文字样式设置
                    context.fillStyle = options.fillStyle || 'white';
                    context.textBaseline = 'middle'; // 垂直居中基准
                    context.textAlign = 'center'; // 水平居中
                    // 动态字体大小（根据聚合点数量调整）
                    var pointCount_1 = (item.properties && item.properties.point_count) || 0;
                    // 修改为图标大小的一半
                    var fontSize = options.iconOptions.fontSize || Math.floor(iconWidth / 6);
                    context.font = "".concat(fontSize, "px Arial"); // 使用 normal 字体样式
                    // 绘制文字（完全居中）
                    var text = pointCount_1.toString();
                    if (text) {
                        var textX = x + iconWidth / 2; // 图标水平中心
                        // const textY = y + iconHeight / 2; // 图标垂直中心
                        // context.fillText(text, textX, textY);
                        // 为了更精确的垂直居中，需要考虑字体度量
                        // 获取字体的度量信息
                        var metrics = context.measureText(text);
                        // 计算文字的实际高度
                        var fontHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
                        // 调整Y坐标以实现真正的垂直居中
                        var textY = y + iconHeight / 2 + (metrics.actualBoundingBoxAscent - fontHeight / 2);
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
            }
            else {
                // 缓存，操作同上
                if (!stacks$1[url]) {
                    stacks$1[url] = [];
                    console.log('开始加载图片:', urlValue);
                    getImage$1(url, function (img, src) {
                        console.log('图片加载成功:', src);
                        stacks$1[src] && stacks$1[src].forEach(function (fun) {
                            return fun(img);
                        });
                        stacks$1[src] = [];
                        imageMap$1[src] = img;
                    }, function (src) {
                        console.log('图片加载失败:', src);
                        stacks$1[src] && stacks$1[src].forEach(function (fun) {
                            return fun('error');
                        });
                        stacks$1[src] = [];
                        imageMap$1[src] = 'error';
                        drawPoint();
                    });
                }
                stacks$1[url].push(function (x, y, iconWidth, iconHeight) {
                    return function (img) {
                        if (img === 'error') {
                            console.log('图片加载错误，绘制默认点');
                            drawPoint();
                        }
                        else if (iconWidth && iconHeight) {
                            context.shadowBlur = iconOptions.shadowBlur;
                            context.shadowColor = iconOptions.shadowColor;
                            context.drawImage(img, x, y, iconWidth, iconHeight);
                        }
                        else {
                            context.shadowBlur = iconOptions.shadowBlur;
                            context.shadowColor = iconOptions.shadowColor;
                            context.drawImage(img, x, y);
                        }
                        if (options.iconOptions.show) {
                            // 文字样式设置
                            context.fillStyle = options.fillStyle || 'white';
                            context.textBaseline = 'middle'; // 垂直居中基准
                            context.textAlign = 'center'; // 水平居中
                            // 动态字体大小（根据聚合点数量调整）
                            var pointCount_2 = (item.properties && item.properties.point_count) || 0;
                            // 修改为图标大小的一半
                            var fontSize = options.iconOptions.fontSize || Math.floor(iconWidth / 6);
                            context.font = "".concat(fontSize, "px Arial"); // 使用 normal 字体样式
                            // 绘制文字（完全居中）
                            var text = pointCount_2.toString();
                            if (text) {
                                var textX = x + iconWidth / 2; // 图标水平中心
                                // const textY = y + iconHeight / 2; // 图标垂直中心
                                // context.fillText(text, textX, textY);
                                // 为了更精确的垂直居中，需要考虑字体度量
                                // 获取字体的度量信息
                                var metrics = context.measureText(text);
                                // 计算文字的实际高度
                                var fontHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
                                // 调整Y坐标以实现真正的垂直居中
                                var textY = y + iconHeight / 2 + (metrics.actualBoundingBoxAscent - fontHeight / 2);
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
            }
            else if (typeof value === 'number') {
                return value;
            }
            else if (value === 'center') {
                return -total / 2;
            }
            else {
                return defaultValue;
            }
        };
        // 计算标签的偏移量
        var top = parsePosition(labelOptions.top, labelHeight, -labelHeight / 2);
        var left = parsePosition(labelOptions.left, labelWidth, -labelWidth / 2);
        parsePosition(labelOptions.right, labelWidth, labelWidth / 2);
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
    function getImage$1(url, callback, fallback) {
        var img = new Image();
        img.onload = function () {
            callback && callback(img, url);
        };
        img.onerror = function () {
            fallback && fallback(url);
        };
        img.src = window.decodeURIComponent(url);
    }

    /**
     * 文本绘制模块
     * @author Mofei Zhu<mapv@zhuwenlong.com>
     */
    var drawText = {
        /**
         * 绘制文本
         * @param context Canvas上下文
         * @param dataSet 数据集
         * @param options 绘制选项
         */
        draw: function (context, dataSet, options) {
            // 获取数据
            var data = dataSet instanceof DataSet$1 ? dataSet.get() : dataSet;
            // 保存上下文状态
            context.save();
            // 设置上下文属性
            for (var key in options) {
                context[key] = options[key];
            }
            var rects = [];
            // 设置字体大小
            var size = options._size || options.size;
            if (size) {
                context.font = "bold " + size + "px Arial";
            }
            else {
                context.font = "bold 12px Arial";
            }
            // 文本属性
            var textKey = options.textKey || 'text';
            // 设置文本对齐方式
            if (!options.textAlign) {
                context.textAlign = 'center';
            }
            // 设置文本基线
            if (!options.textBaseline) {
                context.textBaseline = 'middle';
            }
            // 标注避让模式
            if (options.avoid) {
                for (var i = 0, len = data.length; i < len; i++) {
                    // 获取偏移量
                    var offset = data[i].offset || options.offset || {
                        x: 0,
                        y: 0
                    };
                    var item = data[i];
                    // 确保geometry存在
                    if (!item.geometry)
                        continue;
                    // 获取坐标
                    var coordinates = item.geometry._coordinates || item.geometry.coordinates;
                    var x = coordinates[0] + offset.x;
                    var y = coordinates[1] + offset.y;
                    var text = item[textKey];
                    // 测量文本宽度
                    var textWidth = context.measureText(text).width;
                    // 计算文本矩形区域
                    var px = x - textWidth / 2;
                    var py = y - (size || 12) / 2;
                    var rect = {
                        sw: {
                            x: px,
                            y: py + (size || 12)
                        },
                        ne: {
                            x: px + textWidth,
                            y: py
                        }
                    };
                    // 检查是否重叠，不重叠则绘制
                    if (!hasOverlay(rects, rect)) {
                        rects.push(rect);
                        context.fillText(text, x, y);
                    }
                }
            }
            else {
                // 普通绘制模式
                for (var i = 0, len = data.length; i < len; i++) {
                    // 获取偏移量
                    var offset = data[i].offset || options.offset || {
                        x: 0,
                        y: 0
                    };
                    var item = data[i];
                    // 确保geometry存在
                    if (!item.geometry)
                        continue;
                    // 获取坐标
                    var coordinates = item.geometry._coordinates || item.geometry.coordinates;
                    var x = coordinates[0] + offset.x;
                    var y = coordinates[1] + offset.y;
                    var text = item[textKey];
                    // 绘制文本
                    context.fillText(text, x, y);
                }
            }
            // 恢复上下文状态
            context.restore();
        }
    };
    /**
     * 检查当前矩形是否与已有的矩形列表重叠
     * @param rects 已有的矩形列表
     * @param overlay 当前矩形
     * @returns 是否重叠
     */
    function hasOverlay(rects, overlay) {
        for (var i = 0; i < rects.length; i++) {
            if (isRectOverlay(rects[i], overlay)) {
                return true;
            }
        }
        return false;
    }
    /**
     * 判断两个矩形是否重叠
     * @param rect1 第一个矩形
     * @param rect2 第二个矩形
     * @returns 是否重叠
     */
    function isRectOverlay(rect1, rect2) {
        // minx、miny 两个矩形右下角最小的x和y
        // maxx、maxy 两个矩形左上角最大的x和y
        var minx = Math.min(rect1.ne.x, rect2.ne.x);
        var miny = Math.min(rect1.sw.y, rect2.sw.y);
        var maxx = Math.max(rect1.sw.x, rect2.sw.x);
        var maxy = Math.max(rect1.ne.y, rect2.ne.y);
        // 如果最小右下角大于最大左上角，则重叠
        if (minx > maxx && miny > maxy) {
            return true;
        }
        return false;
    }

    /**
     * 绘制图标
     * @author wanghyper
     */
    // 图片缓存对象
    var imageMap = {};
    // 图片加载队列
    var stacks = {};
    var drawIcon = {
        draw: function (context, dataSet, options) {
            var data = dataSet instanceof DataSet$1 ? dataSet.get() : dataSet;
            var _loop_1 = function (i, len) {
                var item = data[i];
                if (item.geometry) {
                    // 如果是聚类点且配置了图标选项
                    if (item.properties && item.properties.cluster) {
                        this_1.drawClusterIcon(item, options, context);
                    }
                    else {
                        var icon = item.icon || options.icon;
                        if (typeof icon === 'string') {
                            var url = window.encodeURIComponent(icon);
                            var img = imageMap[url];
                            if (img) {
                                drawItem(img, options, context, item);
                            }
                            else {
                                if (!stacks[url]) {
                                    stacks[url] = [];
                                    getImage(url, function (img, src) {
                                        stacks[src] && stacks[src].forEach(function (fun) { return fun(img); });
                                        stacks[src] = null;
                                        imageMap[src] = img;
                                    }, function (src) {
                                        stacks[src] && stacks[src].forEach(function (fun) { return fun('error'); });
                                        stacks[src] = null;
                                        imageMap[src] = 'error';
                                    });
                                }
                                stacks[url].push(function (img) {
                                    drawItem(img, options, context, item);
                                });
                            }
                        }
                        else {
                            drawItem(icon, options, context, item);
                        }
                    }
                }
            };
            var this_1 = this;
            for (var i = 0, len = data.length; i < len; i++) {
                _loop_1(i);
            }
        },
        /**
         * 绘制聚类图标
         * @param item 数据项
         * @param options 配置项
         * @param context 画布上下文
         */
        drawClusterIcon: function (item, options, context) {
            var _this = this;
            // 确保geometry存在
            if (!item.geometry)
                return;
            var coordinates = item.geometry._coordinates || item.geometry.coordinates;
            var x = coordinates[0];
            var y = coordinates[1];
            // 获取图标配置
            var iconOptions = Object.assign({}, options.iconOptions || {}, item.iconOptions || {});
            // 如果配置了显示图标且图标url存在
            if (iconOptions.show !== false && (iconOptions.url || item.icon)) {
                var iconUrl = '';
                // 如果url是函数，则根据聚合点数量调用
                if (typeof iconOptions.url === 'function') {
                    var count = item.properties ? (item.properties.point_count || 0) : 0;
                    iconUrl = iconOptions.url(count);
                }
                else if (typeof iconOptions.url === 'string') {
                    iconUrl = iconOptions.url;
                }
                if (iconUrl) {
                    var url = window.encodeURIComponent(iconUrl);
                    var img = imageMap[url];
                    if (img) {
                        if (img === 'error') {
                            // 图片加载失败，绘制默认点
                            this.drawDefaultPoint(context, x, y, item, options);
                        }
                        else {
                            this.drawImageWithText(context, img, x, y, item, options, iconOptions);
                        }
                    }
                    else {
                        // 异步加载图片
                        if (!stacks[url]) {
                            stacks[url] = [];
                            getImage(url, function (img, src) {
                                stacks[src] && stacks[src].forEach(function (fun) { return fun(img); });
                                stacks[src] = null;
                                imageMap[src] = img;
                            }, function (src) {
                                stacks[src] && stacks[src].forEach(function (fun) { return fun('error'); });
                                stacks[src] = null;
                                imageMap[src] = 'error';
                            });
                        }
                        stacks[url].push(function (img) {
                            if (img === 'error') {
                                _this.drawDefaultPoint(context, x, y, item, options);
                            }
                            else {
                                _this.drawImageWithText(context, img, x, y, item, options, iconOptions);
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
        drawDefaultPoint: function (context, x, y, item, options) {
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
        drawImageWithText: function (context, img, x, y, item, options, iconOptions) {
            context.save();
            // 设置图标大小
            var iconWidth = item.size || iconOptions.width || 40;
            var iconHeight = item.size || iconOptions.height || 40;
            // 根据聚合点数量动态调整图标大小
            var pointCount = item.properties ? (item.properties.point_count || 0) : 0;
            if (pointCount > 100) {
                iconWidth = 50;
                iconHeight = 50;
            }
            else if (pointCount > 50) {
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
                var fontSize = iconOptions.fontSize || Math.floor(iconWidth / 6);
                context.font = "".concat(fontSize, "px Arial");
                // 绘制文字（完全居中）
                var text = pointCount.toString();
                if (text) {
                    var textX = x + iconWidth / 2;
                    // 获取字体度量信息以实现精确垂直居中
                    var metrics = context.measureText(text);
                    var fontHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
                    var textY = y + iconHeight / 2 + (metrics.actualBoundingBoxAscent - fontHeight / 2);
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
        drawDefaultClusterPoint: function (context, x, y, item, options) {
            context.save();
            var size = item.size || options.size || 10;
            var pointCount = item.properties ? (item.properties.point_count || 0) : 0;
            // 根据点数量调整大小
            if (pointCount > 100) {
                size = 20;
            }
            else if (pointCount > 50) {
                size = 18;
            }
            else if (pointCount > 10) {
                size = 16;
            }
            // 绘制圆形
            context.beginPath();
            context.arc(x, y, size, 0, Math.PI * 2);
            // 根据数量设置颜色
            if (pointCount > 100) {
                context.fillStyle = 'rgba(255, 0, 0, 0.8)';
            }
            else if (pointCount > 50) {
                context.fillStyle = 'rgba(255, 165, 0, 0.8)';
            }
            else if (pointCount > 10) {
                context.fillStyle = 'rgba(255, 255, 0, 0.8)';
            }
            else {
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
    /**
     * 绘制单个图标项
     * @param img 图片对象
     * @param options 配置项
     * @param context 画布上下文
     * @param item 数据项
     */
    function drawItem(img, options, context, item) {
        // 确保geometry存在
        if (!item.geometry)
            return;
        context.save();
        var coordinates = item.geometry._coordinates || item.geometry.coordinates;
        var x = coordinates[0];
        var y = coordinates[1];
        var offset = options.offset || { x: 0, y: 0 };
        var width = item.width || options._width || options.width;
        var height = item.height || options._height || options.height;
        // 计算图标中心点坐标
        var centerX = x - ~~(width || 0) / 2 + offset.x;
        var centerY = y - ~~(height || 0) / 2 + offset.y;
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
        var deg = item.deg || options.deg;
        if (deg) {
            context.translate(centerX, centerY);
            context.rotate((deg * Math.PI) / 180);
            context.translate(-centerX, -centerY);
        }
        // 绘制图片
        if (options.sx !== undefined && options.sy !== undefined && options.swidth !== undefined && options.sheight !== undefined && options.width !== undefined && options.height !== undefined) {
            context.drawImage(img, options.sx, options.sy, options.swidth, options.sheight, centerX, centerY, width || 0, height || 0);
        }
        else if (width && height) {
            context.drawImage(img, centerX, centerY, width, height);
        }
        else {
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
    function getImage(url, callback, fallback) {
        var img = new Image();
        img.onload = function () {
            callback && callback(img, url);
        };
        img.onerror = function () {
            fallback && fallback(url);
        };
        img.src = window.decodeURIComponent(url);
    }

    function sortKD(ids, coords, nodeSize, left, right, depth) {
        if (right - left <= nodeSize) { return; }

        var m = (left + right) >> 1;

        select(ids, coords, m, left, right, depth % 2);

        sortKD(ids, coords, nodeSize, left, m - 1, depth + 1);
        sortKD(ids, coords, nodeSize, m + 1, right, depth + 1);
    }

    function select(ids, coords, k, left, right, inc) {

        while (right > left) {
            if (right - left > 600) {
                var n = right - left + 1;
                var m = k - left + 1;
                var z = Math.log(n);
                var s = 0.5 * Math.exp(2 * z / 3);
                var sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
                var newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
                var newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
                select(ids, coords, k, newLeft, newRight, inc);
            }

            var t = coords[2 * k + inc];
            var i = left;
            var j = right;

            swapItem(ids, coords, left, k);
            if (coords[2 * right + inc] > t) { swapItem(ids, coords, left, right); }

            while (i < j) {
                swapItem(ids, coords, i, j);
                i++;
                j--;
                while (coords[2 * i + inc] < t) { i++; }
                while (coords[2 * j + inc] > t) { j--; }
            }

            if (coords[2 * left + inc] === t) { swapItem(ids, coords, left, j); }
            else {
                j++;
                swapItem(ids, coords, j, right);
            }

            if (j <= k) { left = j + 1; }
            if (k <= j) { right = j - 1; }
        }
    }

    function swapItem(ids, coords, i, j) {
        swap(ids, i, j);
        swap(coords, 2 * i, 2 * j);
        swap(coords, 2 * i + 1, 2 * j + 1);
    }

    function swap(arr, i, j) {
        var tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }

    function range(ids, coords, minX, minY, maxX, maxY, nodeSize) {
        var stack = [0, ids.length - 1, 0];
        var result = [];
        var x, y;

        while (stack.length) {
            var axis = stack.pop();
            var right = stack.pop();
            var left = stack.pop();

            if (right - left <= nodeSize) {
                for (var i = left; i <= right; i++) {
                    x = coords[2 * i];
                    y = coords[2 * i + 1];
                    if (x >= minX && x <= maxX && y >= minY && y <= maxY) { result.push(ids[i]); }
                }
                continue;
            }

            var m = Math.floor((left + right) / 2);

            x = coords[2 * m];
            y = coords[2 * m + 1];

            if (x >= minX && x <= maxX && y >= minY && y <= maxY) { result.push(ids[m]); }

            var nextAxis = (axis + 1) % 2;

            if (axis === 0 ? minX <= x : minY <= y) {
                stack.push(left);
                stack.push(m - 1);
                stack.push(nextAxis);
            }
            if (axis === 0 ? maxX >= x : maxY >= y) {
                stack.push(m + 1);
                stack.push(right);
                stack.push(nextAxis);
            }
        }

        return result;
    }

    function within(ids, coords, qx, qy, r, nodeSize) {
        var stack = [0, ids.length - 1, 0];
        var result = [];
        var r2 = r * r;

        while (stack.length) {
            var axis = stack.pop();
            var right = stack.pop();
            var left = stack.pop();

            if (right - left <= nodeSize) {
                for (var i = left; i <= right; i++) {
                    if (sqDist(coords[2 * i], coords[2 * i + 1], qx, qy) <= r2) { result.push(ids[i]); }
                }
                continue;
            }

            var m = Math.floor((left + right) / 2);

            var x = coords[2 * m];
            var y = coords[2 * m + 1];

            if (sqDist(x, y, qx, qy) <= r2) { result.push(ids[m]); }

            var nextAxis = (axis + 1) % 2;

            if (axis === 0 ? qx - r <= x : qy - r <= y) {
                stack.push(left);
                stack.push(m - 1);
                stack.push(nextAxis);
            }
            if (axis === 0 ? qx + r >= x : qy + r >= y) {
                stack.push(m + 1);
                stack.push(right);
                stack.push(nextAxis);
            }
        }

        return result;
    }

    function sqDist(ax, ay, bx, by) {
        var dx = ax - bx;
        var dy = ay - by;
        return dx * dx + dy * dy;
    }

    var defaultGetX = function (p) { return p[0]; };
    var defaultGetY = function (p) { return p[1]; };

    var KDBush = function KDBush(points, getX, getY, nodeSize, ArrayType) {
        if ( getX === void 0 ) getX = defaultGetX;
        if ( getY === void 0 ) getY = defaultGetY;
        if ( nodeSize === void 0 ) nodeSize = 64;
        if ( ArrayType === void 0 ) ArrayType = Float64Array;

        this.nodeSize = nodeSize;
        this.points = points;

        var IndexArrayType = points.length < 65536 ? Uint16Array : Uint32Array;

        var ids = this.ids = new IndexArrayType(points.length);
        var coords = this.coords = new ArrayType(points.length * 2);

        for (var i = 0; i < points.length; i++) {
            ids[i] = i;
            coords[2 * i] = getX(points[i]);
            coords[2 * i + 1] = getY(points[i]);
        }

        sortKD(ids, coords, nodeSize, 0, ids.length - 1, 0);
    };

    KDBush.prototype.range = function range$1 (minX, minY, maxX, maxY) {
        return range(this.ids, this.coords, minX, minY, maxX, maxY, this.nodeSize);
    };

    KDBush.prototype.within = function within$1 (x, y, r) {
        return within(this.ids, this.coords, x, y, r, this.nodeSize);
    };

    var defaultOptions = {
        minZoom: 0,   // min zoom to generate clusters on
        maxZoom: 16,  // max zoom level to cluster the points on
        minPoints: 2, // minimum points to form a cluster
        radius: 40,   // cluster radius in pixels
        extent: 512,  // tile extent (radius is calculated relative to it)
        nodeSize: 64, // size of the KD-tree leaf node, affects performance
        log: false,   // whether to log timing info

        // whether to generate numeric ids for input features (in vector tiles)
        generateId: false,

        // a reduce function for calculating custom cluster properties
        reduce: null, // (accumulated, props) => { accumulated.sum += props.sum; }

        // properties to use for individual points when running the reducer
        map: function (props) { return props; } // props => ({sum: props.my_value})
    };

    var Supercluster = function Supercluster(options) {
        this.options = extend(Object.create(defaultOptions), options);
        this.trees = new Array(this.options.maxZoom + 1);
    };

    Supercluster.prototype.load = function load (points) {
        var ref = this.options;
            var log = ref.log;
            var minZoom = ref.minZoom;
            var maxZoom = ref.maxZoom;
            var nodeSize = ref.nodeSize;

        if (log) { console.time('total time'); }

        var timerId = "prepare " + (points.length) + " points";
        if (log) { console.time(timerId); }

        this.points = points;

        // generate a cluster object for each point and index input points into a KD-tree
        var clusters = [];
        for (var i = 0; i < points.length; i++) {
            if (!points[i].geometry) { continue; }
            clusters.push(createPointCluster(points[i], i));
        }
        this.trees[maxZoom + 1] = new KDBush(clusters, getX, getY, nodeSize, Float32Array);

        if (log) { console.timeEnd(timerId); }

        // cluster points on max zoom, then cluster the results on previous zoom, etc.;
        // results in a cluster hierarchy across zoom levels
        for (var z = maxZoom; z >= minZoom; z--) {
            var now = +Date.now();

            // create a new set of clusters for the zoom and index them with a KD-tree
            clusters = this._cluster(clusters, z);
            this.trees[z] = new KDBush(clusters, getX, getY, nodeSize, Float32Array);

            if (log) { console.log('z%d: %d clusters in %dms', z, clusters.length, +Date.now() - now); }
        }

        if (log) { console.timeEnd('total time'); }

        return this;
    };

    Supercluster.prototype.getClusters = function getClusters (bbox, zoom) {
        var minLng = ((bbox[0] + 180) % 360 + 360) % 360 - 180;
        var minLat = Math.max(-90, Math.min(90, bbox[1]));
        var maxLng = bbox[2] === 180 ? 180 : ((bbox[2] + 180) % 360 + 360) % 360 - 180;
        var maxLat = Math.max(-90, Math.min(90, bbox[3]));

        if (bbox[2] - bbox[0] >= 360) {
            minLng = -180;
            maxLng = 180;
        } else if (minLng > maxLng) {
            var easternHem = this.getClusters([minLng, minLat, 180, maxLat], zoom);
            var westernHem = this.getClusters([-180, minLat, maxLng, maxLat], zoom);
            return easternHem.concat(westernHem);
        }

        var tree = this.trees[this._limitZoom(zoom)];
        var ids = tree.range(lngX(minLng), latY(maxLat), lngX(maxLng), latY(minLat));
        var clusters = [];
        for (var i = 0, list = ids; i < list.length; i += 1) {
            var id = list[i];

                var c = tree.points[id];
            clusters.push(c.numPoints ? getClusterJSON(c) : this.points[c.index]);
        }
        return clusters;
    };

    Supercluster.prototype.getChildren = function getChildren (clusterId) {
        var originId = this._getOriginId(clusterId);
        var originZoom = this._getOriginZoom(clusterId);
        var errorMsg = 'No cluster with the specified id.';

        var index = this.trees[originZoom];
        if (!index) { throw new Error(errorMsg); }

        var origin = index.points[originId];
        if (!origin) { throw new Error(errorMsg); }

        var r = this.options.radius / (this.options.extent * Math.pow(2, originZoom - 1));
        var ids = index.within(origin.x, origin.y, r);
        var children = [];
        for (var i = 0, list = ids; i < list.length; i += 1) {
            var id = list[i];

                var c = index.points[id];
            if (c.parentId === clusterId) {
                children.push(c.numPoints ? getClusterJSON(c) : this.points[c.index]);
            }
        }

        if (children.length === 0) { throw new Error(errorMsg); }

        return children;
    };

    Supercluster.prototype.getLeaves = function getLeaves (clusterId, limit, offset) {
        limit = limit || 10;
        offset = offset || 0;

        var leaves = [];
        this._appendLeaves(leaves, clusterId, limit, offset, 0);

        return leaves;
    };

    Supercluster.prototype.getTile = function getTile (z, x, y) {
        var tree = this.trees[this._limitZoom(z)];
        var z2 = Math.pow(2, z);
        var ref = this.options;
            var extent = ref.extent;
            var radius = ref.radius;
        var p = radius / extent;
        var top = (y - p) / z2;
        var bottom = (y + 1 + p) / z2;

        var tile = {
            features: []
        };

        this._addTileFeatures(
            tree.range((x - p) / z2, top, (x + 1 + p) / z2, bottom),
            tree.points, x, y, z2, tile);

        if (x === 0) {
            this._addTileFeatures(
                tree.range(1 - p / z2, top, 1, bottom),
                tree.points, z2, y, z2, tile);
        }
        if (x === z2 - 1) {
            this._addTileFeatures(
                tree.range(0, top, p / z2, bottom),
                tree.points, -1, y, z2, tile);
        }

        return tile.features.length ? tile : null;
    };

    Supercluster.prototype.getClusterExpansionZoom = function getClusterExpansionZoom (clusterId) {
        var expansionZoom = this._getOriginZoom(clusterId) - 1;
        while (expansionZoom <= this.options.maxZoom) {
            var children = this.getChildren(clusterId);
            expansionZoom++;
            if (children.length !== 1) { break; }
            clusterId = children[0].properties.cluster_id;
        }
        return expansionZoom;
    };

    Supercluster.prototype._appendLeaves = function _appendLeaves (result, clusterId, limit, offset, skipped) {
        var children = this.getChildren(clusterId);

        for (var i = 0, list = children; i < list.length; i += 1) {
            var child = list[i];

                var props = child.properties;

            if (props && props.cluster) {
                if (skipped + props.point_count <= offset) {
                    // skip the whole cluster
                    skipped += props.point_count;
                } else {
                    // enter the cluster
                    skipped = this._appendLeaves(result, props.cluster_id, limit, offset, skipped);
                    // exit the cluster
                }
            } else if (skipped < offset) {
                // skip a single point
                skipped++;
            } else {
                // add a single point
                result.push(child);
            }
            if (result.length === limit) { break; }
        }

        return skipped;
    };

    Supercluster.prototype._addTileFeatures = function _addTileFeatures (ids, points, x, y, z2, tile) {
        for (var i$1 = 0, list = ids; i$1 < list.length; i$1 += 1) {
            var i = list[i$1];

                var c = points[i];
            var isCluster = c.numPoints;
            var f = {
                type: 1,
                geometry: [[
                    Math.round(this.options.extent * (c.x * z2 - x)),
                    Math.round(this.options.extent * (c.y * z2 - y))
                ]],
                tags: isCluster ? getClusterProperties(c) : this.points[c.index].properties
            };

            // assign id
            var id = (void 0);
            if (isCluster) {
                id = c.id;
            } else if (this.options.generateId) {
                // optionally generate id
                id = c.index;
            } else if (this.points[c.index].id) {
                // keep id if already assigned
                id = this.points[c.index].id;
            }

            if (id !== undefined) { f.id = id; }

            tile.features.push(f);
        }
    };

    Supercluster.prototype._limitZoom = function _limitZoom (z) {
        return Math.max(this.options.minZoom, Math.min(+z, this.options.maxZoom + 1));
    };

    Supercluster.prototype._cluster = function _cluster (points, zoom) {
        var clusters = [];
        var ref = this.options;
            var radius = ref.radius;
            var extent = ref.extent;
            var reduce = ref.reduce;
            var minPoints = ref.minPoints;
        var r = radius / (extent * Math.pow(2, zoom));

        // loop through each point
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            // if we've already visited the point at this zoom level, skip it
            if (p.zoom <= zoom) { continue; }
            p.zoom = zoom;

            // find all nearby points
            var tree = this.trees[zoom + 1];
            var neighborIds = tree.within(p.x, p.y, r);

            var numPointsOrigin = p.numPoints || 1;
            var numPoints = numPointsOrigin;

            // count the number of points in a potential cluster
            for (var i$1 = 0, list = neighborIds; i$1 < list.length; i$1 += 1) {
                var neighborId = list[i$1];

                    var b = tree.points[neighborId];
                // filter out neighbors that are already processed
                if (b.zoom > zoom) { numPoints += b.numPoints || 1; }
            }

            if (numPoints >= minPoints) { // enough points to form a cluster
                var wx = p.x * numPointsOrigin;
                var wy = p.y * numPointsOrigin;

                var clusterProperties = reduce && numPointsOrigin > 1 ? this._map(p, true) : null;

                // encode both zoom and point index on which the cluster originated -- offset by total length of features
                var id = (i << 5) + (zoom + 1) + this.points.length;

                for (var i$2 = 0, list$1 = neighborIds; i$2 < list$1.length; i$2 += 1) {
                    var neighborId$1 = list$1[i$2];

                        var b$1 = tree.points[neighborId$1];

                    if (b$1.zoom <= zoom) { continue; }
                    b$1.zoom = zoom; // save the zoom (so it doesn't get processed twice)

                    var numPoints2 = b$1.numPoints || 1;
                    wx += b$1.x * numPoints2; // accumulate coordinates for calculating weighted center
                    wy += b$1.y * numPoints2;

                    b$1.parentId = id;

                    if (reduce) {
                        if (!clusterProperties) { clusterProperties = this._map(p, true); }
                        reduce(clusterProperties, this._map(b$1));
                    }
                }

                p.parentId = id;
                clusters.push(createCluster(wx / numPoints, wy / numPoints, id, numPoints, clusterProperties));

            } else { // left points as unclustered
                clusters.push(p);

                if (numPoints > 1) {
                    for (var i$3 = 0, list$2 = neighborIds; i$3 < list$2.length; i$3 += 1) {
                        var neighborId$2 = list$2[i$3];

                            var b$2 = tree.points[neighborId$2];
                        if (b$2.zoom <= zoom) { continue; }
                        b$2.zoom = zoom;
                        clusters.push(b$2);
                    }
                }
            }
        }

        return clusters;
    };

    // get index of the point from which the cluster originated
    Supercluster.prototype._getOriginId = function _getOriginId (clusterId) {
        return (clusterId - this.points.length) >> 5;
    };

    // get zoom of the point from which the cluster originated
    Supercluster.prototype._getOriginZoom = function _getOriginZoom (clusterId) {
        return (clusterId - this.points.length) % 32;
    };

    Supercluster.prototype._map = function _map (point, clone) {
        if (point.numPoints) {
            return clone ? extend({}, point.properties) : point.properties;
        }
        var original = this.points[point.index].properties;
        var result = this.options.map(original);
        return clone && result === original ? extend({}, result) : result;
    };

    function createCluster(x, y, id, numPoints, properties) {
        return {
            x: x, // weighted cluster center
            y: y,
            zoom: Infinity, // the last zoom the cluster was processed at
            id: id, // encodes index of the first child of the cluster and its zoom level
            parentId: -1, // parent cluster id
            numPoints: numPoints,
            properties: properties
        };
    }

    function createPointCluster(p, id) {
        var ref = p.geometry.coordinates;
        var x = ref[0];
        var y = ref[1];
        return {
            x: lngX(x), // projected point coordinates
            y: latY(y),
            zoom: Infinity, // the last zoom the point was processed at
            index: id, // index of the source feature in the original input array,
            parentId: -1 // parent cluster id
        };
    }

    function getClusterJSON(cluster) {
        return {
            type: 'Feature',
            id: cluster.id,
            properties: getClusterProperties(cluster),
            geometry: {
                type: 'Point',
                coordinates: [xLng(cluster.x), yLat(cluster.y)]
            }
        };
    }

    function getClusterProperties(cluster) {
        var count = cluster.numPoints;
        var abbrev =
            count >= 10000 ? ((Math.round(count / 1000)) + "k") :
            count >= 1000 ? ((Math.round(count / 100) / 10) + "k") : count;
        return extend(extend({}, cluster.properties), {
            cluster: true,
            cluster_id: cluster.id,
            point_count: count,
            point_count_abbreviated: abbrev
        });
    }

    // longitude/latitude to spherical mercator in [0..1] range
    function lngX(lng) {
        return lng / 360 + 0.5;
    }
    function latY(lat) {
        var sin = Math.sin(lat * Math.PI / 180);
        var y = (0.5 - 0.25 * Math.log((1 + sin) / (1 - sin)) / Math.PI);
        return y < 0 ? 0 : y > 1 ? 1 : y;
    }

    // spherical mercator to longitude/latitude
    function xLng(x) {
        return (x - 0.5) * 360;
    }
    function yLat(y) {
        var y2 = (180 - y * 360) * Math.PI / 180;
        return 360 * Math.atan(Math.exp(y2)) / Math.PI - 90;
    }

    function extend(dest, src) {
        for (var id in src) { dest[id] = src[id]; }
        return dest;
    }

    function getX(p) {
        return p.x;
    }
    function getY(p) {
        return p.y;
    }

    // 定义BaseLayer类
    var BaseLayer = /** @class */ (function () {
        function BaseLayer(map, dataSet, options) {
            var processedDataSet;
            if (!(dataSet instanceof DataSet$1)) {
                processedDataSet = new DataSet$1(dataSet);
            }
            else {
                processedDataSet = dataSet;
            }
            this.dataSet = processedDataSet;
            this.map = map;
            this.options = options;
            if (options.draw === 'cluster') {
                this.refreshCluster(options);
            }
        }
        BaseLayer.prototype.refreshCluster = function (options) {
            options = options || this.options;
            this.supercluster = new Supercluster({
                maxZoom: options.maxZoom || 19,
                radius: options.clusterRadius || 100,
                minPoints: options.minPoints || 2,
                extent: options.extent || 512
            });
            this.supercluster.load(this.dataSet.get());
            // 拿到每个级别下的最大值最小值
            this.supercluster.trees.forEach(function (item) {
                var max = 0;
                var min = Infinity;
                item.points.forEach(function (point) {
                    max = Math.max(point.numPoints || 0, max);
                    min = Math.min(point.numPoints || Infinity, min);
                });
                item.max = max;
                item.min = min;
            });
            this.clusterDataSet = new DataSet$1();
        };
        BaseLayer.prototype.getDefaultContextConfig = function () {
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
        };
        BaseLayer.prototype.initDataRange = function (options) {
            var self = this;
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
                var min = self.options.min || this.dataSet.getMin('count') || 0;
                var max = self.options.max || this.dataSet.getMax('count') || 100;
                self.choropleth.generateByMinMax(min, max);
            }
        };
        BaseLayer.prototype.getLegend = function (options) {
            var _a, _b, _c;
            this.options.draw;
            var legend = null;
            var self = this;
            if (self.options.draw === 'intensity' || self.options.draw === 'heatmap') {
                return (_a = this.intensity) === null || _a === void 0 ? void 0 : _a.getLegend(options);
            }
            else if (self.options.draw === 'category') {
                return (_b = this.category) === null || _b === void 0 ? void 0 : _b.getLegend(options);
            }
            else if (self.options.draw === 'choropleth') {
                return (_c = this.choropleth) === null || _c === void 0 ? void 0 : _c.getLegend(options);
            }
            return legend;
        };
        BaseLayer.prototype.processData = function (data) {
            var _a, _b, _c, _d, _e;
            var self = this;
            var draw = self.options.draw;
            if (draw === 'bubble' || draw === 'intensity' || draw === 'category' || draw === 'choropleth' || draw === 'simple') {
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    if (self.options.draw === 'bubble') {
                        data[i]._size = (_a = self.intensity) === null || _a === void 0 ? void 0 : _a.getSize(item.count);
                    }
                    else {
                        data[i]._size = undefined;
                    }
                    var styleType = '_fillStyle';
                    if (((_b = data[i].geometry) === null || _b === void 0 ? void 0 : _b.type) === 'LineString' || self.options.styleType === 'stroke') {
                        styleType = '_strokeStyle';
                    }
                    if (self.options.draw === 'intensity') {
                        data[i][styleType] = (_c = self.intensity) === null || _c === void 0 ? void 0 : _c.getColor(item.count);
                    }
                    else if (self.options.draw === 'category') {
                        data[i][styleType] = (_d = self.category) === null || _d === void 0 ? void 0 : _d.get(item.count);
                    }
                    else if (self.options.draw === 'choropleth') {
                        data[i][styleType] = (_e = self.choropleth) === null || _e === void 0 ? void 0 : _e.get(item.count);
                    }
                }
            }
        };
        BaseLayer.prototype.isEnabledTime = function () {
            var animationOptions = this.options.animation;
            var flag = animationOptions && !(animationOptions.enabled === false);
            return !!flag;
        };
        BaseLayer.prototype.argCheck = function (options) {
            if (options.draw === 'heatmap') {
                if (options.strokeStyle) {
                    console.warn('[heatmap] options.strokeStyle is discard, pleause use options.strength [eg: options.strength = 0.1]');
                }
            }
        };
        BaseLayer.prototype.drawContext = function (context, dataSet, options, nwPixel) {
            var self = this;
            switch (self.options.draw) {
                case 'heatmap':
                    drawHeatmap.draw(context, dataSet, self.options);
                    break;
                case 'grid':
                case 'cluster':
                case 'honeycomb':
                    self.options.offset = {
                        x: nwPixel.x,
                        y: nwPixel.y
                    };
                    if (self.options.draw === 'grid') {
                        drawGrid.draw(context, dataSet, self.options);
                    }
                    else if (self.options.draw === 'cluster') {
                        drawCluster.draw(context, dataSet, self.options);
                    }
                    else {
                        drawHoneycomb.draw(context, dataSet, self.options);
                    }
                    break;
                case 'text':
                    drawText.draw(context, dataSet, self.options);
                    break;
                case 'icon':
                    drawIcon.draw(context, dataSet, self.options);
                    break;
                case 'clip':
                    drawClip.draw(context, dataSet, self.options);
                    break;
                default:
                    if (self.options.context === 'webgl') {
                        webglDrawSimple.draw(context, dataSet, self.options);
                    }
                    else {
                        // 使用增强版绘制函数
                        if (self.options.enhancedDraw) {
                            drawSimple.drawEnhanced(context, dataSet, self.options);
                        }
                        else {
                            drawSimple.draw(context, dataSet, self.options);
                        }
                    }
            }
            if (self.options.arrow && self.options.arrow.show !== false) {
                object.draw(context, dataSet, self.options);
            }
        };
        BaseLayer.prototype.isPointInPath = function (context, pixel) {
            var _a, _b, _c, _d;
            var ctx = this.getContext();
            var conf = this.getDefaultContextConfig();
            for (var i in conf) {
                ctx[i] = conf[i];
            }
            var data;
            if (this.options.draw === 'cluster' &&
                (!this.options.maxClusterZoom || this.options.maxClusterZoom >= this.getZoom())) {
                data = ((_a = this.clusterDataSet) === null || _a === void 0 ? void 0 : _a.get()) || [];
            }
            else {
                data = this.dataSet.get();
            }
            var _loop_1 = function (i) {
                ctx.beginPath();
                var options = this_1.options;
                var x = pixel.x * (((_b = this_1.canvasLayer) === null || _b === void 0 ? void 0 : _b.devicePixelRatio) || 1);
                var y = pixel.y * (((_c = this_1.canvasLayer) === null || _c === void 0 ? void 0 : _c.devicePixelRatio) || 1);
                options.multiPolygonDraw = function () {
                    if (ctx.isPointInPath(x, y)) {
                        return data[i];
                    }
                    return null;
                };
                pathSimple.draw(ctx, data[i], options);
                var geoType = (_d = data[i].geometry) === null || _d === void 0 ? void 0 : _d.type;
                if ((geoType === null || geoType === void 0 ? void 0 : geoType.indexOf('LineString')) !== -1) {
                    if (ctx.isPointInStroke && ctx.isPointInStroke(x, y)) {
                        return { value: data[i] };
                    }
                }
                else {
                    if (ctx.isPointInPath(x, y)) {
                        return { value: data[i] };
                    }
                }
            };
            var this_1 = this;
            for (var i = 0; i < data.length; i++) {
                var state_1 = _loop_1(i);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
            return null;
        };
        // 递归获取聚合点下的所有原始点数据
        BaseLayer.prototype.getClusterPoints = function (cluster) {
            var _this = this;
            var _a;
            if (cluster.type !== 'Feature') {
                return [];
            }
            var children = ((_a = this.supercluster) === null || _a === void 0 ? void 0 : _a.getChildren(cluster.id)) || [];
            return children
                .map(function (item) {
                if (item.type === 'Feature') {
                    return _this.getClusterPoints(item);
                }
                else {
                    return item;
                }
            })
                .flat();
        };
        /**
         * 获取指定范围内的数据点
         * @param {Object} bounds - 地理范围边界
         */
        BaseLayer.prototype.getDataInBounds = function (bounds) {
            var data = this.dataSet.get();
            var result = [];
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                if (item.geometry && item.geometry.coordinates) {
                    var coords = item.geometry.coordinates;
                    if (bounds.contains(coords)) {
                        result.push(item);
                    }
                }
            }
            return result;
        };
        /**
         * 根据条件过滤数据
         * @param {Function} filter - 过滤函数
         */
        BaseLayer.prototype.filterData = function (filter) {
            if (typeof filter === 'function') {
                var filteredData = this.dataSet.filter(filter);
                return new DataSet$1(filteredData);
            }
            return this.dataSet;
        };
        /**
         * 更新数据集
         * @param {Array|DataSet} data - 新数据
         */
        BaseLayer.prototype.updateData = function (data) {
            if (data instanceof DataSet$1) {
                this.dataSet = data;
            }
            else if (Array.isArray(data)) {
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
        };
        /**
         * 添加数据
         * @param {Object|Array} data - 要添加的数据
         */
        BaseLayer.prototype.addData = function (data) {
            this.dataSet.add(data);
            // 如果是聚类图，需要刷新聚类
            if (this.options.draw === 'cluster') {
                this.refreshCluster(this.options);
            }
            // 重新初始化数据范围
            this.initDataRange(this.options);
            // 重新绘制
            this.draw();
        };
        /**
         * 清除数据
         */
        BaseLayer.prototype.clearData = function () {
            this.dataSet.clear();
            // 如果是聚类图，需要刷新聚类
            if (this.options.draw === 'cluster') {
                this.refreshCluster(this.options);
            }
            // 重新绘制
            this.draw();
        };
        /**
         * 获取数据统计信息
         */
        BaseLayer.prototype.getDataStats = function () {
            var data = this.dataSet.get();
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
        };
        BaseLayer.prototype.clickEvent = function (pixel, e) {
            var _a, _b, _c, _d;
            if (!this.options.methods) {
                return;
            }
            var dataItem = this.isPointInPath(this.getContext(), pixel);
            if (dataItem) {
                if (this.options.draw === 'cluster') {
                    var children = this.getClusterPoints(dataItem);
                    dataItem.children = children;
                }
                (_b = (_a = this.options.methods).click) === null || _b === void 0 ? void 0 : _b.call(_a, dataItem, e);
            }
            else {
                (_d = (_c = this.options.methods).click) === null || _d === void 0 ? void 0 : _d.call(_c, null, e);
            }
        };
        BaseLayer.prototype.mousemoveEvent = function (pixel, e) {
            var _a, _b, _c, _d;
            if (!this.options.methods) {
                return;
            }
            var dataItem = this.isPointInPath(this.getContext(), pixel);
            if (dataItem) {
                if (this.options.draw === 'cluster') {
                    var children = this.getClusterPoints(dataItem);
                    dataItem.children = children;
                }
                (_b = (_a = this.options.methods).mousemove) === null || _b === void 0 ? void 0 : _b.call(_a, dataItem, e);
            }
            else {
                (_d = (_c = this.options.methods).mousemove) === null || _d === void 0 ? void 0 : _d.call(_c, null, e);
            }
        };
        /**
         * 悬停事件处理
         * @param {Object} pixel - 像素坐标
         * @param {Event} e - 事件对象
         */
        BaseLayer.prototype.hoverEvent = function (pixel, e) {
            var _a, _b, _c, _d;
            if (!this.options.methods || !this.options.methods.hover) {
                return;
            }
            var dataItem = this.isPointInPath(this.getContext(), pixel);
            if (dataItem) {
                if (this.options.draw === 'cluster') {
                    var children = this.getClusterPoints(dataItem);
                    dataItem.children = children;
                }
                (_b = (_a = this.options.methods).hover) === null || _b === void 0 ? void 0 : _b.call(_a, dataItem, e);
            }
            else {
                (_d = (_c = this.options.methods).hover) === null || _d === void 0 ? void 0 : _d.call(_c, null, e);
            }
        };
        /**
         * 双击事件处理
         * @param {Object} pixel - 像素坐标
         * @param {Event} e - 事件对象
         */
        BaseLayer.prototype.doubleClickEvent = function (pixel, e) {
            var _a, _b, _c, _d;
            if (!this.options.methods || !this.options.methods.doubleClick) {
                return;
            }
            var dataItem = this.isPointInPath(this.getContext(), pixel);
            if (dataItem) {
                if (this.options.draw === 'cluster') {
                    var children = this.getClusterPoints(dataItem);
                    dataItem.children = children;
                }
                (_b = (_a = this.options.methods).doubleClick) === null || _b === void 0 ? void 0 : _b.call(_a, dataItem, e);
            }
            else {
                (_d = (_c = this.options.methods).doubleClick) === null || _d === void 0 ? void 0 : _d.call(_c, null, e);
            }
        };
        BaseLayer.prototype.tapEvent = function (pixel, e) {
            var _a, _b, _c, _d;
            if (!this.options.methods) {
                return;
            }
            var dataItem = this.isPointInPath(this.getContext(), pixel);
            if (dataItem) {
                if (this.options.draw === 'cluster') {
                    var children = this.getClusterPoints(dataItem);
                    dataItem.children = children;
                }
                (_b = (_a = this.options.methods).tap) === null || _b === void 0 ? void 0 : _b.call(_a, dataItem, e);
            }
            else {
                (_d = (_c = this.options.methods).tap) === null || _d === void 0 ? void 0 : _d.call(_c, null, e);
            }
        };
        /**
         * obj.options
         */
        BaseLayer.prototype.update = function (obj, isDraw) {
            var self = this;
            var _options = obj.options;
            var options = self.options;
            for (var i in _options) {
                options[i] = _options[i];
            }
            self.init(options);
            if (isDraw !== false) {
                self.draw();
            }
        };
        /**
         * 更新图层选项
         * @param {Object} options - 新选项
         * @param {Boolean} redraw - 是否重绘
         */
        BaseLayer.prototype.updateOptions = function (options, redraw) {
            if (redraw === void 0) { redraw = true; }
            var self = this;
            for (var key in options) {
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
        };
        BaseLayer.prototype.setOptions = function (options) {
            var self = this;
            self.dataSet.reset();
            // console.log('xxx1')
            self.init(options);
            // console.log('xxx')
            self.draw();
        };
        BaseLayer.prototype.set = function (obj) {
            var self = this;
            var ctx = this.getContext();
            var conf = this.getDefaultContextConfig();
            for (var i in conf) {
                ctx[i] = conf[i];
            }
            self.init(obj.options);
            self.draw();
        };
        BaseLayer.prototype.destroy = function () {
            this.unbindEvent();
            this.hide();
        };
        BaseLayer.prototype.initAnimator = function () {
            var _a;
            var self = this;
            var animationOptions = self.options.animation;
            if (self.options.draw === 'time' || self.isEnabledTime()) {
                if (!(animationOptions === null || animationOptions === void 0 ? void 0 : animationOptions.stepsRange)) {
                    animationOptions.stepsRange = {
                        start: this.dataSet.getMin('time') || 0,
                        end: this.dataSet.getMax('time') || 0
                    };
                }
                this.steps = { step: animationOptions.stepsRange.start };
                self.animator = new TWEEN.Tween(this.steps)
                    .onUpdate(function () {
                    self._canvasUpdate(this.step);
                })
                    .repeat(Infinity);
                this.addAnimatorEvent();
                var duration = ((animationOptions === null || animationOptions === void 0 ? void 0 : animationOptions.duration) || 5) * 1000;
                self.animator.to({ step: animationOptions.stepsRange.end }, duration);
                self.animator.start();
            }
            else {
                (_a = self.animator) === null || _a === void 0 ? void 0 : _a.stop();
            }
        };
        BaseLayer.prototype.addAnimatorEvent = function () { };
        BaseLayer.prototype.animatorMovestartEvent = function () {
            var animationOptions = this.options.animation;
            if (this.isEnabledTime() && this.animator) {
                this.steps.step = animationOptions.stepsRange.start;
                this.animator.stop();
            }
        };
        BaseLayer.prototype.animatorMoveendEvent = function () {
            if (this.isEnabledTime() && this.animator) {
                this.animator.start();
            }
        };
        /**
         * 导出数据为GeoJSON格式
         */
        BaseLayer.prototype.toGeoJSON = function () {
            var data = this.dataSet.get();
            var geojson = {
                type: "FeatureCollection",
                features: []
            };
            data.forEach(function (item) {
                if (item.geometry) {
                    geojson.features.push({
                        type: "Feature",
                        properties: Object.assign({}, item),
                        geometry: item.geometry
                    });
                }
            });
            return geojson;
        };
        /**
         * 导出数据为CSV格式
         */
        BaseLayer.prototype.toCSV = function () {
            var data = this.dataSet.get();
            if (data.length === 0)
                return "";
            // 获取所有属性名作为表头
            var headers = Object.keys(data[0]).filter(function (key) { return key !== 'geometry'; });
            var csv = headers.join(',') + '\n';
            // 添加数据行
            data.forEach(function (item) {
                var row = headers.map(function (header) {
                    var value = item[header];
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
        };
        // 以下方法需要在子类中实现
        BaseLayer.prototype.init = function (options) { };
        BaseLayer.prototype.draw = function () { };
        BaseLayer.prototype.getContext = function () { return null; };
        BaseLayer.prototype.getZoom = function () { return 0; };
        BaseLayer.prototype.unbindEvent = function () { };
        BaseLayer.prototype.hide = function () { };
        BaseLayer.prototype._canvasUpdate = function (step) { };
        return BaseLayer;
    }());
    if (typeof window !== 'undefined') {
        requestAnimationFrame(animate);
    }
    function animate(time) {
        requestAnimationFrame(animate);
        TWEEN.update(time);
    }

    var global$2 = typeof window === 'undefined' ? {} : window;
    var BMap$2 = global$2.BMap || global$2.BMapGL;

    class AnimationLayer extends BaseLayer{
        constructor (map, dataSet, options) {

            super(map, dataSet, options);
            this.map = map;
            this.options = options || {};
            this.dataSet = dataSet;

            var canvasLayer = new CanvasLayer$1({
                map: map,
                zIndex: this.options.zIndex,
                update: this._canvasUpdate.bind(this)
            });

            // 动画循环次数
            this.animateLoopFrequency = 0;

            this.init(this.options);

            this.canvasLayer = canvasLayer;
            this.transferToMercator();
            var self = this;
            dataSet.on('change', function() {
                self.transferToMercator();
                canvasLayer.draw();
            });
            this.ctx = canvasLayer.canvas.getContext('2d');

            this.start();
        }

        draw() {
            this.canvasLayer.draw();
        }

        init(options) {

            var self = this;
            self.options = options;
         
            this.initDataRange(options);
            this.context = self.options.context || '2d';

            if (self.options.zIndex) {
                this.canvasLayer && this.canvasLayer.setZIndex(self.options.zIndex);
            }

            if (self.options.max) {
                this.intensity.setMax(self.options.max);
            }

            if (self.options.min) {
                this.intensity.setMin(self.options.min);
            }

            this.initAnimator();
            
        }

        // 经纬度左边转换为墨卡托坐标
        transferToMercator() {
            var map = this.map;
            var mapType = map.getMapType();
            var projection;
            if (mapType.getProjection) {
                projection = mapType.getProjection();
            } else {
                projection = {
                    lngLatToPoint: function(point) {
                        var mc = map.lnglatToMercator(point.lng, point.lat);
                        return {
                            x: mc[0],
                            y: mc[1]
                        }
                    }
                };
            }

            if (this.options.coordType !== 'bd09mc') {
                var data = this.dataSet.get();
                data = this.dataSet.transferCoordinate(data, function(coordinates) {
                    var pixel = projection.lngLatToPoint({
                        lng: coordinates[0],
                        lat: coordinates[1]
                    });
                    return [pixel.x, pixel.y];
                }, 'coordinates', 'coordinates_mercator');
                this.dataSet._set(data);
            }
        }

        _canvasUpdate() {
            var ctx = this.ctx;
            if (!ctx) {
                return;
            }
            //clear(ctx);
            var map = this.map;
            var projection;
            var mcCenter;
            if  (map.getMapType().getProjection) {
                projection = map.getMapType().getProjection();
                mcCenter = projection.lngLatToPoint(map.getCenter());
            } else  {
                mcCenter = {
                    x: map.getCenter().lng,
                    y: map.getCenter().lat
                };
                if (mcCenter.x > -180 && mcCenter.x < 180) {
                    mcCenter = map.lnglatToMercator(mcCenter.x, mcCenter.y);
                    mcCenter = {x: mcCenter[0], y: mcCenter[1]};
                }
                projection = {
                    lngLatToPoint: function(point) {
                        var mc = map.lnglatToMercator(point.lng, point.lat);
                        return {
                            x: mc[0],
                            y: mc[1]
                        }
                    }
                };
            }
            var zoomUnit;
            if (projection.getZoomUnits) {
                zoomUnit = projection.getZoomUnits(map.getZoom());
            } else {
                zoomUnit = Math.pow(2, 18 - map.getZoom());
            }
            var nwMc = new BMap$2.Pixel(mcCenter.x - (map.getSize().width / 2) * zoomUnit, mcCenter.y + (map.getSize().height / 2) * zoomUnit); //左上角墨卡托坐标

            clear(ctx);

            var dataGetOptions = {
                fromColumn: this.options.coordType == 'bd09mc' ? 'coordinates' : 'coordinates_mercator',
                transferCoordinate: function(coordinate) {
                    if (!coordinate) {
                        return;
                    }
                    var x = (coordinate[0] - nwMc.x) / zoomUnit;
                    var y = (nwMc.y - coordinate[1]) / zoomUnit;
                    return [x, y];
                }
            };
            this.data = this.dataSet.get(dataGetOptions);
            this.processData(this.data);
            this.drawAnimation();
        }
        
        drawAnimation() {
            var ctx = this.ctx;
            var data = this.data;
            if (!data) {
                return;
            }
            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = 'rgba(0, 0, 0, .1)';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.restore();

            ctx.save();
            if (this.options.shadowColor) {
                ctx.shadowColor = this.options.shadowColor;
            }

            if (this.options.shadowBlur) {
                ctx.shadowBlur = this.options.shadowBlur;
            }

            if (this.options.globalAlpha) {
                ctx.globalAlpha = this.options.globalAlpha;
            }

            if (this.options.globalCompositeOperation) {
                ctx.globalCompositeOperation = this.options.globalCompositeOperation;
            }
            var options = this.options;
            var hasCalcAnimateLoopFrequency = false;
            for (var i = 0; i < data.length; i++) {
                if (data[i].geometry.type === 'Point') {
                    ctx.beginPath();
                    var maxSize = data[i].size || this.options.size;
                    var minSize = data[i].minSize || this.options.minSize || 0;
                    if (data[i]._size === undefined) {
                        data[i]._size = minSize;
                    }
                    ctx.arc(data[i].geometry._coordinates[0], data[i].geometry._coordinates[1], data[i]._size, 0, Math.PI * 2, true);
                    ctx.closePath();

                    data[i]._size++;

                    if (data[i]._size > maxSize) {
                        data[i]._size = minSize;
                    }
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = data[i].strokeStyle || data[i]._strokeStyle || options.strokeStyle || 'yellow';
                    ctx.stroke();
                    var fillStyle = data[i].fillStyle || data[i]._fillStyle || options.fillStyle;
                    if (fillStyle) {
                        ctx.fillStyle = fillStyle;
                        ctx.fill();
                    }
                } else if (data[i].geometry.type === 'LineString') {
                    ctx.beginPath();
                    var size = data[i].size || this.options.size || 5;
                    var minSize = data[i].minSize || this.options.minSize || 0;
                    if (data[i]._index === undefined) {
                        data[i]._index = 0;
                    }
                    var index = data[i]._index;
                    
                    ctx.arc(data[i].geometry._coordinates[index][0], data[i].geometry._coordinates[index][1], size, 0, Math.PI * 2, true);
                    ctx.closePath();
                    data[i]._index = data[i]._index + (data[i]._step || 1);
                    var strokeStyle = data[i].strokeStyle || options.strokeStyle;
                    var fillStyle = data[i].fillStyle || options.fillStyle || 'yellow';
                    ctx.fillStyle = fillStyle;
                    ctx.fill();
                    if (strokeStyle && options.lineWidth) {
                        ctx.lineWidth = options.lineWidth || 1;
                        ctx.strokeStyle = strokeStyle;
                        ctx.stroke();
                    }
                    if (data[i]._index >= data[i].geometry._coordinates.length) {
                        if (options.isRound) {
                            data[i]._step = -1;
                            data[i]._index = data[i].geometry._coordinates.length - 1;
                        } else {
                            data[i]._index = 0;
                            // 达到了临界值，并且在此次循环中动画次数没有计算，则加1 
                            !hasCalcAnimateLoopFrequency && this.animateLoopFrequency++;
                            // 开关关掉，一次循环中只能加一次动画执行次数
                            hasCalcAnimateLoopFrequency = true;
                        }
                    } 
                    if (data[i]._index < 0 && options.isRound) {
                        data[i]._step = 1;
                        data[i]._index = 0;
                        !hasCalcAnimateLoopFrequency && this.animateLoopFrequency++;
                        hasCalcAnimateLoopFrequency = true;
                    }
                }
            }
            ctx.restore();
        }

        animate() {
            var prevAnimateLoopFrequency = this.animateLoopFrequency;
            this.drawAnimation();
            var animateTime = this.options.animateTime || 100;
            var stayTime = this.options.stayTime;
            // 动画有停留的时间，并且 循环次数也改变了，则使用停留时间
            if (stayTime && this.animateLoopFrequency != prevAnimateLoopFrequency) {
                this.hide();
                this.timeout = setTimeout(() => {
                    this.canvasLayer.show();
                    this.animate();
                }, stayTime);
            } else {
                this.timeout = setTimeout(this.animate.bind(this), animateTime);
            }
            var timesTimer = null;
            if (this.options.times !== undefined && this.animateLoopFrequency >= this.options.times) {
                this.stop();
                timesTimer && clearTimeout(timesTimer);
                timesTimer = setTimeout(this.hide.bind(this), animateTime);
                return;
            }
        }

        start() {
            this.stop();
            this.animate();
        }

        stop() {
            clearTimeout(this.timeout);
        }

        unbindEvent() {
        }

        hide() {
            this.canvasLayer.hide();
            this.stop();
        }

        show() {
            this.start();
        }

        clearData() {
            this.dataSet && this.dataSet.clear();
            this.update({
                options: null
            });
        }

        destroy() {
            this.stop();
            this.unbindEvent();
            this.clearData();
            this.map.removeOverlay(this.canvasLayer);
            this.canvasLayer = null;
        }
    }

    var global$1 = typeof window === 'undefined' ? {} : window;
    var BMap$1 = global$1.BMap || global$1.BMapGL;

    class Layer$5 extends BaseLayer {
        constructor(map, dataSet, options) {
            super(map, dataSet, options);

            var self = this;
            options = options || {};

            this.clickEvent = this.clickEvent.bind(this);
            this.mousemoveEvent = this.mousemoveEvent.bind(this);
            this.tapEvent = this.tapEvent.bind(this);
            this.doubleClickEvent = this.doubleClickEvent.bind(this);

            self.init(options);
            self.argCheck(options);
            self.transferToMercator();

            var canvasLayer = (this.canvasLayer = new CanvasLayer$1({
                map: map,
                context: this.context,
                updateImmediate: options.updateImmediate,
                paneName: options.paneName,
                mixBlendMode: options.mixBlendMode,
                enableMassClear: options.enableMassClear,
                zIndex: options.zIndex,
                update() {
                    self._canvasUpdate();
                }
            }));

            dataSet.on('change', function () {
                self.transferToMercator();
                // 数据更新后重新生成聚合数据
                if (options.draw === 'cluster') {
                    self.refreshCluster();
                }
                canvasLayer.draw();
            });
        }

        clickEvent(e) {
            var pixel = e.pixel;
            super.clickEvent(pixel, e);
        }

        mousemoveEvent(e) {
            var pixel = e.pixel;
            super.mousemoveEvent(pixel, e);
        }

        tapEvent(e) {
            var pixel = e.pixel;
            super.tapEvent(pixel, e);
        }

        doubleClickEvent(e) {
            var pixel = e.pixel;
            super.doubleClickEvent(pixel, e);
        }

        bindEvent(e) {
            this.unbindEvent();
            var map = this.map;
            var timer = 0;
            var that = this;

            if (this.options.methods) {
                if (this.options.methods.click) {
                    map.setDefaultCursor('default');
                    map.addEventListener('click', this.clickEvent);
                }
                if (this.options.methods.mousemove) {
                    map.addEventListener('mousemove', this.mousemoveEvent);
                }
                
                // 添加悬停事件支持
                if (this.options.methods.hover) {
                    map.addEventListener('mouseover', this.mousemoveEvent);
                    map.addEventListener('mouseout', this.mousemoveEvent);
                }
                
                // 添加双击事件支持
                if (this.options.methods.doubleClick) {
                    map.addEventListener('dblclick', this.doubleClickEvent);
                }

                if ('ontouchend' in window.document && this.options.methods.tap) {
                    map.addEventListener('touchstart', function (e) {
                        timer = new Date();
                    });
                    map.addEventListener('touchend', function (e) {
                        if (new Date() - timer < 300) {
                            that.tapEvent(e);
                        }
                    });
                }
            }
        }

        unbindEvent(e) {
            var map = this.map;

            if (this.options.methods) {
                if (this.options.methods.click) {
                    map.removeEventListener('click', this.clickEvent);
                }
                if (this.options.methods.mousemove) {
                    map.removeEventListener('mousemove', this.mousemoveEvent);
                }
                // 移除悬停事件
                if (this.options.methods.hover) {
                    map.removeEventListener('mouseover', this.mousemoveEvent);
                    map.removeEventListener('mouseout', this.mousemoveEvent);
                }
                // 移除双击事件
                if (this.options.methods.doubleClick) {
                    map.removeEventListener('dblclick', this.doubleClickEvent);
                }
            }
        }

        // 经纬度左边转换为墨卡托坐标
        transferToMercator(dataSet) {
            if (!dataSet) {
                dataSet = this.dataSet;
            }

            var map = this.map;

            var mapType = map.getMapType();
            var projection;
            if (mapType.getProjection) {
                projection = mapType.getProjection();
            } else {
                projection = {
                    lngLatToPoint: function (point) {
                        var mc = map.lnglatToMercator(point.lng, point.lat);
                        return {
                            x: mc[0],
                            y: mc[1]
                        };
                    }
                };
            }

            if (this.options.coordType !== 'bd09mc') {
                var data = dataSet.get();
                data = dataSet.transferCoordinate(
                    data,
                    function (coordinates) {
                        if (coordinates[0] < -180 || coordinates[0] > 180 || coordinates[1] < -90 || coordinates[1] > 90) {
                            return coordinates;
                        } else {
                            var pixel = projection.lngLatToPoint({
                                lng: coordinates[0],
                                lat: coordinates[1]
                            });
                            return [pixel.x, pixel.y];
                        }
                    },
                    'coordinates',
                    'coordinates_mercator'
                );
                dataSet._set(data);
            }
        }

        getContext() {
            return this.canvasLayer.canvas.getContext(this.context);
        }

        _canvasUpdate(time) {
            if (!this.canvasLayer) {
                return;
            }
            var self = this;
            var animationOptions = this.options.animation;
            var map = this.canvasLayer._map;
            var projection;
            var mcCenter;
            if (map.getMapType().getProjection) {
                projection = map.getMapType().getProjection();
                mcCenter = projection.lngLatToPoint(map.getCenter());
            } else {
                mcCenter = {
                    x: map.getCenter().lng,
                    y: map.getCenter().lat
                };
                if (mcCenter.x > -180 && mcCenter.x < 180) {
                    mcCenter = map.lnglatToMercator(mcCenter.x, mcCenter.y);
                    mcCenter = {x: mcCenter[0], y: mcCenter[1]};
                }
                projection = {
                    lngLatToPoint: function (point) {
                        var mc = map.lnglatToMercator(point.lng, point.lat);
                        return {
                            x: mc[0],
                            y: mc[1]
                        };
                    }
                };
            }
            var zoomUnit;
            if (projection.getZoomUnits) {
                zoomUnit = projection.getZoomUnits(map.getZoom());
            } else {
                zoomUnit = Math.pow(2, 18 - map.getZoom());
            }
            //左上角墨卡托坐标
            var nwMc = new BMap$1.Pixel(
                mcCenter.x - (map.getSize().width / 2) * zoomUnit,
                mcCenter.y + (map.getSize().height / 2) * zoomUnit
            );

            var context = this.getContext();
            if (this.isEnabledTime()) {
                if (time === undefined) {
                    clear(context);
                    return;
                }
                if (this.context == '2d') {
                    context.save();
                    context.globalCompositeOperation = 'destination-out';
                    context.fillStyle = 'rgba(0, 0, 0, .1)';
                    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
                    context.restore();
                }
            } else {
                clear(context);
            }

            if (this.context == '2d') {
                for (var key in this.options) {
                    context[key] = this.options[key];
                }
            } else {
                context.clear(context.COLOR_BUFFER_BIT);
            }

            if (
                (this.options.minZoom && map.getZoom() < this.options.minZoom) ||
                (this.options.maxZoom && map.getZoom() > this.options.maxZoom)
            ) {
                return;
            }

            var scale = 1;
            if (this.context != '2d') {
                scale = this.canvasLayer.devicePixelRatio;
            }

            var dataGetOptions = {
                fromColumn: this.options.coordType == 'bd09mc' ? 'coordinates' : 'coordinates_mercator',
                transferCoordinate: function (coordinate) {
                    var x = ((coordinate[0] - nwMc.x) / zoomUnit) * scale;
                    var y = ((nwMc.y - coordinate[1]) / zoomUnit) * scale;
                    return [x, y];
                }
            };

            if (time !== undefined) {
                dataGetOptions.filter = function (item) {
                    var trails = animationOptions.trails || 10;
                    if (time && item.time > time - trails && item.time < time) {
                        return true;
                    } else {
                        return false;
                    }
                };
            }

            // get data from data set
            var data;
            var zoom = this.getZoom();
            if (this.options.draw === 'cluster' && (!this.options.maxClusterZoom || this.options.maxClusterZoom >= zoom)) {
                var bounds = this.map.getBounds();
                var ne = bounds.getNorthEast();
                var sw = bounds.getSouthWest();
                var clusterData = this.supercluster.getClusters([sw.lng, sw.lat, ne.lng, ne.lat], zoom);
                this.pointCountMax = this.supercluster.trees[zoom].max;
                this.pointCountMin = this.supercluster.trees[zoom].min;
                var intensity = {};
                var color = null;
                var size = null;
                if (this.pointCountMax === this.pointCountMin) {
                    color = this.options.fillStyle;
                    size = this.options.minSize || 8;
                } else {
                    intensity = new Intensity({
                        min: this.pointCountMin,
                        max: this.pointCountMax,
                        minSize: this.options.minSize || 8,
                        maxSize: this.options.maxSize || 30,
                        gradient: this.options.gradient
                    });
                }
                for (var i = 0; i < clusterData.length; i++) {
                    var item = clusterData[i];
                    if (item.properties && item.properties.cluster_id) {
                        clusterData[i].size = size || intensity.getSize(item.properties.point_count);
                        clusterData[i].fillStyle = color || intensity.getColor(item.properties.point_count);
                    } else {
                        clusterData[i].size = self.options.size;
                    }
                }

                this.clusterDataSet.set(clusterData);
                this.transferToMercator(this.clusterDataSet);
                data = self.clusterDataSet.get(dataGetOptions);
            } else {
                data = self.dataSet.get(dataGetOptions);
            }

            this.processData(data);

            var nwPixel = map.pointToPixel(new BMap$1.Point(0, 0));

            if (self.options.unit == 'm') {
                if (self.options.size) {
                    self.options._size = self.options.size / zoomUnit;
                }
                if (self.options.width) {
                    self.options._width = self.options.width / zoomUnit;
                }
                if (self.options.height) {
                    self.options._height = self.options.height / zoomUnit;
                }
            } else {
                self.options._size = self.options.size;
                self.options._height = self.options.height;
                self.options._width = self.options.width;
            }

            this.drawContext(context, data, self.options, nwPixel);

            //console.timeEnd('draw');

            //console.timeEnd('update')
            self.options.updateCallback && self.options.updateCallback(time);
        }

        init(options) {
            var self = this;
            self.options = options;
            this.initDataRange(options);
            this.context = self.options.context || '2d';

            if (self.options.zIndex) {
                this.canvasLayer && this.canvasLayer.setZIndex(self.options.zIndex);
            }

            if (self.options.max) {
                this.intensity.setMax(self.options.max);
            }

            if (self.options.min) {
                this.intensity.setMin(self.options.min);
            }

            this.initAnimator();
            this.bindEvent();
        }

        getZoom() {
            return this.map.getZoom();
        }

        addAnimatorEvent() {
            this.map.addEventListener('movestart', this.animatorMovestartEvent.bind(this));
            this.map.addEventListener('moveend', this.animatorMoveendEvent.bind(this));
        }

        show() {
            this.map.addOverlay(this.canvasLayer);
            this.bindEvent();
        }

        hide() {
            this.unbindEvent();
            this.map.removeOverlay(this.canvasLayer);
        }

        draw() {
            this.canvasLayer && this.canvasLayer.draw();
        }

        clearData() {
            this.dataSet && this.dataSet.clear();
            this.update({
                options: null
            });
        }

        /**
         * 更新图层数据
         * @param {Array|DataSet} data - 新数据
         */
        updateData(data) {
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
        addData(data) {
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
         * 获取当前视图范围内的数据
         */
        getDataInBounds() {
            var bounds = this.map.getBounds();
            var ne = bounds.getNorthEast();
            var sw = bounds.getSouthWest();
            var boundsArray = [sw.lng, sw.lat, ne.lng, ne.lat];
            var zoom = this.getZoom();
            
            if (this.options.draw === 'cluster' && (!this.options.maxClusterZoom || this.options.maxClusterZoom >= zoom)) {
                return this.supercluster.getClusters(boundsArray, zoom);
            } else {
                // 简单过滤，实际应该使用更精确的方法
                return this.dataSet.get().filter(item => {
                    if (item.geometry && item.geometry.coordinates) {
                        var coords = item.geometry.coordinates;
                        return coords[0] >= sw.lng && coords[0] <= ne.lng && 
                               coords[1] >= sw.lat && coords[1] <= ne.lat;
                    }
                    return false;
                });
            }
        }

        /**
         * 设置图层透明度
         * @param {Number} opacity - 透明度值 (0-1)
         */
        setOpacity(opacity) {
            if (this.canvasLayer && this.canvasLayer.canvas) {
                this.canvasLayer.canvas.style.opacity = opacity;
            }
        }

        /**
         * 获取图层透明度
         */
        getOpacity() {
            if (this.canvasLayer && this.canvasLayer.canvas) {
                return parseFloat(this.canvasLayer.canvas.style.opacity) || 1;
            }
            return 1;
        }

        /**
         * 切换图层可见性
         */
        toggle() {
            if (this.canvasLayer && this.canvasLayer.canvas) {
                var canvas = this.canvasLayer.canvas;
                canvas.style.display = canvas.style.display === 'none' ? 'block' : 'none';
            }
        }

        /**
         * 获取图层状态信息
         */
        getLayerInfo() {
            return {
                zoom: this.getZoom(),
                visible: this.canvasLayer && this.canvasLayer.canvas ? 
                         this.canvasLayer.canvas.style.display !== 'none' : true,
                opacity: this.getOpacity(),
                dataCount: this.dataSet ? this.dataSet.getTotal() : 0,
                drawType: this.options.draw
            };
        }

        destroy() {
            this.unbindEvent();
            this.clearData();
            this.map.removeOverlay(this.canvasLayer);
            this.canvasLayer = null;
        }
    }

    /**
     * Copyright 2012 Google Inc. All Rights Reserved.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */

    /**
     * @fileoverview Extends OverlayView to provide a canvas "Layer".
     * @author Brendan Kenny
     */

    /**
     * A map layer that provides a canvas over the slippy map and a callback
     * system for efficient animation. Requires canvas and CSS 2D transform
     * support.
     * @constructor
     * @extends google.maps.OverlayView
     * @param {CanvasLayerOptions=} opt_options Options to set in this CanvasLayer.
     */
    function CanvasLayer(opt_options) {
      /**
       * If true, canvas is in a map pane and the OverlayView is fully functional.
       * See google.maps.OverlayView.onAdd for more information.
       * @type {boolean}
       * @private
       */
      this.isAdded_ = false;

      /**
       * If true, each update will immediately schedule the next.
       * @type {boolean}
       * @private
       */
      this.isAnimated_ = false;

      /**
       * The name of the MapPane in which this layer will be displayed.
       * @type {string}
       * @private
       */
      this.paneName_ = CanvasLayer.DEFAULT_PANE_NAME_;

      /**
       * A user-supplied function called whenever an update is required. Null or
       * undefined if a callback is not provided.
       * @type {?function=}
       * @private
       */
      this.updateHandler_ = null;

      /**
       * A user-supplied function called whenever an update is required and the
       * map has been resized since the last update. Null or undefined if a
       * callback is not provided.
       * @type {?function}
       * @private
       */
      this.resizeHandler_ = null;

      /**
       * The LatLng coordinate of the top left of the current view of the map. Will
       * be null when this.isAdded_ is false.
       * @type {google.maps.LatLng}
       * @private
       */
      this.topLeft_ = null;

      /**
       * The map-pan event listener. Will be null when this.isAdded_ is false. Will
       * be null when this.isAdded_ is false.
       * @type {?function}
       * @private
       */
      this.centerListener_ = null;

      /**
       * The map-resize event listener. Will be null when this.isAdded_ is false.
       * @type {?function}
       * @private
       */
      this.resizeListener_ = null;

      /**
       * If true, the map size has changed and this.resizeHandler_ must be called
       * on the next update.
       * @type {boolean}
       * @private
       */
      this.needsResize_ = true;

      /**
       * A browser-defined id for the currently requested callback. Null when no
       * callback is queued.
       * @type {?number}
       * @private
       */
      this.requestAnimationFrameId_ = null;

      var canvas = document.createElement('canvas');
      canvas.style.position = 'absolute';
      canvas.style.top = 0;
      canvas.style.left = 0;
      canvas.style.pointerEvents = 'none';

      /**
       * The canvas element.
       * @type {!HTMLCanvasElement}
       */
      this.canvas = canvas;

      /**
       * The CSS width of the canvas, which may be different than the width of the
       * backing store.
       * @private {number}
       */
      this.canvasCssWidth_ = 300;

      /**
       * The CSS height of the canvas, which may be different than the height of
       * the backing store.
       * @private {number}
       */
      this.canvasCssHeight_ = 150;

      /**
       * A value for scaling the CanvasLayer resolution relative to the CanvasLayer
       * display size.
       * @private {number}
       */
      this.resolutionScale_ = 1;

      /**
       * Simple bind for functions with no args for bind-less browsers (Safari).
       * @param {Object} thisArg The this value used for the target function.
       * @param {function} func The function to be bound.
       */
      function simpleBindShim(thisArg, func) {
        return function() { func.apply(thisArg); };
      }

      /**
       * A reference to this.repositionCanvas_ with this bound as its this value.
       * @type {function}
       * @private
       */
      this.repositionFunction_ = simpleBindShim(this, this.repositionCanvas_);

      /**
       * A reference to this.resize_ with this bound as its this value.
       * @type {function}
       * @private
       */
      this.resizeFunction_ = simpleBindShim(this, this.resize_);

      /**
       * A reference to this.update_ with this bound as its this value.
       * @type {function}
       * @private
       */
      this.requestUpdateFunction_ = simpleBindShim(this, this.update_);

      // set provided options, if any
      if (opt_options) {
        this.setOptions(opt_options);
      }
    }


    var global = typeof window === 'undefined' ? {} : window;

    if (global.google && global.google.maps) {

    CanvasLayer.prototype = new google.maps.OverlayView();

    /**
     * The default MapPane to contain the canvas.
     * @type {string}
     * @const
     * @private
     */
    CanvasLayer.DEFAULT_PANE_NAME_ = 'overlayLayer';

    /**
     * Transform CSS property name, with vendor prefix if required. If browser
     * does not support transforms, property will be ignored.
     * @type {string}
     * @const
     * @private
     */
    CanvasLayer.CSS_TRANSFORM_ = (function() {
      var div = document.createElement('div');
      var transformProps = [
        'transform',
        'WebkitTransform',
        'MozTransform',
        'OTransform',
        'msTransform'
      ];
      for (var i = 0; i < transformProps.length; i++) {
        var prop = transformProps[i];
        if (div.style[prop] !== undefined) {
          return prop;
        }
      }

      // return unprefixed version by default
      return transformProps[0];
    })();

    /**
     * The requestAnimationFrame function, with vendor-prefixed or setTimeout-based
     * fallbacks. MUST be called with window as thisArg.
     * @type {function}
     * @param {function} callback The function to add to the frame request queue.
     * @return {number} The browser-defined id for the requested callback.
     * @private
     */
    CanvasLayer.prototype.requestAnimFrame_ =
        global.requestAnimationFrame ||
        global.webkitRequestAnimationFrame ||
        global.mozRequestAnimationFrame ||
        global.oRequestAnimationFrame ||
        global.msRequestAnimationFrame ||
        function(callback) {
          return global.setTimeout(callback, 1000 / 60);
        };

    /**
     * The cancelAnimationFrame function, with vendor-prefixed fallback. Does not
     * fall back to clearTimeout as some platforms implement requestAnimationFrame
     * but not cancelAnimationFrame, and the cost is an extra frame on onRemove.
     * MUST be called with window as thisArg.
     * @type {function}
     * @param {number=} requestId The id of the frame request to cancel.
     * @private
     */
    CanvasLayer.prototype.cancelAnimFrame_ =
        global.cancelAnimationFrame ||
        global.webkitCancelAnimationFrame ||
        global.mozCancelAnimationFrame ||
        global.oCancelAnimationFrame ||
        global.msCancelAnimationFrame ||
        function(requestId) {};

    /**
     * Sets any options provided. See CanvasLayerOptions for more information.
     * @param {CanvasLayerOptions} options The options to set.
     */
    CanvasLayer.prototype.setOptions = function(options) {
      if (options.animate !== undefined) {
        this.setAnimate(options.animate);
      }

      if (options.paneName !== undefined) {
        this.setPaneName(options.paneName);
      }

      if (options.updateHandler !== undefined) {
        this.setUpdateHandler(options.updateHandler);
      }

      if (options.resizeHandler !== undefined) {
        this.setResizeHandler(options.resizeHandler);
      }

      if (options.resolutionScale !== undefined) {
        this.setResolutionScale(options.resolutionScale);
      }

      if (options.map !== undefined) {
        this.setMap(options.map);
      }
    };

    /**
     * Set the animated state of the layer. If true, updateHandler will be called
     * repeatedly, once per frame. If false, updateHandler will only be called when
     * a map property changes that could require the canvas content to be redrawn.
     * @param {boolean} animate Whether the canvas is animated.
     */
    CanvasLayer.prototype.setAnimate = function(animate) {
      this.isAnimated_ = !!animate;

      if (this.isAnimated_) {
        this.scheduleUpdate();
      }
    };

    /**
     * @return {boolean} Whether the canvas is animated.
     */
    CanvasLayer.prototype.isAnimated = function() {
      return this.isAnimated_;
    };

    /**
     * Set the MapPane in which this layer will be displayed, by name. See
     * {@code google.maps.MapPanes} for the panes available.
     * @param {string} paneName The name of the desired MapPane.
     */
    CanvasLayer.prototype.setPaneName = function(paneName) {
      this.paneName_ = paneName;

      this.setPane_();
    };

    /**
     * @return {string} The name of the current container pane.
     */
    CanvasLayer.prototype.getPaneName = function() {
      return this.paneName_;
    };

    /**
     * Adds the canvas to the specified container pane. Since this is guaranteed to
     * execute only after onAdd is called, this is when paneName's existence is
     * checked (and an error is thrown if it doesn't exist).
     * @private
     */
    CanvasLayer.prototype.setPane_ = function() {
      if (!this.isAdded_) {
        return;
      }

      // onAdd has been called, so panes can be used
      var panes = this.getPanes();
      if (!panes[this.paneName_]) {
        throw new Error('"' + this.paneName_ + '" is not a valid MapPane name.');
      }

      panes[this.paneName_].appendChild(this.canvas);
    };

    /**
     * Set a function that will be called whenever the parent map and the overlay's
     * canvas have been resized. If opt_resizeHandler is null or unspecified, any
     * existing callback is removed.
     * @param {?function=} opt_resizeHandler The resize callback function.
     */
    CanvasLayer.prototype.setResizeHandler = function(opt_resizeHandler) {
      this.resizeHandler_ = opt_resizeHandler;
    };

    /**
     * Sets a value for scaling the canvas resolution relative to the canvas
     * display size. This can be used to save computation by scaling the backing
     * buffer down, or to support high DPI devices by scaling it up (by e.g.
     * window.devicePixelRatio).
     * @param {number} scale
     */
    CanvasLayer.prototype.setResolutionScale = function(scale) {
      if (typeof scale === 'number') {
        this.resolutionScale_ = scale;
        this.resize_();
      }
    };

    /**
     * Set a function that will be called when a repaint of the canvas is required.
     * If opt_updateHandler is null or unspecified, any existing callback is
     * removed.
     * @param {?function=} opt_updateHandler The update callback function.
     */
    CanvasLayer.prototype.setUpdateHandler = function(opt_updateHandler) {
      this.updateHandler_ = opt_updateHandler;
    };

    /**
     * @inheritDoc
     */
    CanvasLayer.prototype.onAdd = function() {
      if (this.isAdded_) {
        return;
      }

      this.isAdded_ = true;
      this.setPane_();

      this.resizeListener_ = google.maps.event.addListener(this.getMap(),
          'resize', this.resizeFunction_);
      this.centerListener_ = google.maps.event.addListener(this.getMap(),
          'center_changed', this.repositionFunction_);

      this.resize_();
      this.repositionCanvas_();
    };

    /**
     * @inheritDoc
     */
    CanvasLayer.prototype.onRemove = function() {
      if (!this.isAdded_) {
        return;
      }

      this.isAdded_ = false;
      this.topLeft_ = null;

      // remove canvas and listeners for pan and resize from map
      this.canvas.parentElement.removeChild(this.canvas);
      if (this.centerListener_) {
        google.maps.event.removeListener(this.centerListener_);
        this.centerListener_ = null;
      }
      if (this.resizeListener_) {
        google.maps.event.removeListener(this.resizeListener_);
        this.resizeListener_ = null;
      }

      // cease canvas update callbacks
      if (this.requestAnimationFrameId_) {
        this.cancelAnimFrame_.call(global, this.requestAnimationFrameId_);
        this.requestAnimationFrameId_ = null;
      }
    };

    /**
     * The internal callback for resize events that resizes the canvas to keep the
     * map properly covered.
     * @private
     */
    CanvasLayer.prototype.resize_ = function() {
      if (!this.isAdded_) {
        return;
      }

      var map = this.getMap();
      var mapWidth = map.getDiv().offsetWidth;
      var mapHeight = map.getDiv().offsetHeight;

      var newWidth = mapWidth * this.resolutionScale_;
      var newHeight = mapHeight * this.resolutionScale_;
      var oldWidth = this.canvas.width;
      var oldHeight = this.canvas.height;

      // resizing may allocate a new back buffer, so do so conservatively
      if (oldWidth !== newWidth || oldHeight !== newHeight) {
        this.canvas.width = newWidth;
        this.canvas.height = newHeight;

        this.needsResize_ = true;
        this.scheduleUpdate();
      }

      // reset styling if new sizes don't match; resize of data not needed
      if (this.canvasCssWidth_ !== mapWidth ||
          this.canvasCssHeight_ !== mapHeight) {
        this.canvasCssWidth_ = mapWidth;
        this.canvasCssHeight_ = mapHeight;
        this.canvas.style.width = mapWidth + 'px';
        this.canvas.style.height = mapHeight + 'px';
      }
    };

    /**
     * @inheritDoc
     */
    CanvasLayer.prototype.draw = function() {
      this.repositionCanvas_();
    };

    /**
     * Internal callback for map view changes. Since the Maps API moves the overlay
     * along with the map, this function calculates the opposite translation to
     * keep the canvas in place.
     * @private
     */
    CanvasLayer.prototype.repositionCanvas_ = function() {
      // TODO(bckenny): *should* only be executed on RAF, but in current browsers
      //     this causes noticeable hitches in map and overlay relative
      //     positioning.

      var map = this.getMap();

      // topLeft can't be calculated from map.getBounds(), because bounds are
      // clamped to -180 and 180 when completely zoomed out. Instead, calculate
      // left as an offset from the center, which is an unwrapped LatLng.
      var top = map.getBounds().getNorthEast().lat();
      var center = map.getCenter();
      var scale = Math.pow(2, map.getZoom());
      var left = center.lng() - (this.canvasCssWidth_ * 180) / (256 * scale);
      this.topLeft_ = new google.maps.LatLng(top, left);

      // Canvas position relative to draggable map's container depends on
      // overlayView's projection, not the map's. Have to use the center of the
      // map for this, not the top left, for the same reason as above.
      var projection = this.getProjection();
      var divCenter = projection.fromLatLngToDivPixel(center);
      var offsetX = -Math.round(this.canvasCssWidth_ / 2 - divCenter.x);
      var offsetY = -Math.round(this.canvasCssHeight_ / 2 - divCenter.y);
      this.canvas.style[CanvasLayer.CSS_TRANSFORM_] = 'translate(' +
          offsetX + 'px,' + offsetY + 'px)';

      this.scheduleUpdate();
    };

    /**
     * Internal callback that serves as main animation scheduler via
     * requestAnimationFrame. Calls resize and update callbacks if set, and
     * schedules the next frame if overlay is animated.
     * @private
     */
    CanvasLayer.prototype.update_ = function() {
      this.requestAnimationFrameId_ = null;

      if (!this.isAdded_) {
        return;
      }

      if (this.isAnimated_) {
        this.scheduleUpdate();
      }

      if (this.needsResize_ && this.resizeHandler_) {
        this.needsResize_ = false;
        this.resizeHandler_();
      }

      if (this.updateHandler_) {
        this.updateHandler_();
      }
    };

    /**
     * A convenience method to get the current LatLng coordinate of the top left of
     * the current view of the map.
     * @return {google.maps.LatLng} The top left coordinate.
     */
    CanvasLayer.prototype.getTopLeft = function() {
      return this.topLeft_;
    };

    /**
     * Schedule a requestAnimationFrame callback to updateHandler. If one is
     * already scheduled, there is no effect.
     */
    CanvasLayer.prototype.scheduleUpdate = function() {
      if (this.isAdded_ && !this.requestAnimationFrameId_) {
        this.requestAnimationFrameId_ =
            this.requestAnimFrame_.call(global, this.requestUpdateFunction_);
      }
    };

    }

    /**
     * @author kyle / http://nikai.us/
     */

    class Layer$4 extends BaseLayer{

        constructor(map, dataSet, options) {

            super(map, dataSet, options);

            var self = this;
            options = options || {};

            self.init(options);
            self.argCheck(options);

            var canvasLayerOptions = {
                map: map,
                animate: false,
                updateHandler: function() {
                    self._canvasUpdate();
                },
                resolutionScale: resolutionScale
            };

            this.canvasLayer = new CanvasLayer(canvasLayerOptions);

            this.clickEvent = this.clickEvent.bind(this);
            this.mousemoveEvent = this.mousemoveEvent.bind(this);
            this.bindEvent();
        }

        clickEvent(e) {
            var pixel = e.pixel;
            super.clickEvent(pixel, e);
        }

        mousemoveEvent(e) {
            var pixel = e.pixel;
            super.mousemoveEvent(pixel, e);
        }

        bindEvent(e) {
            var map = this.map;

            if (this.options.methods) {
                if (this.options.methods.click) {
                    map.setDefaultCursor("default");
                    map.addListener('click', this.clickEvent);
                }
                if (this.options.methods.mousemove) {
                    map.addListener('mousemove', this.mousemoveEvent);
                }
            }
        }

        unbindEvent(e) {
            var map = this.map;

            if (this.options.methods) {
                if (this.options.methods.click) {
                    map.removeListener('click', this.clickEvent);
                }
                if (this.options.methods.mousemove) {
                    map.removeListener('mousemove', this.mousemoveEvent);
                }
            }
        }

        getContext() {
            return this.canvasLayer.canvas.getContext(this.context);
        }

        _canvasUpdate(time) {
            if (!this.canvasLayer) {
                return;
            }

            var self = this;

            var animationOptions = self.options.animation;

            var context = this.getContext();

            if (self.isEnabledTime()) {
                if (time === undefined) {
                    clear(context);
                    return;
                }
                if (this.context == '2d') {
                    context.save();
                    context.globalCompositeOperation = 'destination-out';
                    context.fillStyle = 'rgba(0, 0, 0, .1)';
                    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
                    context.restore();
                }
            } else {
                clear(context);
            }

            if (this.context == '2d') {
                for (var key in self.options) {
                    context[key] = self.options[key];
                }
            } else {
                context.clear(context.COLOR_BUFFER_BIT);
            }

            if (self.options.minZoom && map.getZoom() < self.options.minZoom || self.options.maxZoom && map.getZoom() > self.options.maxZoom) {
                return;
            }

            var scale = 1;
            if (this.context != '2d') {
                scale = this.canvasLayer.devicePixelRatio;
            }

            var map = this.map;
            var mapProjection = map.getProjection();
            var scale = Math.pow(2, map.zoom) * resolutionScale;
            var offset = mapProjection.fromLatLngToPoint(this.canvasLayer.getTopLeft());
            var dataGetOptions = {
                //fromColumn: self.options.coordType == 'bd09mc' ? 'coordinates' : 'coordinates_mercator',
                transferCoordinate: function(coordinate) {
                    var latLng = new google.maps.LatLng(coordinate[1], coordinate[0]);
                    var worldPoint = mapProjection.fromLatLngToPoint(latLng);
                    var pixel = {
                        x: (worldPoint.x - offset.x) * scale,
                        y: (worldPoint.y - offset.y) * scale,
                    };
                    return [pixel.x, pixel.y];
                }
            };

            if (time !== undefined) {
                dataGetOptions.filter = function(item) {
                    var trails = animationOptions.trails || 10;
                    if (time && item.time > (time - trails) && item.time < time) {
                        return true;
                    } else {
                        return false;
                    }
                };
            }

            // get data from data set
            var data = self.dataSet.get(dataGetOptions);

            this.processData(data);

            var latLng = new google.maps.LatLng(0, 0);
            var worldPoint = mapProjection.fromLatLngToPoint(latLng);
            var pixel = {
                x: (worldPoint.x - offset.x) * scale,
                y: (worldPoint.y - offset.y) * scale,
            };


            if (self.options.unit == 'm' && self.options.size) {
                self.options._size = self.options.size / zoomUnit;
            } else {
                self.options._size = self.options.size;
            }

            this.drawContext(context, new DataSet$1(data), self.options, pixel);

            //console.timeEnd('draw');

            //console.timeEnd('update')
            self.options.updateCallback && self.options.updateCallback(time);
        }

        init(options) {

            var self = this;

            self.options = options;

            this.initDataRange(options);

            this.context = self.options.context || '2d';

            if (self.options.zIndex) {
                this.canvasLayer && this.canvasLayer.setZIndex(self.options.zIndex);
            }

            this.initAnimator();
        }

        addAnimatorEvent() {
            this.map.addListener('movestart', this.animatorMovestartEvent.bind(this));
            this.map.addListener('moveend', this.animatorMoveendEvent.bind(this));
        }

        show() {
            this.map.addOverlay(this.canvasLayer);
        }

        hide() {
            this.map.removeOverlay(this.canvasLayer);
        }

        draw() {
            self.canvasLayer.draw();
        }

    }

    /**
     * MapV for maptalks.js (https://github.com/maptalks/maptalks.js)
     * @author fuzhenn / https://github.com/fuzhenn
     */

    let Layer$2;
    if (typeof(maptalks) !== 'undefined') {
        Layer$2 = class extends maptalks.Layer{

            constructor(id, dataSet, options) {
                super(id, options);
                this.options_ = options;
                this.dataSet = dataSet;
                this._initBaseLayer(options);
            }
        
            _initBaseLayer(options) {
                const self = this;
                const baseLayer = this.baseLayer = new BaseLayer(null, this.dataSet, options);
                self.init(options);
                baseLayer.argCheck(options);
            } 
        
            clickEvent(e) {
                if (!this.baseLayer) {
                    return;
                }
                const pixel = e.containerPoint;
                this.baseLayer.clickEvent(pixel, e.domEvent);
            }
        
            mousemoveEvent(e) {
                if (!this.baseLayer) {
                    return;
                }
                const pixel = e.containerPoint;
                this.baseLayer.mousemoveEvent(pixel, e.domEvent);
            }
        
            getEvents() {
                return {
                    'click' : this.clickEvent,
                    'mousemove' : this.mousemoveEvent
                };
            }
            
            init(options) {
        
                const base = this.baseLayer;
        
                base.options = options;
        
                base.initDataRange(options);
        
                base.context = base.options.context || '2d';
        
                base.initAnimator();
            }
        
            addAnimatorEvent() {
                this.map.addListener('movestart', this.animatorMovestartEvent.bind(this));
                this.map.addListener('moveend', this.animatorMoveendEvent.bind(this));
            }
        
        };
        
        class LayerRenderer extends maptalks.renderer.CanvasRenderer {
        
            needToRedraw() {
                const base = this.layer.baseLayer;
                if (base.isEnabledTime()) {
                    return true;
                }
                return super.needToRedraw();
            }
        
            draw() {
                const base = this.layer.baseLayer;
                if (!this.canvas || !base.isEnabledTime() || this._shouldClear) {
                    this.prepareCanvas();
                    this._shouldClear = false;
                }
                this._update(this.gl || this.context, this._mapvFrameTime);
                delete this._mapvFrameTime;
                this.completeRender();
            }
        
            drawOnInteracting() {
                this.draw();
                this._shouldClear = false;
            }
        
            onSkipDrawOnInteracting() {
                this._shouldClear = true;
            }
        
            _canvasUpdate(time) {
                this.setToRedraw();
                this._mapvFrameTime = time;
            }
        
            _update(context, time) {
                if (!this.canvas) {
                    return;
                }
        
                const self = this.layer.baseLayer;
        
                const animationOptions = self.options.animation;
        
                const map = this.getMap();
        
                if (self.isEnabledTime()) {
                    if (time === undefined) {
                        clear(context);
                        return;
                    }
                    if (self.context == '2d') {
                        context.save();
                        context.globalCompositeOperation = 'destination-out';
                        context.fillStyle = 'rgba(0, 0, 0, .1)';
                        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
                        context.restore();
                    }
                } else {
                    clear(context);
                }
        
                if (self.context == '2d') {
                    for (const key in self.options) {
                        context[key] = self.options[key];
                    }
                } else {
                    context.clear(context.COLOR_BUFFER_BIT);
                }
        
                const scale = 1;
        
                //reuse to save coordinate instance creation
                const coord = new maptalks.Coordinate(0, 0);
                const dataGetOptions = {
                    fromColumn: self.options.coordType === 'bd09mc' ? 'coordinates_mercator' : 'coordinates',
                    transferCoordinate: function(coordinate) {
                        coord.x = coordinate[0];
                        coord.y = coordinate[1];
                        const r = map.coordToContainerPoint(coord)._multi(scale).toArray();
                        return r;
                    }
                };
        
                if (time !== undefined) {
                    dataGetOptions.filter = function(item) {
                        const trails = animationOptions.trails || 10;
                        if (time && item.time > (time - trails) && item.time < time) {
                            return true;
                        } else {
                            return false;
                        }
                    };
                }
        
                // get data from data set
                const data = self.dataSet.get(dataGetOptions);
        
                self.processData(data);
        
                if (self.options.unit == 'm') {
                    if (self.options.size) {
                        self.options._size = self.options.size / zoomUnit;
                    }
                    if (self.options.width) {
                        self.options._width = self.options.width / zoomUnit;
                    }
                    if (self.options.height) {
                        self.options._height = self.options.height / zoomUnit;
                    }
                } else {
                    self.options._size = self.options.size;
                    self.options._height = self.options.height;
                    self.options._width = self.options.width;
                }
        
                const zeroZero = new maptalks.Point(0, 0);
                //screen position of the [0, 0] point
                const zeroZeroScreen = map._pointToContainerPoint(zeroZero)._multi(scale);
                self.drawContext(context, data, self.options, zeroZeroScreen);
        
                //console.timeEnd('draw');
        
                //console.timeEnd('update')
                self.options.updateCallback && self.options.updateCallback(time);
            }
        
            createCanvas() {
                if (this.canvas) {
                    return;
                }
                const map = this.getMap();
                const size = map.getSize();
                const r = map.getDevicePixelRatio ? map.getDevicePixelRatio() : (maptalks.Browser.retina ? 2 : 1),
                    w = r * size.width,
                    h = r * size.height;
                this.canvas = maptalks.Canvas.createCanvas(w, h, map.CanvasClass);
                const mapvContext = this.layer.baseLayer.context;
                if (mapvContext === '2d') {
                    this.context = this.canvas.getContext('2d');
                    if (this.layer.options['globalCompositeOperation']) {
                        this.context.globalCompositeOperation = this.layer.options['globalCompositeOperation'];
                    }
                    if (this.layer.baseLayer.options.draw !== 'heatmap' && r !== 1) {
                        //in heatmap.js, devicePixelRatio is being mulitplied independently
                        this.context.scale(r, r);
                    }
                    
                } else {
                    const attributes = {
                        'alpha': true,
                        'preserveDrawingBuffer' : true,
                        'antialias' : false
                    };
                    this.gl = this.canvas.getContext('webgl', attributes);
                }
        
                this.onCanvasCreate();
        
                this._bindToMapv();
        
                this.layer.fire('canvascreate', {
                    'context' : this.context,
                    'gl' : this.gl
                });
            }
        
            _bindToMapv() {
                //some bindings needed by mapv baselayer
                const base = this.layer.baseLayer;
                const map = this.getMap();
                this.devicePixelRatio = map.getDevicePixelRatio ? map.getDevicePixelRatio() : (maptalks.Browser.retina ? 2 : 1);
                base.canvasLayer = this;
                base._canvasUpdate = this._canvasUpdate.bind(this);
                base.getContext = function () {
                    const renderer = self.getRenderer();
                    return renderer.gl || renderer.context;
                };
            }
        }
        
        Layer$2.registerRenderer('canvas', LayerRenderer);
    }

    var Layer$3 = Layer$2;

    /**
     * MapV for AMap
     * @author sakitam-fdd - https://github.com/sakitam-fdd
     */

    /**
     * create canvas
     * @param width
     * @param height
     * @param Canvas
     * @returns {HTMLCanvasElement}
     */
    const createCanvas$1 = (width, height, Canvas) => {
        if (typeof document !== 'undefined') {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            return canvas
        } else {
            // create a new canvas instance in node.js
            // the canvas class needs to have a default constructor without any parameter
            return new Canvas(width, height)
        }
    };

    class Layer$1 extends BaseLayer {
        constructor(map = null, dataSet, options) {
            super(map, dataSet, options);

            this.options = options;

            /**
             * internal
             * @type {{canvas: null, devicePixelRatio: number}}
             */
            this.canvasLayer = {
                canvas: null,
                devicePixelRatio: window.devicePixelRatio
            };

            /**
             * canvas layer
             * @type {null}
             * @private
             */
            this.layer_ = null;

            this.initDataRange(options);
            this.initAnimator();
            this.onEvents();
            map.on('complete', function () {
                this.init(map, options);
                this.argCheck(options);
            }, this);
        }

        /**
         * init mapv layer
         * @param map
         * @param options
         */
        init(map, options) {
            if (map) {
                this.map = map;
                this.context = this.options.context || '2d';
                this.getCanvasLayer();
            } else {
                throw new Error('not map object')
            }
        }

        /**
         * update layer
         * @param time
         * @private
         */
        _canvasUpdate(time) {
            this.render(this.canvasLayer.canvas, time);
        }

        /**
         * render layer
         * @param canvas
         * @param time
         * @returns {Layer}
         */
        render(canvas, time) {
            if (!canvas) return;
            const map = this.map;
            const context = canvas.getContext(this.context);
            const animationOptions = this.options.animation;
            if (this.isEnabledTime()) {
                if (time === undefined) {
                    clear(context);
                    return this;
                }
                if (this.context === '2d') {
                    context.save();
                    context.globalCompositeOperation = 'destination-out';
                    context.fillStyle = 'rgba(0, 0, 0, .1)';
                    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
                    context.restore();
                }
            } else {
                clear(context);
            }

            if (this.context === '2d') {
                for (const key in this.options) {
                    context[key] = this.options[key];
                }
            } else {
                context.clear(context.COLOR_BUFFER_BIT);
            }
            const dataGetOptions = {
                transferCoordinate: function (coordinate) {
                    const _pixel = map.lngLatToContainer(new AMap.LngLat(coordinate[0], coordinate[1]));
                    return [_pixel['x'], _pixel['y']];
                }
            };

            if (time !== undefined) {
                dataGetOptions.filter = function (item) {
                    const trails = animationOptions.trails || 10;
                    if (time && item.time > (time - trails) && item.time < time) {
                        return true;
                    } else {
                        return false;
                    }
                };
            }

            const data = this.dataSet.get(dataGetOptions);
            this.processData(data);

            if (this.options.unit === 'm') {
                if (this.options.size) {
                    this.options._size = this.options.size / zoomUnit;
                }
                if (this.options.width) {
                    this.options._width = this.options.width / zoomUnit;
                }
                if (this.options.height) {
                    this.options._height = this.options.height / zoomUnit;
                }
            } else {
                this.options._size = this.options.size;
                this.options._height = this.options.height;
                this.options._width = this.options.width;
            }

            this.drawContext(context, new DataSet$1(data), this.options, {x: 0, y: 0});
            this.options.updateCallback && this.options.updateCallback(time);
            return this
        }

        /**
         * get canvas layer
         */
        getCanvasLayer() {
            if (!this.canvasLayer.canvas && !this.layer_) {
                const canvas = this.canvasFunction();
                const bounds = this.map.getBounds();
                this.layer_ = new AMap.CanvasLayer({
                    canvas: canvas,
                    bounds: this.options.bounds || bounds,
                    zooms: this.options.zooms || [0, 22],
                });
                this.layer_.setMap(this.map);
                this.map.on('mapmove', this.canvasFunction, this);
                this.map.on('zoomchange', this.canvasFunction, this);
            }
        }

        /**
         * canvas constructor
         * @returns {*}
         */
        canvasFunction() {
            const [width, height] = [this.map.getSize().width, this.map.getSize().height];
            if (!this.canvasLayer.canvas) {
                this.canvasLayer.canvas = createCanvas$1(width, height);
            } else {
                this.canvasLayer.canvas.width = width;
                this.canvasLayer.canvas.height = height;
                const bounds = this.map.getBounds();
                if (this.layer_) {
                    this.layer_.setBounds(this.options.bounds || bounds);
                }
            }
            this.render(this.canvasLayer.canvas);
            return this.canvasLayer.canvas
        }

        /**
         * remove layer
         */
        removeLayer() {
            if (!this.map) return;
            this.unEvents();
            this.map.removeLayer(this.layer_);
            delete this.map;
            delete this.layer_;
            delete this.canvasLayer.canvas;
        }

        getContext() {
            return this.canvasLayer.canvas.getContext(this.context);
        }

        /**
         * handle click event
         * @param event
         */
        clickEvent(event) {
            const pixel = event.pixel;
            super.clickEvent(pixel, event);
        }

        /**
         * handle mousemove/pointermove event
         * @param event
         */
        mousemoveEvent(event) {
            const pixel = event.pixel;
            super.mousemoveEvent(pixel, event);
        }

        /**
         * add animator event
         */
        addAnimatorEvent() {
            this.map.on('movestart', this.animatorMovestartEvent, this);
            this.map.on('moveend', this.animatorMoveendEvent, this);
        }

        /**
         * bind event
         */
        onEvents() {
            const map = this.map;
            this.unEvents();
            if (this.options.methods) {
                if (this.options.methods.click) {
                    map.on('click', this.clickEvent, this);
                }
                if (this.options.methods.mousemove) {
                    map.on('mousemove', this.mousemoveEvent, this);
                }
            }
        }

        /**
         * unbind events
         */
        unEvents() {
            const map = this.map;
            if (this.options.methods) {
                if (this.options.methods.click) {
                    map.off('click', this.clickEvent, this);
                }
                if (this.options.methods.mousemove) {
                    map.off('mousemove', this.mousemoveEvent, this);
                }
            }
        }
    }

    /**
     * MapV for openlayers (https://openlayers.org)
     * @author sakitam-fdd - https://github.com/sakitam-fdd
     */

    /**
     * create canvas
     * @param width
     * @param height
     * @returns {HTMLCanvasElement}
     */
    const createCanvas = (width, height) => {
      if (typeof document !== 'undefined') {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
      }
    };

    class Layer extends BaseLayer {
      constructor (map = null, dataSet, options) {
        super(map, dataSet, options);

        this.options = options;

        /**
         * internal
         * @type {{canvas: null, devicePixelRatio: number}}
         */
        this.canvasLayer = {
          canvas: null,
          devicePixelRatio: window.devicePixelRatio
        };

        /**
         * cavnas layer
         * @type {null}
         * @private
         */
        this.layer_ = null;

        /**
         * previous cursor
         * @type {undefined}
         * @private
         */
        this.previousCursor_ = undefined;

        this.init(map, options);
        this.argCheck(options);
      }

      /**
       * init mapv layer
       * @param map
       * @param options
       */
      init (map, options) {
        if (map && map instanceof ol.Map) {
          this.$Map = map;
          this.context = this.options.context || '2d';
          this.getCanvasLayer();
          this.initDataRange(options);
          this.initAnimator();
          this.onEvents();
        } else {
          throw new Error('not map object')
        }
      }

      /**
       * update layer
       * @param time
       * @private
       */
      _canvasUpdate (time) {
        this.render(this.canvasLayer.canvas, time);
      }

      /**
       * render layer
       * @param canvas
       * @param time
       * @returns {Layer}
       */
      render (canvas, time) {
        const map = this.$Map;
        const context = canvas.getContext(this.context);
        const animationOptions = this.options.animation;
        const _projection = this.options.hasOwnProperty('projection') ? this.options.projection : 'EPSG:4326';
        const mapViewProjection = this.$Map.getView().getProjection().getCode();
        if (this.isEnabledTime()) {
          if (time === undefined) {
            clear(context);
            return this;
          }
          if (this.context === '2d') {
            context.save();
            context.globalCompositeOperation = 'destination-out';
            context.fillStyle = 'rgba(0, 0, 0, .1)';
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
            context.restore();
          }
        } else {
          clear(context);
        }

        if (this.context === '2d') {
          for (const key in this.options) {
            context[key] = this.options[key];
          }
        } else {
          context.clear(context.COLOR_BUFFER_BIT);
        }
    	const dataGetOptions = {};
        dataGetOptions.transferCoordinate = ((_projection === mapViewProjection) ? function (coordinate) {
    			// 当数据与map的投影一致时不再进行投影转换
    			return map.getPixelFromCoordinate(coordinate);
    		} : function (coordinate) {
    			// 数据与Map投影不一致时 将数据投影转换为 Map的投影
    			return map.getPixelFromCoordinate(ol.proj.transform(coordinate, _projection, mapViewProjection));
    		});

        if (time !== undefined) {
          dataGetOptions.filter = function(item) {
            const trails = animationOptions.trails || 10;
            if (time && item.time > (time - trails) && item.time < time) {
              return true;
            } else {
              return false;
            }
          };
        }

        const data = this.dataSet.get(dataGetOptions);
        this.processData(data);

        if (this.options.unit === 'm') {
          if (this.options.size) {
            this.options._size = this.options.size / zoomUnit;
          }
          if (this.options.width) {
            this.options._width = this.options.width / zoomUnit;
          }
          if (this.options.height) {
            this.options._height = this.options.height / zoomUnit;
          }
        } else {
          this.options._size = this.options.size;
          this.options._height = this.options.height;
          this.options._width = this.options.width;
        }

        this.drawContext(context, new DataSet$1(data), this.options, {x: 0, y: 0});
        this.options.updateCallback && this.options.updateCallback(time);
        return this
      }

      /**
       * get canvas layer
       */
      getCanvasLayer () {
        if (!this.canvasLayer.canvas && !this.layer_) {
          const extent = this.getMapExtent();
          this.layer_ = new ol.layer.Image({
            layerName: this.options.layerName,
            minResolution: this.options.minResolution,
            maxResolution: this.options.maxResolution,
            zIndex: this.options.zIndex,
            extent: extent,
            source: new ol.source.ImageCanvas({
              canvasFunction: this.canvasFunction.bind(this),
              projection: this.$Map.getView().getProjection().getCode(), // 图层投影与Map保持一致
              ratio: (this.options.hasOwnProperty('ratio') ? this.options.ratio : 1)
            })
          });
          this.$Map.addLayer(this.layer_);
          this.$Map.un('precompose', this.reRender, this);
          this.$Map.on('precompose', this.reRender, this);
        }
      }

      /**
       * re render
       */
      reRender () {
        if (!this.layer_) return;
        const extent = this.getMapExtent();
        this.layer_.setExtent(extent);
      }

      /**
       * canvas constructor
       * @param extent
       * @param resolution
       * @param pixelRatio
       * @param size
       * @param projection
       * @returns {*}
       */
      canvasFunction (extent, resolution, pixelRatio, size, projection) {
        if (!this.canvasLayer.canvas) {
          this.canvasLayer.canvas = createCanvas(size[0], size[1]);
        } else {
          this.canvasLayer.canvas.width = size[0];
          this.canvasLayer.canvas.height = size[1];
        }
        this.render(this.canvasLayer.canvas);
        return this.canvasLayer.canvas
      }

      /**
       * get map current extent
       * @returns {Array}
       */
      getMapExtent () {
        const size = this.$Map.getSize();
        return this.$Map.getView().calculateExtent(size);
      }

      /**
       * add layer to map
       * @param map
       */
      addTo (map) {
        this.init(map, this.options);
      }

      /**
       * remove layer
       */
      removeLayer () {
        if (!this.$Map) return;
        this.unEvents();
        this.$Map.un('precompose', this.reRender, this);
        this.$Map.removeLayer(this.layer_);
        delete this.$Map;
        delete this.layer_;
        delete this.canvasLayer.canvas;
      }

      getContext() {
        return this.canvasLayer.canvas.getContext(this.context);
      }

      /**
       * handle click event
       * @param event
       */
      clickEvent(event) {
        const pixel = event.pixel;
        super.clickEvent({
          x: pixel[0],
          y: pixel[1]
        }, event);
      }

      /**
       * handle mousemove/pointermove event
       * @param event
       */
      mousemoveEvent(event) {
        const pixel = event.pixel;
        super.mousemoveEvent({
          x: pixel[0],
          y: pixel[1]
        }, event);
      }

      /**
       * add animator event
       */
      addAnimatorEvent() {
        this.$Map.on('movestart', this.animatorMovestartEvent, this);
        this.$Map.on('moveend', this.animatorMoveendEvent, this);
      }

      /**
       * bind event
       */
      onEvents () {
        const map = this.$Map;
        this.unEvents();
        if (this.options.methods) {
          if (this.options.methods.click) {
            map.on('click', this.clickEvent, this);
          }
          if (this.options.methods.mousemove) {
            map.on('pointermove', this.mousemoveEvent, this);
          }
        }
      }

      /**
       * unbind events
       */
      unEvents () {
        const map = this.$Map;
        if (this.options.methods) {
          if (this.options.methods.click) {
            map.un('click', this.clickEvent, this);
          }
          if (this.options.methods.pointermove) {
            map.un('pointermove', this.mousemoveEvent, this);
          }
        }
      }

      /**
       * set map cursor
       * @param cursor
       * @param feature
       */
      setDefaultCursor (cursor, feature) {
        if (!this.$Map) return;
        const element = this.$Map.getTargetElement();
        if (feature) {
          if (element.style.cursor !== cursor) {
            this.previousCursor_ = element.style.cursor;
            element.style.cursor = cursor;
          }
        } else if (this.previousCursor_ !== undefined) {
          element.style.cursor = this.previousCursor_;
          this.previousCursor_ = undefined;
        }
      }
      
      /**
       * 显示图层
       */
      show() {
        this.$Map.addLayer(this.layer_);
      }

      /**
       * 隐藏图层
       */
      hide() {
        this.$Map.removeLayer(this.layer_);
      }
    }

    // https://github.com/SuperMap/iClient-JavaScript
    /**
     * @class MapVRenderer
     * @classdesc 地图渲染类。
     * @category Visualization MapV
     * @private
     * @extends mapv.BaseLayer
     * @param {L.Map} map - 待渲染的地图。
     * @param {L.Layer} layer - 待渲染的图层。
     * @param {DataSet} dataSet - 待渲染的数据集。
     * @param {Object} options - 渲染的参数。
     */
    class MapVRenderer$1 extends BaseLayer {

        constructor(map, layer, dataSet, options) {
            super(map, dataSet, options);
            if (!BaseLayer) {
                return;
            }


            var self = this;
            options = options || {};

            self.init(options);
            self.argCheck(options);
            this.canvasLayer = layer;
            this.clickEvent = this.clickEvent.bind(this);
            this.mousemoveEvent = this.mousemoveEvent.bind(this);
            this._moveStartEvent = this.moveStartEvent.bind(this);
            this._moveEndEvent = this.moveEndEvent.bind(this);
            this._zoomStartEvent = this.zoomStartEvent.bind(this);
            this.bindEvent();
        }

        /**
         * @function MapVRenderer.prototype.clickEvent
         * @description 点击事件。
         * @param {Object} e - 触发对象。
         */
        clickEvent(e) {
            var offset = this.map.containerPointToLayerPoint([0, 0]);
            var devicePixelRatio = this.devicePixelRatio = this.canvasLayer.devicePixelRatio = window.devicePixelRatio;
            var pixel = e.layerPoint;
            super.clickEvent(L.point((pixel.x - offset.x) / devicePixelRatio, (pixel.y - offset.y) / devicePixelRatio), e);
        }

        /**
         * @function MapVRenderer.prototype.mousemoveEvent
         * @description 鼠标移动事件。
         * @param {Object} e - 触发对象。
         */
        mousemoveEvent(e) {
            var pixel = e.layerPoint;
            super.mousemoveEvent(pixel, e);
        }

        /**
         * @function MapVRenderer.prototype.bindEvent
         * @description 绑定鼠标移动和鼠标点击事件。
         * @param {Object} e - 触发对象。
         */
        bindEvent() {
            var map = this.map;

            if (this.options.methods) {
                if (this.options.methods.click) {
                    map.on('click', this.clickEvent);
                }
                if (this.options.methods.mousemove) {
                    map.on('mousemove', this.mousemoveEvent);
                }
            }
            this.map.on('movestart', this._moveStartEvent);
            this.map.on('moveend', this._moveEndEvent);
            this.map.on('zoomstart', this._zoomStartEvent);
        }
        /**
         * @function MapVRenderer.prototype.destroy
         * @description 释放资源。
         */
        destroy() {
            this.unbindEvent();
            this.clearData();
            this.animator && this.animator.stop();
            this.animator = null;
            this.canvasLayer = null;
        }
        /**
         * @function MapVRenderer.prototype.unbindEvent
         * @description 解绑鼠标移动和鼠标滑动触发的事件。
         * @param {Object} e - 触发对象。
         */
        unbindEvent() {
            var map = this.map;

            if (this.options.methods) {
                if (this.options.methods.click) {
                    map.off('click', this.clickEvent);
                }
                if (this.options.methods.mousemove) {
                    map.off('mousemove', this.mousemoveEvent);
                }
            }
            this.map.off('movestart', this._moveStartEvent);
            this.map.off('moveend', this._moveEndEvent);
            this.map.off('zoomstart', this._zoomStartEvent);
        }

        /**
         * @function MapVRenderer.prototype.getContext
         * @description 获取信息。
         */
        getContext() {
            return this.canvasLayer.getCanvas().getContext(this.context);
        }

        /**
         * @function MapVRenderer.prototype.addData
         * @description 添加数据。
         * @param {Object} data - 待添加的数据。
         * @param  {Object} options - 待添加的数据信息。
         */
        addData(data, options) {
            var _data = data;
            if (data && data.get) {
                _data = data.get();
            }
            this.dataSet.add(_data);
            this.update({
                options: options
            });
        }

        /**
         * @function MapVRenderer.prototype.update
         * @description 更新图层。
         * @param {Object} opt - 待更新的数据。
         * @param {Object} opt.data - mapv数据集。
         * @param {Object} opt.options - mapv绘制参数。
         */
        update(opt) {
            var update = opt || {};
            var _data = update.data;
            if (_data && _data.get) {
                _data = _data.get();
            }
            if (_data != undefined) {
                this.dataSet.set(_data);
            }
            super.update({
                options: update.options
            });
        }

        /**
         * @function MapVRenderer.prototype.getData
         * @description 获取数据
         */
        getData() {
            return this.dataSet;
        }

        /**
         * @function MapVRenderer.prototype.removeData
         * @description 删除符合过滤条件的数据。
         * @param {Function} filter - 过滤条件。条件参数为数据项，返回值为 true，表示删除该元素；否则表示不删除。
         */
        removeData(filter) {
            if (!this.dataSet) {
                return;
            }
            var newData = this.dataSet.get({
                filter: function (data) {
                    return (filter != null && typeof filter === "function") ? !filter(data) : true;
                }
            });
            this.dataSet.set(newData);
            this.update({
                options: null
            });
        }

        /**
         * @function MapVRenderer.prototype.clearData
         * @description 清除数据
         */
        clearData() {
            this.dataSet && this.dataSet.clear();
            this.update({
                options: null
            });
        }

        _canvasUpdate(time) {
            if (!this.canvasLayer) {
                return;
            }

            var self = this;

            var animationOptions = self.options.animation;

            var context = this.getContext();
            var map = this.map;
            if (self.isEnabledTime()) {
                if (time === undefined) {
                    this.clear(context);
                    return;
                }
                if (this.context === '2d') {
                    context.save();
                    context.globalCompositeOperation = 'destination-out';
                    context.fillStyle = 'rgba(0, 0, 0, .1)';
                    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
                    context.restore();
                }
            } else {
                this.clear(context);
            }

            if (this.context === '2d') {
                for (var key in self.options) {
                    context[key] = self.options[key];
                }
            } else {
                context.clear(context.COLOR_BUFFER_BIT);
            }

            if (self.options.minZoom && map.getZoom() < self.options.minZoom || self.options.maxZoom && map.getZoom() > self.options.maxZoom) {
                return;
            }

            var bounds = map.getBounds();
            //获取当前像素下的地理范围
            var dw = bounds.getEast() - bounds.getWest();
            var dh = bounds.getNorth() - bounds.getSouth();
            var mapCanvas = map.getSize();

            var resolutionX = dw / mapCanvas.x,
                resolutionY = dh / mapCanvas.y;
            //var centerPx = map.latLngToLayerPoint(map.getCenter());

            //获取屏幕左上角的地理坐标坐标
            //左上角屏幕坐标为0,0
            var topLeft = this.canvasLayer.getTopLeft();

            var topLeftPX = map.latLngToContainerPoint(topLeft);
            // 获取精确的像素坐标. https://github.com/SuperMap/iClient-JavaScript/blob/eacc26952b8915bba0122db751d766056c5fb24d/src/leaflet/core/Base.js
            // var topLeftPX = map.latLngToAccurateContainerPoint(topLeft);
            // var lopLeft = map.containerPointToLatLng([0, 0]);
            var dataGetOptions = {
                transferCoordinate: function (coordinate) {
                    var offset;
                    if (self.context === '2d') {
                        offset = map.latLngToContainerPoint(L.latLng(coordinate[1], coordinate[0]));
                        // offset = map.latLngToAccurateContainerPoint(L.latLng(coordinate[1], coordinate[0]));
                    } else {
                        offset = {
                            'x': (coordinate[0] - topLeft.lng) / resolutionX,
                            'y': (topLeft.lat - coordinate[1]) / resolutionY
                        };
                    }
                    var pixel = {
                        x: offset.x - topLeftPX.x,
                        y: offset.y - topLeftPX.y
                    };
                    return [pixel.x, pixel.y];
                }
            };

            if (time !== undefined) {
                dataGetOptions.filter = function (item) {
                    var trails = animationOptions.trails || 10;
                    return (time && item.time > (time - trails) && item.time < time);
                };
            }

            var data = self.dataSet.get(dataGetOptions);

            this.processData(data);

            self.options._size = self.options.size;

            var worldPoint = map.latLngToContainerPoint(L.latLng(0, 0));
            var pixel = {
                x: worldPoint.x - topLeftPX.x,
                y: worldPoint.y - topLeftPX.y
            };
            this.drawContext(context, data, self.options, pixel);

            self.options.updateCallback && self.options.updateCallback(time);
        }

        init(options) {

            var self = this;

            self.options = options;

            this.initDataRange(options);

            this.context = self.options.context || '2d';

            if (self.options.zIndex) {
                this.canvasLayer && this.canvasLayer.setZIndex(self.options.zIndex);
            }

            this.initAnimator();
        }

        addAnimatorEvent() { }

        /**
         * @function MapVRenderer.prototype.moveStartEvent
         * @description 开始移动事件。
         */
        moveStartEvent() {
            var animationOptions = this.options.animation;
            if (this.isEnabledTime() && this.animator) {
                this.steps.step = animationOptions.stepsRange.start;
                this._hide();
            }
        }

        /**
         * @function MapVRenderer.prototype.moveEndEvent
         * @description 结束移动事件。
         */
        moveEndEvent() {
            this.canvasLayer.draw();
            this._show();
        }

        /**
         * @function MapVRenderer.prototype.zoomStartEvent
         * @description 隐藏渲染样式。
         */
        zoomStartEvent() {
            this._hide();
        }

        /**
         * @function MapVRenderer.prototype.clear
         * @description 清除信息。
         * @param {string} context - 指定要清除的信息。
         */
        clear(context) {
            context && context.clearRect && context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        }

        _hide() {
            this.canvasLayer.canvas.style.display = 'none';
        }

        _show() {
            this.canvasLayer.canvas.style.display = 'block';
        }

        /**
         * @function MapVRenderer.prototype.draw
         * @description 绘制渲染
         */
        draw() {
            this.canvasLayer.draw();
        }
    }

    var mapVLayer$2;
    if (typeof (L) !== 'undefined') {
        /**
         * @class mapVLayer
         * @classdesc MapV 图层。
         * @category Visualization MapV
         * @extends {L.Layer}
         * @param {mapv.DataSet} dataSet - MapV 图层数据集。
         * @param {Object} mapVOptions - MapV 图层参数。
         * @param {Object} options - 参数。
         * @param {string} [options.attributionPrefix] - 版权信息前缀。
         * @param {string} [options.attribution='© 2018 百度 MapV'] - 版权信息。
         * @fires mapVLayer#loaded
         */
        var MapVLayer = L.Layer.extend({

            options: {
                attributionPrefix: null,
                attribution: ''
            },

            initialize: function (dataSet, mapVOptions, options) {
                options = options || {};
                this.dataSet = dataSet || {};
                this.mapVOptions = mapVOptions || {};
                this.render = this.render.bind(this);
                L.Util.setOptions(this, options);
                if (this.options.attributionPrefix) {
                    this.options.attribution = this.options.attributionPrefix + this.options.attribution;
                }

                this.canvas = this._createCanvas();
                L.stamp(this);
            },

            /**
             * @private
             * @function mapVLayer.prototype.onAdd
             * @description 添加地图图层。
             * @param {L.Map} map - 要添加的地图。
             */
            onAdd: function (map) {
                this._map = map;
                var overlayPane = this.getPane();
                var container = this.container = L.DomUtil.create("div", "leaflet-layer leaflet-zoom-animated", overlayPane);
                container.appendChild(this.canvas);
                var size = map.getSize();
                container.style.width = size.x + "px";
                container.style.height = size.y + "px";
                this.renderer = new MapVRenderer$1(map, this, this.dataSet, this.mapVOptions);
                this.draw();
                /**
                 * @event mapVLayer#loaded
                 * @description 图层添加完成之后触发。
                 */
                this.fire("loaded");
            },

            // _hide: function () {
            //     this.canvas.style.display = 'none';
            // },

            // _show: function () {
            //     this.canvas.style.display = 'block';
            // },

            /**
             * @private
             * @function mapVLayer.prototype.onRemove
             * @description 删除地图图层。
             */
            onRemove: function () {
                L.DomUtil.remove(this.container);
                this.renderer.destroy();
            },

            /**
             * @function mapVLayer.prototype.addData
             * @description 追加数据。
             * @param {Object} data - 要追加的数据。
             * @param {Object} options - 要追加的值。
             */
            addData: function (data, options) {
                this.renderer.addData(data, options);
            },

            /**
             * @function mapVLayer.prototype.update
             * @description 更新图层。
             * @param {Object} opt - 待更新的数据。
             * @param {Object} data - mapv 数据集。
             * @param {Object} options - mapv 绘制参数。
             */
            update: function (opt) {
                this.renderer.update(opt);
            },

            /**
             * @function mapVLayer.prototype.getData
             * @description 获取数据。
             * @returns {mapv.DataSet} mapv 数据集。
             */
            getData: function () {
                if (this.renderer) {
                    this.dataSet = this.renderer.getData();
                }
                return this.dataSet;
            },

            /**
             * @function mapVLayer.prototype.removeData
             * @description 删除符合过滤条件的数据。
             * @param {Function} filter - 过滤条件。条件参数为数据项，返回值为 true，表示删除该元素；否则表示不删除。
             * @example
             *  filter=function(data){
             *    if(data.id=="1"){
             *      return true
             *    }
             *    return false;
             *  }
             */
            removeData: function (filter) {
                this.renderer && this.renderer.removeData(filter);
            },

            /**
             * @function mapVLayer.prototype.clearData
             * @description 清除数据。
             */
            clearData: function () {
                this.renderer.clearData();
            },

            /**
             * @function mapVLayer.prototype.draw
             * @description 绘制图层。
             */
            draw: function () {
                return this._reset();
            },

            /**
             * @function mapVLayer.prototype.setZIndex
             * @description 设置 canvas 层级。
             * @param {number} zIndex - canvas 层级。
             */
            setZIndex: function (zIndex) {
                this.canvas.style.zIndex = zIndex;
            },

            /**
             * @function mapVLayer.prototype.render
             * @description 渲染。
             */
            render: function () {
                this.renderer._canvasUpdate();
            },

            /**
             * @function mapVLayer.prototype.getCanvas
             * @description 获取 canvas。
             * @returns {HTMLElement} 返回 mapV 图层包含的 canvas 对象。
             */
            getCanvas: function () {
                return this.canvas;
            },

            /**
             * @function mapVLayer.prototype.getContainer
             * @description 获取容器。
             * @returns {HTMLElement} 返回包含 mapV 图层的 dom 对象。
             */
            getContainer: function () {
                return this.container;
            },

            /**
             * @function mapVLayer.prototype.getTopLeft
             * @description 获取左上角坐标。
             * @returns {L.Bounds} 返回左上角坐标。
             */
            getTopLeft: function () {
                var map = this._map;
                var topLeft;
                if (map) {
                    var bounds = map.getBounds();
                    topLeft = bounds.getNorthWest();
                }
                return topLeft;

            },

            _createCanvas: function () {
                var canvas = document.createElement('canvas');
                canvas.style.position = 'absolute';
                canvas.style.top = 0 + "px";
                canvas.style.left = 0 + "px";
                canvas.style.pointerEvents = "none";
                canvas.style.zIndex = this.options.zIndex || 600;
                var global$2 = typeof window === 'undefined' ? {} : window;
                var devicePixelRatio = this.devicePixelRatio = global$2.devicePixelRatio;
                if (!this.mapVOptions.context || this.mapVOptions.context === '2d') {
                    canvas.getContext('2d').scale(devicePixelRatio, devicePixelRatio);
                }
                return canvas;
            },


            _resize: function () {
                var canvas = this.canvas;
                if (!canvas) {
                    return;
                }

                var map = this._map;
                var size = map.getSize();
                canvas.width = size.x;
                canvas.height = size.y;
                canvas.style.width = size.x + 'px';
                canvas.style.height = size.y + 'px';
                var bounds = map.getBounds();
                var topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
                L.DomUtil.setPosition(canvas, topLeft);

            },

            _reset: function () {
                this._resize();
                this._render();
            },
            redraw: function () {
                this._resize();
                this._render();
            },
            _render: function () {
                this.render();
            }

        });

        mapVLayer$2 = function (dataSet, mapVOptions, options) {
            return new MapVLayer(dataSet, mapVOptions, options);
        };
    }
    var mapVLayer$3 = mapVLayer$2;

    class MapVRenderer extends BaseLayer {

        /**
         * Creates an instance of MapVRenderer.
         * @param {*} viewer cesium viewer
         * @param {*} dataset mapv dataset
         * @param {*} option mapvOptions
         * @param {*} mapVLayer
         * @memberof MapVRenderer
         */
        constructor(viewer, dataset, option, mapVLayer) {
            super(viewer, dataset, option);
            if (!BaseLayer) {
                return;
            }
            this.map = viewer,
                this.scene = viewer.scene,
                this.dataSet = dataset;
            option = option || {},
                this.init(option),
                this.argCheck(option),
                this.initDevicePixelRatio(),
                this.canvasLayer = mapVLayer,
                this.stopAniamation = !1,
                this.animation = option.animation,
                this.clickEvent = this.clickEvent.bind(this),
                this.mousemoveEvent = this.mousemoveEvent.bind(this),
                this.bindEvent();
        }
        initDevicePixelRatio() {
            this.devicePixelRatio = window.devicePixelRatio || 1;
        }
        clickEvent(t) {
            var e = t.point;
            super.clickEvent(e, t);
        }
        mousemoveEvent(t) {
            var e = t.point;
            super.mousemoveEvent(e, t);
        }
        addAnimatorEvent() { }
        animatorMovestartEvent() {
            var t = this.options.animation;
            this.isEnabledTime() && this.animator && (this.steps.step = t.stepsRange.start);
        }
        animatorMoveendEvent() {
            this.isEnabledTime() && this.animator;
        }
        bindEvent() {
            this.map;
            this.options.methods && (this.options.methods.click,
                this.options.methods.mousemove);
        }
        unbindEvent() {
            var t = this.map;
            this.options.methods && (this.options.methods.click && t.off("click", this.clickEvent),
                this.options.methods.mousemove && t.off("mousemove", this.mousemoveEvent));
        }
        getContext() {
            return this.canvasLayer.canvas.getContext(this.context)
        }
        init(t) {
            this.options = t,
                this.initDataRange(t),
                this.context = this.options.context || "2d",
                this.options.zIndex && this.canvasLayer && this.canvasLayer.setZIndex(this.options.zIndex),
                this.initAnimator();
        }
        _canvasUpdate(t) {
            this.map;
            var e = this.scene;
            if (this.canvasLayer && !this.stopAniamation) {
                var i = this.options.animation
                    , n = this.getContext();
                if (this.isEnabledTime()) {
                    if (void 0 === t)
                        return void this.clear(n);
                    "2d" === this.context && (n.save(),
                        n.globalCompositeOperation = "destination-out",
                        n.fillStyle = "rgba(0, 0, 0, .1)",
                        n.fillRect(0, 0, n.canvas.width, n.canvas.height),
                        n.restore());
                } else
                    this.clear(n);
                if ("2d" === this.context)
                    for (var o in this.options)
                        n[o] = this.options[o];
                else
                    n.clear(n.COLOR_BUFFER_BIT);
                var a = {
                    transferCoordinate: function (t) {
                        var i = Cesium.Cartesian3.fromDegrees(t[0], t[1])
                            , n = Cesium.SceneTransforms.wgs84ToWindowCoordinates(e, i);
                        return void 0 == n ? [-1, -1] : [n.x, n.y]
                    }
                };
                void 0 !== t && (a.filter = function (e) {
                    var n = i.trails || 10;
                    return !!(t && e.time > t - n && e.time < t)
                }
                );
                var c = this.dataSet.get(a);
                this.processData(c),
                    "m" == this.options.unit && this.options.size,
                    this.options._size = this.options.size;
                var h = Cesium.SceneTransforms.wgs84ToWindowCoordinates(e, Cesium.Cartesian3.fromDegrees(0, 0));
                this.drawContext(n, new DataSet$1(c), this.options, h),
                    this.options.updateCallback && this.options.updateCallback(t);
            }
        }
        updateData(t, e) {
            var i = t;
            i && i.get && (i = i.get()),
                void 0 != i && this.dataSet.set(i),
                super.update({
                    options: e
                });
        }
        addData(t, e) {
            var i = t;
            t && t.get && (i = t.get()),
                this.dataSet.add(i),
                this.update({
                    options: e
                });
        }
        getData() {
            return this.dataSet
        }
        removeData(t) {
            if (this.dataSet) {
                var e = this.dataSet.get({
                    filter: function (e) {
                        return null == t || "function" != typeof t || !t(e)
                    }
                });
                this.dataSet.set(e),
                    this.update({
                        options: null
                    });
            }
        }
        clearData() {
            this.dataSet && this.dataSet.clear(),
                this.update({
                    options: null
                });
        }
        draw() {
            this.canvasLayer.draw();
        }
        clear(t) {
            t && t.clearRect && t.clearRect(0, 0, t.canvas.width, t.canvas.height);
        }
    }

    var mapVLayer;
    if (typeof (Cesium) !== 'undefined') {
        var defIndex = 0;
        Cesium;
        class MapVLayer {
            /**
             *Creates an instance of MapVLayer.
             * @param {*} viewer
             * @param {*} dataset
             * @param {*} options
             * @param {*} container default viewer.container
             * @memberof MapVLayer
             */
            constructor(viewer, dataset, options, container) {
                this.map = viewer,
                    this.scene = viewer.scene,
                    this.mapvBaseLayer = new MapVRenderer(viewer, dataset, options, this),
                    this.mapVOptions = options,
                    this.initDevicePixelRatio(),
                    this.canvas = this._createCanvas(),
                    this.render = this.render.bind(this);
                if (container) {
                    this.container = container;
                } else {
                    const inner = viewer.container.querySelector('.cesium-viewer-cesiumWidgetContainer');
                    this.container = inner ? inner : viewer.container;
                }
                this.addInnerContainer();

                // void 0 != container ? (this.container = container,
                //     container.appendChild(this.canvas)) : (this.container = viewer.container,
                //         this.addInnerContainer()),
                this.bindEvent();
                this._reset();
            }
            initDevicePixelRatio() {
                this.devicePixelRatio = window.devicePixelRatio || 1;
            }
            addInnerContainer() {
                this.container.appendChild(this.canvas);
            }
            bindEvent() {
                var that = this;

                this.innerMoveStart = this.moveStartEvent.bind(this);
                this.innerMoveEnd = this.moveEndEvent.bind(this);
                this.scene.camera.moveStart.addEventListener(this.innerMoveStart, this);
                this.scene.camera.moveEnd.addEventListener(this.innerMoveEnd, this);

                var t = new Cesium.ScreenSpaceEventHandler(this.scene.canvas);

                t.setInputAction(function (t) {
                    that.innerMoveEnd();
                }, Cesium.ScreenSpaceEventType.LEFT_UP);
                t.setInputAction(function (t) {
                    that.innerMoveEnd();
                }, Cesium.ScreenSpaceEventType.MIDDLE_UP);
                this.handler = t;
            }
            unbindEvent() {
                this.scene.camera.moveStart.removeEventListener(this.innerMoveStart, this);
                this.scene.camera.moveEnd.removeEventListener(this.innerMoveEnd, this);
                this.scene.postRender.removeEventListener(this._reset, this);
                this.handler && (this.handler.destroy(), this.handler = null);
            }
            moveStartEvent() {
                if (this.mapvBaseLayer) {
                    this.mapvBaseLayer.animatorMovestartEvent();
                    this.scene.postRender.addEventListener(this._reset, this);
                }
            }
            moveEndEvent() {
                if (this.mapvBaseLayer) {
                    this.scene.postRender.removeEventListener(this._reset, this),
                        this.mapvBaseLayer.animatorMoveendEvent();
                    this._reset();
                }
            }
            zoomStartEvent() {
                this._unvisiable();
            }
            zoomEndEvent() {
                this._unvisiable();
            }
            addData(t, e) {
                void 0 != this.mapvBaseLayer && this.mapvBaseLayer.addData(t, e);
            }
            updateData(t, e) {
                void 0 != this.mapvBaseLayer && this.mapvBaseLayer.updateData(t, e);
            }
            getData() {
                return this.mapvBaseLayer && (this.dataSet = this.mapvBaseLayer.getData()),
                    this.dataSet
            }
            removeData(t) {
                void 0 != this.mapvBaseLayer && this.mapvBaseLayer && this.mapvBaseLayer.removeData(t);
            }
            removeAllData() {
                void 0 != this.mapvBaseLayer && this.mapvBaseLayer.clearData();
            }
            _visiable() {
                return this.canvas.style.display = "block",
                    this
            }
            _unvisiable() {
                return this.canvas.style.display = "none",
                    this
            }
            _createCanvas() {
                var t = document.createElement("canvas");
                t.id = this.mapVOptions.layerid || "mapv" + defIndex++ ,
                    t.style.position = "absolute",
                    t.style.top = "0px",
                    t.style.left = "0px",
                    t.style.pointerEvents = "none",
                    t.style.zIndex = this.mapVOptions.zIndex || 0,
                    t.width = parseInt(this.map.canvas.width),
                    t.height = parseInt(this.map.canvas.height),
                    t.style.width = this.map.canvas.style.width,
                    t.style.height = this.map.canvas.style.height;
                var e = this.devicePixelRatio;
                return "2d" == this.mapVOptions.context && t.getContext(this.mapVOptions.context).scale(e, e),
                    t
            }
            _reset() {
                this.resizeCanvas();
                this.fixPosition();
                this.onResize();
                this.render();
            }
            draw() {
                this._reset();
            }
            show() {
                this._visiable();
            }
            hide() {
                this._unvisiable();
            }
            destroy() {
                this.remove();
            }
            remove() {
                void 0 != this.mapvBaseLayer && (this.removeAllData(),
                    this.mapvBaseLayer.clear(this.mapvBaseLayer.getContext()),
                    this.mapvBaseLayer = void 0,
                    this.canvas.parentElement.removeChild(this.canvas));
            }
            update(t) {
                void 0 != t && this.updateData(t.data, t.options);
            }
            resizeCanvas() {
                if (void 0 != this.canvas && null != this.canvas) {
                    var t = this.canvas;
                    t.style.position = "absolute",
                        t.style.top = "0px",
                        t.style.left = "0px",
                        t.width = parseInt(this.map.canvas.width),
                        t.height = parseInt(this.map.canvas.height),
                        t.style.width = this.map.canvas.style.width,
                        t.style.height = this.map.canvas.style.height;
                }
            }
            fixPosition() { }
            onResize() { }
            render() {
                void 0 != this.mapvBaseLayer && this.mapvBaseLayer._canvasUpdate();
            }
        }
        mapVLayer = function (viewer, dataSet, mapVOptions, container) {
            return new MapVLayer(viewer, dataSet, mapVOptions, container);
        };
    }

    var mapVLayer$1 = mapVLayer;

    /**
     * GeoJSON解析模块
     * @author kyle / http://nikai.us/
     */
    var geojson = {
        /**
         * 将GeoJSON对象转换为DataSet对象
         * @param geoJson GeoJSON对象
         * @returns DataSet对象
         */
        getDataSet: function (geoJson) {
            var data = [];
            var features = geoJson.features;
            // 遍历GeoJSON要素
            if (features) {
                for (var i = 0; i < features.length; i++) {
                    var feature = features[i];
                    var geometry = feature.geometry;
                    var properties = feature.properties;
                    var item = {
                        geometry: geometry
                    };
                    // 复制属性
                    for (var key in properties) {
                        item[key] = properties[key];
                    }
                    data.push(item);
                }
            }
            // 创建并返回DataSet对象
            return new DataSet$1(data);
        }
    };

    /**
     * CSV解析模块
     * @author kyle / http://nikai.us/
     */
    var csv = {
        /**
         * 将CSV字符串转换为二维数组
         * @param strData CSV字符串
         * @param strDelimiter 分隔符，默认为逗号
         * @returns 解析后的二维数组
         */
        CSVToArray: function (strData, strDelimiter) {
            // 检查分隔符是否定义，默认使用逗号
            strDelimiter = (strDelimiter || ",");
            // 创建正则表达式来解析CSV值
            var objPattern = new RegExp((
            // 分隔符
            "(\"" + strDelimiter + "|\\r?\\n|\\r|^)" +
                // 带引号的字段
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                // 标准字段
                "([^\"\"" + strDelimiter + "\\r\\n]*))"), "gi");
            // 创建数组来保存数据，默认添加一个空的第一行
            var arrData = [[]];
            // 创建数组来保存单个模式匹配组
            var arrMatches = null;
            // 循环匹配正则表达式，直到找不到匹配项
            while ((arrMatches = objPattern.exec(strData)) !== null) {
                // 获取找到的分隔符
                var strMatchedDelimiter = arrMatches[1];
                // 检查分隔符是否有长度（不是字符串开头）并且是否匹配字段分隔符
                // 如果不匹配，则表示这是行分隔符
                if (strMatchedDelimiter.length &&
                    strMatchedDelimiter !== strDelimiter) {
                    // 由于我们已经到达新的数据行，向数据数组添加一个空行
                    arrData.push([]);
                }
                var strMatchedValue = void 0;
                // 检查捕获的是哪种值（带引号或不带引号）
                if (arrMatches[2]) {
                    // 找到带引号的值，移除转义的双引号
                    strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g"), "\"");
                }
                else {
                    // 找到不带引号的值
                    strMatchedValue = arrMatches[3];
                }
                // 将值添加到数据数组
                arrData[arrData.length - 1].push(strMatchedValue);
            }
            // 返回解析后的数据
            return arrData;
        },
        /**
         * 将CSV字符串转换为DataSet对象
         * @param csvStr CSV字符串
         * @param split 分隔符，默认为逗号
         * @returns DataSet对象
         */
        getDataSet: function (csvStr, split) {
            // 解析CSV字符串为二维数组
            var arr = this.CSVToArray(csvStr, split || ',');
            var data = [];
            // 获取表头
            var header = arr[0];
            // 遍历数据行，跳过表头和最后一行（可能为空）
            for (var i = 1; i < arr.length - 1; i++) {
                var line = arr[i];
                var item = {};
                // 遍历每个字段
                for (var j = 0; j < line.length; j++) {
                    var value = line[j];
                    // 如果字段名是'geometry'，则解析为JSON对象
                    if (header[j] === 'geometry') {
                        value = JSON.parse(value);
                    }
                    item[header[j]] = value;
                }
                data.push(item);
            }
            // 创建并返回DataSet对象
            return new DataSet$1(data);
        }
    };

    exports.AMapLayer = Layer$1;
    exports.DataSet = DataSet$1;
    exports.Map = MapHelper;
    exports.MaptalksLayer = Layer$3;
    exports.OpenlayersLayer = Layer;
    exports.baiduMapAnimationLayer = AnimationLayer;
    exports.baiduMapCanvasLayer = CanvasLayer$1;
    exports.baiduMapLayer = Layer$5;
    exports.canvasClear = clear;
    exports.canvasDrawGrid = drawGrid;
    exports.canvasDrawHeatmap = drawHeatmap;
    exports.canvasDrawHoneycomb = drawHoneycomb;
    exports.canvasDrawSimple = drawSimple;
    exports.canvasResolutionScale = resolutionScale$1;
    exports.cesiumMapLayer = mapVLayer$1;
    exports.csv = csv;
    exports.geojson = geojson;
    exports.googleMapCanvasLayer = CanvasLayer;
    exports.googleMapLayer = Layer$4;
    exports.leafletMapLayer = mapVLayer$3;
    exports.utilCityCenter = cityCenter;
    exports.utilCurve = curve;
    exports.utilDataRangeCategory = Category;
    exports.utilDataRangeChoropleth = Choropleth;
    exports.utilDataRangeIntensity = Intensity;
    exports.utilForceEdgeBundling = ForceEdgeBundling;
    exports.version = version;
    exports.webglDrawLine = line;
    exports.webglDrawPoint = point;
    exports.webglDrawPolygon = polygon;
    exports.webglDrawSimple = webglDrawSimple;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
