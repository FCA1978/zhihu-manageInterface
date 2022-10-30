const router = require("express").Router()

// 用户接口
router.use("/user",require("./user"))

// 用户接口
router.use("/auth",require("./auth"))

// 上传文件接口
router.use("/upload",require("./upload"))

// 话题模块接口
router.use("/topic",require("./topic"))

// 问题接口
router.use("/questions",require("./questions"))

// 答案接口(二级嵌套模式 问题->答案)
router.use("/questions/:questionId/answers",require("./answers"))

// 评论接口(三级嵌套模式 问题->答案->评论)
router.use("/questions/:questionId/answers/:answerId/comments",require("./comments"))

module.exports = router