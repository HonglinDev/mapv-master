## baiduMapLayer

百度地图类，提供通用的图层功能。所有地图平台的图层都继承自此类。

##### 参数

- `map` (Object) - 地图实例，不同地图平台的地图对象
- `dataSet` (DataSet) - 数据集，包含要可视化的数据
- `options` (Object) - 配置选项，用于控制图层的绘制效果

##### 返回值

- `baiduMapLayer` - 图层实例

##### 示例

```javascript
// 创建百度地图实例
var map = new BMap.Map("container");
map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);

// 创建数据集
var data = [
  {
    geometry: {
      type: "Point",
      coordinates: [116.404, 39.915],
    },
    count: 100,
  },
];
var dataSet = new mapv.DataSet(data);

// 创建图层配置
var options = {
  fillStyle: "rgba(50, 50, 255, 0.6)",
  draw: "simple",
  size: 10,
};

// 创建图层实例
var baseLayer = new mapv.baiduMapLayer(map, dataSet, options);
// 预期结果: 创建了一个基于 baiduMapLayer 的图层实例
```

## options

### 使用案例

```js
{
    methods: { // 一些事件回调函数
        click: function (item) { // 点击事件，返回对应点击元素的对象值
            console.log(item);
        },
        mousemove: function(item) { // 鼠标移动事件，对应鼠标经过的元素对象值
            console.log(item);
        },
        tap: function(item) {
            console.log(item) // 只针对移动端,点击事件
        }
    },
    animation: {
        type: 'time', // 按时间展示动画
        stepsRange: { // 动画时间范围,time字段中值
            start: 0,
            end: 100
        },
        trails: 10, // 时间动画的拖尾大小
        duration: 5, // 单个动画的时间，单位秒
    }
}

```

### 参数

| 参数名                   | 类型     | 默认值                                                                                                  | 必填 | 描述                                                                         |
| ------------------------ | -------- | ------------------------------------------------------------------------------------------------------- | ---- | ---------------------------------------------------------------------------- |
| zIndex                   | Number   | 1                                                                                                       | 否   | 层级                                                                         |
| size                     | Number   | 5                                                                                                       | 否   | 大小值                                                                       |
| unit                     | String   | 'px'                                                                                                    | 否   | 'px': 以像素为单位绘制,默认值。'm': 以米制为单位绘制，会跟随地图比例放大缩小 |
| mixBlendMode             | String   | 'normal'                                                                                                | 否   | 不同图层之间的叠加模式                                                       |
| fillStyle                | String   | 'rgba(200, 200, 50, 1)'                                                                                 | 否   | 填充颜色                                                                     |
| strokeStyle              | String   | 'rgba(0, 0, 255, 1)'                                                                                    | 否   | 描边颜色                                                                     |
| lineWidth                | Number   | 4                                                                                                       | 否   | 描边宽度                                                                     |
| globalAlpha              | Number   | 1                                                                                                       | 否   | 透明度                                                                       |
| globalCompositeOperation | String   | 'lighter'                                                                                               | 否   | 颜色叠加方式                                                                 |
| coordType                | String   | 'bd09ll'                                                                                                | 否   | 可选百度墨卡托坐标类型 bd09mc 和百度经纬度坐标类型 bd09ll(默认)              |
| shadowColor              | String   | 'rgba(255, 255, 255, 1)'                                                                                | 否   | 投影颜色                                                                     |
| shadowBlur               | Number   | 35                                                                                                      | 否   | 投影模糊级数                                                                 |
| updateCallback           | Function | undefined                                                                                               | 否   | 重绘回调函数，如果是时间动画、返回当前帧的时间                               |
| shadowOffsetX            | Number   | 0                                                                                                       | 否   | 投影 X 偏移量                                                                |
| shadowOffsetY            | Number   | 0                                                                                                       | 否   | 投影 Y 偏移量                                                                |
| context                  | String   | '2d'                                                                                                    | 否   | 可选 2d 和 webgl，webgl 目前只支持画 simple 模式的点和线                     |
| lineCap                  | String   | 'butt'                                                                                                  | 否   | 线帽样式                                                                     |
| lineJoin                 | String   | 'miter'                                                                                                 | 否   | 线段连接方式                                                                 |
| miterLimit               | Number   | 10                                                                                                      | 否   | 斜接限制                                                                     |
| animation                | Object   | undefined                                                                                               | 否   | 动画配置                                                                     |
| animation.type           | String   | 'time'                                                                                                  | 否   | 按时间展示动画                                                               |
| animation.trails         | Number   | 10                                                                                                      | 否   | 时间动画的拖尾大小                                                           |
| animation.duration       | Number   | 5                                                                                                       | 否   | 单个动画的时间，单位秒                                                       |
| animation.stepsRange     | Object   | "{ start: 0, end: 100 }"                                                                                | 否   | 动画时间范围，对应数据中的 time 字段值                                       |
| draw                     | String   | 'simple','time','heatmap','grid','honeycomb','bubble','intensity','category','choropleth','text','icon' | 是   | 详细看下面的 draw                                                            |

