/** 文件系统管理  */
const fs = require('fs')
/** 路径系统管理 */
const path = require('path')
/** 全局状态管理 */
const {stateGet} = require('assets/scripts/global-state.js')
/** 扩展映射 后缀(key):分类数组(value) */
const extMapping = require('package.json')['ext-mapping']
/**
 * 根据路径赋值
 * @param {string} dirPath 路径
 * @param {FileInfo} fileInfo 文件信息
 */
function findFile(dirPath, fileInfo) {
  try {
    const files = fs.readdirSync(dirPath)
    files.forEach(item => {
      const fPath = path.join(dirPath, item)
        , stat = fs.statSync(fPath)
      if (stat.isDirectory() && !fPath.includes('node_modules')) {
        findFile(fPath, fileInfo)
      }
      if (stat.isFile()) {
        const projDir = path.dirname(fPath)
        const distDir = projDir.replace(stateGet('projPath'), stateGet('distPath'))
        /** @type {ItemObj} */
        const pathObj = {path: fPath, projDir: projDir, distDir: distDir}
        // 获取文件扩展名
        const ext = path.extname(fPath)
        let category = extMapping[ext] || 'other' // 默认为 'other'
        // 获取文件名（去除扩展名）
        const baseName = path.basename(fPath, ext)
        // 检查文件名是否以 .min 结尾
        if (baseName.endsWith('.min')) { category = 'other' }
        if (category === 'exclude') return // 如果为 'exclude' 则跳过
        // 将路径对象推入对应的数组
        if (category !== 'other' && path.basename(fPath) !== 'model.jsdoc.js') {
          fileInfo[category].push(pathObj)
        } else if (category === 'other') {
          fileInfo.other.push(pathObj)
        }
      }
    })
  } catch (err) {
    console.log("项目路径或打包路径为空")
  }
}
/**
 * 通过项目路径获取所有资源并整理为数组
 * @param {string} [projPath] 项目路径
 * @return {FileInfo}
 */
function projFiles(projPath = stateGet('projPath')) {
  projPath = path.normalize(projPath)
  const fileInfo = {html: [], css: [], js: [], other: []}
  findFile(projPath, fileInfo)
  return fileInfo
}
module.exports = {projFilesFunc: projFiles}
