// 工具js库 - src/static/utils.js
/**
 * 处理页面可见工具
 * @param {function} [hiddenFunc = ()=>{}] 隐藏回调函数
 * @param {function} [visibleFunc = ()=>{}] 可见回调函数
 */
function handleVisibilityChange(hiddenFunc = () => {}, visibleFunc = () => {}) {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'hidden') {hiddenFunc()} else if (document.visibilityState === 'visible') {visibleFunc()}
  })
}

/**
 * 同步url请求
 * @param url {string | URL} 请求地址
 * @param [body=null] {Document | XMLHttpRequestBodyInit | null} 请求体
 * @returns {null | string}
 */
function makeSyncRequest(url, body = null) {
  const xhr = new XMLHttpRequest()
  // 初始化请求
  xhr.open("GET", url, false) // false 表示同步请求
  try {
    // 发送请求
    xhr.send(body)
    // 检查请求状态
    if (xhr.status === 200) {
      // 请求成功，返回响应文本
      return xhr.responseText
    } else {
      // 请求失败，返回错误信息
      console.error("Request failed. Status: " + xhr.status)
      return null
    }
  } catch (e) {
    console.error("Error occurred: " + e.message)
    return null
  }
}

/**
 * 追加文本/文字
 * @param selectors {string} css选择器
 * @param text {string} 文字
 */
function appendText(selectors, text) {
  const textNode = document.createTextNode(text) // 创建文本节点
  const div = document.querySelector('span.msg') // 获取目标div
  div.appendChild(textNode) // 将文本节点添加到div中
}

/** 提供用于操作 LocalStorage 的工具类。 */
class LocalStorageUtil {
  /**
   * 保存Obj对象数据存储到LocalStorage
   * @param obj {Object} 对象
   */
  static setObj(obj) {
    try {
      const entries = Object.entries(obj)
      for (const [key, value] of entries) { // 遍历键值对
        localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.error('Error while saving to LocalStorage:', error)
    }
  }
  /**
   * 保存数据到LocalStorage
   * @param key {string} 键
   * @param value {any} 值
   */
  static setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error while saving to LocalStorage:', error)
    }
  }
  /**
   * 从LocalStorage获取数据
   * @param key {string} 键
   * @returns {any|null} 对象结果
   */
  static getItem(key) {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Error while getting data from LocalStorage:', error)
      return null
    }
  }
  /**
   * 获取LocalStorage的所有key
   * @returns {null|string[]}
   */
  static getKeys() {
    try {
      const keys = []
      for (let i = 0; i < localStorage.length; i++) {keys.push(localStorage.key(i))}
      return keys
    } catch (error) {
      console.error('Error while getting keys from LocalStorage:', error)
      return null
    }
  }
  /**
   * 从LocalStorage删除数据
   * @param key {string} 键
   */
  static removeItem(key) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error while removing data from LocalStorage:', error)
    }
  }
  /**
   * 计算 LocalStorage 占用的空间（以字节Byte为单位）
   * @returns {number} LocalStorage 占用的总空间大小
   */
  static localStorageSize() {
    let total = 0
    const length = localStorage.length
    for (let i = 0; i < length; i++) {
      const key = localStorage.key(i)
      const value = localStorage.getItem(key)
      // 计算键和值的字节长度并累加
      total += key.length
      total += value.length
    }
    return total
  }
  /** 清空LocalStorage中的所有数据 */
  static clear() {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error while clearing LocalStorage:', error)
    }
  }
}