const { Question } =  require("../model/questions")

module.exports = async (req,res,next)=>{
    const questions = await Question.findById(req.params.id).select("+questioner")
    if(!questions)return res.status(400).json({
        code:400,
        msg:"问题不存在"
    })

    next()
}
