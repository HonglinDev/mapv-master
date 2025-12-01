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