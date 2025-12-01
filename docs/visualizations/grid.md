# 网格图 (Grid)

网格图是 MapV 中用于将数据聚合到网格中展示的可视化类型，通过网格的颜色深浅来表示数据的密集程度。

## 概述

网格图将地图划分为等大小的网格，每个网格的颜色深浅表示该区域内数据的密集程度。

## 百度地图示例

### 基本用法

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>百度地图网格图示例</title>
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
            draw: 'grid',
            size: 50,
            gridSize: 50,
            label: {
                show: true,
                fillStyle: 'white',
                font: '12px Arial'
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
| draw | String | 'grid' | 绘制类型 |
| size | Number | 50 | 点大小 |
| gridSize | Number | 50 | 网格大小 |
| label | Object | null | 标签配置 |
| label.show | Boolean | false | 是否显示标签 |
| label.fillStyle | String | 'white' | 标签颜色 |
| label.font | String | '12px Arial' | 标签字体 |
| max | Number | null | 最大值 |
| min | Number | null | 最小值 |

### 适用场景

- 展示数据空间分布
- 分析区域数据密度
- 城市规划分析
- 人口分布可视化
- 商业数据分析

### 完整示例

您可以查看完整的百度地图可视化示例，包含简单点图、热力图、网格图等多种可视化效果：

[百度地图可视化示例](../../examples/baidu-map/baidu-map-visualization-example.html)