### 事件

| 参数名    | 类型     | 默认值    | 必填 | 描述                                   |
| --------- | -------- | --------- | ---- | -------------------------------------- |
| click     | Function | undefined | 否   | 点击事件，返回对应点击元素的对象值     |
| mousemove | Function | undefined | 否   | 鼠标移动事件，对应鼠标经过的元素对象值 |
| tap       | Function | undefined | 否   | 只针对移动端的点击事件                 |

 

### draw 案例

#### simple

最直接的方式绘制点线面

```js
{
    draw: 'simple',
    geometry: {
        type: 'Point',
        coordinates: [123, 23]
    },
    size: 10, // 点数据时候使用
    fillStyle: 'red', // 点数据时候使用
    strokeStyle: 'red' // 线数据时候使用
}
```

#### heatmap

热力图展示

```js
var options = {
    draw: 'heatmap',
    size: 13, // 每个热力点半径大小
    gradient: { // 热力图渐变色
        0.25: "rgb(0,0,255)",
        0.55: "rgb(0,255,0)",
        0.85: "yellow",
        1.0: "rgb(255,0,0)"
    },
    max: 100, // 最大权重值
}

dataSet中加count字段，代表权重，根据上面配置用以计算它的热度
```

#### grid

网格状展示

```js
{
    draw: 'grid',
    size: 40,
    label: { // 网格中显示累加的值总和
        show: true,
        fillStyle: 'white',
        shadowColor: 'yellow',
        font: '20px Arial',
        shadowBlur: 10,
    },
    gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"},
}
```

#### honeycomb

蜂窝状展示

```js
{
    draw: 'honeycomb',
    size: 40,
    label: { // 网格中显示累加的值总和
        show: true,
        fillStyle: 'white',
        shadowColor: 'yellow',
        font: '20px Arial',
        shadowBlur: 10,
    },
    gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"},
}
```

#### bubble

用不同大小的圆来展示

```js
{
    draw: 'bubble',
    max: 100, // 数值最大值范围
    maxSize: 10, // 显示的圆最大半径大小
}
```

dataSet 中加 count 字段，代表权重，根据上面配置用以计算它实际展示的大小

#### intensity

根据不同的值对应按渐变色中颜色进行展示

```js
{
    draw: 'intensity',
    max: 100, // 最大阈值
    min: 0, // 最小阈值
    gradient: { // 显示的颜色渐变范围$
        '0': 'blue',$
        '0.6': 'cyan',$
        '0.7': 'lime',$
        '0.8': 'yellow',$
        '1.0': 'red'$
    }$
}
```

#### category

按不同的值进行分类，并使用对应的颜色展示

```js
{
    draw: 'category',
    splitList: { // 按对应的值按相应颜色展示
        other: 'rgba(255, 255, 0, 0.8)',
        1: 'rgba(253, 98, 104, 0.8)',
        2: 'rgba(255, 146, 149, 0.8)',
        3: 'rgba(255, 241, 193, 0.8)',
        4: 'rgba(110, 176, 253, 0.8)',
        5: 'rgba(52, 139, 251, 0.8)',
        6: 'rgba(17, 102, 252)'
    }
}
```

#### choropleth

按不同的值区间进行分类，并使用对应的颜色展示

```js
{
    draw: 'choropleth',
    // 按数值区间来展示不同颜色的点
    splitList: [
        {
            start: 0,
            end: 2,
            color: randomColor()
        },{
            start: 2,
            end: 4,
            color: randomColor()
        },{
            start: 4,
            end: 6,
            color: randomColor()
        },{
            start: 6,
            end: 8,
            color: randomColor()
        },{
            start: 8,
            color: randomColor()
        }
    ]
}
```

#### icon

展示 icon

```js
{
    draw: 'icon',
    rotate: '90', // 图片旋转角度
    width: 10, // 规定图像的宽度
    height: 10, // 规定图像的高度
    size: 10, // 添加点击事件时候可以用来设置点击范围
    sx: 10, // 开始剪切的 x 坐标位置
    sy: 10, // 开始剪切的 y 坐标位置
    swidth: 10, // 被剪切图像的宽度
    sheight: 10, // 被剪切图像的高度
}
```

dataSet 中添加字段

```js
{
    icon: Image, // 加载好的Image对象
    rotate: '90', // 图片旋转角度
}
```

#### text

展示文本

