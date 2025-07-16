// jsdoc.js

/**
 * @typedef {Object} DBJson
 * @property {string} leave_title 离开标签
 * @property {string[]} typewriter 打字机字符串数组
 * @property {string} welcome 欢迎语句
 * @property {ProjItem[]} proj_list 项目名单
 */

/**
 * @typedef {Object} ProjItem
 * @property {string} title 标题
 * @property {string} summary 概括
 * @property {string} desc 详情
 * @property {string} emoji 表情图标
 * @property {string} bgUrl 背景图片地址
 * @property {string:'#'} [href] 项目地址
 */