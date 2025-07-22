import path from 'path'
import fs from 'fs'
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
import gulp, { series, parallel } from "gulp"
import connect from "gulp-connect" //启动本地服务器
import csso from "gulp-csso"
import htmlMin from "gulp-html-minifier-terser"
import uglifyEs from "gulp-uglify-es"

/** 根目录和目标目录 */
const {rootDir, distDir} = {rootDir: path.join(__dirname, './src'), distDir: path.join(__dirname, './docs')}
/**
 * 其他文件后缀
 * @type {OtherFileExt[]}
 */
const otherFileExt = ['.eot', '.ico', '.svg', '.jpg', '.png', '.otf', '.ttf', '.woff', '.woff2']
/**
 * 文件信息
 * @type {FileInfo}
 */
const fileInfo = {html: [], css: [], js: [], other: []}
/**
 * 根据路径赋值
 * @param {string} dirPath 路径
 * @param {FileInfo} fileInfo 文件信息
 */
function findFile(dirPath, fileInfo) {
  try {
    const files = fs.readdirSync(dirPath)
    files.forEach(item => {
      const fPath = path.join(dirPath, item), stat = fs.statSync(fPath)
      if (stat.isDirectory() && !fPath.includes('node_modules')) {
        findFile(fPath, fileInfo)
      }
      if (stat.isFile()) {
        const srcDir = path.dirname(fPath)
        const dstDir = srcDir.replace(rootDir, distDir)
        /** @type {ItemObj} */
        const pathObj = {path: fPath, srcDir: srcDir, dstDir: dstDir}
        if (fPath.includes('jsdoc.js')) { return}
        // 获取文件扩展名
        const ext = path.extname(fPath)
        let otherFlag = otherFileExt.includes(ext)
        // 获取文件名（去除扩展名）
        const baseName = path.basename(fPath, ext)
        // 检查文件名是否以 .min 结尾
        if (baseName.endsWith('.min')) { otherFlag = true }
        // 将路径对象推入对应的数组
        if (otherFlag) {
          fileInfo.other.push(pathObj)
        } else {
          switch (ext) {
            case '.css':
              fileInfo.css.push(pathObj)
              break
            case '.js':
              fileInfo.js.push(pathObj)
              break
            case '.html':
              fileInfo.html.push(pathObj)
              break
          }
        }
      }
    })
  } catch (err) {
    console.log("项目路径或打包路径为空")
  }
}
/**
 * 创建 html 任务
 * @param {ItemObj[]} itemObjArr
 */
function createHtmlTasks(itemObjArr) {
  return itemObjArr.map((item, index) => {
    return async () => {
      return new Promise((resolve, reject) => {
        const currentTime = Date.now()
        gulp.src(item.path)
          .pipe(htmlMin({
            removeComments: true, collapseWhitespace: true, removeEmptyAttributes: false, minifyJS: true, minifyCSS: true,
          }))
          .pipe(gulp.dest(item.dstDir))
          .on('end', () => {
            // simpleLog(item, {currentTime, type: "Html", count: itemObjArr.length, nowCount: index + 1})
            resolve()
          })
          .on('error', (err) => {
            console.error(`Error processing ${ item.path }:`, err)
            reject(err) // 如果出错，调用 reject
          })
      })
    }
  })
}
/**
 * 创建 css 任务
 * @param {ItemObj[]} itemObjArr
 */
function createCssTasks(itemObjArr) {
  return itemObjArr.map((item, index) => {
    return async () => {
      return new Promise((resolve, reject) => {
        const currentTime = Date.now()
        gulp.src(item.path)
          .pipe(csso())
          .pipe(gulp.dest(item.dstDir))
          .on('end', () => {
            // simpleLog(item, {currentTime, type: "Css", count: itemObjArr.length, nowCount: index + 1})
            resolve()
          })
          .on('error', (err) => {
            console.error(`Error processing ${ item.path }:`, err)
            reject(err) // 如果出错，调用 reject
          })
      })
    }
  })
}
/**
 * 创建 javascript 任务
 * @param {ItemObj[]} itemObjArr
 */
function createJSTasks(itemObjArr) {
  return itemObjArr.map((item, index) => {
    return async () => {
      return new Promise((resolve, reject) => {
        const currentTime = Date.now()
        gulp.src(item.path)
          .pipe(uglifyEs.default({compress: {drop_console: true}, mangle: true}))
          .pipe(gulp.dest(item.dstDir))
          .on('end', () => {
            // simpleLog(item, {currentTime, type: "JavaScript", count: itemObjArr.length, nowCount: index + 1})
            resolve()
          })
          .on('error', (err) => {
            console.error(`Error processing ${ item.path }:`, err)
            reject(err) // 如果出错，调用 reject
          })
      })
    }
  })
}
/**
 * 创建 other 任务
 * @param {ItemObj[]} itemObjArr
 */
function createOtherTasks(itemObjArr) {
  return itemObjArr.map((item, index) => {
    return async () => {
      return new Promise((resolve, reject) => {
        const currentTime = Date.now()
        gulp.src(item.path, {encoding: false})
          .pipe(gulp.dest(item.dstDir))
          .on('end', () => {
            // simpleLog(item, {currentTime, type: "Other", count: itemObjArr.length, nowCount: index + 1})
            resolve()
          })
          .on('error', (err) => {
            console.error(`Error processing ${ item.path }:`, err)
            reject(err) // 如果出错，调用 reject
          })
      })
    }
  })
}

// 启动开发服务器
const server = async () => {
  connect.server({root: rootDir, livereload: true, port: 8838, host: '0.0.0.0'}, () => {
    console.log(`根目录为'${ rootDir }' http://10.168.1.216:8838`)
    // cp.exec("start http://10.168.1.216:8838")
  })
}
/**
 * 执行gulp任务
 */
export function build() {
  findFile(rootDir, fileInfo)
  // window.simplePopup(`${ (Date.now() - time) / 1000 }s CSS 打包完毕`)
  const totalCount = Object.keys(fileInfo).reduce((sum, key) => sum + fileInfo[key].length, 0), time = new Date(),
    groupHtmlTasks = createHtmlTasks(fileInfo.html), groupCssTasks = createCssTasks(fileInfo.css),
    groupJSTasks = createJSTasks(fileInfo.js), groupOtherTasks = createOtherTasks(fileInfo.other)
  gulp.series(...groupHtmlTasks, ...groupCssTasks, ...groupJSTasks, ...groupOtherTasks, () => {
    // fileCount = 0
    console.log(`${ new Date().toLocaleTimeString('en-gb') } 执行打包任务完毕 耗时 ${ (Date.now() - time.getTime()) / 1000 }s`)
    console.log(`${ new Date().toLocaleTimeString('en-gb') } 总文件数量: ${ totalCount }`)
  })()
}
/** 测试任务 */
export function test() {}
// 默认任务(服务器) default
export default server