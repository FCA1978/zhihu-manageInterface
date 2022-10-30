module.exports = {
    app:{
        port:process.env.POST || 3000
    },
    // 数据库配置
    db:{
        url:process.env.MONGODB_URL ||"mongodb://localhost:27017/caesarfan"
    },
    // jwt密钥
    secret:"6255cfd8-839f-40be-ae58-ee558137df0c"
}