# DataSet 数据集

## 概述

DataSet 是 MapV 中统一规范的数据对象，用来保存和管理 JSON 数据。它是 MapV 的核心数据管理类，负责处理所有地理信息数据，支持点、线、面等 GeoJSON 格式的地理数据。

## 构造函数

```javascript
new mapv.DataSet(data, options)
```

### 参数

| 参数名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| data | Array | [] | 数据数组，包含要管理的地理信息数据 |
| options | Object | {} | 可选配置项，目前为预留扩展接口，没有预定义字段 |

### 示例

```javascript
// 创建一个空的 DataSet 实例
var dataSet = new mapv.DataSet();

// 使用数据数组创建 DataSet 实例
var data = [
  { city: "北京", count: 30 },
  { city: "南京", count: 30 }
];
var dataSet = new mapv.DataSet(data);
```

## 数据格式

### 基础数据格式

```javascript
var data = [
  { city: "北京", count: 30 },
  { city: "南京", count: 30 }
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
      coordinates: [123, 23]
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

## 方法

### get()

获取数据集中的数据。

```javascript
dataSet.get(args)
```

#### 参数

| 参数名 | 类型 | 默认值 | 必填 | 描述 |
|--------|------|--------| ------| ------|
| args | Object | {} | 否 | 配置参数对象 |
| args.filter | Function | undefined  | 否 | 数据过滤函数，返回 `true` 的数据项会被包含在结果中 |
| args.transferCoordinate | Function | undefined | 否 | 坐标转换函数，用于转换数据项的坐标 |
| args.fromColumn | String | 'coordinates' | 否 | 源坐标列名，默认为 'coordinates'，配合transferCoordinate使用 |
| args.toColumn | String | '_coordinates' | 否 |目标坐标列名，默认为 '_coordinates'，配合transferCoordinate使用 |

#### 返回值
- `Array` - 数据数组

#### 示例

```javascript
// 获取所有数据
var data = dataSet.get();

// 使用过滤器获取数据
var filteredData = dataSet.get({
  filter: function (item) {
    return item.count > 10; // 只返回 count 大于 10 的数据项
  },
});

// 使用坐标转换函数
var transformedData = dataSet.get({
  transferCoordinate: function (coordinates) {
    // 将经纬度转换为其他坐标系
    return [coordinates[0] + 0.1, coordinates[1] + 0.1];
  },
});
```

### set(data)

设置数据集的内容，替换现有数据。

```javascript
dataSet.set(data)
```

#### 参数
- `data` (Array) - 新的数据数组，将替换数据集中的所有现有数据

#### 返回值
- 无

#### 示例

```javascript
// 设置新数据
var newData = [
  {
    geometry: {
      type: "Point",
      coordinates: [123, 23],
    },
    fillStyle: "red",
    size: 30,
  },
  {
    geometry: {
      type: "Point",
      coordinates: [124, 24],
    },
    fillStyle: "blue",
    size: 20,
  },
];
dataSet.set(newData);

// 设置空数组，清空数据集
dataSet.set([]);
```

### add(data)

添加数据到数据集。

```javascript
dataSet.add(data)
```

#### 参数
- `data` (Object | Array) - 要添加的数据项或数据数组
  - 若为 Object，则添加单条数据
  - 若为 Array，则添加多条数据

#### 返回值
- 无

#### 示例

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

### update(callback, condition)

更新数据集中的数据。

```javascript
dataSet.update(callback, condition)
```

#### 参数
- `callback` (Function) - 更新回调函数，接收数据项作为参数，用于修改数据
- `condition` (Object | Function, 可选) - 更新条件
  - 若为 Object，则匹配所有属性的对象会被更新
  - 若为 Function，则返回 `true` 的数据项会被更新
  - 若不提供，则更新所有数据项

#### 返回值
- 无

#### 示例

```javascript
// 更新所有数据
dataSet.update(function (item) {
  item.count += 10;
});

// 按条件对象更新数据
dataSet.update(
  function (item) {
    item.count += 10;
  },
  { city: "北京" }
);

// 按条件函数更新数据
dataSet.update(
  function (item) {
    item.count += 10;
  },
  function (item) {
    return item.count < 50;
  }
);
```



### clear()

清空数据集中的所有数据。

```javascript
dataSet.clear()
```

#### 参数
- 无

#### 返回值
- 无

#### 示例

```javascript
// 清空数据集
dataSet.clear();

