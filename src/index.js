// src/index.js
"use strict"

;(() => {
  titleHandle()
  welcomeRender()
  typewriterHandle()
  renderProjList(dbJson.proj_list)
  renderOtherList(dbJson.other_list)
  listenArrow()
  timingHandle()
  fragmentCarousel(document.querySelector('.banner-rebound'))
})()

/** 标题处理 */
function titleHandle() {
  // 基础数据初始化
  LocalStorageUtil.setObj({title: document.title})
  // 处理可见性的变化
  handleVisibilityChange(() => {document.title = dbJson.leave_title}, () => {document.title = LocalStorageUtil.getItem("title")})
}

/** 欢迎语句 渲染 */
function welcomeRender() {document.querySelector("div.my-welcome").innerText = dbJson.welcome}

/** 打字机处理 */
function typewriterHandle() {
  let index = 0, index2 = 0, addFlag = true
  // 打字机定时器
  setInterval(() => {
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

/**
 * 渲染项目目录
 * @param {ProjItem[]} projList
 */
function renderProjList(projList) {
  /** @type {HTMLDivElement} */
  const caseProjBox = document.querySelector(".case-proj-box")
  let htmlTmpl = ''
  projList.forEach(projItem => {
    htmlTmpl += `<div class="col-6 col-lg-3">`
      + `<div style="background-image: url('${ !projItem.bgUrl ? "" : "./static/images/" + projItem.bgUrl }');">`
      + `<h4>${ projItem.title }</h4>`
      + `</div>`
      + `<div>`
      + `<span>${ projItem.summary }</span>`
      + `<a href="${ projItem.href || '#' }">${ projItem.emoji }前往</a>`
      + `<label><i class="fa fa-arrow-circle-o-down"></i></label>`
      + `</div>`
      + `<div class="case-proj-desc">${ projItem.desc }</div>`
      + `</div>`
  })
  caseProjBox.innerHTML = htmlTmpl
}

/**
 * 渲染项目目录
 * @param {OtherItem[]} otherList
 */
function renderOtherList(otherList) {
  /** @type {HTMLDivElement} */
  const caseOtherBox = document.querySelector(".other-features")
  let htmlTmpl = ''
  otherList.forEach(otherItem => {
    const {title, desc, href} = otherItem
    htmlTmpl += `<a href="${ href }" title="${ desc }" class="features">${ title }</a>`
  })
  caseOtherBox.innerHTML = htmlTmpl
}

/** 监听箭头事件 */
function listenArrow() {
  /** @type {HTMLDivElement} */
  const caseProjBox = document.querySelector(".case-proj-box")
  // 事件委托：在父元素上添加 click 事件监听器
  caseProjBox.addEventListener("click", function (event) {
    caseProjBox.querySelectorAll(".case-proj-desc").forEach(item => {
      item.removeAttribute('style')
    })
    // 检查点击的元素是否是目标元素
    if (event.target.matches("i.fa")) {
      let sibElement = event.target.parentElement.parentElement.nextElementSibling
      sibElement.style.display = "block"
      // sibElement.style.height = 'auto'
      // sibElement.style.height = sibElement.offsetHeight + 'px'// 获取和设置实际高度
    }
  })
}

/** 定时处理 */
function timingHandle() {
  /** @type {HTMLSpanElement} */
  const spanTimeElement = document.querySelector("div.my-calendar>span:first-child")
    , spanDateElement = document.querySelector("div.my-calendar>span:last-child")
  setInterval(function () {
    const formattedDate = new Date().toLocaleDateString('zh-CN', {year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'long'})
      .replace(/\//g, '年').replace(/日/, '日 ').replace(/(.*?)(年.*?)(日.*?)(\s.*)/, '$1$2$3$4')
    spanTimeElement.innerText = new Date().toLocaleTimeString('zh-CN')
    spanDateElement.innerText = formattedDate
  }, 1000)
}