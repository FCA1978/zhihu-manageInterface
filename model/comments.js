const mongoose = require("mongoose");

// 引入配置文件
const config = require("../config");

// 引入joi
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// 定义 user 结构
const commentSchema = new mongoose.Schema(
  {
    //  隐藏版本信息 __v
    __v: {
      type: Number,
      select: false,
    },
    content: {
      type: String,
      required: true,
    },
    commentator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      select: false,
    },
    questionId: {
      type: String,
    },
    answerId: {
      type: String,
    },

    rootCommentId: {
      type: String,
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// 创建 Model
const Comment = mongoose.model("Comment", commentSchema);

// 创建内容校验规则对象
function commentValidator(data) {
  const schema = Joi.object({
    content: Joi.string().required(),
    commentator: Joi.objectId(),
    questionId: Joi.string(),
    answerId: Joi.string(),
    rootCommentId: Joi.string(),
    replyTo: Joi.objectId(),
  });

  return schema.validate(data);
}

// 导出
module.exports = {
  // 导出model
  Comment,
  commentValidator,
};
