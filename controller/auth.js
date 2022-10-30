// 引入用户模块
const { User } = require("../model/user")

// 引入 bcrypt
const bcrypt = require("bcryptjs")

exports.login = async (req, res, next) => {
  try{
    // 获取到校验过后的数据
    const validValue = req.validValue
    console.log(validValue);

    // 1.检测用户是否存在
    let user = await User.findOne({ email: validValue.email }).select("+password")
    console.log(user);

    // 2.如果用户不存在，那就直接返回失败的响应
    if(!user) {
      return res.status(400).json({
        code: 400,
        msg: "用户名或者密码错误"
      })
    }

    // 3.如果用户存在，我们再来检测密码是否正确
    // 第一个思路: 我们将数据库中的密码进行解密，然后进行比较，看是否正确
    // 第二个思路: 我们将现在这个没有加密的密码也进行加密，然后我们拿着2个加密的密码机械能比较
    // null undefined ： data and hash arguments required
    let compareResult = await bcrypt.compare(validValue.password, user.password)
    
    // 4.如果密码不正确，返回失败的响应
    if(!compareResult) {
      return res.status(400).json({
        code: 400,
        msg: "用户名或者密码错误"
      })
    }

    // 5.登录成功，响应成功的信息
    res.status(200).json({
      code: 200,
      msg: "登录成功",
      authorization: {
        token: user.generateToken()
      }
    })
  } catch(err) {
    next(err)
  }
}
