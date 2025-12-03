# 地图使用限制说明

本文档详细说明在特定页面或场景中无法使用地图案例的具体原因及解决方案。

## 1. 技术限制说明

### 系统/框架不支持的具体技术限制

MapV 基于 Canvas 和 WebGL 技术进行大数据量的地理信息可视化，存在以下技术限制：

1.  **Canvas 上下文限制**：
    -   部分老旧浏览器或特定嵌入式 WebView 环境不支持 HTML5 Canvas API。
    -   单个 Canvas 元素的尺寸受浏览器限制（通常为 4096px 或 8192px），超大分辨率屏幕或长图可能无法完整渲染。
    -   **跨域限制 (CORS)**：加载外部图片或瓦片资源时，如果服务器未设置正确的 CORS 头，会导致 Canvas 变为"被污染"状态，无法导出图片 (`toDataURL`) 或进行像素级操作。

2.  **WebGL 环境依赖**：
    -   部分 3D 可视化效果（如 `3d-map-earth`, `3d-simple`）依赖 WebGL。
    -   如果用户设备的显卡驱动未更新、硬件加速被禁用，或处于远程桌面/虚拟机环境中，WebGL 上下文可能创建失败。

3.  **DOM 容器可见性**：
    -   **初始化时容器不可见**：如果在 DOM 元素 `display: none` 或宽高为 0 时初始化地图（如 BMap, MapV），可能导致地图中心点偏移、瓦片加载失败或 Canvas 尺寸计算错误（通常为 0x0）。

### 缺少的必要 API 或 SDK 支持

1.  **地图底图 SDK 缺失**：
    -   MapV 依赖第三方地图 SDK（百度地图 JS API、高德地图 JS API、Google Maps API 等）作为底图容器。
    -   如果页面未正确引入对应的地图 SDK 脚本（如 `<script src="//api.map.baidu.com/api?v=2.0&ak=..."></script>`），MapV 将无法工作。
    -   **API Key (AK) 无效**：未配置有效的 API Key，或 Key 受到域名/IP 限制，会导致底图无法加载或报错。

2.  **HTTPS 协议兼容性**：
    -   如果宿主页面运行在 HTTPS 环境下，引用的地图 API 资源必须也支持 HTTPS。引用 HTTP 资源会被浏览器安全策略拦截（Mixed Content 错误）。

## 2. 使用场景分析

### 不允许使用地图的页面类型/业务场景

1.  **纯文本/低性能终端展示页**：
    -   在需要极致首屏加载速度或运行在低性能 IoT 设备上的页面，不建议使用重型地图组件。
    -   **替代方案**：使用静态地图图片截图，或简化的 SVG 矢量地图（如 ECharts Geo SVG）。

2.  **打印/导出 PDF 场景**：
    -   浏览器原生的打印功能往往无法正确截取 WebGL 内容或动态加载的 Canvas。
    -   **替代方案**：提供专门的“导出图片”按钮，使用 `canvas.toDataURL()` 生成静态图片后再进行打印。

3.  **无外网环境（内网部署）**：
    -   依赖在线 API（如百度地图在线版）在内网无法加载。
    -   **替代方案**：需部署离线地图瓦片服务，并配置 MapV 使用自定义瓦片源。

### 替代方案建议

| 场景 | 限制原因 | 推荐替代方案 |
| :--- | :--- | :--- |
| **报表概览页** | 空间有限，无需交互 | 使用 ECharts 渲染简化的 GeoJSON 矢量地图 |
| **低端设备/大屏** | WebGL 性能不足 | 降级为 Canvas 2D 渲染，或减少数据点数量 |
| **内网环境** | 无法连接公网 API | 部署离线瓦片服务器 (如 GeoServer) + Leaflet/OpenLayers |
| **静态导出** | Canvas 跨域/打印失效 | 后端生成静态地图图片返回前端展示 |

## 3. 错误处理指南

### 常见错误信息与解决方案

| 错误代码/信息 | 可能原因 | 解决方案 |
| :--- | :--- | :--- |
| `BMap is not defined` | 百度地图 SDK 未加载或加载失败 | 检查网络；确认 `<script>` 标签在 MapV 之前引入；检查 AK 是否有效。 |
| `MapV: options.context is not valid` | 传入的 Canvas 上下文无效 | 检查 Canvas 元素是否正确获取；检查浏览器是否支持 Canvas。 |
| `SecurityError: The operation is insecure.` | Canvas 跨域污染 | 确保加载的图片资源开启了 CORS；检查图片服务器响应头 `Access-Control-Allow-Origin`。 |
| `WebGL not supported` | 设备不支持 WebGL | 提示用户开启硬件加速；或降级使用 Canvas 2D 渲染模式。 |
| 地图显示一片空白 | 容器高度为 0 或未初始化 | 确保地图容器 `div` 设置了具体高度（如 `height: 100%`）；确保在 DOM 挂载后（`mounted`）再初始化地图。 |

### 错误处理示例代码

```javascript
try {
    if (typeof BMap === 'undefined') {
        throw new Error('BMap SDK not loaded. Please check your network or API Key.');
    }

    var map = new BMap.Map("map");
    // ... 初始化代码
} catch (error) {
    console.error('Map Initialization Failed:', error.message);
    // 显示降级方案，例如静态图片
    document.getElementById('map').innerHTML = '<img src="static-map-placeholder.png" alt="Map Loading Failed" />';
}
```

## 4. 最佳实践建议

### 推荐的可替代可视化方案

当无法使用完整地图功能时，推荐以下分级替代策略：

1.  **ECharts / Highcharts Maps**：
    -   **优点**：基于 SVG/Canvas，轻量，不依赖外部瓦片服务，适合展示行政区划统计数据。
    -   **适用**：仪表盘、统计报表。

2.  **静态切片/图片**：
    -   **优点**：无兼容性问题，加载快。
    -   **适用**：缩略图、打印页、邮件内容。

3.  **纯 CSS/SVG 示意图**：
    -   **优点**：极致轻量，矢量缩放。
    -   **适用**：简单的位置示意（如“门店分布”仅显示几个点）。

### 未来支持计划

-   **离线支持**：MapV 核心库已支持与 Leaflet/OpenLayers 结合使用离线瓦片，建议优先评估这两种方案以解决内网限制。
-   **WebGL 兼容性**：持续优化 WebGL 渲染管线，增加对低端显卡的自动降级策略（预计未来版本加入自动检测切换 Context 功能）。
