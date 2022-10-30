const router = require("express").Router()

const topic = require("../controller/topic")

const auth = require("../middleware/auth");

const { topicValidator } = require("../model/topic");

const validator = require("../middleware/validate");

const checkTopicExist = require("../middleware/checkTopicExist")

// 获取话题列表
router.get("/",topic.getTopicsList)

// 获取话题列表
router.get("/:id",topic.getTopic)

// 新增话题
router.post("/",[auth,validator(topicValidator)],topic.createTopic)

// 修改话题
router.patch("/:id",[auth,validator(topicValidator)],topic.updateTopic)

// 话题的粉丝
router.get("/:id/followers",checkTopicExist,topic.listTopicFollowers)

// 话题的问题列表
router.get("/:id/questions",checkTopicExist,topic.listQuestions)

module.exports = router