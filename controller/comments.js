const { Comment } = require("../model/comments");

// 获取评论列表
exports.getCommentsList = async (req, res, next) => {
  try {
    // 当前是第几页
    const page = Math.max(req.query.page * 1, 1) - 1;
    // 每页有几条数据
    const { per_page = 10 } = req.query;
    const perPage = Math.max(per_page * 1, 1);

    const keyword = new RegExp(req.query.keyword);
    const { questionId, answerId } = req.params;
    const { rootCommentId } = req.query
    const commentsList = await Comment.find({
      content: keyword,
      questionId,
      answerId,
    })
      .limit(perPage)
      .skip(page * perPage)
      .populate("rootCommentId replyTo")
    if (!commentsList)
      return res.status(400).json({
        code: 400,
        msg: "获取评论列表失败",
      });
    res.status(200).json({
      code: 200,
      msg: "获取评论列表成功",
      data: commentsList,
    });
  } catch (error) {
    next(error);
  }
};

// 获取指定评论
exports.getComment = async (req, res, next) => {
  try {
    const { fields = "" } = req.query;
    const selectFields = fields
      .split(";")
      .filter((f) => f)
      .map((f) => "+" + f)
      .join("");
    const comment = await Comment.findById(req.params.id)
      .select(selectFields)
      .populate("commentator");

    if (!comment)
      return res.status(400).json({
        code: 400,
        msg: "获取评论失败",
      });

    res.status(200).json({
      code: 200,
      msg: "获取评论成功",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

// 新增评论
exports.createComment = async (req, res, next) => {
  try {
    const { questionId, answerId } = req.params;
    const commentator = req.userData._id  ;
    const comment = new Comment({
      ...req.body,
      answerer: req.userData._id,
      questionId,
      answerId,
      commentator
    });
    await comment.save();

    res.status(200).json({
      code: 200,
      msg: "评论成功",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

// 更新评论
exports.updateComment = async (req, res, next) => {
  try {
    let commentId = req.params.id;
    const { content } = req.body
    const data = await Comment.findByIdAndUpdate(commentId,content);
    if (!data)
      return res.status(400).json({
        code: 400,
        msg: "更新评论失败",
        value: data,
      });

    res.status(200).json({
      code: 200,
      msg: "更新评论成功",
      data: req.body,
    });
  } catch (error) {
    next(error);
  }
};

// 删除评论
exports.deleteComment = async (req, res, next) => {
  try {
    const data = await Comment.findByIdAndDelete(req.params.id);
    if (!data)
      return res.status(400).json({
        code: 400,
        msg: "删除评论失败",
      });

    res.status(200).json({
      code: 200,
      msg: "删除评论成功",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};
