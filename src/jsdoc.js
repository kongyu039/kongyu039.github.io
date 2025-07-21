// jsdoc.js

/**
 * @typedef {Object} DBJson
 * @property {string} projSummary 项目描述开发原因和经历
 * @property {string} projDrivingForce 项目驱动力
 * @property {string} leave_title 离开标签
 * @property {string[]} typewriter 打字机字符串数组
 * @property {string} welcome 欢迎语句
 * @property {OtherItem[]} other_list 项目名单
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

/**
 * @typedef {Object} OtherItem
 * @property {string} title 标题
 * @property {string} desc 详情
 * @property {string:'#'} [href] 项目地址
 */