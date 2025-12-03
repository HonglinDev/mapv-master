### 任务概述
将用户提供的JavaScript options对象转换为Markdown表格格式，并替换`/d:/前端项目/mapv地图修改/mapv-master/docs/api/layers.md`文件中第98-107行的现有内容。

### 转换内容
将以下options对象：
```javascript
{
     zIndex: 1, // 层级
     size: 5, // 大小值
     unit: 'px', // 'px': 以像素为单位绘制,默认值。'm': 以米制为单位绘制，会跟随地图比例放大缩小
     mixBlendMode: 'normal', // 不同图层之间的叠加模式，参考 `https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode` 
     fillStyle: 'rgba(200, 200, 50, 1)', // 填充颜色
     strokeStyle: 'rgba(0, 0, 255, 1)', // 描边颜色
     lineWidth: 4, // 描边宽度
     globalAlpha: 1, // 透明度
     globalCompositeOperation: 'lighter', // 颜色叠加方式
     coordType: 'bd09ll', // 可选百度墨卡托坐标类型bd09mc和百度经纬度坐标类型bd09ll(默认)
     shadowColor: 'rgba(255, 255, 255, 1)', // 投影颜色
     shadowBlur: 35,  // 投影模糊级数
     updateCallback: function (time) { // 重绘回调函数，如果是时间动画、返回当前帧的时间
     },
     shadowOffsetX: 0,
     shadowOffsetY: 0,
     context: '2d', // 可选2d和webgl，webgl目前只支持画simple模式的点和线
     lineCap: 'butt',
     lineJoin: 'miter',
     miterLimit: 10,
     methods: { // 一些事件回调函数
         click: function (item) { // 点击事件，返回对应点击元素的对象值
             console.log(item);
         },
         mousemove: function(item) { // 鼠标移动事件，对应鼠标经过的元素对象值
             console.log(item);
         },
         tap: function(item) {
             console.log(item) // 只针对移动端,点击事件
         }
     },
     animation: {
         type: 'time', // 按时间展示动画
         stepsRange: { // 动画时间范围,time字段中值
             start: 0,
             end: 100
         },
         trails: 10, // 时间动画的拖尾大小
         duration: 5, // 单个动画的时间，单位秒
     }
}
```

转换为Markdown表格：
```markdown
#### 参数

| 参数名 | 类型 | 默认值 | 必填 | 描述 |
|--------|------|--------|------|------|
| zIndex | Number | 1 | 否 | 层级 |
| size | Number | 5 | 否 | 大小值 |
| unit | String | 'px' | 否 | 'px': 以像素为单位绘制,默认值。'm': 以米制为单位绘制，会跟随地图比例放大缩小 |
| mixBlendMode | String | 'normal' | 否 | 不同图层之间的叠加模式，参考 [CSS mix-blend-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode) |
| fillStyle | String | 'rgba(200, 200, 50, 1)' | 否 | 填充颜色 |
| strokeStyle | String | 'rgba(0, 0, 255, 1)' | 否 | 描边颜色 |
| lineWidth | Number | 4 | 否 | 描边宽度 |
| globalAlpha | Number | 1 | 否 | 透明度 |
| globalCompositeOperation | String | 'lighter' | 否 | 颜色叠加方式 |
| coordType | String | 'bd09ll' | 否 | 可选百度墨卡托坐标类型bd09mc和百度经纬度坐标类型bd09ll(默认) |
| shadowColor | String | 'rgba(255, 255, 255, 1)' | 否 | 投影颜色 |
| shadowBlur | Number | 35 | 否 | 投影模糊级数 |
| updateCallback | Function | undefined | 否 | 重绘回调函数，如果是时间动画、返回当前帧的时间 |
| shadowOffsetX | Number | 0 | 否 | 投影X偏移量 |
| shadowOffsetY | Number | 0 | 否 | 投影Y偏移量 |
| context | String | '2d' | 否 | 可选2d和webgl，webgl目前只支持画simple模式的点和线 |
| lineCap | String | 'butt' | 否 | 线帽样式 |
| lineJoin | String | 'miter' | 否 | 线段连接方式 |
| miterLimit | Number | 10 | 否 | 斜接限制 |
| methods | Object | {} | 否 | 事件回调函数对象 |
| methods.click | Function | undefined | 否 | 点击事件，返回对应点击元素的对象值 |
| methods.mousemove | Function | undefined | 否 | 鼠标移动事件，对应鼠标经过的元素对象值 |
| methods.tap | Function | undefined | 否 | 只针对移动端的点击事件 |
| animation | Object | undefined | 否 | 动画配置 |
| animation.type | String | 'time' | 否 | 按时间展示动画 |
| animation.stepsRange | Object | { start: 0, end: 100 } | 否 | 动画时间范围，对应数据中的time字段值 |
| animation.trails | Number | 10 | 否 | 时间动画的拖尾大小 |
| animation.duration | Number | 5 | 否 | 单个动画的时间，单位秒 |
```

### 执行步骤
1. 读取`/d:/前端项目/mapv地图修改/mapv-master/docs/api/layers.md`文件内容
2. 替换第98-107行的现有内容（包括`#### 参数`标题和现有表格）
3. 写入修改后的内容到文件
4. 验证修改是否正确