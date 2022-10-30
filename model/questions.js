const mongoose = require("mongoose");

// 引入joi
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// 定义 user 结构
const uestionSchema = new mongoose.Schema(
  {
    //  隐藏版本信息 __v
    __v: {
      type: Number,
      select: false,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    questioner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      select: false,
    },
    topics: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Topic",
        },
      ],
      select: false,
    },
  },
  { timestamps: true }
);

// 创建 Model
const Question = mongoose.model("Question", uestionSchema);

// 创建内容校验规则对象
function questionValidator(data) {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    questioner: Joi.objectId(),
    topics: Joi.array().items(Joi.objectId()),
  });

  return schema.validate(data);
}

// 导出
module.exports = {
  // 导出model
  Question,
  questionValidator,
};
