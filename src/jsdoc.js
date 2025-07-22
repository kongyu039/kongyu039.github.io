// jsdoc.js

/**
 * @typedef {Object} DBJson 数据Json
 * @property {string} projSummary 项目描述开发原因和经历
 * @property {string} projDrivingForce 项目驱动力
 * @property {string} leave_title 离开标签
 * @property {string[]} typewriter 打字机字符串数组
 * @property {string} welcome 欢迎语句
 * @property {OtherItem[]} other_list 项目名单
 * @property {ProjItem[]} proj_list 项目名单
 */

/**
 * @typedef {Object} ProjItem 项目元素
 * @property {string} title 标题
 * @property {string} summary 概括
 * @property {string} desc 详情
 * @property {string} emoji 表情图标
 * @property {string} bgUrl 背景图片地址
 * @property {string:'#'} [href] 项目地址
 */

/**
 * @typedef {Object} OtherItem 其他元素
 * @property {string} title 标题
 * @property {string} desc 详情
 * @property {string:'#'} [href] 项目地址
 */

/**
 * @typedef {Object} FileInfo 文件信息
 * @property {ItemObj[]} html - html文件
 * @property {ItemObj[]} css - css文件
 * @property {ItemObj[]} js - js脚本文件
 * @property {ItemObj[]} other - 其他文件
 */

/**
 * @typedef {Object} ItemObj 文件Item对象
 * @property {string} path 原始路径
 * @property {string} srcDir 原始目录
 * @property {string} dstDir 打包目录
 */

/**
 * Other其他文件后缀
 * @typedef {'.jpg'|'.jpg'|'.svg'|'.ico'|'.ttf'|'.otf'|'.eot'|'.woff'|'.woff2','.png'} OtherFileExt
 */