// 清空后验证数据数量
var dataCount = dataSet.getTotal();
console.log(dataCount); // 预期输出: 0
```

### reset()

将数据集恢复到初始状态，使用缓存的数据。

```javascript
dataSet.reset()
```

#### 示例

```javascript
// 初始化数据集
var data = [{ city: "北京", count: 30 }, { city: "上海", count: 50 }];
var dataSet = new mapv.DataSet(data);

// 修改数据
dataSet.update(function(item) {
  item.count += 10;
});

// 重置数据集
dataSet.reset();
```

### initGeometry(transferFn)

初始化数据项的 geometry 字段，用于将非地理数据转换为地理数据。

```javascript
dataSet.initGeometry(transferFn)
```

#### 参数
- `transferFn` (Function, 可选) - 自定义转换函数，用于生成 geometry 字段

#### 返回值
- 无

#### 示例

```javascript
// 使用默认转换函数初始化 geometry
var data = [
  { city: '北京', count: 30 },
  { lng: 116.404, lat: 39.915, count: 50 }
];
var dataSet = new mapv.DataSet(data);

dataSet.initGeometry();

// 使用自定义转换函数初始化 geometry
dataSet.initGeometry(function(item) {
  return {
    type: 'Point',
    coordinates: [item.lng || 0, item.lat || 0]
  };
});
```

### getMin(columnName)

获取指定列的最小值。

```javascript
dataSet.getMin(columnName)
```

#### 参数
- `columnName` (String) - 列名，用于指定要计算最小值的属性

#### 返回值
- `Number` - 该列的最小值
- `undefined` - 当数据集中没有数据时返回

#### 示例

```javascript
// 获取 count 列的最小值
var minCount = dataSet.getMin('count');
console.log(minCount); // 预期输出: 数据集中 count 列的最小值
```

### getMax(columnName)

获取指定列的最大值。

```javascript
dataSet.getMax(columnName)
```

#### 参数
- `columnName` (String) - 列名，用于指定要计算最大值的属性

#### 返回值
- `Number` - 该列的最大值
- `undefined` - 当数据集中没有数据时返回

#### 示例

```javascript
// 获取 count 列的最大值
var maxCount = dataSet.getMax('count');
console.log(maxCount); // 预期输出: 数据集中 count 列的最大值
```

### getSum(columnName)

获取指定列的总和。

```javascript
dataSet.getSum(columnName)
```

#### 参数
- `columnName` (String) - 列名，用于指定要求和的属性

#### 返回值
- `Number` - 该列的总和
- `undefined` - 当数据集中没有数据时返回

#### 示例

```javascript
// 获取 count 列的总和
var sumCount = dataSet.getSum('count');
console.log(sumCount); // 预期输出: 数据集中 count 列的总和
```

### getAverage(columnName)

获取指定列的平均值。

```javascript
dataSet.getAverage(columnName)
```

#### 参数
- `columnName` (String) - 列名，用于指定要计算平均值的属性

#### 返回值
- `Number` - 该列的平均值

#### 示例

```javascript
// 获取 count 列的平均值
var avgCount = dataSet.getAverage('count');
console.log(avgCount); // 预期输出: 数据集中 count 列的平均值
```

### getUnique(columnName)

获取指定列的唯一值数组。

```javascript
dataSet.getUnique(columnName)
```

#### 参数
- `columnName` (String) - 列名，用于指定要获取唯一值的属性

#### 返回值
- `Array` - 唯一值数组
- `undefined` - 当数据集中没有数据时返回

#### 示例

```javascript
// 获取 city 列的唯一值
var uniqueCities = dataSet.getUnique('city');
console.log(uniqueCities); // 预期输出: 数据集中 city 列的唯一值数组
```

### sort(columnName, order)

对数据集中的数据进行排序。

```javascript
dataSet.sort(columnName, order)
```

#### 参数

| 参数名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| columnName | String | 无 | 排序列名，用于指定排序的属性 |
| order | String | 'asc' | 排序方式 |

#### 返回值
- 无

#### 示例

```javascript
// 按 count 列升序排序
dataSet.sort('count');

