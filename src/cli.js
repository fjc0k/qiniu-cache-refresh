#!/usr/bin/env node
const path = require('path')
const proc = require('process')
const chalk = require('chalk')
const _ = require('lodash')
const cTable = require('console.table')
const cacheRefresher = require('./index')

const cwd = proc.cwd()
const configFile = path.join(cwd, 'qiniu.config.js')

let config
try {
  config = require(configFile)
} catch (error) {
  throw new Error(chalk.red(`找不到配置文件 --> ${configFile}`))
}

if (!_.isPlainObject(config)) {
  throw new Error(chalk.red(`配置应为对象 --> ${configFile}`))
}

if (!config.accessKey || !config.secretKey) {
  throw new Error(chalk.red(`accessKey 或 secretKey 不能为空 --> ${configFile}`))
}

if (!_.isPlainObject(config.cacheRefresh)) {
  throw new Error(chalk.red(`未配置或未正确配置 cacheRefresh 字段 --> ${configFile}`))
}

cacheRefresher({
  accessKey: config.accessKey,
  secretKey: config.secretKey,
  urls: config.cacheRefresh.urls || null,
  dirs: config.cacheRefresh.dirs || null
}).then(
  res => {
    console.log()
    console.log(chalk.green('✔ 缓存刷新请求提交成功~'))
    console.log()
    console.log(cTable.getTable([
      {
        刷新类型: '文件',
        每日限额: res.urlQuotaDay,
        当前剩余: res.urlSurplusDay
      }, {
        刷新类型: '目录',
        每日限额: res.dirQuotaDay,
        当前剩余: res.dirSurplusDay
      }
    ]))
  },
  err => {
    throw err
  }
)
