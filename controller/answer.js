const { Answer } = require("../model/answers");

// 获取答案列表
exports.getAnswersList = async (req, res, next) => {
  try {
    // 当前是第几页
    const page = Math.max(req.query.page * 1, 1) - 1;
    // 每页有几条数据
    const { per_page = 10 } = req.query;
    const perPage = Math.max(per_page * 1, 1);

    const keyword = new RegExp(req.query.keyword);
    const answersList = await Answer.find({
      content: keyword,
      questionId: req.params.questionId,
    })
      .limit(perPage)
      .skip(page * perPage);
    if (!answersList)
      return res.status(400).json({
        code: 400,
        msg: "获取答案列表失败",
      });
    res.status(200).json({
      code: 200,
      msg: "获取答案列表成功",
      data: answersList,
    });
  } catch (error) {
    next(error);
  }
};

// 获取指定答案
exports.getAnswer = async (req, res, next) => {
  try {
    const { fields = "" } = req.query;
    const selectFields = fields
      .split(";")
      .filter((f) => f)
      .map((f) => "+" + f)
      .join("");
    const answer = await Answer.findById(req.params.id)
      .select(selectFields)
      .populate("answerer");

    if (!answer)
      return res.status(400).json({
        code: 400,
        msg: "获取答案失败",
      });

    res.status(200).json({
      code: 200,
      msg: "获取答案成功",
      data: answer,
    });
  } catch (error) {
    next(error);
  }
};

// 新增问题
exports.createAnswer = async (req, res, next) => {                                                                                              
  try {
    console.log('有进这里?');
    const aswer = new Answer({
      ...req.body,
      answerer: req.userData._id,
      questionId: req.params.questionId,
    });
    await aswer.save();

    res.status(200).json({
      code: 200,
      msg: "答案新增成功",
      data: aswer,
    });
  } catch (error) {
    next(error);
  }
};

// 更新问题
exports.updateAnswer = async (req, res, next) => {
  try {
    let anwserId = req.params.id;
    const data = await Answer.findByIdAndUpdate(anwserId, req.body);
    if (!data)
      return res.status(400).json({
        code: 400,
        msg: "更新答案失败",
        value: data,
      });

    res.status(200).json({
      code: 200,
      msg: "更新答案成功",
      data: req.body,
    });
  } catch (error) {
    next(error);
  }
};

// 删除问题
exports.deleteAnswer = async (req, res, next) => {
  try {
    const data = await Answer.findByIdAndDelete(req.params.id);
    if (!data)
      return res.status(400).json({
        code: 400,
        msg: "删除答案失败",
      });

    res.status(200).json({
      code: 200,
      msg: "删除答案成功",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};
