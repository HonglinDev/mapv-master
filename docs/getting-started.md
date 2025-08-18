# 快速开始

## 安装

### NPM 安装

如果你使用 NPM 开发环境，可使用 NPM 安装，MapV 能很好地和诸如 Webpack、Browserify 或 fis 的 CommonJS 模块打包器配合使用。

```bash
npm install mapv


如果您需要修改build/mapv.js中的功能，应该根据具体需求修改对应的源文件：

修改工具函数 - 直接修改src/canvas/目录下的相应文件
修改绘制功能 - 修改src/canvas/draw/或src/webgl/draw/目录下的相应文件

修改数据处理 - 修改src/data/DataSet.js

修改数据范围处理 - 修改src/utils/data-range/目录下的相应文件


修改图层基础功能 - 修改src/map/BaseLayer.js


修改特定地图适配器 - 修改src/map/下相应目录的文件
修改完成后，需要运行构建命令重新生成build/mapv.js文件。