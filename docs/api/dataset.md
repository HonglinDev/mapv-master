# DataSet 数据集

DataSet 是 MapV 中统一规范的数据对象，用来保存 JSON 数据对象。可以增删改查数据，并且可以订阅数据修改事件。

## 简介

DataSet 是 MapV 的核心数据管理类，负责处理所有地理信息数据。它支持点、线、面等 GeoJSON 格式的地理数据，并提供了丰富的数据操作方法。

## 数据格式

### 基本数据格式

```javascript
var data = [
  {
    city: "北京",
    count: 30,
  },
  {
    city: "南京",
    count: 30,
  },
];
var dataSet = new mapv.DataSet(data);
```

### 地理信息数据格式

MapV 中主要展示地理信息数据，需要在数据中添加 geometry 字段，geometry 字段的内容统一使用 GeoJSON 规范。

```javascript
var data = [
  // 点数据
  {
    geometry: {
      type: "Point",
      coordinates: [123, 23],
    },
    fillStyle: "red",
    size: 30,
  },
  // 线数据
  {
    geometry: {
      type: "LineString",
      coordinates: [
        [123, 23],
        [124, 24],
      ],
    },
    count: 30,
  },
  // 面数据
  {
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [123, 23],
          [123, 23],
          [123, 23],
        ],
      ],
    },
    count: 30 * Math.random(),
  },
];

var dataSet = new mapv.DataSet(data);
```

### 构造函数

DataSet(data, options)
创建一个新的 DataSet 实例。

#### 参数

```javascript
data(Array) - 数据数组;
options(Object) - 可选配置项;
```

```javascript
var dataSet = new mapv.DataSet(data, {
  // 配置项
});
```

### 方法

##### get(args)

获取数据集中的数据。

参数

```javascript
args(Object) - 可选参数;
filter(Function) - 数据过滤函数;
transferCoordinate(Function) - 坐标转换函数;
返回值(Array) - 数据数组;
// 获取所有数据
var data = dataSet.get();

// 使用过滤器获取数据
var data = dataSet.get({
  filter: function (item) {
    return item.count > 10;
  },
});
```

#### set(data)

设置数据集的内容。

参数

示例

```javascript
data(Array) - 新的数据数组;
dataSet.set([
  {
    geometry: {
      type: "Point",
      coordinates: [123, 23],
    },
    fillStyle: "red",
    size: 30,
  },
]);
```

#### add(data)

添加数据到数据集。

参数

data(Object | Array) - 要添加的数据项或数据数组;
示例;

```javascript
// 添加单条数据
dataSet.add({
  geometry: {
    type: "Point",
    coordinates: [123, 23],
  },
  count: 50,
});

// 添加多条数据
dataSet.add([
  {
    geometry: {
      type: "Point",
      coordinates: [123, 23],
    },
    count: 50,
  },
  {
    geometry: {
      type: "Point",
      coordinates: [124, 24],
    },
    count: 60,
  },
]);
```

#### update(callback, condition)

更新数据集中的数据。

参数

callback (Function) - 更新回调函数
condition (Object) - 更新条件
示例

```javascript
// 更新所有数据
dataSet.update(function (item) {
  item.count += 10;
});

// 按条件更新数据
dataSet.update(
  function (item) {
    item.count += 10;
  },
  { city: "北京" }
);
```

#### remove(args)

移除数据。

参数

args (Object) - 移除条件
clear()
清空数据集。

getMin(columnName)
获取指定列的最小值。

参数

columnName (String) - 列名
返回值

(Number) - 最小值

getMax(columnName)
获取指定列的最大值。

参数

columnName (String) - 列名
返回值

(Number) - 最大值

getSum(columnName)
获取指定列的总和。

参数

columnName (String) - 列名
返回值

(Number) - 总和

getAverage(columnName)
获取指定列的平均值。

参数

columnName (String) - 列名
返回值

(Number) - 平均值

sort(columnName, order)
对数据进行排序。

参数

columnName (String) - 排序列名
order (String) - 排序方式 ('asc' 或 'desc')
getPage(page, pageSize)
获取分页数据。

参数

page (Number) - 页码（从 1 开始）
pageSize (Number) - 每页数据条数
返回值

(Array) - 分页数据

getTotal()
获取数据总数。

返回值

(Number) - 数据总数

groupBy(columnName)
按列分组数据。

参数

columnName (String) - 分组列名
返回值

(Object) - 分组结果

find(predicate)
查找单个匹配项。

参数

predicate (Function) - 查找条件函数
返回值

(Object|null) - 匹配项或 null

findAll(predicate)
查找所有匹配项。

参数

predicate (Function) - 查找条件函数
返回值

(Array) - 匹配项数组

map(mapper)
数据映射转换。

参数

mapper (Function) - 映射函数
返回值

(Array) - 转换后的数据数组

filter(filter)
数据过滤。

参数

filter (Function) - 过滤函数
返回值

(Array) - 过滤后的数据数组
