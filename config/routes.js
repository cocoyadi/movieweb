
/**
 * Created by yadi_coco on 2017/9/4.
 */
//拿到控制器
var Index=require("../app/controllers/index");
var User=require("../app/controllers/user");
var Movie=require("../app/controllers/movie");
var Comment=require("../app/controllers/comment");

module.exports=function(app){
    //会话前的预处理
    app.use(function(req, res, next){
        var _user=req.session.user;
        res.locals.user=_user;
        next();
    })

    //首页
    app.get("/",Index.index);


    //登陆
    app.post("/user/signin",User.signin);
    //展示登录页
    app.get("/signin",User.showSignin);
    //注册
    app.post("/user/signup",User.signup);
   app.get("/signup",User.showSignup);
    //展示注册页
    //退出
    app.get("/logout",User.logout);
    //用户列表(权限管理)
    app.get("/admin/userlist", User.signinRequired,User.adminRequired,User.userlist);

    //电影详情页
    app.get("/movie/:id",User.signinRequired,Movie.detail);
    //添加电影详情
    app.get("/admin/movie/new",User.signinRequired,User.adminRequired,Movie.new);
    //更新电影详情
    app.get("/admin/movie/update/:id", User.signinRequired,User.adminRequired,Movie.update);
    //删除电影详情
   app.delete("/admin/movie/list",User.signinRequired,User.adminRequired, Movie.delete);
    //保存电影详情
    app.post("/admin/movie",User.signinRequired,User.adminRequired, Movie.save);
    //电影列表
    app.get("/admin/movie/list",User.signinRequired,User.adminRequired, Movie.list);


    //保存评论
    app.post("/user/comment",Comment.save)
}
