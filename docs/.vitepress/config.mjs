/*
 * @Author: 李红林 1770679549@qq.com
 * @Date: 2025-12-01 16:03:26
 * @LastEditors: 李红林 1770679549@qq.com
 * @LastEditTime: 2025-12-04 14:28:26
 * @FilePath: \mapv-master\docs\.vitepress\config.mjs
 * @Description: 
 * 
 */
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'MapV',
  description: '地理信息可视化开源库',
  base: '/',
  ignoreDeadLinks: true,
  themeConfig: {
    logo: '/logo.png',
    lastUpdatedText: "最近更新时间",
    docFooter: { prev: '上一篇', next: '下一篇' },
    outline: {
      label: '页面导航',  // 改为中文
      level: [2, 3]  // 显示h2和h3标题
    },
    darkModeSwitchLabel: '切换主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    nav: [
      { text: '首页', link: '/' },
      { text: '快速开始', link: '/getting-started' },
      { text: 'API参考', link: '/api/dataset', activeMatch: '/api/' },
      { text: '常见问题', link: '/problem/faq', activeMatch: '/problem/' },
      { text: '平台适配器', link: '/platforms/baidu', activeMatch: '/platforms/' },
      { text: '可视化类型', link: '/visualizations/simple', activeMatch: '/visualizations/' },
      { text: '示例', link: '/examples/basic', activeMatch: '/examples/' },
      { text: '更新日志', link: '/CHANGELOG' },
    ],
    sidebar: {
      '/api/': [
        {
          text: 'API参考',
          items: [
            { text: '数据集 (DataSet)', link: '/api/dataset' },
            { text: '图层 (Layers)', link: '/api/layers' },
            { text: '工具类 (Utils)', link: '/api/utils' }
          ]
        }
      ],
      '/platforms/': [
        {
          text: '平台适配器', items: [
            { text: '百度地图', link: '/platforms/baidu' },
            { text: '高德地图', link: '/platforms/amap' },
            { text: '谷歌地图', link: '/platforms/google' },
            { text: 'Leaflet', link: '/platforms/leaflet' },
            { text: 'OpenLayers', link: '/platforms/openlayers' },
            { text: 'MapTalks', link: '/platforms/maptalks' },
            { text: 'Cesium', link: '/platforms/cesium' }
          ]
        }
      ],
      '/problem/': [
        {
          text: '常见问题', items: [
            { text: '常见问题解答', link: '/problem/faq' },
            { text: '地图使用限制说明', link: '/problem/limitations' }
          ]
        }
      ],
      '/visualizations/': [
        {
          text: '可视化类型', items: [
            { text: '简单点图 (Simple)', link: '/visualizations/simple' },
            { text: '气泡图 (Bubble)', link: '/visualizations/bubble' },
            { text: '热力图 (Heatmap)', link: '/visualizations/heatmap' },
            { text: '网格图 (Grid)', link: '/visualizations/grid' },
            { text: '蜂窝图 (Honeycomb)', link: '/visualizations/honeycomb' },
            { text: '强度图 (Intensity)', link: '/visualizations/intensity' },
            { text: '分类图 (Category)', link: '/visualizations/category' },
            { text: 'Choropleth 图', link: '/visualizations/choropleth' }
          ]
        }
      ],
      '/examples/': [
        {
          text: '示例', items: [
            {
              text: '百度地图', items: [
                { text: '可视化示例', link: '/examples/baidu-map-visualization-example' },
                {
                  text: '点图', items: [
                    { text: '气泡图', link: '/examples/baidu-map-point-bubble' },
                    { text: '分类图', link: '/examples/baidu-map-point-category' },
                    { text: '聚类图', link: '/examples/baidu-map-point-cluster' },
                    { text: '热力图', link: '/examples/baidu-map-point-heatmap' },
                    { text: '网格图', link: '/examples/baidu-map-point-grid' },
                    { text: '蜂窝图', link: '/examples/baidu-map-point-honeycomb' },
                    { text: '强度图', link: '/examples/baidu-map-point-intensity' },
                    { text: '简单点图', link: '/examples/baidu-map-point-simple' }
                  ]
                },
                {
                  text: '线图', items: [
                    { text: '动画线图', link: '/examples/baidu-map-polyline-animate' },
                    { text: '热力线图', link: '/examples/baidu-map-polyline-heatmap' },
                    { text: '简单线图', link: '/examples/baidu-map-polyline-simple' }
                  ]
                },
                {
                  text: '面图', items: [
                    { text: '强度面图', link: '/examples/baidu-map-polygon-intensity' },
                    { text: '简单面图', link: '/examples/baidu-map-polygon-simple' }
                  ]
                }
              ]
            },
            {
              text: '高德地图', items: [
                {
                  text: '点图', items: [
                    { text: '气泡图', link: '/examples/amap-point-bubble' },
                    { text: '分类图', link: '/examples/amap-point-category' },
                    { text: '聚类图', link: '/examples/amap-point-cluster' },
                    { text: '热力图', link: '/examples/amap-point-heatmap' },
                    { text: '蜂窝图', link: '/examples/amap-point-honeycomb' },
                    { text: '强度图', link: '/examples/amap-point-intensity' }
                  ]
                },
                {
                  text: '线图', items: [
                    { text: '动画线图', link: '/examples/amap-polyline-animation' },
                    { text: '简单线图', link: '/examples/amap-polyline-simple' }
                  ]
                },
                {
                  text: '面图', items: [
                    { text: '强度面图', link: '/examples/amap-polygon-intensity' }
                  ]
                }
              ]
            },
            {
              text: 'Leaflet', items: [
                {
                  text: '点图', items: [
                    { text: '气泡图', link: '/examples/leaflet-point-bubble' },
                    { text: '分类图', link: '/examples/leaflet-point-category' },
                    { text: '聚类图', link: '/examples/leaflet-point-cluster' },
                    { text: '热力图', link: '/examples/leaflet-map-point-heatmap' },
                    { text: '蜂窝图', link: '/examples/leaflet-point-honeycomb' },
                    { text: '强度图', link: '/examples/leaflet-point-intensity' }
                  ]
                },
                {
                  text: '线图', items: [
                    { text: '动画线图', link: '/examples/leaflet-polyline-animation' },
                    { text: '简单线图', link: '/examples/leaflet-polyline-simple' }
                  ]
                }
              ]
            },
            {
              text: 'OpenLayers', items: [
                {
                  text: '点图', items: [
                    { text: '气泡图', link: '/examples/ol-point-bubble' },
                    { text: '分类图', link: '/examples/ol-point-category' },
                    { text: '聚类图', link: '/examples/ol-point-cluster' },
                    { text: '热力图', link: '/examples/ol-map-point-heatmap' },
                    { text: '蜂窝图', link: '/examples/ol-point-honeycomb' },
                    { text: '强度图', link: '/examples/ol-point-intensity' }
                  ]
                },
                {
                  text: '线图', items: [
                    { text: '动画线图', link: '/examples/ol-polyline-animation' },
                    { text: '简单线图', link: '/examples/ol-polyline-simple' }
                  ]
                }
              ]
            },
            {
              text: 'MapTalks', items: [
                {
                  text: '点图', items: [
                    { text: '气泡图', link: '/examples/maptalks-point-bubble' },
                    { text: '分类图', link: '/examples/maptalks-point-category' },
                    { text: '聚类图', link: '/examples/maptalks-point-cluster' },
                    { text: '热力图', link: '/examples/maptalks-map-point-heatmap' },
                    { text: '蜂窝图', link: '/examples/maptalks-point-honeycomb' },
                    { text: '强度图', link: '/examples/maptalks-point-intensity' }
                  ]
                },
                {
                  text: '线图', items: [
                    { text: '动画线图', link: '/examples/maptalks-polyline-animation' },
                    { text: '简单线图', link: '/examples/maptalks-polyline-simple' }
                  ]
                }
              ]
            },
            {
              text: 'Cesium', items: [
                {
                  text: '点图', items: [
                    { text: '气泡图', link: '/examples/cesium-point-bubble' },
                    { text: '分类图', link: '/examples/cesium-point-category' },
                    { text: '聚类图', link: '/examples/cesium-point-cluster' },
                    { text: '热力图', link: '/examples/cesium-map-point-heatmap' },
                    { text: '蜂窝图', link: '/examples/cesium-point-honeycomb' },
                    { text: '强度图', link: '/examples/cesium-point-intensity' }
                  ]
                },
                {
                  text: '线图', items: [
                    { text: '动画线图', link: '/examples/cesium-polyline-animation' },
                    { text: '简单线图', link: '/examples/cesium-polyline-simple' }
                  ]
                }
              ]
            },
            {
              text: 'Google地图', items: [
                {
                  text: '点图', items: [
                    { text: '气泡图', link: '/examples/google-maps-point-bubble' },
                    { text: '网格图', link: '/examples/google-maps-point-grid' },
                    { text: '蜂窝图', link: '/examples/google-maps-point-honeycomb' },
                    { text: '简单点图', link: '/examples/google-maps-point-simple' }
                  ]
                },
                {
                  text: '线图', items: [
                    { text: '简单线图', link: '/examples/google-maps-polyline-simple' }
                  ]
                }
              ]
            },
            {
              text: 'Canvas', items: [
                { text: '力导向图', link: '/examples/canvas-forceEdgeBundling' },
                { text: '网格图', link: '/examples/canvas-grid' },
                { text: '热力图', link: '/examples/canvas-heatmap' },
                { text: '蜂窝图', link: '/examples/canvas-honeycomb' },
                { text: '简单点图', link: '/examples/canvas-point-simple' },
                { text: '简单面图', link: '/examples/canvas-polygon' },
                { text: '简单线图', link: '/examples/canvas-polyline' }
              ]
            },
            {
              text: '3D地图', items: [
                { text: '地球3D地图', link: '/examples/3d-map-earth' },
                { text: '平面3D地图', link: '/examples/3d-map-flate' },
                { text: '简单3D示例', link: '/examples/3d-simple' }
              ]
            }
          ]
        }
      ]
    },
    search: {
      provider: 'local'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/huiyan-fe/mapv' }
    ]
  },
  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' },
    lineNumbers: true
  },
  build: {
    outDir: '../dist'
  }
})
