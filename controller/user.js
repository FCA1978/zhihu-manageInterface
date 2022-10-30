const { User } = require("../model/user");

const { Question } = require("../model/questions");

// 引入bcrypt
const bcrypt = require("bcryptjs");
const { Answer } = require("../model/answers");

// 注册用户
exports.register = async (req, res, next) => {
  try {
    console.log(req.body); //post请求参数在body里面
    console.log(req.validValue);

    let { email, password, name } = req.validValue;
    // 查询邮箱是否已经被注册过了
    let user = await User.findOne({ email });

    // 如果注册了，我们就不能再次注册，直接返回失败的相应
    if (user) {
      return res.status(400).json({
        code: 400,
        msg: "邮箱已经被注册，请重新输入",
        data: { email },
      });
    }

    // 如果没有注册过，我们就进行注册，返回成功的相应
    // 对密码进行加密
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    // 创建User实例
    user = new User({
      email,
      password,
      name,
    });

    // 进行数据的存储
    await user.save();

    // 成功的相应
    res.status(200).json({
      code: 200,
      msg: "注册成功！",
    });
  } catch (err) {
    next(err);
  }
};

// 获取所有用户
exports.getUserList = async (req, res, next) => {
  try {
    // 1.查询用户
    let userList = await User.find();
    // 2.如果不存在，返回失败的相应
    if (!userList) {
      return res.status(400).json({
        code: 400,
        msg: "用户列表不存在",
      });
    }
    // 3.如果存在，返回成功的相应
    res.status(200).json({
      code: 200,
      msg: "用户列表查询成功",
      data: { userList },
    });
  } catch (err) {
    next(err);
  }
};

