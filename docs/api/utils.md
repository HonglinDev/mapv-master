# 工具类 (Utils)

工具类是 MapV 中提供的一些通用工具函数，用于辅助数据处理和可视化。

## 角度计算

### getAngle(start, end)

根据两点坐标获取角度。

#### 参数
- `start` (Array) - 起点坐标，格式为 [x, y]
- `end` (Array) - 终点坐标，格式为 [x, y]

#### 返回值
- `Number` - 角度（范围：0-360度）

#### 示例

```javascript
// 计算两点之间的角度
var start = [100, 100];
var end = [200, 200];
var angle = mapv.utils.getAngle(start, end);
console.log(angle); // 预期输出: 45

// 计算不同方向的角度
var angle1 = mapv.utils.getAngle([0, 0], [1, 0]);
console.log(angle1); // 预期输出: 0

var angle2 = mapv.utils.getAngle([0, 0], [0, 1]);
console.log(angle2); // 预期输出: 90

var angle3 = mapv.utils.getAngle([0, 0], [-1, 0]);
console.log(angle3); // 预期输出: 180

var angle4 = mapv.utils.getAngle([0, 0], [0, -1]);
console.log(angle4); // 预期输出: 270
```

#### 适用场景
- 计算两点之间的方向角
- 旋转图标或标记
- 绘制箭头或方向指示
- 路径规划和导航

#### 边缘情况
- 当 start 和 end 坐标相同时，返回 0
- 当 end.x < start.x 时，角度会自动调整到 180-360 度范围
- 当 end.y < start.y 时，角度会自动调整到 0-360 度范围

## 曲线生成

### curve(points, curvature)

生成平滑曲线。

#### 参数
- `points` (Array) - 原始点数组，格式为 [[x1, y1], [x2, y2], ...]
- `curvature` (Number, 可选) - 曲线曲率，默认值为 0.5

#### 返回值
- `Array` - 生成的曲线上的点数组

#### 示例

```javascript
// 生成平滑曲线
var points = [[100, 100], [200, 200], [300, 150], [400, 250]];
var curvePoints = mapv.utils.curve(points);
console.log(curvePoints.length); // 预期输出: 生成的曲线上的点数量

// 调整曲线曲率
var curvePoints2 = mapv.utils.curve(points, 0.8);
console.log(curvePoints2.length); // 预期输出: 生成的曲线上的点数量
```

#### 适用场景
- 绘制平滑路径
- 地图上的轨迹可视化
- 数据可视化中的曲线连接
- 动画路径生成

#### 边缘情况
- 当 points 数组长度小于 2 时，返回原始点数组
- 当 curvature 为 0 时，生成的曲线接近直线
- 当 curvature 大于 1 时，曲线会变得更加弯曲

## 城市中心点

### cityCenter(cityName)

获取城市中心点坐标。

#### 参数
- `cityName` (String) - 城市名称

#### 返回值
- `Array|null` - 城市中心点坐标，格式为 [longitude, latitude]，如果找不到城市则返回 null

#### 示例

```javascript
// 获取城市中心点坐标
var beijingCenter = mapv.utils.cityCenter('北京');
console.log(beijingCenter); // 预期输出: [116.4074, 39.9042]

var shanghaiCenter = mapv.utils.cityCenter('上海');
console.log(shanghaiCenter); // 预期输出: [121.4737, 31.2304]

var unknownCenter = mapv.utils.cityCenter('未知城市');
console.log(unknownCenter); // 预期输出: null
```

#### 适用场景
- 城市定位
- 地图中心点设置
- 城市数据可视化
- 区域分析

#### 边缘情况
- 当城市名称不存在时，返回 null
- 当城市名称拼写不正确时，可能返回 null
- 当城市名称为中文时，需要使用正确的中文名称

## 事件处理

### Event

事件处理工具类，用于事件的绑定和触发。

#### 方法

##### on(element, event, handler)

绑定事件监听器。

###### 参数
- `element` (Object) - 事件源对象
- `event` (String) - 事件名称
- `handler` (Function) - 事件处理函数

###### 返回值
- 无

##### off(element, event, handler)

移除事件监听器。

###### 参数
- `element` (Object) - 事件源对象
- `event` (String) - 事件名称
- `handler` (Function) - 事件处理函数

###### 返回值
- 无

##### emit(element, event, data)

触发事件。

###### 参数
- `element` (Object) - 事件源对象
- `event` (String) - 事件名称
- `data` (Any, 可选) - 事件数据

###### 返回值
- 无

#### 示例

```javascript
// 创建事件源对象
var eventEmitter = {};

// 绑定事件监听器
function handleClick(data) {
  console.log('点击事件触发:', data);
}
mapv.utils.Event.on(eventEmitter, 'click', handleClick);

// 触发事件
mapv.utils.Event.emit(eventEmitter, 'click', { x: 100, y: 100 });
// 预期输出: 点击事件触发: { x: 100, y: 100 }

// 移除事件监听器
mapv.utils.Event.off(eventEmitter, 'click', handleClick);

// 再次触发事件，不会执行处理函数
mapv.utils.Event.emit(eventEmitter, 'click', { x: 200, y: 200 });
// 预期输出: 无
```

#### 适用场景
- 组件间通信
- 事件驱动编程
- 自定义事件
- 事件管理

