const fs = require('fs');
const path = require('path');

// 创建目录
const mkdir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

mkdir('build');
mkdir('build/release');

// 生成version.js文件
const version = require('./package.json').version;
const versionContent = `export var version = "${version}";
`;
fs.writeFileSync('build/version.js', versionContent);
