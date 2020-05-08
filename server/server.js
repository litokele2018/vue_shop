const express = require('express')
const compression = require('compression')

const app = express()
// 中间件 gzip 压缩
app.use(compression())
app.use(express.static('../dist'))

app.listen(8080, () => {
  console.log('success')
})