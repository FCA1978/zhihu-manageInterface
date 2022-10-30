const router = require("express").Router();
const auth = require("../middleware/auth");
const { commentValidator } = require("../model/comments");
const validator = require("../middleware/validate");
const checkCommentExist = require("../middleware/checkCommentExist");
const checkCommentator = require("../middleware/checkCommentator");
const comment = require("../controller/comments");

// 获取评论列表
router.get("/", comment.getCommentsList);

// 获取指定评论
router.get("/:id", checkCommentExist, comment.getComment);

// 新增评论
router.post("/", [auth, validator(commentValidator)], comment.createComment);
 
// 修改评论
router.patch(
  "/:id",
  [auth, validator(commentValidator), checkCommentExist, checkCommentator],
  comment.updateComment
);

// 删除评论
router.delete(
  "/:id",
  [auth, checkCommentExist, checkCommentator],
  comment.deleteComment
);

module.exports = router;