```js
{
    draw: 'text',
    fillStyle: 'white',
    textAlign: 'center',
    avoid: true, // 开启文本标注避让
    textBaseline: 'middle',
    offset: { // 文本便宜值
        x: 0,
        y: 0
    }
}
```

dataSet 中添加字段

```js
{
  text: "文本内容";
}
```

## animation:

[点动画 1](http://mapv.baidu.com/examples/#baidu-map-point-time.html)
[点动画 2](http://mapv.baidu.com/examples/#baidu-map-point-time1.html)
[线动画](http://mapv.baidu.com/examples/#baidu-map-polyline-time.html)

```js
{
    draw: 'simple',
    animation: {
        type: 'time', // 按时间展示动画
        stepsRange: { // 动画时间范围,time字段中值
            start: 0,
            end: 100
        },
        trails: 10, // 时间动画的拖尾大小
        duration: 5, // 单个动画的时间，单位秒
    }
}
```

## 常用方法

### update(options, isDraw)

更新图层配置。

##### 参数

- `options` (Object) - 新的配置选项，用于更新图层的绘制效果
- `isDraw` (Boolean, 可选) - 是否重新绘制图层，默认为 true

##### 返回值

- 无

##### 示例

```javascript
// 更新图层颜色和大小
layer.update({
  fillStyle: "rgba(255, 50, 50, 0.6)",
  size: 15,
});
// 预期结果: 图层颜色变为红色，大小变为 15

// 更新图层配置但不立即绘制
layer.update(
  {
    draw: "heatmap",
    maxOpacity: 0.8,
  },
  false
);
// 预期结果: 图层配置已更新，但未立即绘制

// 示例数据
// 假设图层初始配置为:
// {
//   fillStyle: 'rgba(50, 50, 255, 0.6)',
//   draw: 'simple',
//   size: 10
// }
// 执行 layer.update({ fillStyle: 'rgba(255, 50, 50, 0.6)', size: 15 }) 后:
// 图层配置更新为:
// {
//   fillStyle: 'rgba(255, 50, 50, 0.6)',
//   draw: 'simple',
//   size: 15
// }
// 并重新绘制图层
```

##### 适用场景

- 动态更新图层样式
- 切换可视化类型
- 调整图层参数
- 批量更新配置

##### 边缘情况

- 当 options 为 null 或 undefined 时，不更新任何配置
- 当 isDraw 为 false 时，配置更新但不重新绘制
- 当 options 包含无效配置时，可能导致图层绘制异常

### setOptions(options)

设置图层选项，替换现有配置。

##### 参数

- `options` (Object) - 配置选项，用于替换图层的现有配置

##### 返回值

- 无

##### 示例

```javascript
// 设置新的图层配置
layer.setOptions({
  fillStyle: "rgba(50, 255, 50, 0.6)",
  draw: "grid",
  size: 20,
  gridSize: 50,
});
// 预期结果: 图层配置被替换为新的配置

// 示例数据
// 假设图层初始配置为:
// {
//   fillStyle: 'rgba(50, 50, 255, 0.6)',
//   draw: 'simple',
//   size: 10
// }
// 执行 layer.setOptions({ fillStyle: 'rgba(50, 255, 50, 0.6)', draw: 'grid' }) 后:
// 图层配置被替换为:
// {
//   fillStyle: 'rgba(50, 255, 50, 0.6)',
//   draw: 'grid'
// }
// 注意: 未在新配置中指定的选项会被移除
```

##### 适用场景

- 完全替换图层配置
- 切换可视化类型
- 重置图层配置
- 批量设置配置

##### 边缘情况

- 当 options 为 null 或 undefined 时，不更新任何配置
- 当 options 为空对象时，图层配置会被清空
- 当 options 包含无效配置时，可能导致图层绘制异常

### draw()

重新绘制图层。

##### 参数

- 无

##### 返回值

- 无

##### 示例

```javascript
// 重新绘制图层
layer.draw();
// 预期结果: 图层重新绘制

// 结合 update 方法使用，先更新配置再绘制
layer.update(
  {
    fillStyle: "rgba(50, 50, 255, 0.6)",
    size: 10,
  },
  false
); // 不立即绘制
layer.draw(); // 手动绘制
// 预期结果: 图层配置更新后重新绘制
```

##### 适用场景

- 数据更新后重新绘制
- 配置更新后手动绘制
- 图层显示异常时重新绘制
- 地图缩放或平移后重新绘制

##### 边缘情况

- 当图层已被销毁时，调用 draw() 可能不会产生任何效果
- 当图层隐藏时，调用 draw() 不会立即显示图层

### show()

显示图层。

##### 参数

- 无

##### 返回值

- 无

##### 示例

```javascript
// 显示图层
layer.show();
// 预期结果: 图层从隐藏状态变为显示状态

// 结合 hide 方法使用
layer.hide(); // 先隐藏图层
// 执行某些操作
layer.show(); // 再显示图层
// 预期结果: 图层先隐藏后显示
```

##### 适用场景

- 动态显示图层
- 图层切换
- 条件显示图层
- 恢复隐藏的图层

##### 边缘情况

- 当图层已显示时，调用 show() 不会产生任何效果
- 当图层已被销毁时，调用 show() 可能不会产生任何效果

### hide()

隐藏图层。

##### 参数

- 无

##### 返回值

- 无

##### 示例

```javascript
// 隐藏图层
layer.hide();
// 预期结果: 图层从显示状态变为隐藏状态

// 结合 show 方法使用
layer.show(); // 先显示图层
// 执行某些操作
layer.hide(); // 再隐藏图层
// 预期结果: 图层先显示后隐藏
```

##### 适用场景

- 动态隐藏图层
- 图层切换
- 条件隐藏图层
- 临时隐藏图层

##### 边缘情况

- 当图层已隐藏时，调用 hide() 不会产生任何效果
- 当图层已被销毁时，调用 hide() 可能不会产生任何效果

### destroy()

销毁图层，释放资源。

##### 参数

- 无

##### 返回值

- 无

##### 示例

```javascript
// 销毁图层
layer.destroy();
// 预期结果: 图层被销毁，资源被释放

// 示例数据
// 假设图层已创建并显示
// 执行 layer.destroy() 后:
// 图层从地图上移除
// 相关事件监听器被移除
// 资源被释放
// 图层实例不再可用
```

##### 适用场景

- 不再需要使用图层时
- 页面卸载时
- 切换地图实例时
- 释放资源，优化性能

##### 边缘情况

- 当图层已被销毁时，调用 destroy() 不会产生任何效果
- 销毁后的图层实例不应再被使用
- 销毁图层后，相关的地图事件监听器会被移除
  各平台图层
  百度地图图层 (baiduMapLayer)
  百度地图的 MapV 图层实现。

示例

```javascript
var map = new BMap.Map("container");
var dataSet = new mapv.DataSet(data);

var options = {
  fillStyle: "rgba(50, 50, 255, 0.6)",
  draw: "simple",
};

var mapvLayer = new mapv.baiduMapLayer(map, dataSet, options);
```

高德地图图层 (AMapLayer)
高德地图的 MapV 图层实现。

示例

```javascript
var map = new AMap.Map("container");
var dataSet = new mapv.DataSet(data);

var options = {#
  fillStyle: "rgba(50, 50, 255, 0.6)",
  draw: "simple",
};

var mapvLayer = new mapv.AMapLayer(map, dataSet, options);
```

谷歌地图图层 (googleMapLayer)
谷歌地图的 MapV 图层实现。

Leaflet 图层 (leafletMapLayer)
Leaflet 的 MapV 图层实现。

OpenLayers 图层 (OpenlayersLayer)
OpenLayers 的 MapV 图层实现。

MapTalks 图层 (MaptalksLayer)
MapTalks 的 MapV 图层实现。

Cesium 图层 (cesiumMapLayer)#Cesium 的 MapV 图层实现。

图层配置选项
通用选项
选项 类型 默认值 描述
draw String 'simple' 绘制类型
fillStyle String '#000000' 填充颜色
strokeStyle String '#000000' 描边颜色
lineWidth Number 1 线条宽度
size Number 5 点大小
max Number null 最大值
min Number null 最小值
zIndex Number null 层级
特定可视化类型选项
热力图 (heatmap)
选项 类型 默认值 描述
gradient Object null 渐变色配置
maxOpacity Number 0.8 最大透明度
minOpacity Number 0.0 最小透明度
聚合图 (cluster)
选项 类型 默认值 描述
clusterRadius Number 100 聚合半径
maxZoom Number 19 最大聚合缩放级别
动画选项
选项 类型 默认值 描述
animation Object null 动画配置
animation.enabled Boolean false 是否启用动画
animation.duration Number 5000 动画持续时间(毫秒)
事件处理
图层支持多种交互事件：

点击事件

```javascript
var options = {
  methods: {
    click: function (item, event) {
      console.log("点击:", item);
    },
  },
};
```

鼠标移动事件

```javascript
var options = {
  methods: {
    mousemove: function (item, event) {
      console.log("鼠标移动:", item);
    },
  },
};
```

鼠标悬停事件

```javascript
var options = {
  methods: {
    hover: function (item, event) {
      console.log("悬停:", item);
    },
  },
};
```

鼠标双击事件

```javascript
var options = {
  methods: {
    doubleClick: function (item, event) {
      console.log("双击:", item);
    },
  },
};
```
