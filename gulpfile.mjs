import gulp, { series, parallel } from "gulp"
import connect from "gulp-connect" //启动本地服务器
import cp from "child_process"

const {rootDir, distDir} = {rootDir: "./src", distDir: "./dist"}

// 启动开发服务器
const server = async () => {
  connect.server({root: rootDir, livereload: true, port: 8838, host: '0.0.0.0'}, () => {
    console.log(`根目录为'${ rootDir }' http://10.168.1.216:8838`)
    // cp.exec("start http://10.168.1.216:8838")
  })
}

// 创建格式化 html+css+js+other(需要指定特定的后缀 ttf+otf+eot+svg+woff+woff2+jpg+png+ico)

// 默认任务(服务器) default
export default server