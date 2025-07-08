import gulp, { series, parallel } from "gulp"
import connect from "gulp-connect" //启动本地服务器
import cp from "child_process"

const server = async () => {
  connect.server(
    {root: "./src/", livereload: true, port: 8838, host: '0.0.0.0'},
    () => {
      console.log("http://10.168.1.216:8838")
      // cp.exec("start http://10.168.1.216:8838")
    },
  )
}

// 默认任务(服务器) default
export default server