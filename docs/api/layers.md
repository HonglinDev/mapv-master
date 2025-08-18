# 图层 (Layers)

图层是 MapV 在各种地图平台上的可视化载体，负责将数据渲染到地图上。

## 基础图层类

所有地图平台的图层都继承自基础图层类，提供统一的接口和功能。

### BaseLayer

基础图层类，提供通用的图层功能。

#### 构造函数

```javascript
new BaseLayer(map, dataSet, options);
```

参数

map (Object) - 地图实例
dataSet (DataSet) - 数据集
options (Object) - 配置选项
常用方法
update(options, isDraw)
更新图层配置。

参数

options (Object) - 新的配置选项
isDraw (Boolean) - 是否重新绘制
setOptions(options)
设置图层选项。

参数

options (Object) - 配置选项
draw()
重新绘制图层。

show()
显示图层。

hide()
隐藏图层。

destroy()
销毁图层。
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
