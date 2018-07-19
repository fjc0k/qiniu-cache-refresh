// 参考：https://github.com/qiniu/nodejs-sdk/blob/master/examples/cdn_refresh_urls_dirs.js
const qiniu = require('qiniu')

module.exports = ({ accessKey, secretKey, urls = null, dirs = null }) => {
  return new Promise((resolve, reject) => {
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    const cdnManager = new qiniu.cdn.CdnManager(mac)
    cdnManager.refreshUrlsAndDirs(urls, dirs, (err, resBody, resInfo) => {
      if (err) {
        reject(err)
      } else if (resInfo.statusCode === 200) {
        resolve(JSON.parse(resBody))
      } else {
        reject(resInfo)
      }
    })
  })
}
