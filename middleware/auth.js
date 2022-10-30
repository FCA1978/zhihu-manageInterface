// 引入jwt
const jwt = require("jsonwebtoken")
const config = require("../config")

module.exports = function(req,res,next){
    // 前端在请求接口的时候，需要在header带上后端生成的token

    // 1.保存数据（token）
    const token = req.header("authorization")
    // 2.检测时候存在token
    if(!token){
        return res.status(400).json({
            code:400,
            msg:"Unauthorizatoin，无token"
        })
    }
    // 3.当token存在的时候，验证是否有效
try {
    const userData = jwt.verify(token,config.secret)

    req.userData = userData

    next()
} catch (error) {
    return res.status(401).json({
        code:401,
        msg:"Unauthorizatoin，Token无效"
    })
}

    
}
