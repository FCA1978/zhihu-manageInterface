const mongoose = require("mongoose");

// 引入joi
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// 定义 topic 结构
const topicSchema = new mongoose.Schema({
  //  隐藏版本信息 __v
  __v: {
    type: Number,
    select: false,
  },
  //   话题的名称
  name: {
    type: String,
    required: true,
  },
  //   图像
  avatar_url: {
    type: String,
  },
  //   简介
  introduction: {
    type:String,
    maxlength:300,
    select:false
  },
});

// 创建Model
const Topic = mongoose.model("Topic", topicSchema);

// 创建话题校验规则对象
function topicValidator(data) {
    const schema = Joi.object({
        name:Joi.string().required(),
        avatar_url:Joi.string(),
        introduction:Joi.string().max(500)
    })

    return schema.validate(data);
}

// 导出
module.exports = {
  // 导出model
  Topic,
  topicValidator
};
