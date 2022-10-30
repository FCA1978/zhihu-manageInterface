const mongoose = require("mongoose");

// 引入配置文件
const config = require("../config");

// 引入joi
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// 引入jwt
const jwt = require("jsonwebtoken");
const { string, number } = require("joi");

// 定义 user 结构
const userSchema = new mongoose.Schema({
  // 邮箱
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 30,
    unique: true,
  },
  // 用户名
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
  },
  // 密码
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1000,
    select: false,
  },
  //  隐藏版本信息 __v
  __v: {
    type: Number,
    select: false,
  },

  // 个人资料部分
  // 封面/头像
  avatar_url: {
    type: String,
    select: false,
  },

  // 性别
  gender: {
    type: String,
    enum: ["male", "female"],
    default: "male",
    required: true,
  },

  // 一句话介绍
  headline: {
    type: String,
    max: 100,
  },

  // 居住地
  locations: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
    select: false,
  },

  // 行业
  bussiness: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic",
    select: false,
  },

  // 职业经历
  employments: {
    type: [
      {
        company: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
        job: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
      },
    ],
    select: false,
  },

  // 教育经历
  educations: {
    type: [
      {
        school: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
        major: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
        diploma: { type: Number, enum: [1, 2, 3, 4, 5] },
        entrance_year: { type: Number },
        graduation_year: { type: Number },
      },
    ],
    select: false,
  },

  // 关注与粉丝部分
  following: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    select: false,
  },

  // 话题部分
  followingTopic: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    select: false,
  },

  likingAnswers: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answer",
      },
    ],
    select: false,
  },
  dislikingAnswers: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answer",
      },
    ],
    select: false,
  },
});

// 封装生成token的功能
userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    config.secret,
    { expiresIn: "10d" }
  );
};

// 创建 Model
const User = mongoose.model("User", userSchema);

// 创建内容校验规则对象
function userValidator(data) {
  const schema = Joi.object({
    email: Joi.string().email().trim().lowercase().min(6).max(30).required(),
    // .messages({
    //   "any.required": "缺少必选参数 email",
    //   "string.email": "email 格式错误",
    //   "string.min": "email 最少为6个字符",
    //   "string.max": "email 最多为30个字符",
    // })
    name: Joi.string().min(2).max(20).required(),
    // .message({
    //     "any.required":"缺少必选参数 name",
    //     "string.base":"name必须为Sting类型",
    //     "string.min":"name最少为2个字符",
    //     "string.max":"name最多为20个字符"
    // })
    password: Joi.string()
      .pattern(/^[a-zA-Z0-9]{6,16}$/)
      .required(),
    //   .message({
    //     "any.required":"缺少必选参数 name",
    //     "string.min":"password最少为6个字符",
    //     "string.max":"password最多为16个字符"
    // })
    _id: Joi.objectId(),

    avatar_url: Joi.string(),
    gender: Joi.any().valid("male", "femal").default("male"),
    headline: Joi.string().max(100),
    locations: Joi.array().items(Joi.string()),
    bussiness: Joi.objectId(),
    employments: Joi.array().items(
      Joi.object().keys({
        company: Joi.objectId(),
        job: Joi.objectId(),
      })
    ),
    educations: Joi.array().items(
      Joi.object().keys({
        school: Joi.objectId(),
        major: Joi.objectId(),
        diploma: Joi.number().valid(1, 2, 3, 4, 5),
        encodeURIComponent: Joi.number(),
        graduation_year: Joi.number(),
        entrance_year: Joi.number(),
      })
    ),
    following: Joi.array().items(
      Joi.object().keys({
        type: Joi.objectId(),
      })
    ),
    followingTopic: Joi.array().items(
      Joi.object().keys({
        type: Joi.objectId(),
      })
    ),
  });

  return schema.validate(data);
}

// 导出
module.exports = {
  // 导出model
  User,
  userValidator,
};
