const router = require("express").Router();

const { userValidator } = require("../model/user");

const validator = require("../middleware/validate");

const user = require("../controller/user");

const auth = require("../middleware/auth");

const checkUserExist = require("../middleware/checkUserExist");

const checkTopicExist = require("../middleware/checkTopicExist");

const checkAnswerExist = require("../middleware/checkAnswerExist");

// 注册用户
router.post("/", validator(userValidator), user.register);

// 获取所有用户
router.get("/", user.getUserList);

// 获取指定用户
router.get("/:id", user.getUser);

//编辑修改/指定用户
router.patch("/:id", [auth, validator(userValidator)], user.updateUser);

//删除指定用户
router.delete("/:id", [auth, validator(userValidator)], user.deleteUser);

// 获取关注列表
router.get("/:id/following", user.listFollowing);

// 关注
router.put("/following/:id", [auth, checkUserExist], user.follow);

// 取消关注
router.delete("/following/:id", [auth, checkUserExist], user.unfollow);

// 获取某个用户的粉丝
router.get("/:id/followers", user.listFollowers);

// 关注话题
router.put("/followingTopic/:id", [auth, checkTopicExist], user.followTopic);

// 取消关注话题
router.delete(
  "/followingTopic/:id",
  [auth, checkTopicExist],
  user.unfollowTopic
);

// 获取关注话题列表
router.get("/:id/followingTopic", user.listFolloweringTopic);

// 用户的问题列表
router.get("/:id/questions", user.listQuestions);

// 喜欢答案
router.put("/likingAnswers/:id", [auth, checkAnswerExist], user.likeAnswer,user.undislikeAnswer);

// 取消喜欢答案
router.delete("/likingAnswers/:id", [auth, checkAnswerExist], user.unlikeAnswer);

// 喜欢列表
router.get("/:id/likingAnswers", [auth, checkAnswerExist], user.listLikingAnswers);

// 踩答案
router.put("/likingAnswers/:id", [auth, checkAnswerExist], user.dislikeAnswer,user.unlikeAnswer);

// 取消踩答案
router.delete("/likingAnswers/:id", [auth, checkAnswerExist], user.undislikeAnswer);

// 踩列表
router.get("/:id/likingAnswers", [auth, checkAnswerExist], user.listDisLikingAnswers);
module.exports = router;