// 按 count 列降序排序
dataSet.sort('count', 'desc');
```

### getPage(page, pageSize)

获取数据集中的分页数据。

```javascript
dataSet.getPage(page, pageSize)
```

#### 参数

| 参数名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| page | Number | 无 | 页码，从 1 开始 |
| pageSize | Number | 无 | 每页数据条数 |

#### 返回值
- `Array` - 分页数据数组

#### 示例

```javascript
// 获取第 1 页，每页 10 条数据
var page1 = dataSet.getPage(1, 10);
console.log(page1.length); // 预期输出: 10（如果数据总数大于等于 10）

// 获取第 2 页，每页 10 条数据
var page2 = dataSet.getPage(2, 10);
console.log(page2.length); // 预期输出: 10（如果数据总数大于等于 20）
```

### getTotal()

获取数据集中的数据总数。

```javascript
dataSet.getTotal()
```

#### 参数
- 无

#### 返回值
- `Number` - 数据总数

#### 示例

```javascript
// 获取数据总数
var total = dataSet.getTotal();
console.log(total); // 预期输出: 数据集中的数据总数
```

### groupBy(columnName)

按指定列对数据集中的数据进行分组。

```javascript
dataSet.groupBy(columnName)
```

#### 参数
- `columnName` (String) - 分组列名，用于指定分组的属性

#### 返回值
- `Object` - 分组结果，键为分组列的值，值为该分组的数据数组

#### 示例

```javascript
// 按 city 列分组
var groupedByCity = dataSet.groupBy('city');
console.log(groupedByCity); 
// 预期输出: { 
//   '北京': [{...}, {...}], 
//   '上海': [{...}, {...}], 
//   ... 
// }
```

### find(predicate)

查找数据集中第一个匹配条件的数据项。

```javascript
dataSet.find(predicate)
```

#### 参数
- `predicate` (Function) - 查找条件函数，接收数据项作为参数，返回 `true` 的第一个数据项会被返回

#### 返回值
- `Object|null` - 第一个匹配条件的数据项，或 null（如果没有匹配项）

#### 示例

```javascript
// 查找 count 大于 15 的第一个数据项
var foundItem = dataSet.find(function (item) {
  return item.count > 15;
});
console.log(foundItem); // 预期输出: 第一个 count 大于 15 的数据项
```

### findAll(predicate)

查找数据集中所有匹配条件的数据项。

```javascript
dataSet.findAll(predicate)
```

#### 参数
- `predicate` (Function) - 查找条件函数，接收数据项作为参数，返回 `true` 的数据项会被包含在结果中

#### 返回值
- `Array` - 所有匹配条件的数据项数组

#### 示例

```javascript
// 查找所有 count 大于 10 的数据项
var foundItems = dataSet.findAll(function (item) {
  return item.count > 10;
});
console.log(foundItems.length); // 预期输出: 匹配条件的数据项数量
```

### map(mapper)

对数据集中的每个数据项应用映射函数，返回转换后的数据数组。

```javascript
dataSet.map(mapper)
```

#### 参数
- `mapper` (Function) - 映射函数，接收数据项作为参数，返回转换后的数据项

#### 返回值
- `Array` - 转换后的数据数组

#### 示例

```javascript
// 将 count 转换为 log10(count)
var logData = dataSet.map(function (item) {
  return {
    ...item,
    count: Math.log10(item.count)
  };
});
console.log(logData); // 预期输出: count 转换为 log10 值的数据数组
```

### filter(predicate)

过滤数据集中的数据，返回符合条件的数据项数组。

```javascript
dataSet.filter(predicate)
```

#### 参数
- `predicate` (Function) - 过滤函数，接收数据项作为参数，返回 `true` 的数据项会被包含在结果中

#### 返回值
- `Array` - 过滤后的数据数组

#### 示例

```javascript
// 过滤出 count 大于 10 的数据项
var filteredData = dataSet.filter(function (item) {
  return item.count > 10;
});
console.log(filteredData.length); // 预期输出: count 大于 10 的数据项数量

// 过滤出点数据
var pointData = dataSet.filter(function (item) {
  return item.geometry && item.geometry.type === "Point";
});
console.log(pointData.length); // 预期输出: 点数据的数量
```