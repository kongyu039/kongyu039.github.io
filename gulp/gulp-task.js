// gulp 相关
const gulp = require('gulp')
const csso = require('gulp-csso')
const htmlMin = require('gulp-html-minifier-terser')
const uglifyEs = require('gulp-uglify-es').default
const jsonMinify = require('gulp-json-minify')

// "dependencies":{"gulp":"^4.0.2","gulp-csso":"^4.0.1","gulp-html-minifier-terser":"^6.0.1","gulp-json-minify":"^1.2.3","gulp-uglify-es":"^3.0.0"}
// 其他
const {projFilesFunc} = require('assets/gulp/proj-files.js')
const {stateGet} = require('assets/scripts/global-state.js')
const logger = loggerGen('.container .logs')
/**
 * 项目文件存储
 * @type {FileInfo}
 */
let projFiles
let fileCount = 0
let time = {Html: null, Css: null, JavaScript: null, Other: null}
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
          .pipe(gulp.dest(item.distDir))
          .on('end', () => {
            simpleLog(item, {currentTime, type: "Html", count: itemObjArr.length, nowCount: index + 1})
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
          .pipe(gulp.dest(item.distDir))
          .on('end', () => {
            simpleLog(item, {currentTime, type: "Css", count: itemObjArr.length, nowCount: index + 1})
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
          .pipe(uglifyEs({compress: {drop_console: true}, mangle: true}))
          .pipe(gulp.dest(item.distDir))
          .on('end', () => {
            simpleLog(item, {currentTime, type: "JavaScript", count: itemObjArr.length, nowCount: index + 1})
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
        if ((/\.json$/i).test(item.path)) {
          gulp.src(item.path)
            .pipe(jsonMinify())
            .pipe(gulp.dest(item.distDir))
            .on('end', () => {
              simpleLog(item, {currentTime, type: "Other", count: itemObjArr.length, nowCount: index + 1})
              resolve()
            })
            .on('error', (err) => {
              console.error(`Error processing ${ item.path }:`, err)
              reject(err) // 如果出错，调用 reject
            })
        } else {
          gulp.src(item.path)
            .pipe(gulp.dest(item.distDir))
            .on('end', () => {
              simpleLog(item, {currentTime, type: "Other", count: itemObjArr.length, nowCount: index + 1})
              resolve()
            })
            .on('error', (err) => {
              console.error(`Error processing ${ item.path }:`, err)
              reject(err) // 如果出错，调用 reject
            })
        }
      })
    }
  })
}
/**
 * 面板打印日志
 * @param item {ItemObj}
 * @param type {string} 类型
 * @param nowCount {number} 现在数量
 * @param count {number} 总共数量
 * @param currentTime {number} 此单文件开始时间
 */
function simpleLog(item, {currentTime, type, nowCount, count}) {
  const nowTime = Date.now()
    , timestamp = new Date(nowTime).toLocaleTimeString('en-GB')
    , lineFlag = String(++fileCount).padStart(4, ' ')
  logger.$log(`${ timestamp }${ lineFlag } ${ (nowTime - currentTime) / 1000 }s ${ item.path.replace(stateGet('projPath'), '') }`)
  if (nowCount === 1) {
    time[type] = Date.now()
  }
  if (nowCount === count) {
    window.simplePopup(`${ timestamp } ${ type } 打包完毕 耗时 ${ (nowTime - time[type]) / 1000 }s`)
  }
}
/**
 * 执行gulp任务
 */
export function runTask() {
  projFiles = projFilesFunc()
  // window.simplePopup(`${ (Date.now() - time) / 1000 }s CSS 打包完毕`)
  const totalCount = Object.keys(projFiles).reduce((sum, key) => sum + projFiles[key].length, 0)
    , time = new Date()
    , groupHtmlTasks = createHtmlTasks(projFiles.html)
    , groupCssTasks = createCssTasks(projFiles.css)
    , groupJSTasks = createJSTasks(projFiles.js)
    , groupOtherTasks = createOtherTasks(projFiles.other)

  logger.$clear()
  logger.$log(`${ time.toLocaleTimeString('en-gb') } 执行打包任务开始`)
  gulp.series(...groupHtmlTasks, ...groupCssTasks, ...groupJSTasks, ...groupOtherTasks, () => {
    fileCount = 0
    logger.$log(`${ new Date().toLocaleTimeString('en-gb') } 执行打包任务完毕 耗时 ${ (Date.now() - time.getTime()) / 1000 }s`)
    logger.$log(`${ new Date().toLocaleTimeString('en-gb') } 总文件数量: ${ totalCount }`)
  })()
}