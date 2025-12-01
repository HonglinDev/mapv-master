# 简单点图 (Simple)

简单点图是 MapV 中最基本的可视化类型，用于在地图上绘制简单的点标记。

## 概述

简单点图用于在地图上绘制离散的点，每个点可以设置颜色、大小、边框等样式。

## 百度地图示例

### 基本用法

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>百度地图简单点图示例</title>
    <!-- 加载百度地图API -->
    <script type="text/javascript" src="https://api.map.baidu.com/api?v=3.0&ak=v87ZLCsZWK6Lh9GNS3WQiGOuCMldqiCT"></script>
    <!-- 加载MapV库 -->
    <script type="text/javascript" src="../../build/mapv.js"></script>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }
        #map-container {
            width: 100%;
            height: 600px;
        }
    </style>
</head>
<body>
    <div id="map-container"></div>

    <script>
        // 初始化地图
        var map = new BMap.Map("map-container");
        var point = new BMap.Point(116.404, 39.915);
        map.centerAndZoom(point, 11);
        map.enableScrollWheelZoom(true);

        // 创建示例数据
        var data = [];
        var randomCount = 1000;
        for (var i = 0; i < randomCount; i++) {
            var cityCenter = map.getCenter();
            var randomX = Math.random() * 50 - 25;
            var randomY = Math.random() * 50 - 25;
            data.push({
                geometry: {
                    type: "Point",
                    coordinates: [cityCenter.lng + randomX / 100, cityCenter.lat + randomY / 100]
                },
                count: Math.random() * 100
            });
        }

        // 创建数据集
        var dataSet = new mapv.DataSet(data);

        // 创建图层配置
        var options = {
            fillStyle: 'rgba(50, 50, 255, 0.6)',
            strokeStyle: 'rgba(0, 0, 255, 0.8)',
            lineWidth: 1,
            draw: 'simple',
            size: 5,
            label: {
                show: true,
                fillStyle: 'white',
                font: '12px Arial',
                offsetX: 0,
                offsetY: -10
            }
        };

        // 创建图层
        var mapvLayer = new mapv.baiduMapLayer(map, dataSet, options);
    </script>
</body>
</html>
```

### 配置选项

| 选项 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| fillStyle | String | 'rgba(255, 0, 0, 0.6)' | 填充颜色 |
| strokeStyle | String | 'rgba(0, 0, 0, 0.8)' | 边框颜色 |
| lineWidth | Number | 1 | 边框宽度 |
| draw | String | 'simple' | 绘制类型 |
| size | Number | 5 | 点大小 |
| label | Object | null | 标签配置 |
| label.show | Boolean | false | 是否显示标签 |
| label.fillStyle | String | 'white' | 标签颜色 |
| label.font | String | '12px Arial' | 标签字体 |
| label.offsetX | Number | 0 | 标签X轴偏移 |
| label.offsetY | Number | 0 | 标签Y轴偏移 |

### 适用场景

- 显示离散点数据
- 标记地理位置
- 展示分布情况
- 基础数据可视化

### 完整示例

您可以查看完整的百度地图可视化示例，包含简单点图、热力图、网格图等多种可视化效果：

[百度地图可视化示例](../../examples/baidu-map/baidu-map-visualization-example.html)