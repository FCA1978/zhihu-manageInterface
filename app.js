// 导入配置文件
const  config = require("./config")

const express = require("express")

const cors = require("cors")

const morgan = require("morgan")

const app = express()


// 处理中间件
// 处理json的中间件
app.use(express.json())

// 处理跨域
app.use(cors())

// 处理日志
app.use(morgan("dev"))

// 静态资源的托管
 app.use(express.static("public"))

// 引入数据库
require("./model")

// 引入路由中间件
app.use("/api",require("./routes"))

// 引入错误厝里中间件
// 注意点：必须放在路由中间件的后面
app.use(require("./middleware/error"))

app.listen(config.app.port,()=>{
    console.log(config.app.port);
})