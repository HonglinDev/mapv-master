const fs = require('fs');
const path = require('path');

// 定义examples文件夹路径和docs/examples文件夹路径
const examplesDir = path.join(__dirname, 'examples');
const docsExamplesDir = path.join(__dirname, 'docs', 'examples');

// 确保docs/examples文件夹存在
if (!fs.existsSync(docsExamplesDir)) {
  fs.mkdirSync(docsExamplesDir, { recursive: true });
}

// 扫描examples文件夹中的所有HTML文件
function scanHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      scanHtmlFiles(filePath, fileList);
    } else if (path.extname(file) === '.html') {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// 提取HTML文件中的标题
function extractTitle(htmlContent) {
  const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : '未命名示例';
}

// 提取HTML文件中的描述（从meta标签或注释中提取）
function extractDescription(htmlContent) {
  const metaMatch = htmlContent.match(/<meta name="description" content="(.*?)"\s*\/?>/i);
  if (metaMatch) {
    return metaMatch[1].trim();
  }
  
  // 如果没有meta标签，尝试从注释中提取
  const commentMatch = htmlContent.match(/<!--\s*description:\s*(.*?)\s*-->/i);
  if (commentMatch) {
    return commentMatch[1].trim();
  }
  
  return '暂无描述';
}

// 生成Markdown文件
function generateMarkdownFile(htmlFilePath) {
  // 读取HTML文件内容
  const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
  
  // 提取标题和描述
  const title = extractTitle(htmlContent);
  const description = extractDescription(htmlContent);
  
  // 生成相对路径，使用正斜杠
  const relativePath = path.relative(__dirname, htmlFilePath);
  const srcPath = `/${relativePath.replace(/\\/g, '/')}`;
  
  const markdownContent = `---
title: ${title}
description: ${description}
---

<ExampleViewer
  title="${title}"
  description="${description}"
  src="${srcPath}"
  language="html"
/>
`;
  
  // 生成Markdown文件路径
  const relativeHtmlPath = path.relative(examplesDir, htmlFilePath);
  const markdownFileName = path.basename(relativeHtmlPath, '.html') + '.md';
  const markdownFilePath = path.join(docsExamplesDir, markdownFileName);
  
  // 写入Markdown文件
  fs.writeFileSync(markdownFilePath, markdownContent, 'utf8');
  
  console.log(`生成Markdown文件: ${markdownFilePath}`);
}

// 主函数
function main() {
  console.log('开始扫描examples文件夹...');
  
  // 扫描所有HTML文件
  const htmlFiles = scanHtmlFiles(examplesDir);
  
  console.log(`找到 ${htmlFiles.length} 个HTML文件`);
  
  // 为每个HTML文件生成Markdown文件
  htmlFiles.forEach(htmlFile => {
    generateMarkdownFile(htmlFile);
  });
  
  console.log('Markdown文件生成完成！');
}

// 执行主函数
main();