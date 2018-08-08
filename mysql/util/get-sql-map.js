const fs = require('fs')
const walkFile = require('./walk-file')

/**
 * 获取sql目录下的文件目录数据
 * @return {object} 
 */
function getSqlMap () {
  // 储存基础路径
  let basePath = __dirname
  // 在window下路径有两个反斜杠//
  // 替换成单个反斜杠 /
  basePath = basePath.replace(/\\/g, '\/')

  // 分割/
  let pathArr = basePath.split('\/')
  // 将最后一个去掉
  pathArr = pathArr.splice( 0, pathArr.length - 1 )
  //先添加 / 在拼接 /sql/
  basePath = pathArr.join('/') + '/sql/'

  let fileList = walkFile( basePath, 'sql' )
  return fileList
}

module.exports = getSqlMap