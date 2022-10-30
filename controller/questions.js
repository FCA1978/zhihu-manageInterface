const { Question } = require("../model/questions");

// 获取问题列表
exports.getQuestionsList = async (req, res, next) => {
  try {
    // 当前是第几页
    const page = Math.max(req.query.page * 1, 1) - 1;
    // 每页有几条数据
    const { per_page = 10 } = req.query;
    const perPage = Math.max(per_page * 1, 1);

    const keyword = new RegExp(req.query.keyword);
    const questionsList = await Question.find({
      $or: [
        {
          title: keyword,
        },
        {
          description: keyword,
        },
      ],
    })
      .limit(perPage)
      .skip(page * perPage);
    if (!questionsList)
      return res.status(400).json({
        code: 400,
        msg: "获取问题列表失败",
      });
    res.status(200).json({
      code: 200,
      msg: "获取问题列表成功",
      data: questionsList,
    });
  } catch (error) {
    next(error);
  }
};

// 获取指定问题
exports.getQuestion = async (req, res, next) => {
  try {
    const { fields = "" } = req.query;
    const selectFields = fields
      .split(";")
      .filter((f) => f)
      .map((f) => "+" + f)
      .join("");
    const question = await Question.findById(req.params.id)
      .select(selectFields)
      .populate("questioner topics");

    if (!question)
      return res.status(400).json({
        code: 400,
        msg: "获取问题失败",
      });

    res.status(200).json({
      code: 200,
      msg: "获取问题成功",
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// 新增问题
exports.createQuestion = async (req, res, next) => {
  try {
    const question = new Question({
      ...req.body,
      questioner: req.userData._id,
    });
    await question.save();

    res.status(200).json({
      code: 200,
      msg: "问题创建成功",
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// 更新问题
exports.updateQuestion = async (req, res, next) => {
  try {
    let questionId = req.params.id;
    const data = await Question.findByIdAndUpdate(questionId, req.body);
    if (!data)
      return res.status(400).json({
        code: 400,
        msg: "更新问题失败",
        value: data,
      });

    res.status(200).json({
      code: 200,
      msg: "更新问题成功",
      data: req.body,
    });
  } catch (error) {
    next(error);
  }
};

// 删除问题
exports.deleteQuestion = async (req, res, next) => {
  try {
    const data = await Question.findByIdAndDelete(req.params.id);
    if (!data)
      return res.status(400).json({
        code: 400,
        msg: "删除问题失败",
      });

    res.status(200).json({
      code: 200,
      msg: "删除问题成功",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

