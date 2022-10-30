module.exports = (validator) =>{
    return (req,res,next) =>{
        const { error ,value } = validator(req.body)
        console.log(error);
        if(error){
            // 说明数据有错，不能继续向后执行
            return res.status(400).json({
                code:400,
                value:error._orginal,
                msg:error.details[0].message
            })
        }

        // 数据校验通过，相应成功的信息
        req.validValue = value
        next()
    }

}