const vscode = require('vscode')
const path = require('path')
const fs = require('fs')

/**
 * 从某个HTML文件读取能被Webview加载的HTML内容
 * @param {*} context 上下文
 * @param {*} templatePath 相对于插件根目录的html文件相对路径
 */
function getWebViewContent(context, templatePath) {
  const resourcePath = path.join(context.extensionPath, templatePath);
  const dirPath = path.dirname(resourcePath);
  let html = fs.readFileSync(resourcePath, 'utf-8');
  // vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
  html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
    return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
  });
  return html;
}


/**
 * @description: 通过字符查找所在的行数(第一次匹配的行数)
 * @param {*} document
 * @param {*} text
 * @return {*}
 */
function findLine(document, text) {
  let count = document.lineCount
  let line = -1
  for(let i = 0; i < count; i++){
    const currentLineText = document.lineAt(i).text
    if(currentLineText.indexOf(text) > 0){
      line = i
    }
  }
  return line
}

module.exports = {
  getWebViewContent,
  findLine
}