#### 边缘情况
- 当 element 不是对象时，可能无法正常工作
- 当 handler 不是函数时，可能无法正常工作
- 当事件名称不存在时，触发事件不会执行任何处理函数

## 画布工具

### Canvas

画布操作工具类，用于辅助画布绘制。

#### 方法

##### clear(canvas)

清空画布。

###### 参数
- `canvas` (HTMLCanvasElement) - Canvas 元素

###### 返回值
- 无

##### resize(canvas, width, height)

调整画布大小。

###### 参数
- `canvas` (HTMLCanvasElement) - Canvas 元素
- `width` (Number) - 新的宽度
- `height` (Number) - 新的高度

###### 返回值
- 无

#### 示例

```javascript
// 获取 Canvas 元素
var canvas = document.getElementById('canvas');

// 清空画布
mapv.utils.Canvas.clear(canvas);
// 预期结果: 画布被清空

// 调整画布大小
mapv.utils.Canvas.resize(canvas, 800, 600);
// 预期结果: 画布大小调整为 800x600
```

#### 适用场景
- 画布绘制辅助
- 动画绘制
- 数据可视化
- 图形处理

#### 边缘情况
- 当 canvas 不是有效的 Canvas 元素时，可能无法正常工作
- 当 width 或 height 为负数时，可能无法正常工作

## 数据范围处理

### Category

分类数据范围处理类，用于将分类数据映射到颜色或其他值。

#### 构造函数

```javascript
new mapv.utils.Category(options);
```

##### 参数
- `options` (Object) - 配置选项
  - `categories` (Array) - 分类数组
  - `colors` (Array) - 颜色数组，与分类数组对应

#### 方法

##### getColor(value)

根据分类值获取颜色。

###### 参数
- `value` (Any) - 分类值

###### 返回值
- `String` - 对应的颜色值

#### 示例

```javascript
// 创建分类实例
var category = new mapv.utils.Category({
  categories: ['北京', '上海', '广州', '深圳'],
  colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00']
});

// 获取分类颜色
var color1 = category.getColor('北京');
console.log(color1); // 预期输出: #FF0000

var color2 = category.getColor('上海');
console.log(color2); // 预期输出: #00FF00
```

#### 适用场景
- 分类数据可视化
- 地图着色
- 数据分组
- 颜色映射

#### 边缘情况
- 当 categories 和 colors 数组长度不匹配时，可能导致颜色映射错误
- 当 value 不在 categories 数组中时，可能返回默认颜色

## 强度数据范围

### Intensity

强度数据范围处理类，用于将数值数据映射到颜色或其他值。

#### 构造函数

```javascript
new mapv.utils.Intensity(options);
```

##### 参数
- `options` (Object) - 配置选项
  - `min` (Number) - 最小值
  - `max` (Number) - 最大值
  - `colors` (Array) - 颜色数组，用于生成渐变

#### 方法

##### getColor(value)

根据数值获取颜色。

###### 参数
- `value` (Number) - 数值

###### 返回值
- `String` - 对应的颜色值

#### 示例

```javascript
// 创建强度实例
var intensity = new mapv.utils.Intensity({
  min: 0,
  max: 100,
  colors: ['#0000FF', '#00FFFF', '#FFFF00', '#FF0000']
});

// 获取强度颜色
var color1 = intensity.getColor(0);
console.log(color1); // 预期输出: #0000FF

var color2 = intensity.getColor(50);
console.log(color2); // 预期输出: #FFFF00

var color3 = intensity.getColor(100);
console.log(color3); // 预期输出: #FF0000
```

#### 适用场景
- 热力图
- 强度图
- 数值数据可视化
- 颜色渐变

#### 边缘情况
- 当 min 大于 max 时，可能导致颜色映射错误
- 当 value 小于 min 时，返回最小值对应的颜色
- 当 value 大于 max 时，返回最大值对应的颜色

## 分级数据范围

### Choropleth

分级数据范围处理类，用于将数值数据映射到不同的级别。

#### 构造函数

```javascript
new mapv.utils.Choropleth(options);
```

##### 参数
- `options` (Object) - 配置选项
  - `breaks` (Array) - 分级断点数组
  - `colors` (Array) - 颜色数组，与分级断点对应

#### 方法

##### getColor(value)

根据数值获取颜色。

###### 参数
- `value` (Number) - 数值

###### 返回值
- `String` - 对应的颜色值

#### 示例

```javascript
// 创建分级实例
var choropleth = new mapv.utils.Choropleth({
  breaks: [0, 25, 50, 75, 100],
  colors: ['#0000FF', '#00FFFF', '#FFFF00', '#FF0000']
});

// 获取分级颜色
var color1 = choropleth.getColor(10);
console.log(color1); // 预期输出: #0000FF

var color2 = choropleth.getColor(30);
console.log(color2); // 预期输出: #00FFFF

var color3 = choropleth.getColor(80);
console.log(color3); // 预期输出: #FF0000
```

#### 适用场景
- 分级统计图
- 地图着色
- 数值数据分级
- 颜色映射

#### 边缘情况
- 当 breaks 和 colors 数组长度不匹配时，可能导致颜色映射错误
- 当 value 小于最小断点时，返回第一个颜色
- 当 value 大于最大断点时，返回最后一个颜色
