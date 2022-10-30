const mongoose = require("mongoose");

// 引入配置文件
const config = require("../config");

// 引入joi
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// 定义 user 结构
const answerSchema = new mongoose.Schema({
  //  隐藏版本信息 __v
  __v: {
    type: Number,
    select: false,
  },
  content: {
    type: String,
    required: true,
  },
  answerer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    select: false,
  },
  questionId: {
    type: String,
  },
  voteCount:{
    type:Number,
    default:0,
    required:true
  }
},{ timestamps: true });

// 创建 Model
const Answer = mongoose.model("Answer", answerSchema);

// 创建内容校验规则对象
function answerValidator(data) {
  const schema = Joi.object({
    content: Joi.string().required(),
    answerer: Joi.objectId(),
    questionId: Joi.string(),

    topics: Joi.array().items(Joi.objectId()),
    voteCount: Joi.number()
  });

  return schema.validate(data);
}

// 导出
module.exports = {
  // 导出model
  Answer,
  answerValidator,
};
