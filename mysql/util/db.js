// 引入nodejs依赖库
// mysql 数据库
const mysql = require('mysql')

// 创建数据库连接池
// host 主机名
// user 用户名
// password 密码
// database 数据库
const pool = mysql.createPool({
  host     :  '127.0.0.1',
  user     :  'root',
  password :  'root',
  database :  'koa_demo'
})

// 封装查询语句
let query = function( sql, values ) {

  return new Promise(( resolve, reject ) => {
    // 获取链接
    pool.getConnection(function(err, connection) {
      if (err) {
        reject( err )
      } else {
        // 查询
        connection.query(sql, values, ( err, rows) => {

          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          // 释放连接池
          connection.release()
        })
      }
    })
  })

}

module.exports = {
  query
}