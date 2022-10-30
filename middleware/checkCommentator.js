const { Comment } = require("../model/comments");

module.exports = async (req, res, next) => {
  const comment = await Comment.findById(req.params.id).select("+commentator");
  console.log(comment.commentator.toString());
  console.log(req.userData._id,'//');
  if (comment.commentator.toString() !== req.userData._id) {
    return res.status(400).json({
      code: 400,
      msg: "没有权限",
    });
  }
  next()
};
