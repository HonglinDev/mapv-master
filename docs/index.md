# MapV 使用文档

MapV 是一款地理信息可视化开源库，可以用来展示大量地理信息数据，点、线、面的数据，每种数据也有不同的展示类型，如直接打点、热力图、网格、聚合等方式展示数据。

## 目录

- [快速开始](./getting-started.md)
- [更新日志](./CHANGELOG.md)
- [API 参考](./api/)
  - [数据集 (DataSet)](./api/dataset.md)
  - [图层 (Layers)](./api/layers.md)
  - [工具类 (Utils)](./api/utils.md)
- [平台适配器](./platforms/)
  - [百度地图](./platforms/baidu.md)
  - [高德地图](./platforms/amap.md)
  - [谷歌地图](./platforms/google.md)
  - [Leaflet](./platforms/leaflet.md)
  - [OpenLayers](./platforms/openlayers.md)
  - [MapTalks](./platforms/maptalks.md)
  - [Cesium](./platforms/cesium.md)
- [可视化类型](./visualizations/)
  - [简单点图 (Simple)](./visualizations/simple.md)
  - [气泡图 (Bubble)](./visualizations/bubble.md)
  - [热力图 (Heatmap)](./visualizations/heatmap.md)
  - [网格图 (Grid)](./visualizations/grid.md)
  - [蜂窝图 (Honeycomb)](./visualizations/honeycomb.md)
  - [强度图 (Intensity)](./visualizations/intensity.md)
  - [分类图 (Category)](./visualizations/category.md)
  - [ choropleth 图 (Choropleth)](./visualizations/choropleth.md)
- [示例](./examples/)

## 简介

MapV 支持多种地理信息数据的可视化展示，包括点数据、线数据和面数据。每种数据类型都有多种可视化方式，可以根据业务需求选择合适的展示方式。

### 支持的数据类型

1. **点数据 (Point)** - 用于展示地理位置标记
2. **线数据 (LineString)** - 用于展示路径、轨迹等线性数据
3. **面数据 (Polygon)** - 用于展示区域范围数据

### 支持的可视化类型

1. **简单点图** - 直接在地图上绘制点标记
2. **气泡图** - 根据数据值大小绘制不同大小的点
3. **热力图** - 以热力形式展示数据密度分布
4. **网格图** - 将数据聚合到网格中展示
5. **蜂窝图** - 使用六边形网格聚合数据
6. **强度图** - 根据数据值使用颜色渐变展示
7. **分类图** - 根据数据分类使用不同颜色展示
8. ** choropleth 图** - 根据数值范围使用不同颜色填充区域

## 安装

### NPM 安装

```bash
npm install mapv
```
### CDN 引入
```bash
<script src="https://cdn.jsdelivr.net/npm/mapv/dist/mapv.min.js"></script>
```
### 基本用法
```bash
// 创建数据集
var data = [
  {
    geometry: {
      type: 'Point',
      coordinates: [116.405285, 39.904989]
    },
    count: 100
  }
];

var dataSet = new mapv.DataSet(data);

// 创建图层
var options = {
  fillStyle: 'rgba(50, 50, 255, 0.6)',
  draw: 'simple'
};

var mapvLayer = new mapv.baiduMapLayer(map, dataSet, options);
```
### 支持环境

MapV 使用 Canvas 开发，支持现代浏览器（IE8以上版本）。