// 获取指定用户
exports.getUser = async (req, res, next) => {
  try {
    const { field = "" } = req.query;
    const selectFields = field
      .split(";")
      .filter((f) => f)
      .map((f) => "+" + f)
      .join("");

    const populateStr = field
      .split(";")
      .filter((f) => f)
      .map((f) => {
        if (f == "employments") {
          return "employments.company employments.job";
        }
        if (f == "educations") {
          return "educations.school educations.major";
        }

        return f;
      });

    let userId = req.params.id;
    let user = await User.findById(userId)
      .select(selectFields)
      .populate("populateStr");

    if (!user)
      return res.status(400).json({
        code: 400,
        msg: "该用户不存在",
      });

    res.status(200).json({
      code: 200,
      msg: "查询指定用户成功",
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};

// 编辑修改/指定用户
exports.updateUser = async (req, res, next) => {
  try {
    let userId = req.params.id;
    let body = req.body;

    // 对密码重新进行加密
    const salt = await bcrypt.genSalt(10);
    body.password = await bcrypt.hash(body.password, salt);

    // 1.查询用户并修改
    const data = await User.findByIdAndUpdate(userId, body);
    // 2.查询失败
    if (!data)
      res.status(400).json({
        code: 400,
        msg: "更新用户失败",
      });
    // 3.更新成功
    res.status(200).json({
      code: 200,
      msg: "更新成功",
      data: { body },
    });
  } catch (err) {
    next(err);
  }
};

// 删除指定用户
exports.deleteUser = async (req, res, next) => {
  try {
    let userId = req.params.id;
    // 查询并且删除用户
    const data = await User.findByIdAndDelete(userId);

    //查询失败
    if (!data)
      res.status(400).json({
        code: 400,
        msg: "删除用户失败",
        value: {
          _id: userId,
        },
      });
    // 查询成功
    const body = req.body;
    res.status(200).json({
      code: 400,
      msg: "删除用户成功",
      value: {
        data: { body },
      },
    });
  } catch (err) {
    next(err);
  }
};

// 获取关注列表
exports.listFollowing = async (req, res, next) => {
  try {
    let userId = req.params.id;
    const user = await User.findById(userId)
      .select("+following")
      .populate("following");
    console.log(user);

    // 未找到
    if (!user)
      return res.status(400).json({
        code: 400,
        msg: "获取关注列表失败",
      });
    // 获取成功
    res.status(200).json({
      code: 200,
      msg: "获取关注列表成功",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// 关注
exports.follow = async (req, res, next) => {
  try {
    let userId = req.userData._id;
    console.log(userId);
    const user = await User.findById(userId.toString()).select("+following");

    // 如果已经关注过了，那我们就直接return
    if (user.following.map((id) => id.toString()).includes(req.params.id))
      return res.status(400).json({
        code: 400,
        msg: "已关注，关注失败",
      });
    // 如果之前没有关注，那么就再关注
    user.following.push(req.params.id);
    await user.save();
    res.status(200).json({
      code: 200,
      msg: "关注成功",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// 取消关注
exports.unfollow = async (req, res, next) => {
  try {
    let userId = req.userData._id;
    const user = await User.findById(userId.toString()).select("+following");

    //  获取所关注的用户的索引
    const index = user.following.map((id) =>
      id.toString().indexOf(req.params.id)
    );
    //  若没有关注，则取消关注
    if (index == -1)
      return res.status(400).json({
        code: 400,
        msg: "未关注,取消关注失败",
      });

    // 已经关注，则进行取消操作
    user.following.splice(index, 1);
    await user.save();

    res.status(200).json({
      code: 200,
      msg: "取消关注成功",
    });
  } catch (error) {
    next(error);
  }
};

// 查询粉丝列表
exports.listFollowers = async (req, res, next) => {
  try {
    const users = await User.find({ following: req.params.id });
    if (!users)
      return res.status(400).json({
        code: 400,
        msg: "查询粉丝列表失败",
      });

    res.status(400).json({
      code: 400,
      msg: "查询粉丝列表成功",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// 关注话题
exports.followTopic = async (req, res, next) => {
  try {
    let userId = req.userData._id;
    console.log(userId);
    const user = await User.findById(userId.toString()).select(
      "+followingTopic"
    );

    // 如果已经关注过了，那我们就直接return
    if (user.followingTopic.map((id) => id.toString()).includes(req.params.id))
      return res.status(400).json({
        code: 400,
        msg: "已关注，关注失败",
      });
    // 如果之前没有关注，那么就再关注
    user.followingTopic.push(req.params.id);
    await user.save();
    res.status(200).json({
      code: 200,
      msg: "关注成功",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// 取消关注话题
exports.unfollowTopic = async (req, res, next) => {
  try {
    let userId = req.userData._id;
    const user = await User.findById(userId.toString()).select(
      "+followingTopic"
    );

    //  获取所关注的用户的索引
    const index = user.followingTopic.map((id) =>
      id.toString().indexOf(req.params.id)
    );
    //  若没有关注，则取消关注
    if (index == -1)
      return res.status(400).json({
        code: 400,
        msg: "未关注,取消关注失败",
      });

    // 已经关注，则进行取消操作
    user.followingTopic.splice(index, 1);
    await user.save();

    res.status(200).json({
      code: 200,
      msg: "取消关注成功",
    });
  } catch (error) {
    next(error);
  }
};

// 获取用户关注话题
exports.listFolloweringTopic = async (req, res, next) => {
  try {
    let userId = req.params.id;
    const user = await User.findById(userId)
      .select("+followingTopic")
      .populate("followingTopic");
    if (!user)
      return res.status(400).json({
        code: 400,
        msg: "查询失败",
      });
    res.status(200).json({
      code: 200,
      msg: "查询成功",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// 用户的问题列表
exports.listQuestions = async (req, res, next) => {
  try {
    const question = await Question.find({ questioner: req.params.id });
    if (!question)
      return res.status(400).json({
        code: 400,
        msg: "查询失败",
      });

    res.status(200).json({
      code: 200,
      msg: "查询成功",
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// 赞

//喜欢答案
exports.likeAnswer = async (req, res, next) => {
  try {
    let userId = req.userData._id;
    console.log(userId);
    const user = await User.findById(userId.toString()).select("+likingAnswers");
    if (!user.likingAnswers.map((id) => id.toString()).includes(req.params.id)){
      user.likingAnswers.push(req.params.id);
      await user.save();
      await Answer.findByIdAndUpdate(req.params.id,{$inc:{voteCount:1}})
    } 
    res.status(200).json({
      code: 200,
      msg: "赞成功",
      data: user,
    });
    next();
  } catch (error) {
    next(error);
  }
};

// 取消喜欢
exports.unlikeAnswer = async (req, res, next) => {
  try {
    let userId = req.userData._id;
    const user = await User.findById(userId.toString()).select("+likingAnswers");

    const index = user.likingAnswers.map((id) =>
      id.toString().indexOf(req.params.id)
    );
    if (index > -1){
      user.likingAnswers.splice(index, 1);
      await user.save();
      await Answer.findByIdAndUpdate(req.params.id,{$inc:{voteCount:-1}})
    }
     
    res.status(200).json({
      code: 200,
      msg: "取消喜欢成功",
    });
  } catch (error) {
    next(error);
  }
};

// 获取喜欢的答案列表
exports.listLikingAnswers = async (req, res, next) => {
  try {
    let userId = req.params.id;
    const user = await User.findById(userId)
      .select("+likingAnswers")
      .populate("likingAnswers");

    // 未找到
    if (!user)
      return res.status(400).json({
        code: 400,
        msg: "操作失败",
      });
    // 获取成功
    res.status(200).json({
      code: 200,
      msg: "操作成功",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};


// 踩
//不喜欢
exports.dislikeAnswer = async (req, res, next) => {
  try {
    let userId = req.userData._id;
    const user = await User.findById(userId.toString()).select("+dislikingAnswers");
    if (!user.dislikingAnswers.map((id) => id.toString()).includes(req.params.id)){
      user.dislikingAnswers.push(req.params.id);
      await user.save();
    } 
    res.status(200).json({
      code: 200,
      msg: "踩成功",
      data: user,
    });
    next();
  } catch (error) {
    next(error);
  }
};

// 取消不喜欢
exports.undislikeAnswer = async (req, res, next) => {
  try {
    let userId = req.userData._id;
    const user = await User.findById(userId.toString()).select("+dislikingAnswers");

    const index = user.dislikingAnswers.map((id) =>
      id.toString().indexOf(req.params.id)
    );
    if (index > -1){
      user.dislikingAnswers.splice(index, 1);
      await user.save();
    }
     
    res.status(200).json({
      code: 200,
      msg: "取消踩成功",
    });
  } catch (error) {
    next(error);
  }
};

// 获取不喜欢的答案列表
exports.listDisLikingAnswers = async (req, res, next) => {
  try {
    let userId = req.params.id;
    const user = await User.findById(userId)
      .select("+dislikingAnswers")
      .populate("dislikingAnswers");

    // 未找到
    if (!user)
      return res.status(400).json({
        code: 400,
        msg: "操作失败",
      });
    // 获取成功
    res.status(200).json({
      code: 200,
      msg: "操作成功",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};