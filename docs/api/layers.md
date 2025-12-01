# 图层 (Layers)

图层是 MapV 在各种地图平台上的可视化载体，负责将数据渲染到地图上。

## 基础图层类

所有地图平台的图层都继承自基础图层类，提供统一的接口和功能。

### BaseLayer

基础图层类，提供通用的图层功能。所有地图平台的图层都继承自此类。

#### 构造函数

```javascript
new BaseLayer(map, dataSet, options);
```

##### 参数
- `map` (Object) - 地图实例，不同地图平台的地图对象
- `dataSet` (DataSet) - 数据集，包含要可视化的数据
- `options` (Object) - 配置选项，用于控制图层的绘制效果

##### 返回值
- `BaseLayer` - 图层实例

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
      coordinates: [116.404, 39.915]
    },
    count: 100
  }
];
var dataSet = new mapv.DataSet(data);

// 创建图层配置
var options = {
  fillStyle: 'rgba(50, 50, 255, 0.6)',
  draw: 'simple',
  size: 10
};

// 创建图层实例
var baseLayer = new mapv.BaseLayer(map, dataSet, options);
// 预期结果: 创建了一个基于 BaseLayer 的图层实例
```

##### 适用场景
- 创建自定义图层
- 扩展地图平台支持
- 实现通用图层功能

##### 边缘情况
- 当 map 不是有效的地图实例时，图层可能无法正常工作
- 当 dataSet 不是有效的 DataSet 实例时，图层可能无法显示数据
- 当 options 配置不正确时，图层可能无法按预期绘制
### 常用方法

#### update(options, isDraw)

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
  fillStyle: 'rgba(255, 50, 50, 0.6)',
  size: 15
});
// 预期结果: 图层颜色变为红色，大小变为 15

// 更新图层配置但不立即绘制
layer.update({
  draw: 'heatmap',
  maxOpacity: 0.8
}, false);
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
#### setOptions(options)

设置图层选项，替换现有配置。

##### 参数
- `options` (Object) - 配置选项，用于替换图层的现有配置

##### 返回值
- 无

##### 示例

```javascript
// 设置新的图层配置
layer.setOptions({
  fillStyle: 'rgba(50, 255, 50, 0.6)',
  draw: 'grid',
  size: 20,
  gridSize: 50
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
#### draw()

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
layer.update({
  fillStyle: 'rgba(50, 50, 255, 0.6)',
  size: 10
}, false); // 不立即绘制
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

#### show()

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

#### hide()

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

#### destroy()

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
    fillStyle: 'rgba(50, 50, 255, 0.6)',
    draw: 'simple'
};

var mapvLayer = new mapv.baiduMapLayer(map, dataSet, options);
```
高德地图图层 (AMapLayer)
高德地图的 MapV 图层实现。

示例
```javascript
var map = new AMap.Map('container');
var dataSet = new mapv.DataSet(data);

var options = {
    fillStyle: 'rgba(50, 50, 255, 0.6)',
    draw: 'simple'
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

Cesium 图层 (cesiumMapLayer)
Cesium 的 MapV 图层实现。

图层配置选项
通用选项
选项	类型	默认值	描述
draw	String	'simple'	绘制类型
fillStyle	String	'#000000'	填充颜色
strokeStyle	String	'#000000'	描边颜色
lineWidth	Number	1	线条宽度
size	Number	5	点大小
max	Number	null	最大值
min	Number	null	最小值
zIndex	Number	null	层级
特定可视化类型选项
热力图 (heatmap)
选项	类型	默认值	描述
gradient	Object	null	渐变色配置
maxOpacity	Number	0.8	最大透明度
minOpacity	Number	0.0	最小透明度
聚合图 (cluster)
选项	类型	默认值	描述
clusterRadius	Number	100	聚合半径
maxZoom	Number	19	最大聚合缩放级别
动画选项
选项	类型	默认值	描述
animation	Object	null	动画配置
animation.enabled	Boolean	false	是否启用动画
animation.duration	Number	5000	动画持续时间(毫秒)
事件处理
图层支持多种交互事件：

点击事件
```javascript
var options = {
    methods: {
        click: function(item, event) {
            console.log('点击:', item);
        }
    }
};
```
鼠标移动事件
```javascript
var options = {
    methods: {
        mousemove: function(item, event) {
            console.log('鼠标移动:', item);
        }
    }
};
```
鼠标悬停事件
```javascript
var options = {
    methods: {
        hover: function(item, event) {
            console.log('悬停:', item);
        }
    }
};
```

鼠标双击事件
```javascript
var options = {
    methods: {
        doubleClick: function(item, event) {
            console.log('双击:', item);
        }
    }
};
```
