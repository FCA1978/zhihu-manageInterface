const router = require("express").Router();
const auth = require("../middleware/auth");
const { answerValidator } = require("../model/answers");
const validator = require("../middleware/validate");
const checkAnswerExist = require("../middleware/checkAnswerExist");
const checkAnswerer = require("../middleware/checkAnswerer");
const answer = require("../controller/answer");

// 获取答案列表
router.get("/", answer.getAnswersList);

// 获取指定答案
router.get("/:id", checkAnswerExist, answer.getAnswer);

// 新增答案
router.post("/", [auth, validator(answerValidator)], answer.createAnswer);
 
// 修改答案
router.patch(
  "/:id",
  [auth, validator(answerValidator), checkAnswerExist, checkAnswerer],
  answer.updateAnswer
);

// 删除问题
router.delete(
  "/:id",
  [auth, checkAnswerExist, checkAnswerer],
  answer.deleteAnswer
);

module.exports = router;
