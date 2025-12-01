# 热力图 (Heatmap)

热力图是 MapV 中用于展示数据密度分布的可视化类型，通过颜色渐变来表示数据的密集程度。

## 概述

热力图通过颜色的深浅来表示数据的密度，颜色越深表示数据越密集，颜色越浅表示数据越稀疏。

## 百度地图示例

### 基本用法

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>百度地图热力图示例</title>
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
            draw: 'heatmap',
            size: 10,
            gradient: {
                0.25: 'rgb(0, 0, 255)',
                0.55: 'rgb(0, 255, 0)',
                0.85: 'yellow',
                1.0: 'rgb(255, 0, 0)'
            },
            maxOpacity: 0.8,
            minOpacity: 0
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
| draw | String | 'heatmap' | 绘制类型 |
| size | Number | 10 | 热力点大小 |
| gradient | Object | null | 渐变色配置 |
| maxOpacity | Number | 0.8 | 最大透明度 |
| minOpacity | Number | 0 | 最小透明度 |
| max | Number | null | 最大值 |
| min | Number | null | 最小值 |

### 适用场景

- 展示数据密度分布
- 分析热点区域
- 人口分布可视化
- 交通流量分析
- 犯罪率分布

### 完整示例

您可以查看完整的百度地图可视化示例，包含简单点图、热力图、网格图等多种可视化效果：

[百度地图可视化示例](../../examples/baidu-map/baidu-map-visualization-example.html)