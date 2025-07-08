// src/index.js
"use strict"

;(() => {
  titleHandle()
  welcomeRender()
  typewriterHandle()
})()

/** 标题处理 */
function titleHandle() {
  // 基础数据初始化
  LocalStorageUtil.setObj({title: document.title})
  // 处理可见性的变化
  handleVisibilityChange(() => {document.title = dbJson.leave_title}, () => {document.title = LocalStorageUtil.getItem("title")})
}

/** 欢迎语句 渲染 */
function welcomeRender() {
  document.querySelector("div.my-welcome").innerText = dbJson.welcome
}

/** 打字机处理 */
function typewriterHandle() {
  let index = 0, index2 = 0, addFlag = true
  const timerId = setInterval(() => {
    let strLength = dbJson.typewriter[index].length
    if (addFlag) {
      appendText("span.msg", dbJson.typewriter[index][index2])
      index2++
      if (index2 === strLength) {
        addFlag = false
      }
    } else {
      document.querySelector("span.msg").lastChild.remove()
      index2--
      if (index2 === 0) {
        index = Math.floor(dbJson.typewriter.length * Math.random())
        addFlag = true
      }
    }
  }, 180)
}