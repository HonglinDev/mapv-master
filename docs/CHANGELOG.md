# 更新日志 (CHANGELOG)

## v2.0.63 (2025-08-18)

### 新增功能

#### 工具函数增强
- **Canvas 清除功能增强**：在 clear.js 中添加了 clearRect 函数，支持清除指定区域，保留原有的清除整个画布功能
- **设备像素比处理增强**：在 resolutionScale.js 中添加了 getDevicePixelRatio 函数用于获取设备像素比，以及 scaleContext 函数支持只进行缩放而不改变画布尺寸
- **图标绘制功能大幅增强**：在 icon.js 中增加了多项功能：
  - 添加了专门的聚类图标绘制功能 drawClusterIcon
  - 添加了默认点绘制功能 drawDefaultPoint
  - 添加了带文字的图片绘制功能 drawImageWithText
  - 添加了默认聚类点绘制功能 drawDefaultClusterPoint
  - 支持根据聚合点数量动态调整图标大小
  - 支持阴影效果
  - 支持图标居中对齐
  - 支持文字精确居中
  - 支持根据聚合点数量设置不同颜色

#### 绘制功能增强
- **聚类绘制功能**(cluster.js)：
  - 增加了专门的聚类点绘制函数 drawClusterPoint
  - 支持根据聚合点数量动态调整图标大小
  - 支持阴影效果
  - 支持图标居中对齐
  - 支持文字精确居中
  - 支持根据聚合点数量设置不同颜色

- **基础绘制功能**(simple.js)：
  - 添加了增强版绘制函数 drawEnhanced
  - 支持阴影效果
  - 支持更灵活的样式设置
  - 支持数据过滤器

- **路径绘制功能**(path/simple.js)：
  - 增加了图片标记支持 drawImageMarker
  - 添加了增强版多边形绘制函数 drawPolygonEnhanced
  - 支持渐变填充效果

#### 数据处理增强
- **统计功能增强**(DataSet.js)：
  - 添加了 getAverage 方法用于计算指定列的平均值

- **数据操作功能**：
  - 添加了 sort 方法用于数据排序
  - 添加了 getPage 和 getTotal 方法用于分页处理
  - 添加了 groupBy 方法用于数据分组

- **数据查询功能**：
  - 添加了 find 方法用于查找单个匹配项
  - 添加了 findAll 方法用于查找所有匹配项

- **数据转换功能**：
  - 添加了 map 方法用于数据映射转换
  - 添加了 filter 方法用于数据过滤

#### 数据范围处理增强
- **Category.js 增强**：
  - 添加了 generateByUniqueValues 方法，可以根据唯一值自动生成分类
  - 添加了 getDefaultColors 方法获取默认颜色列表
  - 添加了 addCategory、removeCategory、updateCategory 方法用于动态管理分类规则
  - 添加了 getCategories 方法获取所有分类规则

- **Choropleth.js 增强**：
  - 添加了 generateByCustomRange 方法，支持自定义区间生成
  - 添加了 getDefaultColors 方法获取默认颜色列表
  - 添加了 addRange、removeRange、updateRange 方法用于动态管理区间规则
  - 添加了 getRanges 方法获取所有区间规则
  - 增强了 getLegend 方法，使其能够正确显示区间标签

- **Intensity.js 增强**：
  - 添加了 setGradient 和 getGradient 方法用于设置和获取渐变色
  - 添加了 setTheme 方法支持预设主题
  - 添加了 getThemes 方法获取预设主题列表
  - 添加了 setMinMax 和 setMinMaxSize 方法用于同时设置最大最小值
  - 增强了 getLegend 方法，添加了数值标签显示功能

#### 图层基础功能增强
- **数据操作增强**(BaseLayer.js)：
  - 添加了 getDataInBounds 方法用于获取指定范围内的数据点
  - 添加了 filterData 方法用于根据条件过滤数据
  - 添加了 updateData 方法用于更新数据集
  - 添加了 addData 方法用于添加数据
  - 添加了 clearData 方法用于清除数据
  - 添加了 getDataStats 方法用于获取数据统计信息

- **事件处理增强**：
  - 添加了 hoverEvent 方法处理悬停事件
  - 添加了 doubleClickEvent 方法处理双击事件

- **选项更新增强**：
  - 添加了 updateOptions 方法用于更灵活地更新图层选项

- **绘制功能增强**：
  - 在 drawContext 方法中添加了对增强版绘制函数的支持

- **数据导出功能**：
  - 添加了 toGeoJSON 方法用于导出为GeoJSON格式
  - 添加了 toCSV 方法用于导出为CSV格式

#### 特定地图适配器增强
- **百度地图适配器增强**(baidu-map/Layer.js)：
  - **事件处理增强**：
    - 添加了悬停事件支持
    - 添加了双击事件支持
  - **数据操作增强**：
    - 添加了 updateData 方法用于更新图层数据
    - 添加了 addData 方法用于添加数据
    - 添加了 getDataInBounds 方法用于获取当前视图范围内的数据
  - **图层控制增强**：
    - 添加了 setOpacity 和 getOpacity 方法用于控制图层透明度
    - 添加了 toggle 方法用于切换图层可见性
  - **图层信息获取**：
    - 添加了 getLayerInfo 方法用于获取图层状态信息

这些增强功能使工具函数更加灵活和强大，支持更丰富的可视化效果。